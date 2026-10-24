// Catálogo Oficial Ambev com Códigos EAN reais, Marcas, Categorias, Descrições completas e Imagens
import { ProdutoCatalogo } from '../types';
import { salvarProdutoCatalogoFirestore } from './firestoreSync';

export const CATALOGO_AMBEV_OFICIAL: ProdutoCatalogo[] = [
  {
    "codigo": "7891991304863",
    "nome": "Beb.mista Skol Beats Caipirinha L.neck 269ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991304863.png",
    "descricao": "Beb.mista Skol Beats Caipirinha L.neck 269ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891991307994",
    "nome": "Beb.mista Skol Beats Green Mix Lt 269ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307994.png",
    "descricao": "Beb.mista Skol Beats Green Mix Lt 269ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2206.00.90."
  },
  {
    "codigo": "7891991296472",
    "nome": "Bebida Mista Alcoólica Gin & Tônica Skol Beats Gt Garrafa 313ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "313ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991296472.png",
    "descricao": "Bebida Mista Alcoólica Gin & Tônica Skol Beats Gt Garrafa 313ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas (Bebidas Alcoolicas). Apresentação/Volume: 313ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891149105588",
    "nome": "Bebida Mista Alcoólica Skol Beats Senses Garrafa 313ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "313ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149105588.png",
    "descricao": "Bebida Mista Alcoólica Skol Beats Senses Garrafa 313ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 313ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891149108404",
    "nome": "Cerv.skol Puro Malte 300ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149108404.png",
    "descricao": "Cerv.skol Puro Malte 300ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149106608",
    "nome": "Cerveja Skol Beats Spirit Long Neck 355g Skol",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355G",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149106608.png",
    "descricao": "Cerveja Skol Beats Spirit Long Neck 355g Skol — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355G. NCM: 2208.90.00."
  },
  {
    "codigo": "7891149105045",
    "nome": "Cerveja Skol Pack 12x269ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149105045.png",
    "descricao": "Cerveja Skol Pack 12x269ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "60008855",
    "nome": "Cerveja Skol Puro Malte Sleek Lt 350ml Data",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/60008855.png",
    "descricao": "Cerveja Skol Puro Malte Sleek Lt 350ml Data — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307680",
    "nome": "Pack Cerveja Pilsen Skol Lata 12 Unidades 350ml Cada",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307680.png",
    "descricao": "Pack Cerveja Pilsen Skol Lata 12 Unidades 350ml Cada — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991299879",
    "nome": "Pack Cerveja Pilsen Skol Lata 6 Unidades 310ml Cada Embalagem Econômica",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "310ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991299879.png",
    "descricao": "Pack Cerveja Pilsen Skol Lata 6 Unidades 310ml Cada Embalagem Econômica — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 310ML. NCM: 2203.00.00."
  },
  {
    "codigo": "852139000099",
    "nome": "Fresskolita Reg 8 X 2 Lts",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/852139000099",
    "descricao": "Fresskolita Reg 8 X 2 Lts — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991299763",
    "nome": "Brahma Chopp lata 410 ml pack com 15 unidades",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "410ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991299763.png",
    "descricao": "Brahma Chopp lata 410 ml pack com 15 unidades — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 410ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305501",
    "nome": "Brahma D Malte Escura Lt Slek 350ml Sh12",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305501.png",
    "descricao": "Brahma D Malte Escura Lt Slek 350ml Sh12 — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305525",
    "nome": "Brahma Duplo Malte Tostada Lata 350 ml pack com 12 unidades",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305525.png",
    "descricao": "Brahma Duplo Malte Tostada Lata 350 ml pack com 12 unidades — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305167",
    "nome": "Brahma Duplo Malte Trigo Lata 350 ml pack com 12 unidades",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305167.png",
    "descricao": "Brahma Duplo Malte Trigo Lata 350 ml pack com 12 unidades — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149030309",
    "nome": "Brahma Pilsen Long Neck 1 Unidade",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149030309.png",
    "descricao": "Brahma Pilsen Long Neck 1 Unidade — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991294508",
    "nome": "Cerv Brahma 473ml Chopp Pack Com 12",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991294508.png",
    "descricao": "Cerv Brahma 473ml Chopp Pack Com 12 — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149107018",
    "nome": "Cerv.brahma Extra Lager Lt.350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149107018.png",
    "descricao": "Cerv.brahma Extra Lager Lt.350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303880",
    "nome": "Cerveja Black Pilsner Duplo Malte Brahma Lata 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991303880.png",
    "descricao": "Cerveja Black Pilsner Duplo Malte Brahma Lata 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307345",
    "nome": "Cerveja Brahma Chopp Pilsen Multipack Com 12 Lt 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307345.png",
    "descricao": "Cerveja Brahma Chopp Pilsen Multipack Com 12 Lt 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991295185",
    "nome": "Cerveja Brahma D Malte 300ml Traz Vasilhame",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991295185.png",
    "descricao": "Cerveja Brahma D Malte 300ml Traz Vasilhame — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991300308",
    "nome": "Cerveja Brahma Duplo Malte 310ml Lt Pack Com 20",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "310ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991300308.png",
    "descricao": "Cerveja Brahma Duplo Malte 310ml Lt Pack Com 20 — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 310ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60008053",
    "nome": "Cerveja Brahma Duplo Malte Trigo 350ml Data",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/60008053.png",
    "descricao": "Cerveja Brahma Duplo Malte Trigo 350ml Data — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149106486",
    "nome": "Cerveja L.neck Brahma Extra Red Lager",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149106486.png",
    "descricao": "Cerveja L.neck Brahma Extra Red Lager — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305518",
    "nome": "Cerveja Pilsner Duplo Malte Tostada Brahma Lata 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305518.png",
    "descricao": "Cerveja Pilsner Duplo Malte Tostada Brahma Lata 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305150",
    "nome": "Cerveja Pilsner Trigo Duplo Malte Brahma Lata 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305150.png",
    "descricao": "Cerveja Pilsner Trigo Duplo Malte Brahma Lata 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149106455",
    "nome": "Cerveja Specialty Beer Extra Weiss 355ml Brahma",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149106455.png",
    "descricao": "Cerveja Specialty Beer Extra Weiss 355ml Brahma — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991016247",
    "nome": "Cerveja Antarctica 269ml Lt Ginger Ale By",
    "marca": "Antarctica (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991016247.png",
    "descricao": "Cerveja Antarctica 269ml Lt Ginger Ale By — Produto oficial do catálogo Ambev. Marca: Antarctica (Ambev). Categoria: Bebidas Alcoólicas (Agua). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303521",
    "nome": "Cerveja Antarctica Lt 473ml Original",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991303521.png",
    "descricao": "Cerveja Antarctica Lt 473ml Original — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60005441",
    "nome": "Cerveja Antarctica Subzero Retornavel Garrafa 300ml Data",
    "marca": "Antarctica (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/60005441.png",
    "descricao": "Cerveja Antarctica Subzero Retornavel Garrafa 300ml Data — Produto oficial do catálogo Ambev. Marca: Antarctica (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991295017",
    "nome": "Cerveja Pilsen Antarctica Original Lata 473ml",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991295017.png",
    "descricao": "Cerveja Pilsen Antarctica Original Lata 473ml — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304214",
    "nome": "Cerveja Pilsen Silver Antarctica Subzero Lata 350ml",
    "marca": "Antarctica (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991304214.png",
    "descricao": "Cerveja Pilsen Silver Antarctica Subzero Lata 350ml — Produto oficial do catálogo Ambev. Marca: Antarctica (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307338",
    "nome": "Pack Cerveja Pilsen Antarctica Original Lata 12 Unidades 350ml Cada Embalagem Econômica",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307338.png",
    "descricao": "Pack Cerveja Pilsen Antarctica Original Lata 12 Unidades 350ml Cada Embalagem Econômica — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307048",
    "nome": "Pack Cerveja Pilsen Antarctica Original Lata 15 Unidades 269ml Cada Embalagem Econômica",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307048.png",
    "descricao": "Pack Cerveja Pilsen Antarctica Original Lata 15 Unidades 269ml Cada Embalagem Econômica — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991000888",
    "nome": "Tonica Antarctica Diet||refrigerantes | Agua Tonica Antarctica Diet",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991000888.png",
    "descricao": "Tonica Antarctica Diet||refrigerantes | Agua Tonica Antarctica Diet — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Agua). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991015967",
    "nome": "Água Tônica 3 Limões Zero Açúcar Antarctica Lata 269ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991015967",
    "descricao": "Água Tônica 3 Limões Zero Açúcar Antarctica Lata 269ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 269ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991000864",
    "nome": "Agua Tonica Antarctica 350ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991000864",
    "descricao": "Agua Tonica Antarctica 350ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991307413",
    "nome": "Agua Tonica Antarctica 350ml Intense Lt",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991307413",
    "descricao": "Agua Tonica Antarctica 350ml Intense Lt — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298513",
    "nome": "Água Tônica Antarctica Garrafa 1l",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991298513",
    "descricao": "Água Tônica Antarctica Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298520",
    "nome": "Água Tônica Antarctica Garrafa 1l",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991298520",
    "descricao": "Água Tônica Antarctica Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991015929",
    "nome": "Água Tônica Antarctica Lata 269ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991015929",
    "descricao": "Água Tônica Antarctica Lata 269ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 269ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991305440",
    "nome": "Cerveja Munich Helles Puro Malte Spaten Garrafa 330ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305440.png",
    "descricao": "Cerveja Munich Helles Puro Malte Spaten Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303347",
    "nome": "Cerveja Munich Helles Puro Malte Spaten Lata 269ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991303347.png",
    "descricao": "Cerveja Munich Helles Puro Malte Spaten Lata 269ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303200",
    "nome": "Cerveja Munich Helles Puro Malte Spaten Lata 473ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991303200.png",
    "descricao": "Cerveja Munich Helles Puro Malte Spaten Lata 473ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60003997",
    "nome": "Cerveja Spaten Gf 355ml Data",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/60003997.png",
    "descricao": "Cerveja Spaten Gf 355ml Data — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303217",
    "nome": "Cerveja Spaten Latao 473ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991303217.png",
    "descricao": "Cerveja Spaten Latao 473ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60004796",
    "nome": "Cerveja Spaten Puro Malte Gf 600ml Data",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/60004796.png",
    "descricao": "Cerveja Spaten Puro Malte Gf 600ml Data — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898700710878",
    "nome": "Kit Caneca + Cerveja Munich Helles Puro Malte Spaten 355ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898700710878.png",
    "descricao": "Kit Caneca + Cerveja Munich Helles Puro Malte Spaten 355ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304184",
    "nome": "Cerveja Cero Sunbrew Zero Álcool Corona Garrafa 330ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991304184.png",
    "descricao": "Cerveja Cero Sunbrew Zero Álcool Corona Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991307505",
    "nome": "Cerveja Cero Sunbrew Zero Álcool Corona Lata 350ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307505.png",
    "descricao": "Cerveja Cero Sunbrew Zero Álcool Corona Lata 350ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991304191",
    "nome": "Cerveja Corona Zero Ln 330ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991304191.png",
    "descricao": "Cerveja Corona Zero Ln 330ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991305853",
    "nome": "Cerveja Extra Corona 473ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305853.png",
    "descricao": "Cerveja Extra Corona 473ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306324",
    "nome": "Cerveja Extra Pilsen Corona Lata 269ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991306324.png",
    "descricao": "Cerveja Extra Pilsen Corona Lata 269ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305846",
    "nome": "Cerveja Pilsen Corona Lata 473ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991305846.png",
    "descricao": "Cerveja Pilsen Corona Lata 473ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307512",
    "nome": "Corona Cero Sunbrew N Lt Sleek 350ml C 8 Cx Cartao",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307512.png",
    "descricao": "Corona Cero Sunbrew N Lt Sleek 350ml C 8 Cx Cartao — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991303309",
    "nome": "Cerveja Lager Premium Puro Malte Stella Artois Lata 473ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991303309.png",
    "descricao": "Cerveja Lager Premium Puro Malte Stella Artois Lata 473ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991013000",
    "nome": "Cerveja Lata 310ml Stella Artois",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "310ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991013000.png",
    "descricao": "Cerveja Lata 310ml Stella Artois — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 310ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304870",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Garrafa 330ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991304870.png",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306461",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991306461.png",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306478",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991306478.png",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306430",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 473ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991306430.png",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 473ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306485",
    "nome": "Cerveja Puro Malte Pure Gold Stella Artois Lata 350ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991306485.png",
    "descricao": "Cerveja Puro Malte Pure Gold Stella Artois Lata 350ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991302289",
    "nome": "Cerveja Stella Artois C15 Lt 269ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991302289.png",
    "descricao": "Cerveja Stella Artois C15 Lt 269ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7792798006045",
    "nome": "Cerveja Stella Artois Vidro 330ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7792798006045.png",
    "descricao": "Cerveja Stella Artois Vidro 330ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898700710748",
    "nome": "Kit Cálice + Cerveja Puro Malte Stella Artois 330ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898700710748.png",
    "descricao": "Kit Cálice + Cerveja Puro Malte Stella Artois 330ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307437",
    "nome": "Budweiser Lt 269ml Sh C 15 Multpack",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307437.png",
    "descricao": "Budweiser Lt 269ml Sh C 15 Multpack — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304986",
    "nome": "Cerv Budweiser Rom Gfa 300ml",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991304986.png",
    "descricao": "Cerv Budweiser Rom Gfa 300ml — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60008701",
    "nome": "Cerveja Budweiser 300ml Liquido",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/60008701.png",
    "descricao": "Cerveja Budweiser 300ml Liquido — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991298445",
    "nome": "Cerveja Zero Álcool Budweiser Garrafa 330ml",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991298445.png",
    "descricao": "Cerveja Zero Álcool Budweiser Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991298407",
    "nome": "Cerveja Zero Álcool Budweiser Lata 350ml",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991298407.png",
    "descricao": "Cerveja Zero Álcool Budweiser Lata 350ml — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2202.91.00."
  },
  {
    "codigo": "798190114538",
    "nome": "Kit Cerveja Budweiser Com 8 269ml + Copo",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/798190114538.png",
    "descricao": "Kit Cerveja Budweiser Com 8 269ml + Copo — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7896292371040",
    "nome": "Sal De Parrilha Pimenta Do Reino Com Lúpulo Budweiser 200g",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "200G",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7896292371040.png",
    "descricao": "Sal De Parrilha Pimenta Do Reino Com Lúpulo Budweiser 200g — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Mercearia E Doce). Apresentação/Volume: 200G. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991012195",
    "nome": "Bohemia Bela Rosa",
    "marca": "Bohemia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991012195.png",
    "descricao": "Bohemia Bela Rosa — Produto oficial do catálogo Ambev. Marca: Bohemia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7898994341345",
    "nome": "Cerveja Bohemian Pilsener Madalena Garrafa 600ml",
    "marca": "Bohemia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898994341345.png",
    "descricao": "Cerveja Bohemian Pilsener Madalena Garrafa 600ml — Produto oficial do catálogo Ambev. Marca: Bohemia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898958547226",
    "nome": "Cerveja Leopold.bohemian 500",
    "marca": "Bohemia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898958547226.png",
    "descricao": "Cerveja Leopold.bohemian 500 — Produto oficial do catálogo Ambev. Marca: Bohemia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605251698",
    "nome": "Cerv Colorado Appia 410ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "410ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605251698.png",
    "descricao": "Cerv Colorado Appia 410ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 410ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605250332",
    "nome": "Cerv Colorado Nassau Caju 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605250332.png",
    "descricao": "Cerv Colorado Nassau Caju 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605253920",
    "nome": "Cerv Colorado Tim Maia One Way 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605253920.png",
    "descricao": "Cerv Colorado Tim Maia One Way 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605252299",
    "nome": "Cerveja Colorado 600ml Tropicana One Way",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605252299.png",
    "descricao": "Cerveja Colorado 600ml Tropicana One Way — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605253135",
    "nome": "Cerveja Colorado Ed 20 Brazilian Witibier 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605253135.png",
    "descricao": "Cerveja Colorado Ed 20 Brazilian Witibier 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898925943877",
    "nome": "Cerveja Colorado Titas",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898925943877.png",
    "descricao": "Cerveja Colorado Titas — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605252527",
    "nome": "Cerveja Session Ipa Puro Malte Kuyá Colorado Garrafa 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605252527.png",
    "descricao": "Cerveja Session Ipa Puro Malte Kuyá Colorado Garrafa 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605254309",
    "nome": "Cerveja Session Ipa Puro Malte Kuyá Colorado Lata 350ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605254309.png",
    "descricao": "Cerveja Session Ipa Puro Malte Kuyá Colorado Lata 350ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605250400",
    "nome": "Colorado Appia 300ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898605250400.png",
    "descricao": "Colorado Appia 300ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898925943709",
    "nome": "Colorado Vixnu Double Ipa Garrafa 1 Unidade",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898925943709.png",
    "descricao": "Colorado Vixnu Double Ipa Garrafa 1 Unidade — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7792798008131",
    "nome": "Cerveja Patagonia Amber Lager Long Neck - 355ml",
    "marca": "Patagonia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7792798008131.png",
    "descricao": "Cerveja Patagonia Amber Lager Long Neck - 355ml — Produto oficial do catálogo Ambev. Marca: Patagonia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303941",
    "nome": "Cerveja German Lager Becks Lata 269ml",
    "marca": "Beck's (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991303941.png",
    "descricao": "Cerveja German Lager Becks Lata 269ml — Produto oficial do catálogo Ambev. Marca: Beck's (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991302548",
    "nome": "Cerv Michelob Ultra 330ml Long Neck",
    "marca": "Michelob Ultra (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991302548.png",
    "descricao": "Cerv Michelob Ultra 330ml Long Neck — Produto oficial do catálogo Ambev. Marca: Michelob Ultra (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149108640",
    "nome": "Cerveja Witbier Hoegaarden Garrafa 330ml",
    "marca": "Hoegaarden (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891149108640.png",
    "descricao": "Cerveja Witbier Hoegaarden Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Hoegaarden (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304849",
    "nome": "Bebida Mista Alcoólica Caipirinha Beats Caipi Garrafa 269ml",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991304849.png",
    "descricao": "Bebida Mista Alcoólica Caipirinha Beats Caipi Garrafa 269ml — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891991307185",
    "nome": "Bebida Mista Alcoólica Gaseificada Frutas Vermelhas Beats Red Mix Lata 269ml",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991307185.png",
    "descricao": "Bebida Mista Alcoólica Gaseificada Frutas Vermelhas Beats Red Mix Lata 269ml — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2206.00.90."
  },
  {
    "codigo": "7891991306188",
    "nome": "Bebida Mista Alcoólica Tropical Beats Garrafa 269ml",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991306188.png",
    "descricao": "Bebida Mista Alcoólica Tropical Beats Garrafa 269ml — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891991301350",
    "nome": "Kit 2 Bebidas Mistas Alcoólicas Moscow Mule Ginger + 2 Mojito Mint + 2 Gin & Tônica Gt Beats 269ml Cada",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991301350.png",
    "descricao": "Kit 2 Bebidas Mistas Alcoólicas Moscow Mule Ginger + 2 Mojito Mint + 2 Gin & Tônica Gt Beats 269ml Cada — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "78910942",
    "nome": "Guarana Antarctica",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/78910942",
    "descricao": "Guarana Antarctica — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991011020",
    "nome": "Guarana Antarctica",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991011020",
    "descricao": "Guarana Antarctica — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991010238",
    "nome": "Guaraná Antarctica Açaí Lata",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991010238",
    "descricao": "Guaraná Antarctica Açaí Lata — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991010542",
    "nome": "Guaraná Antarctica Garrafa Pet 1 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991010542",
    "descricao": "Guaraná Antarctica Garrafa Pet 1 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991009522",
    "nome": "Guaraná Antarctica Garrafa Pet 1,5 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991009522",
    "descricao": "Guaraná Antarctica Garrafa Pet 1,5 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149102709",
    "nome": "Guaraná Antarctica Garrafa Pet 3,3 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "3.3L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149102709",
    "descricao": "Guaraná Antarctica Garrafa Pet 3,3 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 3.3L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149103157",
    "nome": "Guaraná Antarctica Zero Garrafa Pet 2,5 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149103157",
    "descricao": "Guaraná Antarctica Zero Garrafa Pet 2,5 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "5051162839330",
    "nome": "Guaraná Antarctica, Guaraná Flavoured Soft Drink, Made From Amazon Rainforest Fruit, Imported From Brazil, 350ml, (pack Of 12)",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/5051162839330",
    "descricao": "Guaraná Antarctica, Guaraná Flavoured Soft Drink, Made From Amazon Rainforest Fruit, Imported From Brazil, 350ml, (pack Of 12) — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991298254",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Pepsi 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991298254",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Pepsi 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991305389",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 1l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991305389",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 1l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991304740",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991304740",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991306102",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991306102",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298247",
    "nome": "Kit Refrigerante Guaraná Antarctica + Limonada Soda Antarctica 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991298247",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Limonada Soda Antarctica 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991306966",
    "nome": "Kit Refrigerante Guaraná Antarctica Zero Açúcar + Guaraná Antarctica 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991306966",
    "descricao": "Kit Refrigerante Guaraná Antarctica Zero Açúcar + Guaraná Antarctica 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000172090",
    "nome": "(3 Pack) Diet Pepsi Caffeine Free Cola, 12 Fl Oz Cans, 12 Count",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/12000172090",
    "descricao": "(3 Pack) Diet Pepsi Caffeine Free Cola, 12 Fl Oz Cans, 12 Count — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "12000170775",
    "nome": "(3 Pack) Pepsi Zero Sugar Wild Cherry 12 Fluid Ounce, 12 Pack",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/12000170775",
    "descricao": "(3 Pack) Pepsi Zero Sugar Wild Cherry 12 Fluid Ounce, 12 Pack — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "12000171956",
    "nome": "(4 Pack) Diet Pepsi Soda, 16.9 Fl Oz, 6 Count",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/12000171956",
    "descricao": "(4 Pack) Diet Pepsi Soda, 16.9 Fl Oz, 6 Count — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "600231740555",
    "nome": "Assortment Of Soda, Coca-cola, Pepsi, Dr Pepper, Mountain Dew, Sprite And Ginger Ale Drinks Refrigerator Restock Kit (pack Of 6)",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/600231740555",
    "descricao": "Assortment Of Soda, Coca-cola, Pepsi, Dr Pepper, Mountain Dew, Sprite And Ginger Ale Drinks Refrigerator Restock Kit (pack Of 6) — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "12000173233",
    "nome": "Diet Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/12000173233",
    "descricao": "Diet Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "32368180018",
    "nome": "Jokari Pepsi Heritage Soda / Pop / Beverage Can Caps - 2pk",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/32368180018",
    "descricao": "Jokari Pepsi Heritage Soda / Pop / Beverage Can Caps - 2pk — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840807511",
    "nome": "Pepsi Cola 2lt Light",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840807511",
    "descricao": "Pepsi Cola 2lt Light — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840804947",
    "nome": "Pepsi Cola Twist Zero Lata",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840804947",
    "descricao": "Pepsi Cola Twist Zero Lata — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812386",
    "nome": "Pepsi Garrafa Pet 1,5 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812386",
    "descricao": "Pepsi Garrafa Pet 1,5 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812577",
    "nome": "Pepsi Garrafa Pet 3,3 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "3.3L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812577",
    "descricao": "Pepsi Garrafa Pet 3,3 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 3.3L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000173226",
    "nome": "Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/12000173226",
    "descricao": "Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840812089",
    "nome": "Pepsi Twist 3 Pet",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812089",
    "descricao": "Pepsi Twist 3 Pet — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840802714",
    "nome": "Pepsi Twist Garrafa Pet 2 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840802714",
    "descricao": "Pepsi Twist Garrafa Pet 2 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840802745",
    "nome": "Pepsi Twist Lata",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840802745",
    "descricao": "Pepsi Twist Lata — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840804916",
    "nome": "Pepsi Twist Zero Garrafa Pet 2 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840804916",
    "descricao": "Pepsi Twist Zero Garrafa Pet 2 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000151941",
    "nome": "Pepsi-cola 1893, Ginger (12 Ounce Cans, Pack Of 12)",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/12000151941",
    "descricao": "Pepsi-cola 1893, Ginger (12 Ounce Cans, Pack Of 12) — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991297189",
    "nome": "Refr Sukita 2l Limao",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991297189",
    "descricao": "Refr Sukita 2l Limao — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149840601",
    "nome": "Refrig Sukita Zero Lata",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149840601",
    "descricao": "Refrig Sukita Zero Lata — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991303187",
    "nome": "Refrig.sukita Tubaina 350ml",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991303187",
    "descricao": "Refrig.sukita Tubaina 350ml — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149103379",
    "nome": "Refrig.sukita Vit.2l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149103379",
    "descricao": "Refrig.sukita Vit.2l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149103492",
    "nome": "Refrigerante Laranja E Limão Sukita Garrafa 1,5l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149103492",
    "descricao": "Refrigerante Laranja E Limão Sukita Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149441204",
    "nome": "Refrigerante Laranja Sukita Garrafa 1l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149441204",
    "descricao": "Refrigerante Laranja Sukita Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149108282",
    "nome": "Refrigerante Laranja Sukita Garrafa 200ml",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "200ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149108282",
    "descricao": "Refrigerante Laranja Sukita Garrafa 200ml — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 200ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149440801",
    "nome": "Refrigerante Laranja Sukita Garrafa 2l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149440801",
    "descricao": "Refrigerante Laranja Sukita Garrafa 2l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991297172",
    "nome": "Refrigerante Limão Sukita Garrafa 2l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991297172",
    "descricao": "Refrigerante Limão Sukita Garrafa 2l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149440603",
    "nome": "Refrigerante Sukita",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891149440603",
    "descricao": "Refrigerante Sukita — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812737",
    "nome": "H2oh! Citrus Garrafa Pet",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812737",
    "descricao": "H2oh! Citrus Garrafa Pet — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812614",
    "nome": "H2oh! Limão E Maçã Garrafa Pet 1,5 L",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812614",
    "descricao": "H2oh! Limão E Maçã Garrafa Pet 1,5 L — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "789284081287",
    "nome": "Refrig.h2oh Limoneto 1,5l Shrink Pet",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/789284081287",
    "descricao": "Refrig.h2oh Limoneto 1,5l Shrink Pet — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812751",
    "nome": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 1,5l",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812751",
    "descricao": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812423",
    "nome": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 500ml",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812423",
    "descricao": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 500ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840815837",
    "nome": "Refrigerante Limão H2oh! Lata 269ml",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840815837",
    "descricao": "Refrigerante Limão H2oh! Lata 269ml — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 269ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812416",
    "nome": "Refrigerante Limão Zero Açúcar H2oh! Garrafa 1,5l",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812416",
    "descricao": "Refrigerante Limão Zero Açúcar H2oh! Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812874",
    "nome": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 1,5l",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812874",
    "descricao": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812850",
    "nome": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 500ml",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840812850",
    "descricao": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 500ML. NCM: 2202.10.00."
  },
  {
    "codigo": "52000010268",
    "nome": "(12 Count) Gatorade Frost Thirst Quencher Sports Drink, Arctic Blitz, 12 Fl Oz",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/52000010268",
    "descricao": "(12 Count) Gatorade Frost Thirst Quencher Sports Drink, Arctic Blitz, 12 Fl Oz — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000201314",
    "nome": "(12 Count) Gatorade Thirst Quencher Sports Drink, Lemon Lime, 20 Fl Oz",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/52000201314",
    "descricao": "(12 Count) Gatorade Thirst Quencher Sports Drink, Lemon Lime, 20 Fl Oz — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840808990",
    "nome": "Gatorade Abacaxi",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840808990",
    "descricao": "Gatorade Abacaxi — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: 2202.99.00."
  },
  {
    "codigo": "7894321277073",
    "nome": "Gatorade Fierce Frutas Mistas",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7894321277073",
    "descricao": "Gatorade Fierce Frutas Mistas — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.99.00."
  },
  {
    "codigo": "52000103120",
    "nome": "Gatorade Frost Glacier Cherry Thirst Quencher Sports Drink, 12 Fl Oz, 12 Pack",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/52000103120",
    "descricao": "Gatorade Frost Glacier Cherry Thirst Quencher Sports Drink, 12 Fl Oz, 12 Pack — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "745352113946",
    "nome": "Gatorade Thirst Quencher Powder, Frost Glacier Freeze (makes 36 Quarts)",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/745352113946",
    "descricao": "Gatorade Thirst Quencher Powder, Frost Glacier Freeze (makes 36 Quarts) — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000104257",
    "nome": "Gatorade Thirst Quencher Sports Drink, Strawberry Lemonade, 20 Oz Bottles, 8 Count",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/52000104257",
    "descricao": "Gatorade Thirst Quencher Sports Drink, Strawberry Lemonade, 20 Oz Bottles, 8 Count — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000135145",
    "nome": "Gatorade Thirst Quencher, Orange, 28 Oz Bottle",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/52000135145",
    "descricao": "Gatorade Thirst Quencher, Orange, 28 Oz Bottle — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000043624",
    "nome": "Gatorade Zero Sugar Thirst Quencher, Lemon-lime, 20 Fl Oz (pack Of 12)",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/52000043624",
    "descricao": "Gatorade Zero Sugar Thirst Quencher, Lemon-lime, 20 Fl Oz (pack Of 12) — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840822019",
    "nome": "Isotônico Berry Blue Gatorade Garrafa 500ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840822019",
    "descricao": "Isotônico Berry Blue Gatorade Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 500ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7892840808013",
    "nome": "Isotônico Frutas Cítricas Gatorade Garrafa 500ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840808013",
    "descricao": "Isotônico Frutas Cítricas Gatorade Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 500ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7892840820701",
    "nome": "Isotônico Frutas Silvestres Gatorade Atividades Diárias Garrafa 350ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840820701",
    "descricao": "Isotônico Frutas Silvestres Gatorade Atividades Diárias Garrafa 350ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 350ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7894321264073",
    "nome": "Isotônico Gatorade Frutas Cítricas",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7894321264073",
    "descricao": "Isotônico Gatorade Frutas Cítricas — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: 2202.99.00."
  },
  {
    "codigo": "7892840808020",
    "nome": "Isotônico Laranja Gatorade Garrafa 500ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7892840808020",
    "descricao": "Isotônico Laranja Gatorade Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 500ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7891991000840",
    "nome": "Água Tônica Antarctica Lata 350ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991000840",
    "descricao": "Água Tônica Antarctica Lata 350ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298544",
    "nome": "Água Tônica Antarctica Zero Garrafa 1l",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://cdn-cosmos.bluesoft.com.br/products/7891991298544",
    "descricao": "Água Tônica Antarctica Zero Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991013055",
    "nome": "Energ.fusion Pessego Lt.310ml",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "310ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991013055.png",
    "descricao": "Energ.fusion Pessego Lt.310ml — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Bebida Energeticas). Apresentação/Volume: 310ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7891991010580",
    "nome": "Energético Fusion Lata 250ml",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "250ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991010580.png",
    "descricao": "Energético Fusion Lata 250ml — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Bebida Energeticas). Apresentação/Volume: 250ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7891991294751",
    "nome": "Energético Guaraná Fusion Lata 250ml",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "250ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891991294751.png",
    "descricao": "Energético Guaraná Fusion Lata 250ml — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Bebidas Alcoolicas). Apresentação/Volume: 250ML. NCM: 2202.99.00."
  },
  {
    "codigo": "43000005859",
    "nome": "Mio Energy Tropical Fusion Liquid Water Enhancer, 1.62 Fl Oz",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/43000005859.png",
    "descricao": "Mio Energy Tropical Fusion Liquid Water Enhancer, 1.62 Fl Oz — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Agua). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000608",
    "nome": "Rokz Bloody Mary Infusion Kit For Cocktails, 12 Oz",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/855439000608.png",
    "descricao": "Rokz Bloody Mary Infusion Kit For Cocktails, 12 Oz — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000431",
    "nome": "Rokz Ginger Cardamom Spirit Infusion Blend For Cocktails",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/855439000431.png",
    "descricao": "Rokz Ginger Cardamom Spirit Infusion Blend For Cocktails — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000615",
    "nome": "Rokz Margarita Infusion Kit For Cocktails, 12 Oz",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/855439000615.png",
    "descricao": "Rokz Margarita Infusion Kit For Cocktails, 12 Oz — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000387",
    "nome": "Rokz Spirit Infusion Kit For Cocktails - Fiery Pepper",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/855439000387.png",
    "descricao": "Rokz Spirit Infusion Kit For Cocktails - Fiery Pepper — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840815875",
    "nome": "Chá Ice Tea Pêssego Zero Açúcar Lipton Garrafa 200ml",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "200ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7892840815875.png",
    "descricao": "Chá Ice Tea Pêssego Zero Açúcar Lipton Garrafa 200ml — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 200ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042103278",
    "nome": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Garrafa 1,5l",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891042103278.png",
    "descricao": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042005206",
    "nome": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Lata 340ml",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "340ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891042005206.png",
    "descricao": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Lata 340ml — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 340ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042005213",
    "nome": "Chá Preto Ice Tea Pêssego Lipton Lata 340ml",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "340ML",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891042005213.png",
    "descricao": "Chá Preto Ice Tea Pêssego Lipton Lata 340ml — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 340ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042000195",
    "nome": "Chá Pronto Com Pêssego Lipton Ice Tea 1,5 Litro",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891042000195.png",
    "descricao": "Chá Pronto Com Pêssego Lipton Ice Tea 1,5 Litro — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042000201",
    "nome": "Lipton Ice Tea 1,5l Limao",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7891042000201.png",
    "descricao": "Lipton Ice Tea 1,5l Limao — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000112232",
    "nome": "Lipton Ice Tea, Peach, 20 Fl Oz",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/12000112232.png",
    "descricao": "Lipton Ice Tea, Peach, 20 Fl Oz — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: UN. NCM: NCM não disponível."
  }
];

