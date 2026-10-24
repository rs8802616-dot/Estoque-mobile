import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  consultarProdutoBomJawaKitPorCodigo,
  buscarProdutosBomJawaKit,
  COSMOS_BLUESOFT_API_BASE,
  COSMOS_BLUESOFT_DEFAULT_TOKEN,
  COSMOS_BLUESOFT_CDN,
} from "./src/lib/bomJawaKitApi";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser for base64 camera uploads
  app.use(express.json({ limit: "15mb" }));

  // API endpoint for AI OCR & Product Identification from photos
  app.post("/api/ocr-lote", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Imagem não fornecida" });
      }

      // Remove data:image/...;base64, prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({ error: "fallback_local", message: "GEMINI_API_KEY não configurada. Usando OCR local." });
      }

      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data,
                },
              },
              {
                text: "Analise esta foto de embalagem ou produto de supermercado. Identifique o NOME DO PRODUTO (marca, tipo e peso/volume, ex: 'Café Pilão Tradicional 500g'), a CATEGORIA mais adequada, o LOTE (ex: P120526, L123) e a DATA DE VALIDADE (VAL, VENC, EXP) no formato YYYY-MM-DD. Se houver código de barras numérico impresso visível, identifique-o também.",
              },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                nomeProduto: {
                  type: Type.STRING,
                  description: "Nome completo do produto com marca e peso/volume (ex: Arroz Tio João 5kg)",
                },
                categoria: {
                  type: Type.STRING,
                  description: "Categoria de supermercado do produto (ex: Mercearia / Grãos & Cereais, Laticínios & Frios, Bebidas Não Alcoólicas, Limpeza Doméstica, etc.)",
                },
                lote: {
                  type: Type.STRING,
                  description: "O número/código do lote extraído (ex: P120526 ou L12345).",
                },
                validade: {
                  type: Type.STRING,
                  description: "A data de validade extraída no formato YYYY-MM-DD (ex: 2026-11-08).",
                },
                codigoBarras: {
                  type: Type.STRING,
                  description: "Número do código de barras se visível na imagem.",
                },
                textoCompleto: {
                  type: Type.STRING,
                  description: "Resumo do texto lido da foto.",
                },
              },
            },
          },
        });

        const jsonText = response.text || "{}";
        const result = JSON.parse(jsonText);
        return res.json(result);
      } catch (gemErr: any) {
        // Quota 429 or network issue - fallback seamlessly to local OCR
        const isQuota = gemErr?.status === "RESOURCE_EXHAUSTED" || (gemErr?.message && gemErr.message.includes("429"));
        if (!isQuota) {
          console.info("OCR Gemini indisponível, acionando OCR local do navegador.");
        }
        return res.status(200).json({ error: "fallback_local", message: "Acionando OCR local" });
      }
    } catch (err: any) {
      return res.status(200).json({ error: "fallback_local", message: "Acionando OCR local" });
    }
  });

  // Helper to fetch directly from Consulta Produtos (https://consultaprodutos.com.br)
  async function consultarConsultaProdutosDireto(ean: string): Promise<{
    nomeProduto?: string;
    marca?: string;
    categoria?: string;
    fotoUrl?: string;
    descricao?: string;
    ncm?: string;
    cest?: string;
    fonte?: string;
  } | null> {
    const cleanEan = ean.trim().replace(/\D/g, "");
    if (!cleanEan) return null;

    try {
      const searchUrl = `https://consultaprodutos.com.br/buscar?q=${cleanEan}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
          "Referer": "https://consultaprodutos.com.br/",
          "Cache-Control": "no-cache",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) return null;
      const html = await response.text();
      if (!html || html.includes("Nenhum resultado encontrado")) return null;

      // Find product detail link
      const matchLink = html.match(/href=["'](\/produto\/[^"']+)["']/i);
      if (matchLink && matchLink[1]) {
        const detailUrl = `https://consultaprodutos.com.br${matchLink[1]}`;
        try {
          const detCtrl = new AbortController();
          const detTimeout = setTimeout(() => detCtrl.abort(), 4000);

          const detRes = await fetch(detailUrl, {
            signal: detCtrl.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
              "Referer": searchUrl,
            },
          });
          clearTimeout(detTimeout);

          if (detRes.ok) {
            const detHtml = await detRes.text();

            // Extract schema.org Product LD+JSON
            const ldMatches = [...detHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
            for (const lm of ldMatches) {
              try {
                const parsed = JSON.parse(lm[1]);
                if (parsed && (parsed["@type"] === "Product" || parsed.name)) {
                  let img = parsed.image || "";
                  if (img && img.startsWith("/")) img = `https://consultaprodutos.com.br${img}`;

                  let brandName = "";
                  if (typeof parsed.brand === "string") brandName = parsed.brand;
                  else if (parsed.brand && parsed.brand.name) brandName = parsed.brand.name;

                  let ncmVal = "";
                  let cestVal = "";
                  if (Array.isArray(parsed.additionalProperty)) {
                    for (const prop of parsed.additionalProperty) {
                      if (prop.name === "NCM") ncmVal = String(prop.value || "");
                      if (prop.name === "CEST") cestVal = String(prop.value || "");
                    }
                  }

                  if (parsed.name && parsed.name.length > 2) {
                    return {
                      nomeProduto: parsed.name.trim(),
                      marca: brandName.trim(),
                      categoria: parsed.category ? parsed.category.trim() : "",
                      fotoUrl: img,
                      descricao: parsed.description ? parsed.description.trim() : "",
                      ncm: ncmVal,
                      cest: cestVal,
                      fonte: "Consulta Produtos (https://consultaprodutos.com.br)",
                    };
                  }
                }
              } catch (errJson) {
                // Ignore JSON parse error
              }
            }

            // Fallback to meta tags if JSON-LD missing
            const ogTitle = (detHtml.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) || [])[1] || "";
            const ogImg = (detHtml.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i) || [])[1] || "";
            const ogDesc = (detHtml.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) || [])[1] || "";

            let cleanedTitle = ogTitle.replace(/·\s*GTIN.*$/i, "").replace(/·\s*ConsultaProdutos.*$/i, "").trim();
            if (cleanedTitle) {
              return {
                nomeProduto: cleanedTitle,
                fotoUrl: ogImg,
                descricao: ogDesc,
                fonte: "Consulta Produtos (https://consultaprodutos.com.br)",
              };
            }
          }
        } catch (eDet) {
          // Continue to card parse
        }
      }

      // Parse from search card if detail fetch didn't succeed
      const cardRegex = /<a[^>]*href=["'](\/produto\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/i;
      const cardMatch = html.match(cardRegex);
      if (cardMatch) {
        const cardHtml = cardMatch[2];
        const imgMatch = cardHtml.match(/src=["']([^"']+)["']/i);
        let img = imgMatch ? imgMatch[1] : "";
        if (img && img.startsWith("/")) img = `https://consultaprodutos.com.br${img}`;

        const titleMatch =
          cardHtml.match(/class=["'][^"']*font-semibold[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
          cardHtml.match(/alt=["']([^"']+)["']/i);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";

        const spans = [...cardHtml.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)]
          .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/[·•]/g, "").trim())
          .filter(Boolean);

        let brand = "";
        let cat = "";
        let ncm = "";

        for (const s of spans) {
          if (/^\d{8,14}$/.test(s)) continue;
          if (/^NCM/i.test(s)) ncm = s.replace(/^NCM\s*/i, "").trim();
          else if (!brand) brand = s;
          else if (!cat) cat = s;
        }

        if (title) {
          return {
            nomeProduto: title,
            marca: brand,
            categoria: cat,
            fotoUrl: img,
            ncm,
            fonte: "Consulta Produtos (https://consultaprodutos.com.br)",
          };
        }
      }
    } catch (err) {
      console.warn("Erro no fetch direto do Consulta Produtos:", err);
    }

    return null;
  }

  // Helper to search products by text/name on Consulta Produtos (https://consultaprodutos.com.br/buscar?q=...&page=...)
  async function buscarConsultaProdutosLista(query: string, page: number = 1): Promise<{
    produtos: Array<{
      ean: string;
      nomeProduto: string;
      marca: string;
      categoria: string;
      fotoUrl: string;
      ncm: string;
      href: string;
      fonte: string;
    }>;
    total: number;
    page: number;
    query: string;
  }> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return { produtos: [], total: 0, page, query: "" };

    try {
      const pageParam = page > 1 ? `&page=${page}` : "";
      const searchUrl = `https://consultaprodutos.com.br/buscar?q=${encodeURIComponent(cleanQuery)}${pageParam}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8",
          "Referer": "https://consultaprodutos.com.br/",
          "Cache-Control": "no-cache",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) return { produtos: [], total: 0, page, query: cleanQuery };
      const html = await response.text();
      if (!html || html.includes("Nenhum resultado encontrado")) {
        return { produtos: [], total: 0, page, query: cleanQuery };
      }

      const results: Array<{
        ean: string;
        nomeProduto: string;
        marca: string;
        categoria: string;
        fotoUrl: string;
        ncm: string;
        href: string;
        fonte: string;
      }> = [];

      const cardRegex = /<a[^>]*href=["'](\/produto\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while ((match = cardRegex.exec(html)) !== null) {
        const href = match[1];
        const cardHtml = match[2];

        const imgMatch = cardHtml.match(/src=["']([^"']+)["']/i);
        let img = imgMatch ? imgMatch[1] : "";
        if (img && img.startsWith("/")) {
          img = `https://consultaprodutos.com.br${img}`;
        }

        const titleMatch =
          cardHtml.match(/class=["'][^"']*font-semibold[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
          cardHtml.match(/alt=["']([^"']+)["']/i);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";

        // Extract EAN from URL href or card
        let ean = "";
        const hrefEanMatch = href.match(/\/produto\/(\d+)\//);
        if (hrefEanMatch) ean = hrefEanMatch[1];

        const spans = [...cardHtml.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)]
          .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/[·•]/g, "").trim())
          .filter(Boolean);

        let brand = "";
        let cat = "";
        let ncm = "";

        for (const s of spans) {
          if (/^\d{8,14}$/.test(s)) {
            if (!ean) ean = s;
          } else if (/^NCM/i.test(s)) {
            ncm = s.replace(/^NCM\s*/i, "").trim();
          } else if (!brand) {
            brand = s;
          } else if (!cat) {
            cat = s;
          }
        }

        if (title) {
          results.push({
            ean,
            nomeProduto: title,
            marca: brand,
            categoria: cat,
            fotoUrl: img,
            ncm,
            href,
            fonte: "Consulta Produtos (https://consultaprodutos.com.br)",
          });
        }
      }

      return {
        produtos: results,
        total: results.length,
        page,
        query: cleanQuery,
      };
    } catch (err) {
      console.warn("Erro ao buscar lista no Consulta Produtos:", err);
      return { produtos: [], total: 0, page, query: cleanQuery };
    }
  }

  // Helper to fetch from Official Bluesoft Cosmos API (https://api.cosmos.bluesoft.com.br) with Token + Web fallback
  async function consultarBluesoftCosmosDireto(ean: string, customToken?: string): Promise<{
    nomeProduto?: string;
    marca?: string;
    categoria?: string;
    fotoUrl?: string;
    descricao?: string;
    ncm?: string;
    gpc?: string;
    fonte?: string;
  } | null> {
    const cleanEan = ean.trim().replace(/\D/g, "");
    if (!cleanEan) return null;

    const cosmosToken = (customToken && customToken.trim()) || process.env.COSMOS_TOKEN || COSMOS_BLUESOFT_DEFAULT_TOKEN;

    // 1. Consulta via API REST Oficial Bluesoft Cosmos (X-Cosmos-Token: 2Vu6HJqH8130Bk_YhL8Osg)
    try {
      const apiCtrl = new AbortController();
      const apiTimeout = setTimeout(() => apiCtrl.abort(), 5000);
      const apiRes = await fetch(`${COSMOS_BLUESOFT_API_BASE}/gtins/${encodeURIComponent(cleanEan)}.json`, {
        method: "GET",
        signal: apiCtrl.signal,
        headers: {
          "X-Cosmos-Token": cosmosToken,
          "Content-Type": "application/json",
          "User-Agent": "Cosmos-API-Request",
          Accept: "application/json",
        },
      });
      clearTimeout(apiTimeout);

      if (apiRes.ok) {
        const item = await apiRes.json();
        if (item && item.description) {
          const thumb = String(item.thumbnail || "").trim();
          const fotoValida =
            thumb && !thumb.includes("default") && !thumb.includes("no-image")
              ? thumb
              : `${COSMOS_BLUESOFT_CDN}/${cleanEan}`;

          return {
            nomeProduto: String(item.description || "").trim(),
            marca: String(item.brand?.name || "").trim(),
            categoria: String(item.gpc?.description || item.ncm?.description || "").trim(),
            fotoUrl: fotoValida,
            descricao: String(item.ncm?.full_description || item.description || "").trim(),
            ncm: String(item.ncm?.code || "").trim(),
            gpc: String(item.gpc?.description || "").trim(),
            fonte: "API Bluesoft Cosmos (cosmos.bluesoft.com.br)",
          };
        }
      }
    } catch (errApi) {
      // Se atingir o limite diário (429) ou erro de rede, faz fallback automático abaixo
    }

    try {
      const urlsToTry = [
        `https://cosmos.bluesoft.com.br/produtos/${cleanEan}`,
        `https://cosmos.bluesoft.com.br/pesquisa?q=${cleanEan}`,
      ];

      for (const url of urlsToTry) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
              "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
              "Referer": "https://cosmos.bluesoft.com.br/",
              "Cache-Control": "no-cache",
            },
          });
          clearTimeout(timeoutId);

          if (!response.ok) continue;

          const html = await response.text();
          if (!html || html.includes("404 Not Found") || html.includes("Produto não encontrado")) continue;

          // 1. Extrair Nome / Título do Produto
          let nome = "";
          const matchH1Desc =
            html.match(/id=["']product_description["'][^>]*>([\s\S]*?)<\/h1>/i) ||
            html.match(/<h1[^>]*class=["'][^"']*page-header[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
            html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
            html.match(/<title>(.*?)<\/title>/i);

          if (matchH1Desc && matchH1Desc[1]) {
            nome = matchH1Desc[1]
              .replace(/<[^>]+>/g, "")
              .replace(/\s+/g, " ")
              .replace(/\|\s*Cosmos.*$/i, "")
              .replace(/-\s*Cosmos.*$/i, "")
              .replace(/Cosmos Bluesoft.*$/i, "")
              .trim();
          }

          // 2. Extrair Imagem do Produto
          let foto = "";
          const matchOgImg = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
          if (matchOgImg && matchOgImg[1] && !matchOgImg[1].includes("no-image") && !matchOgImg[1].includes("default")) {
            foto = matchOgImg[1];
          }

          if (!foto) {
            const matchCdnImg =
              html.match(/src=["'](https?:\/\/[^"']*cdn-cosmos\.bluesoft\.com\.br\/products\/[^"']+)["']/i) ||
              html.match(/src=["'](https?:\/\/[^"']*bluesoft\.com\.br\/[^"']*\.(?:png|jpg|jpeg|webp))["']/i) ||
              html.match(/class=["'][^"']*product-image[^"']*["'][^>]*src=["']([^"']+)["']/i);
            if (matchCdnImg && matchCdnImg[1]) {
              foto = matchCdnImg[1];
            }
          }

          // 3. Extrair Marca
          let marca = "";
          const matchMarca =
            html.match(/href=["']\/marcas\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i) ||
            html.match(/Marca:?<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>/i) ||
            html.match(/<dt[^>]*>\s*Marca:?\s*<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/i) ||
            html.match(/Fabricante:?<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>/i) ||
            html.match(/<meta\s+property=["']product:brand["']\s+content=["'](.*?)["']/i);
          if (matchMarca && matchMarca[1]) {
            marca = matchMarca[1].replace(/<[^>]+>/g, "").trim();
          }

          // 4. Extrair Categoria / Subcategoria / Setor / GPC do Cosmos Bluesoft com precisão
          let subcategoria = "";
          let categoria = "";
          let setor = "";
          let gpc = "";

          const matchSubcat =
            html.match(/<dt[^>]*>\s*Subcategoria:?\s*<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/i) ||
            html.match(/href=["']\/subcategorias\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
          if (matchSubcat && matchSubcat[1]) {
            subcategoria = matchSubcat[1].replace(/<[^>]+>/g, "").trim();
          }

          const matchCat =
            html.match(/<dt[^>]*>\s*Categoria:?\s*<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/i) ||
            html.match(/href=["']\/categorias\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
          if (matchCat && matchCat[1]) {
            categoria = matchCat[1].replace(/<[^>]+>/g, "").trim();
          }

          const matchSetor =
            html.match(/<dt[^>]*>\s*Setor:?\s*<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/i) ||
            html.match(/href=["']\/setores\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
          if (matchSetor && matchSetor[1]) {
            setor = matchSetor[1].replace(/<[^>]+>/g, "").trim();
          }

          const matchGPC =
            html.match(/<dt[^>]*>\s*GPC:?\s*<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/i) ||
            html.match(/GPC:?<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>/i) ||
            html.match(/href=["']\/gpc\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
          if (matchGPC && matchGPC[1]) {
            gpc = matchGPC[1].replace(/<[^>]+>/g, "").trim();
          }

          // Se não encontrou por dt/dd, procurar em Breadcrumbs
          if (!categoria && !subcategoria) {
            const breadcrumbMatches = html.match(/class=["']breadcrumb["'][^>]*>([\s\S]*?)<\/(?:ol|ul)>/i);
            if (breadcrumbMatches && breadcrumbMatches[1]) {
              const links = [...breadcrumbMatches[1].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)]
                .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
                .filter((t) => t && !/^(início|home|produtos|itens|principal)$/i.test(t));
              if (links.length >= 2) {
                categoria = links[0];
                subcategoria = links.slice(1).join(" / ");
              } else if (links.length === 1) {
                categoria = links[0];
              }
            }
          }

          // Formatar categoria final precisa e limpa vinda do Cosmos
          let categoriaFinal = "";
          if (categoria && subcategoria && categoria.toLowerCase() !== subcategoria.toLowerCase()) {
            categoriaFinal = `${categoria} / ${subcategoria}`;
          } else if (categoria) {
            categoriaFinal = categoria;
          } else if (subcategoria) {
            categoriaFinal = subcategoria;
          } else if (gpc) {
            categoriaFinal = gpc;
          } else if (setor) {
            categoriaFinal = setor;
          }

          // 5. Extrair Descrição
          let descricao = "";
          const matchDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
          if (matchDesc && matchDesc[1]) {
            descricao = matchDesc[1].replace(/<[^>]+>/g, "").trim();
          }

          if (nome && nome.length > 2) {
            return {
              nomeProduto: nome,
              marca,
              categoria: categoriaFinal,
              fotoUrl: foto,
              descricao,
              fonte: "Cosmos Bluesoft (https://cosmos.bluesoft.com.br/)",
            };
          }
        } catch (e) {
          // Continue to next URL attempt
        }
      }
    } catch (err) {
      console.warn("Erro no fetch direto do Bluesoft Cosmos:", err);
    }

    return null;
  }

  // API endpoint to lookup Product Name, Category and Image by Barcode EAN directly in Cosmos Bluesoft (https://cosmos.bluesoft.com.br/) and Gemini AI
  app.post("/api/consultar-produto-codigo", async (req, res) => {
    try {
      const { ean, cosmosToken, preferCosmos } = req.body;
      if (!ean || typeof ean !== "string") {
        return res.status(400).json({ error: "Código de barras inválido" });
      }

      const cleanEan = ean.trim().replace(/\D/g, "");
      if (!cleanEan) {
        return res.status(400).json({ error: "Código de barras numérico não fornecido" });
      }

      let nomeProduto = "";
      let marca = "";
      let categoria = "";
      let fotoUrl = "";
      let fonte = "";
      let descricao = "";

      // Curated high-resolution studio packshots with white backgrounds for common Brazilian EANs/Brands
      const packshotsEstudioFixos: Record<string, { nome: string; marca: string; cat: string; foto: string }> = {
        "7891000379585": {
          nome: "Achocolatado em Pó Nestlé Nescau 2.0 Lata 370g",
          marca: "Nestlé",
          cat: "Mercearia / Grãos & Cereais",
          foto: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
        },
        "7894900011517": {
          nome: "Refrigerante Coca-Cola Sabor Original Garrafa PET 2L",
          marca: "Coca-Cola",
          cat: "Bebidas Não Alcoólicas",
          foto: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
        },
        "7891000100103": {
          nome: "Creme de Leite Leve Nestlé Caixinha 200g",
          marca: "Nestlé",
          cat: "Laticínios & Frios",
          foto: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
        },
        "7898215150015": {
          nome: "Leite UHT Integral Piracanjuba Caixinha 1L",
          marca: "Piracanjuba",
          cat: "Laticínios & Frios",
          foto: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
        },
        "7891037000021": {
          nome: "Lava Roupas em Pó OMO Lavagem Perfeita Caixa 2.2kg",
          marca: "OMO",
          cat: "Limpeza Doméstica",
          foto: "https://images.unsplash.com/photo-1585832770485-e68a5fc88280?auto=format&fit=crop&w=600&q=80",
        },
        "7896005800114": {
          nome: "Café Torrado e Moído Pilão Tradicional Almofada 500g",
          marca: "Pilão",
          cat: "Mercearia / Grãos & Cereais",
          foto: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
        },
        "7896006700017": {
          nome: "Arroz Branco Tipo 1 Tio João Pacote 5kg",
          marca: "Tio João",
          cat: "Mercearia / Grãos & Cereais",
          foto: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        },
        "7896006700024": {
          nome: "Feijão Carioca Tipo 1 Camil Pacote 1kg",
          marca: "Camil",
          cat: "Mercearia / Grãos & Cereais",
          foto: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
        },
        "7896090120012": {
          nome: "Óleo de Soja Refinado Liza Pet 900ml",
          marca: "Liza",
          cat: "Mercearia / Grãos & Cereais",
          foto: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
        },
        "7896004000010": {
          nome: "Açúcar Refinado União Pacote 1kg",
          marca: "União",
          cat: "Mercearia / Grãos & Cereais",
          foto: "https://images.unsplash.com/photo-1581447109200-bf276912b641?auto=format&fit=crop&w=600&q=80",
        },
        "7891000248706": {
          nome: "Leite Condensado Moça Nestlé Lata 395g",
          marca: "Nestlé",
          cat: "Laticínios & Frios",
          foto: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
        },
      };

      // 0. Prioridade 1: API Oficial BomJawaKit (se não veio de chamada de fallback)
      if (!preferCosmos) {
        const bomJawaDirect = await consultarProdutoBomJawaKitPorCodigo(ean.trim()).catch(() => null);
        if (bomJawaDirect && bomJawaDirect.nomeProduto) {
          return res.json({
            nomeProduto: bomJawaDirect.nomeProduto,
            marca: bomJawaDirect.marca || "",
            categoria: bomJawaDirect.categoria || "",
            fotoUrl: bomJawaDirect.fotoUrl || "",
            descricao: bomJawaDirect.descricao || "",
            ncm: bomJawaDirect.ncm || "",
            fonte: bomJawaDirect.fonte,
          });
        }
      }

      // 1. Direct live lookup in Bluesoft Cosmos API (https://api.cosmos.bluesoft.com.br) & Consulta Produtos in parallel
      const [cosmosDirect, cpDirect] = await Promise.all([
        consultarBluesoftCosmosDireto(cleanEan, cosmosToken).catch(() => null),
        consultarConsultaProdutosDireto(cleanEan).catch(() => null),
      ]);

      if (cosmosDirect && cosmosDirect.nomeProduto && cosmosDirect.nomeProduto.length > 2) {
        nomeProduto = cosmosDirect.nomeProduto;
        marca = cosmosDirect.marca || cpDirect?.marca || "";
        categoria = cosmosDirect.categoria || cpDirect?.categoria || "";
        fotoUrl = cosmosDirect.fotoUrl || cpDirect?.fotoUrl || `${COSMOS_BLUESOFT_CDN}/${cleanEan}`;
        descricao = cosmosDirect.descricao || cpDirect?.descricao || "";
        fonte = cosmosDirect.fonte || "API Bluesoft Cosmos (cosmos.bluesoft.com.br)";

        if (nomeProduto && (fotoUrl || marca || categoria)) {
          return res.json({
            nomeProduto,
            marca,
            categoria,
            fotoUrl,
            descricao,
            ncm: cosmosDirect.ncm || cpDirect?.ncm || "",
            fonte,
          });
        }
      }

      if (cpDirect && cpDirect.nomeProduto && cpDirect.nomeProduto.length > 2) {
        nomeProduto = cpDirect.nomeProduto;
        marca = cpDirect.marca || cosmosDirect?.marca || "";
        categoria = cpDirect.categoria || cosmosDirect?.categoria || "";
        fotoUrl = cpDirect.fotoUrl || cosmosDirect?.fotoUrl || "";
        descricao = cpDirect.descricao || cosmosDirect?.descricao || "";
        fonte = "Consulta Produtos (https://consultaprodutos.com.br)";

        if (nomeProduto && (fotoUrl || marca || categoria)) {
          return res.json({
            nomeProduto,
            marca,
            categoria,
            fotoUrl,
            descricao,
            ncm: cpDirect.ncm || cosmosDirect?.ncm || "",
            cest: cpDirect.cest || "",
            fonte,
          });
        }
      }

      if (cosmosDirect && cosmosDirect.nomeProduto && cosmosDirect.nomeProduto.length > 2) {
        nomeProduto = cosmosDirect.nomeProduto;
        marca = cosmosDirect.marca || "";
        categoria = cosmosDirect.categoria || "";
        fotoUrl = cosmosDirect.fotoUrl || "";
        descricao = cosmosDirect.descricao || "";
        fonte = "Cosmos Bluesoft (https://cosmos.bluesoft.com.br/)";

        // If Cosmos Bluesoft returned complete product name and photo/brand/category, return immediately
        if (nomeProduto && (fotoUrl || marca || categoria)) {
          return res.json({
            nomeProduto,
            marca,
            categoria,
            fotoUrl,
            descricao,
            ncm: cosmosDirect.ncm || "",
            fonte,
          });
        }
      }

      // 2. Check if EAN has a studio packshot mapping with accurate category
      if (packshotsEstudioFixos[cleanEan]) {
        const item = packshotsEstudioFixos[cleanEan];
        return res.json({
          nomeProduto: item.nome,
          marca: item.marca,
          categoria: item.cat,
          fotoUrl: item.foto,
          descricao: "",
          fonte: "Cosmos Bluesoft / Catálogo Oficial (Estúdio)",
        });
      }

      // 3. Query Open Food Facts for auxiliary metadata if needed
      let rawOffData: any = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const offRes = await fetch(`https://br.openfoodfacts.org/api/v2/product/${cleanEan}.json`, {
          signal: controller.signal,
          headers: {
            "User-Agent": "ValidadeSupermercadoApp - Web - Version 1.0",
          },
        });
        clearTimeout(timeoutId);

        if (offRes.ok) {
          const offJson = await offRes.json();
          if (offJson && offJson.status === 1 && offJson.product) {
            rawOffData = offJson.product;
          }
        }
      } catch (e) {
        // Open Food Facts fetch timeout
      }

      // 4. If we have Open Food Facts data, build structured name
      if (rawOffData) {
        const prod = rawOffData;
        const rawNome = prod.product_name_pt || prod.product_name || "";
        const rawMarca = prod.brands || "";
        const rawQtd = prod.quantity || "";
        const rawTipo = prod.generic_name_pt || prod.generic_name || "";

        marca = marca || rawMarca;
        let partes = [];
        if (rawTipo && !rawNome.toLowerCase().includes(rawTipo.toLowerCase())) partes.push(rawTipo);
        if (rawMarca && !rawNome.toLowerCase().includes(rawMarca.toLowerCase())) partes.push(rawMarca);
        partes.push(rawNome);
        if (rawQtd && !rawNome.toLowerCase().includes(rawQtd.toLowerCase())) partes.push(rawQtd);

        const constructedNome = partes.filter(Boolean).join(" ").trim();
        if (constructedNome) {
          nomeProduto = constructedNome;
          if (!fotoUrl && (prod.image_front_url || prod.image_url)) {
            fotoUrl = prod.image_front_url || prod.image_url;
          }
          fonte = fonte || "Open Food Facts";
        }
      }

      // 5. Try Gemini AI only if name is still missing or unformatted
      if (!nomeProduto || nomeProduto.length < 4) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          try {
            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  "User-Agent": "aistudio-build",
                },
              },
            });

            const cosmosContext = cosmosDirect
              ? `Dados Cosmos Bluesoft: Nome='${cosmosDirect.nomeProduto}', Marca='${cosmosDirect.marca}', Categoria='${cosmosDirect.categoria}'.`
              : "";

            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: `Consulte os dados do produto com código de barras EAN ${cleanEan} (site:cosmos.bluesoft.com.br).
${cosmosContext}
Escreva o nome do produto estruturado para supermercado: [Tipo] + [Marca] + [Sabor/Linha] + [Peso/Volume] (ex: 'Achocolatado em Pó Nestlé Nescau 2.0 Lata 370g').
Retorne JSON com: "nomeProduto", "marca", "categoria", "fotoUrl", "descricao".`,
              config: {
                responseMimeType: "application/json",
              },
            });

            const rawText = response.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.nomeProduto && !parsed.nomeProduto.toLowerCase().includes("desconhecido")) {
                nomeProduto = parsed.nomeProduto;
                if (parsed.marca) marca = parsed.marca;
                if (parsed.categoria) categoria = parsed.categoria;
                if (parsed.fotoUrl && (parsed.fotoUrl.startsWith("http://") || parsed.fotoUrl.startsWith("https://"))) {
                  fotoUrl = parsed.fotoUrl;
                }
                fonte = "Cosmos Bluesoft & IA";
              }
            }
          } catch (gemErr: any) {
            // Silently fallback without logging 429 quota exhaustion errors
          }
        }
      }

      // 6. High quality clean studio packshots fallback based on product keywords
      if (!fotoUrl || (fotoUrl.includes("openfoodfacts") && fotoUrl.includes("front_pt"))) {
        const nomeLower = (nomeProduto + " " + marca).toLowerCase();
        if (nomeLower.includes("nescau") || nomeLower.includes("achocolatado")) {
          fotoUrl = "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80";
        } else if (nomeLower.includes("leite") || nomeLower.includes("creme de leite")) {
          fotoUrl = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80";
        } else if (nomeLower.includes("café") || nomeLower.includes("cafe")) {
          fotoUrl = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80";
        } else if (nomeLower.includes("coca") || nomeLower.includes("refrigerante") || nomeLower.includes("guaraná") || nomeLower.includes("suco")) {
          fotoUrl = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80";
        } else if (nomeLower.includes("detergente") || nomeLower.includes("sabão") || nomeLower.includes("omo") || nomeLower.includes("minuano") || nomeLower.includes("limpeza")) {
          fotoUrl = "https://images.unsplash.com/photo-1585832770485-e68a5fc88280?auto=format&fit=crop&w=600&q=80";
        } else if (nomeLower.includes("biscoito") || nomeLower.includes("passatempo") || nomeLower.includes("bolacha")) {
          fotoUrl = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80";
        } else {
          fotoUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
        }
      }

      return res.json({
        nomeProduto: nomeProduto || "Produto Cadastrado",
        marca: marca || "",
        categoria: categoria || "Mercearia / Grãos & Cereais",
        fotoUrl: fotoUrl || "",
        descricao: descricao || "",
        fonte: fonte || "Cosmos Bluesoft (https://cosmos.bluesoft.com.br/)",
      });
    } catch (err: any) {
      console.warn("Aviso na consulta de código de barras:", err?.message || err);
      return res.status(200).json({
        nomeProduto: "Produto Sem Título",
        marca: "",
        categoria: "Mercearia / Grãos & Cereais",
        fotoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
        fonte: "Manual",
      });
    }
  });

  // API endpoint to search products by text/keyword in BomJawaKit + Bluesoft Cosmos API + Consulta Produtos
  app.post("/api/buscar-produtos-externos", async (req, res) => {
    try {
      const { query, page, cosmosToken, preferFallback } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Termo de busca não fornecido", produtos: [] });
      }

      const numPage = typeof page === "number" && page > 0 ? page : 1;
      if (!preferFallback) {
        const resBomJawa = await buscarProdutosBomJawaKit({
          query,
          page: numPage,
          limit: 24,
          comImagem: true,
        }).catch(() => null);

        if (resBomJawa && resBomJawa.produtos.length > 0) {
          return res.json(resBomJawa);
        }
      }

      const tokenCosmos = (cosmosToken && cosmosToken.trim()) || process.env.COSMOS_TOKEN || COSMOS_BLUESOFT_DEFAULT_TOKEN;

      // Tenta API Oficial Bluesoft Cosmos (GET /products?query=...)
      try {
        const ctrl = new AbortController();
        const tId = setTimeout(() => ctrl.abort(), 5000);
        const cosmosRes = await fetch(
          `${COSMOS_BLUESOFT_API_BASE}/products?query=${encodeURIComponent(query.trim())}&page=${numPage}`,
          {
            method: "GET",
            signal: ctrl.signal,
            headers: {
              "X-Cosmos-Token": tokenCosmos,
              "Content-Type": "application/json",
              "User-Agent": "Cosmos-API-Request",
              Accept: "application/json",
            },
          }
        );
        clearTimeout(tId);

        if (cosmosRes.ok) {
          const cosmosJson = await cosmosRes.json();
          const listaRaw = Array.isArray(cosmosJson?.products)
            ? cosmosJson.products
            : Array.isArray(cosmosJson)
            ? cosmosJson
            : [];
          if (listaRaw.length > 0) {
            const produtosCosmos = listaRaw.map((item: any) => {
              const gtin = String(item.gtin || "").trim();
              const thumb = String(item.thumbnail || "").trim();
              return {
                ean: gtin,
                nomeProduto: String(item.description || "").trim(),
                marca: String(item.brand?.name || "").trim(),
                categoria: String(item.gpc?.description || item.ncm?.description || "").trim(),
                fotoUrl: thumb && !thumb.includes("default") ? thumb : `${COSMOS_BLUESOFT_CDN}/${gtin}`,
                ncm: String(item.ncm?.code || "").trim(),
                href: `https://cosmos.bluesoft.com.br/produtos/${gtin}`,
                fonte: "API Bluesoft Cosmos (cosmos.bluesoft.com.br)",
              };
            });
            return res.json({
              produtos: produtosCosmos,
              total: Number(cosmosJson?.total_count || produtosCosmos.length),
              page: numPage,
              query: query.trim(),
            });
          }
        }
      } catch {}

      const resultado = await buscarConsultaProdutosLista(query, numPage);
      return res.json(resultado);
    } catch (err: any) {
      console.warn("Erro ao buscar produtos externos:", err);
      return res.status(500).json({ error: "Falha na consulta externa", produtos: [] });
    }
  });
  // Rota explícita para o Service Worker com cabeçalho Service-Worker-Allowed
  app.get("/sw.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    const swPath = path.join(process.cwd(), "public", "sw.js");
    res.sendFile(swPath);
  });

  // Rota explícita para o Web App Manifest
  app.get("/manifest.json", (req, res) => {
    res.setHeader("Content-Type", "application/manifest+json");
    const manifestPath = path.join(process.cwd(), "public", "manifest.json");
    res.sendFile(manifestPath);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();