/**
 * Verifica se um produto (por código ou nome) pertence ao portfólio Ambev
 */
export function isProdutoAmbev(termo: string): boolean {
  if (!termo) return false;
  const t = termo.trim().toLowerCase();
  return (
    CATALOGO_AMBEV_OFICIAL.some(p => p.codigo === t || p.nome.toLowerCase().includes(t)) ||
    t.includes('ambev') ||
    t.includes('skol') ||
    t.includes('brahma') ||
    t.includes('antarctica') ||
    t.includes('spaten') ||
    t.includes('corona') ||
    t.includes('stella artois') ||
    t.includes('budweiser') ||
    t.includes('bohemia') ||
    t.includes('colorado') ||
    t.includes('patagonia') ||
    t.includes('beck') ||
    t.includes('michelob') ||
    t.includes('hoegaarden') ||
    t.includes('beats') ||
    t.includes('guarana antarctica') ||
    t.includes('pepsi') ||
    t.includes('sukita') ||
    t.includes('h2oh') ||
    t.includes('gatorade') ||
    t.includes('fusion') ||
    t.includes('lipton')
  );
}

/**
 * Cruza o catálogo global do usuário com a base oficial Ambev.
 * - Adiciona todos os produtos da Ambev que ainda não estão no catálogo global.
 * - Atualiza produtos existentes caso estejam sem imagem, marca, categoria ou descrição.
 */
export function garantirCatalogoAmbevNoBancoGlobal(catalogoAtual: ProdutoCatalogo[]): {
  catalogoCompleto: ProdutoCatalogo[];
  novosInseridos: ProdutoCatalogo[];
  atualizados: ProdutoCatalogo[];
} {
  const mapaExistentes = new Map<string, ProdutoCatalogo>();
  for (const p of catalogoAtual || []) {
    if (p && p.codigo) {
      mapaExistentes.set(p.codigo.trim(), { ...p });
    }
  }

  const novosInseridos: ProdutoCatalogo[] = [];
  const atualizados: ProdutoCatalogo[] = [];

  for (const ambev of CATALOGO_AMBEV_OFICIAL) {
    const cod = ambev.codigo.trim();
    if (!mapaExistentes.has(cod)) {
      // Produto novo da Ambev: insere completo no catálogo global
      const novo: ProdutoCatalogo = { ...ambev };
      mapaExistentes.set(cod, novo);
      novosInseridos.push(novo);
    } else {
      // Produto já existia: enriquece se faltar imagem, marca, categoria ou descrição
      const existente = mapaExistentes.get(cod)!;
      let alterado = false;

      if (!existente.imagem && ambev.imagem) {
        existente.imagem = ambev.imagem;
        alterado = true;
      }
      if ((!existente.marca || existente.marca === 'Geral' || existente.marca === 'Não informado') && ambev.marca) {
        existente.marca = ambev.marca;
        alterado = true;
      }
      if ((!existente.categoria || existente.categoria === 'Geral') && ambev.categoria) {
        existente.categoria = ambev.categoria;
        alterado = true;
      }
      if (!existente.descricao && ambev.descricao) {
        existente.descricao = ambev.descricao;
        alterado = true;
      }

      if (alterado) {
        mapaExistentes.set(cod, existente);
        atualizados.push(existente);
      }
    }
  }

  const catalogoCompleto = Array.from(mapaExistentes.values());
  return { catalogoCompleto, novosInseridos, atualizados };
}

/**
 * Sincroniza em lote os produtos da Ambev com o Firestore (coleção 'produtos_catalogo')
 * e salva em localStorage para acesso offline instantâneo.
 */
export async function sincronizarCatalogoAmbevComFirestore(
  catalogoAtual: ProdutoCatalogo[],
  onProgresso?: (atual: number, total: number) => void
): Promise<{ totalNovos: number; totalAtualizados: number; catalogoFinal: ProdutoCatalogo[] }> {
  const { catalogoCompleto, novosInseridos, atualizados } = garantirCatalogoAmbevNoBancoGlobal(catalogoAtual);
  const itensParaSalvar = [...novosInseridos, ...atualizados];

  // Atualiza cache local imediatamente
  try {
    localStorage.setItem('catalogoGlobalFirebase', JSON.stringify(catalogoCompleto));
  } catch (err) {
    console.warn('Erro ao salvar catalogoGlobalFirebase no localStorage:', err);
  }

  // Grava em lotes paralelos de 5 no Firestore para maior velocidade
  let processados = 0;
  const total = itensParaSalvar.length;
  const BATCH_SIZE = 5;

  for (let i = 0; i < itensParaSalvar.length; i += BATCH_SIZE) {
    const lote = itensParaSalvar.slice(i, i + BATCH_SIZE);
    await Promise.all(
      lote.map(async (item) => {
        try {
          await salvarProdutoCatalogoFirestore(item);
        } catch (e) {
          console.warn('Erro ao salvar produto Ambev no Firestore:', item.codigo, e);
        }
      })
    );
    processados += lote.length;
    if (onProgresso) onProgresso(Math.min(processados, total), total);
  }

  return {
    totalNovos: novosInseridos.length,
    totalAtualizados: atualizados.length,
    catalogoFinal: catalogoCompleto
  };
}
