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
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304863.jpg?alt=media&token=3a5a4a73-aadf-4875-b401-d16a636bb33b",
    "descricao": "Beb.mista Skol Beats Caipirinha L.neck 269ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891991307994",
    "nome": "Beb.mista Skol Beats Green Mix Lt 269ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307994.jpg?alt=media&token=e0b3d913-96bd-48d7-a231-cf2f49a34667",
    "descricao": "Beb.mista Skol Beats Green Mix Lt 269ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2206.00.90."
  },
  {
    "codigo": "7891991296472",
    "nome": "Bebida Mista Alcoólica Gin & Tônica Skol Beats Gt Garrafa 313ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "313ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991296472.jpg?alt=media&token=fe53499b-7e0a-4ea3-bd02-7a3f8ace9923",
    "descricao": "Bebida Mista Alcoólica Gin & Tônica Skol Beats Gt Garrafa 313ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas (Bebidas Alcoolicas). Apresentação/Volume: 313ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891149105588",
    "nome": "Bebida Mista Alcoólica Skol Beats Senses Garrafa 313ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "313ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149105588.jpg?alt=media&token=056e84b0-cd08-4644-a9d4-5a498f6fb174",
    "descricao": "Bebida Mista Alcoólica Skol Beats Senses Garrafa 313ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 313ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891149108404",
    "nome": "Cerv.skol Puro Malte 300ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149108404.jpg?alt=media&token=98d9596c-a67e-4965-81d9-d24bce7ef861",
    "descricao": "Cerv.skol Puro Malte 300ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149106608",
    "nome": "Cerveja Skol Beats Spirit Long Neck 355g Skol",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149106608.jpg?alt=media&token=e790bf76-1151-4142-bb65-debb5e6b349a",
    "descricao": "Cerveja Skol Beats Spirit Long Neck 355g Skol — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355G. NCM: 2208.90.00."
  },
  {
    "codigo": "7891149105045",
    "nome": "Cerveja Skol Pack 12x269ml",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149105045.jpg?alt=media&token=9271995c-9624-434c-805c-e24e078a55d2",
    "descricao": "Cerveja Skol Pack 12x269ml — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "60008855",
    "nome": "Cerveja Skol Puro Malte Sleek Lt 350ml Data",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F60008855.jpg?alt=media&token=56fb1b4f-4fa3-4726-b2ba-d1157bc3c10a",
    "descricao": "Cerveja Skol Puro Malte Sleek Lt 350ml Data — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307680",
    "nome": "Pack Cerveja Pilsen Skol Lata 12 Unidades 350ml Cada",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307680.jpg?alt=media&token=3d4600ef-e328-43ce-8a36-0901d51bffcc",
    "descricao": "Pack Cerveja Pilsen Skol Lata 12 Unidades 350ml Cada — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991299879",
    "nome": "Pack Cerveja Pilsen Skol Lata 6 Unidades 310ml Cada Embalagem Econômica",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "310ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991299879.jpg?alt=media&token=e48f4532-2e4d-4b57-9ac1-25d2820cc59b",
    "descricao": "Pack Cerveja Pilsen Skol Lata 6 Unidades 310ml Cada Embalagem Econômica — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 310ML. NCM: 2203.00.00."
  },
  {
    "codigo": "852139000099",
    "nome": "Fresskolita Reg 8 X 2 Lts",
    "marca": "Skol (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F852139000099.jpg?alt=media&token=7bc850d0-2e55-4d4e-b69c-4ac0996ffe1d",
    "descricao": "Fresskolita Reg 8 X 2 Lts — Produto oficial do catálogo Ambev. Marca: Skol (Ambev). Categoria: Bebidas Alcoólicas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991299763",
    "nome": "Brahma Chopp lata 410 ml pack com 15 unidades",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "410ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991299763.jpg?alt=media&token=576dd188-f336-4b41-aced-49e305520277",
    "descricao": "Brahma Chopp lata 410 ml pack com 15 unidades — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 410ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305501",
    "nome": "Brahma D Malte Escura Lt Slek 350ml Sh12",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305501.jpg?alt=media&token=9480f7a1-9de7-4c92-bb11-fb8c7e962484",
    "descricao": "Brahma D Malte Escura Lt Slek 350ml Sh12 — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305525",
    "nome": "Brahma Duplo Malte Tostada Lata 350 ml pack com 12 unidades",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305525.jpg?alt=media&token=c67f2fcb-0d1f-419d-95b9-b1d7f30cb73a",
    "descricao": "Brahma Duplo Malte Tostada Lata 350 ml pack com 12 unidades — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305167",
    "nome": "Brahma Duplo Malte Trigo Lata 350 ml pack com 12 unidades",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305167.jpg?alt=media&token=02315956-5536-4d76-89dd-2fe93511c753",
    "descricao": "Brahma Duplo Malte Trigo Lata 350 ml pack com 12 unidades — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149030309",
    "nome": "Brahma Pilsen Long Neck 1 Unidade",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149030309.jpg?alt=media&token=2364d852-60b0-4f16-bae1-1f24e71d6560",
    "descricao": "Brahma Pilsen Long Neck 1 Unidade — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991294508",
    "nome": "Cerv Brahma 473ml Chopp Pack Com 12",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991294508.jpg?alt=media&token=aa0eab68-4c78-42ec-a473-bba3d6f1d43d",
    "descricao": "Cerv Brahma 473ml Chopp Pack Com 12 — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149107018",
    "nome": "Cerv.brahma Extra Lager Lt.350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149107018.jpg?alt=media&token=361234fc-7a19-4b66-a6c4-89a3e8df1d42",
    "descricao": "Cerv.brahma Extra Lager Lt.350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303880",
    "nome": "Cerveja Black Pilsner Duplo Malte Brahma Lata 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303880.jpg?alt=media&token=8d59f0f9-8b8b-42c2-831d-5972e5910919",
    "descricao": "Cerveja Black Pilsner Duplo Malte Brahma Lata 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307345",
    "nome": "Cerveja Brahma Chopp Pilsen Multipack Com 12 Lt 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307345.jpg?alt=media&token=997d1baf-a3fd-405a-b960-13a843e4581b",
    "descricao": "Cerveja Brahma Chopp Pilsen Multipack Com 12 Lt 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991295185",
    "nome": "Cerveja Brahma D Malte 300ml Traz Vasilhame",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991295185.jpg?alt=media&token=8ab861a0-e6d5-42f7-bb32-e140464813df",
    "descricao": "Cerveja Brahma D Malte 300ml Traz Vasilhame — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991300308",
    "nome": "Cerveja Brahma Duplo Malte 310ml Lt Pack Com 20",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "310ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991300308.jpg?alt=media&token=e61e8beb-77f7-4716-b026-c98915b02bb3",
    "descricao": "Cerveja Brahma Duplo Malte 310ml Lt Pack Com 20 — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 310ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60008053",
    "nome": "Cerveja Brahma Duplo Malte Trigo 350ml Data",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F60008053.jpg?alt=media&token=43f931e3-a438-4a59-a4cc-a1c847ec8581",
    "descricao": "Cerveja Brahma Duplo Malte Trigo 350ml Data — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149106486",
    "nome": "Cerveja L.neck Brahma Extra Red Lager",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149106486.jpg?alt=media&token=63fead3a-ffe7-4acf-9974-7df9c0a00914",
    "descricao": "Cerveja L.neck Brahma Extra Red Lager — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305518",
    "nome": "Cerveja Pilsner Duplo Malte Tostada Brahma Lata 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305518.jpg?alt=media&token=334a7f08-561f-4204-b947-7a8bc2e97c4f",
    "descricao": "Cerveja Pilsner Duplo Malte Tostada Brahma Lata 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305150",
    "nome": "Cerveja Pilsner Trigo Duplo Malte Brahma Lata 350ml",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305150.jpg?alt=media&token=bd33c25d-c7a5-4a30-9681-e8ef410c31f1",
    "descricao": "Cerveja Pilsner Trigo Duplo Malte Brahma Lata 350ml — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149106455",
    "nome": "Cerveja Specialty Beer Extra Weiss 355ml Brahma",
    "marca": "Brahma (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149106455.jpg?alt=media&token=70f3c8a2-8a00-4708-98aa-44e6410a73ac",
    "descricao": "Cerveja Specialty Beer Extra Weiss 355ml Brahma — Produto oficial do catálogo Ambev. Marca: Brahma (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991016247",
    "nome": "Cerveja Antarctica 269ml Lt Ginger Ale By",
    "marca": "Antarctica (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991016247.jpg?alt=media&token=efa67ab3-4448-4e6b-8b25-caaeed1ac954",
    "descricao": "Cerveja Antarctica 269ml Lt Ginger Ale By — Produto oficial do catálogo Ambev. Marca: Antarctica (Ambev). Categoria: Bebidas Alcoólicas (Agua). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303521",
    "nome": "Cerveja Antarctica Lt 473ml Original",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303521.jpg?alt=media&token=0ac9f9cd-e2a8-47d6-9423-0c8da3f41828",
    "descricao": "Cerveja Antarctica Lt 473ml Original — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60005441",
    "nome": "Cerveja Antarctica Subzero Retornavel Garrafa 300ml Data",
    "marca": "Antarctica (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F60005441.jpg?alt=media&token=2a491059-16b2-48a6-b6b4-9d6c285e39b9",
    "descricao": "Cerveja Antarctica Subzero Retornavel Garrafa 300ml Data — Produto oficial do catálogo Ambev. Marca: Antarctica (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991295017",
    "nome": "Cerveja Pilsen Antarctica Original Lata 473ml",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991295017.jpg?alt=media&token=6e26eb1e-3c97-430a-b619-e9bc497e3e4f",
    "descricao": "Cerveja Pilsen Antarctica Original Lata 473ml — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304214",
    "nome": "Cerveja Pilsen Silver Antarctica Subzero Lata 350ml",
    "marca": "Antarctica (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304214.jpg?alt=media&token=3efd6160-62fb-4531-827b-33f2ca52949a",
    "descricao": "Cerveja Pilsen Silver Antarctica Subzero Lata 350ml — Produto oficial do catálogo Ambev. Marca: Antarctica (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307338",
    "nome": "Pack Cerveja Pilsen Antarctica Original Lata 12 Unidades 350ml Cada Embalagem Econômica",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307338.jpg?alt=media&token=c70b3f63-e445-4efe-b5bb-1176d75fdcdb",
    "descricao": "Pack Cerveja Pilsen Antarctica Original Lata 12 Unidades 350ml Cada Embalagem Econômica — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307048",
    "nome": "Pack Cerveja Pilsen Antarctica Original Lata 15 Unidades 269ml Cada Embalagem Econômica",
    "marca": "Antarctica Original (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307048.jpg?alt=media&token=a39cf4f9-64bf-4124-bb41-db4cd5ab1e0f",
    "descricao": "Pack Cerveja Pilsen Antarctica Original Lata 15 Unidades 269ml Cada Embalagem Econômica — Produto oficial do catálogo Ambev. Marca: Antarctica Original (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991000888",
    "nome": "Tonica Antarctica Diet||refrigerantes | Agua Tonica Antarctica Diet",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991000888.jpg?alt=media&token=7da69c2b-3c20-4589-a183-37d70d3a5743",
    "descricao": "Tonica Antarctica Diet||refrigerantes | Agua Tonica Antarctica Diet — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Agua). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991015967",
    "nome": "Água Tônica 3 Limões Zero Açúcar Antarctica Lata 269ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991015967.jpg?alt=media&token=3626397c-feac-446b-b6df-5c946e4f24f6",
    "descricao": "Água Tônica 3 Limões Zero Açúcar Antarctica Lata 269ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 269ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991000864",
    "nome": "Agua Tonica Antarctica 350ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991000864.jpg?alt=media&token=14dc2552-78da-4754-b2ac-54de79ca419f",
    "descricao": "Agua Tonica Antarctica 350ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991307413",
    "nome": "Agua Tonica Antarctica 350ml Intense Lt",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307413.jpg?alt=media&token=22ecc3b6-16ba-42f9-907c-f449eaad08e7",
    "descricao": "Agua Tonica Antarctica 350ml Intense Lt — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298513",
    "nome": "Água Tônica Antarctica Garrafa 1l",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991298513.jpg?alt=media&token=23a9185e-d420-4cd5-94e2-d6b909a678a9",
    "descricao": "Água Tônica Antarctica Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298520",
    "nome": "Água Tônica Antarctica Garrafa 1l",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991298520.jpg?alt=media&token=a0c2ce41-9f70-4776-bbd1-cba3f36d9874",
    "descricao": "Água Tônica Antarctica Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991015929",
    "nome": "Água Tônica Antarctica Lata 269ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991015929.jpg?alt=media&token=49c01053-4f0d-4945-8afc-07586a81a90e",
    "descricao": "Água Tônica Antarctica Lata 269ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 269ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991305440",
    "nome": "Cerveja Munich Helles Puro Malte Spaten Garrafa 330ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305440.jpg?alt=media&token=a4b3a9c4-163c-425e-b648-156704386d89",
    "descricao": "Cerveja Munich Helles Puro Malte Spaten Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303347",
    "nome": "Cerveja Munich Helles Puro Malte Spaten Lata 269ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303347.jpg?alt=media&token=0e95b27b-3358-4137-a053-b854ae9d7328",
    "descricao": "Cerveja Munich Helles Puro Malte Spaten Lata 269ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303200",
    "nome": "Cerveja Munich Helles Puro Malte Spaten Lata 473ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303200.jpg?alt=media&token=ebbd6ea9-6412-4528-a7ef-d13f902f6e8f",
    "descricao": "Cerveja Munich Helles Puro Malte Spaten Lata 473ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60003997",
    "nome": "Cerveja Spaten Gf 355ml Data",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F60003997.jpg?alt=media&token=376d2422-7e6a-4137-847a-a3798ecac6ec",
    "descricao": "Cerveja Spaten Gf 355ml Data — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303217",
    "nome": "Cerveja Spaten Latao 473ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303217.jpg?alt=media&token=117e1b79-5e2f-4354-a45c-531ed6a81d18",
    "descricao": "Cerveja Spaten Latao 473ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60004796",
    "nome": "Cerveja Spaten Puro Malte Gf 600ml Data",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F60004796.jpg?alt=media&token=0f024377-426c-434a-b1de-a208a6dfe21c",
    "descricao": "Cerveja Spaten Puro Malte Gf 600ml Data — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898700710878",
    "nome": "Kit Caneca + Cerveja Munich Helles Puro Malte Spaten 355ml",
    "marca": "Spaten (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898700710878.jpg?alt=media&token=342d91e1-602e-4d58-8b8a-6d232c70711a",
    "descricao": "Kit Caneca + Cerveja Munich Helles Puro Malte Spaten 355ml — Produto oficial do catálogo Ambev. Marca: Spaten (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304184",
    "nome": "Cerveja Cero Sunbrew Zero Álcool Corona Garrafa 330ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304184.jpg?alt=media&token=c3344301-9a64-4c07-b508-80593a7ce100",
    "descricao": "Cerveja Cero Sunbrew Zero Álcool Corona Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991307505",
    "nome": "Cerveja Cero Sunbrew Zero Álcool Corona Lata 350ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307505.jpg?alt=media&token=5142d5ca-a54b-4bd9-b3de-0849d2b3ae22",
    "descricao": "Cerveja Cero Sunbrew Zero Álcool Corona Lata 350ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991304191",
    "nome": "Cerveja Corona Zero Ln 330ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304191.jpg?alt=media&token=84df7cc1-06ae-46ba-8b41-7232b772f616",
    "descricao": "Cerveja Corona Zero Ln 330ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991305853",
    "nome": "Cerveja Extra Corona 473ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305853.jpg?alt=media&token=4207bede-d713-4571-bd9f-1c7f2342c873",
    "descricao": "Cerveja Extra Corona 473ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306324",
    "nome": "Cerveja Extra Pilsen Corona Lata 269ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306324.jpg?alt=media&token=d7f56acd-4c33-4e37-9ac6-9d371b698a3b",
    "descricao": "Cerveja Extra Pilsen Corona Lata 269ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991305846",
    "nome": "Cerveja Pilsen Corona Lata 473ml",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305846.jpg?alt=media&token=ee8b94de-3e82-4993-8a28-bcdfc3ac1e56",
    "descricao": "Cerveja Pilsen Corona Lata 473ml — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307512",
    "nome": "Corona Cero Sunbrew N Lt Sleek 350ml C 8 Cx Cartao",
    "marca": "Corona (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307512.jpg?alt=media&token=6e296aef-8744-4056-ac47-94c4fec0812d",
    "descricao": "Corona Cero Sunbrew N Lt Sleek 350ml C 8 Cx Cartao — Produto oficial do catálogo Ambev. Marca: Corona (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991303309",
    "nome": "Cerveja Lager Premium Puro Malte Stella Artois Lata 473ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303309.jpg?alt=media&token=7c2a35ae-9e1a-4f41-9b9a-5bc9a0bcd909",
    "descricao": "Cerveja Lager Premium Puro Malte Stella Artois Lata 473ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991013000",
    "nome": "Cerveja Lata 310ml Stella Artois",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "310ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991013000.jpg?alt=media&token=558b1f1c-312e-43c8-abe8-88a5aee3b4cd",
    "descricao": "Cerveja Lata 310ml Stella Artois — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 310ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304870",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Garrafa 330ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304870.jpg?alt=media&token=4989c017-077c-4585-b297-e4ea7b55838c",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306461",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306461.jpg?alt=media&token=d4e40b0a-1a6d-44e8-bb37-bbd3feb16a58",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306478",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306478.jpg?alt=media&token=1872689d-064c-4168-b2b1-fc950b429be7",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 269ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306430",
    "nome": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 473ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "473ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306430.jpg?alt=media&token=14f9c194-960d-4df4-8631-e0c5d2a47e14",
    "descricao": "Cerveja Puro Malte Pure Gold Sem Glúten Stella Artois Lata 473ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 473ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991306485",
    "nome": "Cerveja Puro Malte Pure Gold Stella Artois Lata 350ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306485.jpg?alt=media&token=b0523a8f-a00b-48ed-844f-88ad4149482e",
    "descricao": "Cerveja Puro Malte Pure Gold Stella Artois Lata 350ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991302289",
    "nome": "Cerveja Stella Artois C15 Lt 269ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991302289.jpg?alt=media&token=61c1b7c5-2624-4107-850a-eb2be85f16a1",
    "descricao": "Cerveja Stella Artois C15 Lt 269ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7792798006045",
    "nome": "Cerveja Stella Artois Vidro 330ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7792798006045.jpg?alt=media&token=e8f86e22-b94d-404a-9404-886550b700e8",
    "descricao": "Cerveja Stella Artois Vidro 330ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898700710748",
    "nome": "Kit Cálice + Cerveja Puro Malte Stella Artois 330ml",
    "marca": "Stella Artois (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898700710748.jpg?alt=media&token=873e897e-bfc9-4d4e-9b9e-8ff160b47fa0",
    "descricao": "Kit Cálice + Cerveja Puro Malte Stella Artois 330ml — Produto oficial do catálogo Ambev. Marca: Stella Artois (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991307437",
    "nome": "Budweiser Lt 269ml Sh C 15 Multpack",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307437.jpg?alt=media&token=6a7b5b3c-d095-414c-938f-95ab10173e7d",
    "descricao": "Budweiser Lt 269ml Sh C 15 Multpack — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304986",
    "nome": "Cerv Budweiser Rom Gfa 300ml",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304986.jpg?alt=media&token=9bbbd25a-af24-48c6-a023-54233ce3fdcc",
    "descricao": "Cerv Budweiser Rom Gfa 300ml — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "60008701",
    "nome": "Cerveja Budweiser 300ml Liquido",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F60008701.jpg?alt=media&token=a83ea18f-7a1c-4e98-8070-1e3295e48bab",
    "descricao": "Cerveja Budweiser 300ml Liquido — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991298445",
    "nome": "Cerveja Zero Álcool Budweiser Garrafa 330ml",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991298445.jpg?alt=media&token=a8c58091-8af8-4947-bc69-40376b61c3b1",
    "descricao": "Cerveja Zero Álcool Budweiser Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2202.91.00."
  },
  {
    "codigo": "7891991298407",
    "nome": "Cerveja Zero Álcool Budweiser Lata 350ml",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991298407.jpg?alt=media&token=562ef4ab-de88-4b4b-b532-ae5c43a56cc7",
    "descricao": "Cerveja Zero Álcool Budweiser Lata 350ml — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2202.91.00."
  },
  {
    "codigo": "798190114538",
    "nome": "Kit Cerveja Budweiser Com 8 269ml + Copo",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F798190114538.jpg?alt=media&token=6cdcf798-847e-402f-b239-bd1ba9f99d1f",
    "descricao": "Kit Cerveja Budweiser Com 8 269ml + Copo — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7896292371040",
    "nome": "Sal De Parrilha Pimenta Do Reino Com Lúpulo Budweiser 200g",
    "marca": "Budweiser (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "200G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896292371040.jpg?alt=media&token=0aed1dc6-807b-41aa-b14a-6b5f8e4ce325",
    "descricao": "Sal De Parrilha Pimenta Do Reino Com Lúpulo Budweiser 200g — Produto oficial do catálogo Ambev. Marca: Budweiser (Ambev). Categoria: Bebidas Alcoólicas (Mercearia E Doce). Apresentação/Volume: 200G. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991012195",
    "nome": "Bohemia Bela Rosa",
    "marca": "Bohemia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991012195.jpg?alt=media&token=7bcfd636-d6bc-4bc4-8a0f-2e51b7b9e6dc",
    "descricao": "Bohemia Bela Rosa — Produto oficial do catálogo Ambev. Marca: Bohemia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7898994341345",
    "nome": "Cerveja Bohemian Pilsener Madalena Garrafa 600ml",
    "marca": "Bohemia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898994341345.jpg?alt=media&token=0583c75a-2408-47f2-8708-6563ab110d25",
    "descricao": "Cerveja Bohemian Pilsener Madalena Garrafa 600ml — Produto oficial do catálogo Ambev. Marca: Bohemia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898958547226",
    "nome": "Cerveja Leopold.bohemian 500",
    "marca": "Bohemia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898958547226.jpg?alt=media&token=7b118436-9ad6-45e4-bcb1-8a2a22555538",
    "descricao": "Cerveja Leopold.bohemian 500 — Produto oficial do catálogo Ambev. Marca: Bohemia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605251698",
    "nome": "Cerv Colorado Appia 410ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "410ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605251698.jpg?alt=media&token=39cabf63-aa49-4110-982b-3526003476c8",
    "descricao": "Cerv Colorado Appia 410ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 410ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605250332",
    "nome": "Cerv Colorado Nassau Caju 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605250332.jpg?alt=media&token=986208ea-4190-490b-84f9-f304444c4dd6",
    "descricao": "Cerv Colorado Nassau Caju 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605253920",
    "nome": "Cerv Colorado Tim Maia One Way 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605253920.jpg?alt=media&token=9fc440db-3680-4497-b419-f670116b67ee",
    "descricao": "Cerv Colorado Tim Maia One Way 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605252299",
    "nome": "Cerveja Colorado 600ml Tropicana One Way",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605252299.jpg?alt=media&token=c938d594-5006-4b7b-b060-a0392bf7a401",
    "descricao": "Cerveja Colorado 600ml Tropicana One Way — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605253135",
    "nome": "Cerveja Colorado Ed 20 Brazilian Witibier 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605253135.jpg?alt=media&token=0c2aa2e7-79a7-4904-860d-f965e1c4e259",
    "descricao": "Cerveja Colorado Ed 20 Brazilian Witibier 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898925943877",
    "nome": "Cerveja Colorado Titas",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898925943877.jpg?alt=media&token=517fa2aa-655b-4308-9ffd-02423b3a44aa",
    "descricao": "Cerveja Colorado Titas — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605252527",
    "nome": "Cerveja Session Ipa Puro Malte Kuyá Colorado Garrafa 600ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605252527.jpg?alt=media&token=c1fdcb57-b8eb-4e4b-bbe9-da6269dcbc6e",
    "descricao": "Cerveja Session Ipa Puro Malte Kuyá Colorado Garrafa 600ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 600ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605254309",
    "nome": "Cerveja Session Ipa Puro Malte Kuyá Colorado Lata 350ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605254309.jpg?alt=media&token=f76fa077-e4cf-456e-b311-5460c593a96f",
    "descricao": "Cerveja Session Ipa Puro Malte Kuyá Colorado Lata 350ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 350ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898605250400",
    "nome": "Colorado Appia 300ml",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "300ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898605250400.jpg?alt=media&token=e0591ae5-9a02-4001-adb0-4a7d9f7078a6",
    "descricao": "Colorado Appia 300ml — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 300ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7898925943709",
    "nome": "Colorado Vixnu Double Ipa Garrafa 1 Unidade",
    "marca": "Colorado (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898925943709.jpg?alt=media&token=f842b892-9d53-4f76-8fbf-ad20f3def07b",
    "descricao": "Colorado Vixnu Double Ipa Garrafa 1 Unidade — Produto oficial do catálogo Ambev. Marca: Colorado (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: UN. NCM: 2203.00.00."
  },
  {
    "codigo": "7792798008131",
    "nome": "Cerveja Patagonia Amber Lager Long Neck - 355ml",
    "marca": "Patagonia (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7792798008131.jpg?alt=media&token=f9a3971d-8628-42f8-aeb2-497a4c29c86c",
    "descricao": "Cerveja Patagonia Amber Lager Long Neck - 355ml — Produto oficial do catálogo Ambev. Marca: Patagonia (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 355ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991303941",
    "nome": "Cerveja German Lager Becks Lata 269ml",
    "marca": "Beck's (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303941.jpg?alt=media&token=69c768b9-01c7-4d82-9193-5e126bdb81c6",
    "descricao": "Cerveja German Lager Becks Lata 269ml — Produto oficial do catálogo Ambev. Marca: Beck's (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991302548",
    "nome": "Cerv Michelob Ultra 330ml Long Neck",
    "marca": "Michelob Ultra (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991302548.jpg?alt=media&token=e330be79-36b2-48b4-8d75-c1dffdfa9dab",
    "descricao": "Cerv Michelob Ultra 330ml Long Neck — Produto oficial do catálogo Ambev. Marca: Michelob Ultra (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891149108640",
    "nome": "Cerveja Witbier Hoegaarden Garrafa 330ml",
    "marca": "Hoegaarden (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149108640.jpg?alt=media&token=ff5b2791-c568-4c01-af64-6c9653f532a7",
    "descricao": "Cerveja Witbier Hoegaarden Garrafa 330ml — Produto oficial do catálogo Ambev. Marca: Hoegaarden (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 330ML. NCM: 2203.00.00."
  },
  {
    "codigo": "7891991304849",
    "nome": "Bebida Mista Alcoólica Caipirinha Beats Caipi Garrafa 269ml",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304849.jpg?alt=media&token=677f2435-f855-4620-8d67-62e499c9c4aa",
    "descricao": "Bebida Mista Alcoólica Caipirinha Beats Caipi Garrafa 269ml — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891991307185",
    "nome": "Bebida Mista Alcoólica Gaseificada Frutas Vermelhas Beats Red Mix Lata 269ml",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991307185.jpg?alt=media&token=8552f928-09b5-449c-8c8e-1e24d1114ad6",
    "descricao": "Bebida Mista Alcoólica Gaseificada Frutas Vermelhas Beats Red Mix Lata 269ml — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2206.00.90."
  },
  {
    "codigo": "7891991306188",
    "nome": "Bebida Mista Alcoólica Tropical Beats Garrafa 269ml",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306188.jpg?alt=media&token=3056934d-06d5-436e-9378-d81f3911fe7d",
    "descricao": "Bebida Mista Alcoólica Tropical Beats Garrafa 269ml — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas Alcoólicas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2208.90.00."
  },
  {
    "codigo": "7891991301350",
    "nome": "Kit 2 Bebidas Mistas Alcoólicas Moscow Mule Ginger + 2 Mojito Mint + 2 Gin & Tônica Gt Beats 269ml Cada",
    "marca": "Beats (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991301350.jpg?alt=media&token=c0b32e4e-cba5-44af-b780-c01a5656b795",
    "descricao": "Kit 2 Bebidas Mistas Alcoólicas Moscow Mule Ginger + 2 Mojito Mint + 2 Gin & Tônica Gt Beats 269ml Cada — Produto oficial do catálogo Ambev. Marca: Beats (Ambev). Categoria: Bebidas (Bebidas Alcoolicas). Apresentação/Volume: 269ML. NCM: 2203.00.00."
  },
  {
    "codigo": "78910942",
    "nome": "Guarana Antarctica",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F78910942.jpg?alt=media&token=e88618e4-1ea2-48a3-8589-d465d74732be",
    "descricao": "Guarana Antarctica — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991011020",
    "nome": "Guarana Antarctica",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991011020.jpg?alt=media&token=617087ea-444f-4d2e-965d-398e778043a0",
    "descricao": "Guarana Antarctica — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991010238",
    "nome": "Guaraná Antarctica Açaí Lata",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991010238.jpg?alt=media&token=2d796d67-9239-4f2f-bf16-1177c06a8188",
    "descricao": "Guaraná Antarctica Açaí Lata — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991010542",
    "nome": "Guaraná Antarctica Garrafa Pet 1 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991010542.jpg?alt=media&token=7f86bd67-1e86-406b-a8d0-7036fa6535f7",
    "descricao": "Guaraná Antarctica Garrafa Pet 1 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991009522",
    "nome": "Guaraná Antarctica Garrafa Pet 1,5 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991009522.jpg?alt=media&token=8c476f46-067d-4446-ad09-a542910abe75",
    "descricao": "Guaraná Antarctica Garrafa Pet 1,5 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149102709",
    "nome": "Guaraná Antarctica Garrafa Pet 3,3 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "3.3L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149102709.jpg?alt=media&token=ae2f6438-3547-4c30-bc14-8d6092dcef4e",
    "descricao": "Guaraná Antarctica Garrafa Pet 3,3 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 3.3L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149103157",
    "nome": "Guaraná Antarctica Zero Garrafa Pet 2,5 L",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149103157.jpg?alt=media&token=61376ff5-54cc-4b4f-a353-52d60669b190",
    "descricao": "Guaraná Antarctica Zero Garrafa Pet 2,5 L — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "5051162839330",
    "nome": "Guaraná Antarctica, Guaraná Flavoured Soft Drink, Made From Amazon Rainforest Fruit, Imported From Brazil, 350ml, (pack Of 12)",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5051162839330.jpg?alt=media&token=00b289c5-61f5-4714-b190-61c1720b0e06",
    "descricao": "Guaraná Antarctica, Guaraná Flavoured Soft Drink, Made From Amazon Rainforest Fruit, Imported From Brazil, 350ml, (pack Of 12) — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991298254",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Pepsi 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991298254.jpg?alt=media&token=705a7623-1dce-4e7f-8196-c572c1c246ee",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Pepsi 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991305389",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 1l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991305389.jpg?alt=media&token=a896e75a-1008-4e56-99dc-5845bc1200a6",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 1l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991304740",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991304740.jpg?alt=media&token=28700794-34db-496f-b3c9-c40a33fb86c3",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991306102",
    "nome": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306102.jpg?alt=media&token=e3c3462a-3170-4156-bf6b-a010d06d4beb",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Cola Zero Açúcar Pepsi Black 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298247",
    "nome": "Kit Refrigerante Guaraná Antarctica + Limonada Soda Antarctica 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991298247.jpg?alt=media&token=09739bb6-4929-49bd-b57c-ccc272cbd033",
    "descricao": "Kit Refrigerante Guaraná Antarctica + Limonada Soda Antarctica 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991306966",
    "nome": "Kit Refrigerante Guaraná Antarctica Zero Açúcar + Guaraná Antarctica 2l Cada Leve Mais Pague Menos",
    "marca": "Guaraná Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991306966.jpg?alt=media&token=29ee5856-943d-44e4-a6b9-08516edb83b2",
    "descricao": "Kit Refrigerante Guaraná Antarctica Zero Açúcar + Guaraná Antarctica 2l Cada Leve Mais Pague Menos — Produto oficial do catálogo Ambev. Marca: Guaraná Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000172090",
    "nome": "(3 Pack) Diet Pepsi Caffeine Free Cola, 12 Fl Oz Cans, 12 Count",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F12000172090.jpg?alt=media&token=6c75c0ea-f293-44c2-907a-140f6bc41f0e",
    "descricao": "(3 Pack) Diet Pepsi Caffeine Free Cola, 12 Fl Oz Cans, 12 Count — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "12000170775",
    "nome": "(3 Pack) Pepsi Zero Sugar Wild Cherry 12 Fluid Ounce, 12 Pack",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F12000170775.jpg?alt=media&token=c60374fd-873f-46a9-889b-b91a28344e52",
    "descricao": "(3 Pack) Pepsi Zero Sugar Wild Cherry 12 Fluid Ounce, 12 Pack — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "12000171956",
    "nome": "(4 Pack) Diet Pepsi Soda, 16.9 Fl Oz, 6 Count",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F12000171956.jpg?alt=media&token=f6c92eeb-40a3-4056-a7ca-1ea1df54c753",
    "descricao": "(4 Pack) Diet Pepsi Soda, 16.9 Fl Oz, 6 Count — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "600231740555",
    "nome": "Assortment Of Soda, Coca-cola, Pepsi, Dr Pepper, Mountain Dew, Sprite And Ginger Ale Drinks Refrigerator Restock Kit (pack Of 6)",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F600231740555.jpg?alt=media&token=8217b739-a541-44e0-9ff5-cab79f536337",
    "descricao": "Assortment Of Soda, Coca-cola, Pepsi, Dr Pepper, Mountain Dew, Sprite And Ginger Ale Drinks Refrigerator Restock Kit (pack Of 6) — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "12000173233",
    "nome": "Diet Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F12000173233.jpg?alt=media&token=6c748e73-340a-4550-a646-72412fd1cc1e",
    "descricao": "Diet Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "32368180018",
    "nome": "Jokari Pepsi Heritage Soda / Pop / Beverage Can Caps - 2pk",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F32368180018.jpg?alt=media&token=f024c7c3-8c88-464d-a52b-3b775b9025c6",
    "descricao": "Jokari Pepsi Heritage Soda / Pop / Beverage Can Caps - 2pk — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840807511",
    "nome": "Pepsi Cola 2lt Light",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840807511.jpg?alt=media&token=6d95ee9a-3414-4ba2-9ffb-399cf792bae4",
    "descricao": "Pepsi Cola 2lt Light — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840804947",
    "nome": "Pepsi Cola Twist Zero Lata",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840804947.jpg?alt=media&token=4ea12b6c-be88-4e1e-bd8f-da3e2afb0a51",
    "descricao": "Pepsi Cola Twist Zero Lata — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812386",
    "nome": "Pepsi Garrafa Pet 1,5 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812386.jpg?alt=media&token=8fe3cde7-6667-4630-b5c7-6e11ed8f3bda",
    "descricao": "Pepsi Garrafa Pet 1,5 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812577",
    "nome": "Pepsi Garrafa Pet 3,3 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "3.3L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812577.jpg?alt=media&token=b5ab3c50-319d-49d0-ba72-c1d7b9910665",
    "descricao": "Pepsi Garrafa Pet 3,3 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 3.3L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000173226",
    "nome": "Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F12000173226.jpg?alt=media&token=a71a8965-c5c3-4324-ba32-328d0101956c",
    "descricao": "Pepsi Soda, 7.5 Ounce Mini Cans, 10 Pack — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840812089",
    "nome": "Pepsi Twist 3 Pet",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812089.jpg?alt=media&token=73f0dfe3-8712-4a45-a0d4-533e649c9ff3",
    "descricao": "Pepsi Twist 3 Pet — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840802714",
    "nome": "Pepsi Twist Garrafa Pet 2 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840802714.jpg?alt=media&token=af7ff2bc-319a-4449-a6bd-e9c08c5661c9",
    "descricao": "Pepsi Twist Garrafa Pet 2 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840802745",
    "nome": "Pepsi Twist Lata",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840802745.jpg?alt=media&token=d2abb5d0-0db1-4b6c-a2ca-c1c0bcd25abc",
    "descricao": "Pepsi Twist Lata — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840804916",
    "nome": "Pepsi Twist Zero Garrafa Pet 2 L",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840804916.jpg?alt=media&token=a520b7d9-ef6c-40c9-aee4-0dbb24acd5fe",
    "descricao": "Pepsi Twist Zero Garrafa Pet 2 L — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000151941",
    "nome": "Pepsi-cola 1893, Ginger (12 Ounce Cans, Pack Of 12)",
    "marca": "Pepsi (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F12000151941.jpg?alt=media&token=557c9f72-2191-47d3-a624-ee74220a41e5",
    "descricao": "Pepsi-cola 1893, Ginger (12 Ounce Cans, Pack Of 12) — Produto oficial do catálogo Ambev. Marca: Pepsi (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7891991297189",
    "nome": "Refr Sukita 2l Limao",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991297189.jpg?alt=media&token=4589ec95-de09-40cd-860c-d6ac503c21e3",
    "descricao": "Refr Sukita 2l Limao — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149840601",
    "nome": "Refrig Sukita Zero Lata",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149840601.jpg?alt=media&token=50490513-215d-4eb7-86f2-c8ba3bab95e6",
    "descricao": "Refrig Sukita Zero Lata — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991303187",
    "nome": "Refrig.sukita Tubaina 350ml",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991303187.jpg?alt=media&token=da4307ec-9e80-4628-b392-083d95d495c4",
    "descricao": "Refrig.sukita Tubaina 350ml — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149103379",
    "nome": "Refrig.sukita Vit.2l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149103379.jpg?alt=media&token=76795a65-6c0d-4047-8ca1-11097bbc9eca",
    "descricao": "Refrig.sukita Vit.2l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149103492",
    "nome": "Refrigerante Laranja E Limão Sukita Garrafa 1,5l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149103492.jpg?alt=media&token=bb5ae4bc-30d8-4a11-aec9-e9de53338c49",
    "descricao": "Refrigerante Laranja E Limão Sukita Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149441204",
    "nome": "Refrigerante Laranja Sukita Garrafa 1l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149441204.jpg?alt=media&token=5c567252-1fa7-48f7-9074-aa08491ba3bd",
    "descricao": "Refrigerante Laranja Sukita Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149108282",
    "nome": "Refrigerante Laranja Sukita Garrafa 200ml",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "200ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149108282.jpg?alt=media&token=c9fe7949-1564-443b-b598-5dcba9745c39",
    "descricao": "Refrigerante Laranja Sukita Garrafa 200ml — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 200ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149440801",
    "nome": "Refrigerante Laranja Sukita Garrafa 2l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149440801.jpg?alt=media&token=df677981-b145-4071-a762-9585e012332e",
    "descricao": "Refrigerante Laranja Sukita Garrafa 2l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991297172",
    "nome": "Refrigerante Limão Sukita Garrafa 2l",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991297172.jpg?alt=media&token=abc9b039-50da-4faf-a3da-be11ea886fa0",
    "descricao": "Refrigerante Limão Sukita Garrafa 2l — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 2L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891149440603",
    "nome": "Refrigerante Sukita",
    "marca": "Sukita (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891149440603.jpg?alt=media&token=75d417be-10b1-49b7-ada7-6838eb0be7c6",
    "descricao": "Refrigerante Sukita — Produto oficial do catálogo Ambev. Marca: Sukita (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812737",
    "nome": "H2oh! Citrus Garrafa Pet",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812737.jpg?alt=media&token=c7df14f4-3718-40a9-82c3-d14d7968d71d",
    "descricao": "H2oh! Citrus Garrafa Pet — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812614",
    "nome": "H2oh! Limão E Maçã Garrafa Pet 1,5 L",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812614.jpg?alt=media&token=9d8f99d7-f4ba-4336-bc7d-049c5b5cde5d",
    "descricao": "H2oh! Limão E Maçã Garrafa Pet 1,5 L — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "789284081287",
    "nome": "Refrig.h2oh Limoneto 1,5l Shrink Pet",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F789284081287.jpg?alt=media&token=c5b4d0d9-efdf-4399-b350-e746ec810463",
    "descricao": "Refrig.h2oh Limoneto 1,5l Shrink Pet — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812751",
    "nome": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 1,5l",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812751.jpg?alt=media&token=8b030133-d378-428b-8e5c-7f7892e6284d",
    "descricao": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812423",
    "nome": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 500ml",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812423.jpg?alt=media&token=458e971c-b9e6-4385-93ba-5d0606608058",
    "descricao": "Refrigerante Citrus Zero Açúcar H2oh! Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 500ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840815837",
    "nome": "Refrigerante Limão H2oh! Lata 269ml",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "269ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840815837.jpg?alt=media&token=11c60912-fbba-4110-980f-44b9c6d95df9",
    "descricao": "Refrigerante Limão H2oh! Lata 269ml — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 269ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812416",
    "nome": "Refrigerante Limão Zero Açúcar H2oh! Garrafa 1,5l",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812416.jpg?alt=media&token=eff9590b-8e0c-4224-85da-6a61d2e17550",
    "descricao": "Refrigerante Limão Zero Açúcar H2oh! Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812874",
    "nome": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 1,5l",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812874.jpg?alt=media&token=8fce4cb3-b61c-4700-b928-43c98c97737f",
    "descricao": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7892840812850",
    "nome": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 500ml",
    "marca": "H2OH! (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840812850.jpg?alt=media&token=23710534-dba4-4aa2-88e0-87c006359608",
    "descricao": "Refrigerante Limoneto Zero Açúcar H2oh! Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: H2OH! (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 500ML. NCM: 2202.10.00."
  },
  {
    "codigo": "52000010268",
    "nome": "(12 Count) Gatorade Frost Thirst Quencher Sports Drink, Arctic Blitz, 12 Fl Oz",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F52000010268.jpg?alt=media&token=3a4961a8-2c71-44ad-b565-82bb61a37841",
    "descricao": "(12 Count) Gatorade Frost Thirst Quencher Sports Drink, Arctic Blitz, 12 Fl Oz — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000201314",
    "nome": "(12 Count) Gatorade Thirst Quencher Sports Drink, Lemon Lime, 20 Fl Oz",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F52000201314.jpg?alt=media&token=33a135be-7924-4f25-8e07-753024d6cdee",
    "descricao": "(12 Count) Gatorade Thirst Quencher Sports Drink, Lemon Lime, 20 Fl Oz — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840808990",
    "nome": "Gatorade Abacaxi",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840808990.jpg?alt=media&token=eba2a88e-0a79-4131-adfa-f8d4c587a5c4",
    "descricao": "Gatorade Abacaxi — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: 2202.99.00."
  },
  {
    "codigo": "7894321277073",
    "nome": "Gatorade Fierce Frutas Mistas",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894321277073.jpg?alt=media&token=c05fb6d1-dd24-4273-aa02-025ff93c5e32",
    "descricao": "Gatorade Fierce Frutas Mistas — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: UN. NCM: 2202.99.00."
  },
  {
    "codigo": "52000103120",
    "nome": "Gatorade Frost Glacier Cherry Thirst Quencher Sports Drink, 12 Fl Oz, 12 Pack",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F52000103120.jpg?alt=media&token=30219911-be61-4d77-a00f-7dd7edae940f",
    "descricao": "Gatorade Frost Glacier Cherry Thirst Quencher Sports Drink, 12 Fl Oz, 12 Pack — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "745352113946",
    "nome": "Gatorade Thirst Quencher Powder, Frost Glacier Freeze (makes 36 Quarts)",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F745352113946.jpg?alt=media&token=0857bd7c-8bd9-4bc5-af63-342b95c0d479",
    "descricao": "Gatorade Thirst Quencher Powder, Frost Glacier Freeze (makes 36 Quarts) — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000104257",
    "nome": "Gatorade Thirst Quencher Sports Drink, Strawberry Lemonade, 20 Oz Bottles, 8 Count",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F52000104257.jpg?alt=media&token=138ac5c4-1a06-4ac1-9934-10b5e0c95d3f",
    "descricao": "Gatorade Thirst Quencher Sports Drink, Strawberry Lemonade, 20 Oz Bottles, 8 Count — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000135145",
    "nome": "Gatorade Thirst Quencher, Orange, 28 Oz Bottle",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F52000135145.jpg?alt=media&token=c717c679-d1a2-41d0-8542-b3210ec26fc3",
    "descricao": "Gatorade Thirst Quencher, Orange, 28 Oz Bottle — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "52000043624",
    "nome": "Gatorade Zero Sugar Thirst Quencher, Lemon-lime, 20 Fl Oz (pack Of 12)",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F52000043624.jpg?alt=media&token=69107626-18f8-4e33-ad18-c5a2d34a11cc",
    "descricao": "Gatorade Zero Sugar Thirst Quencher, Lemon-lime, 20 Fl Oz (pack Of 12) — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840822019",
    "nome": "Isotônico Berry Blue Gatorade Garrafa 500ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840822019.jpg?alt=media&token=eb4c12c3-96b9-4d2d-a9b2-5e55d94d87f5",
    "descricao": "Isotônico Berry Blue Gatorade Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 500ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7892840808013",
    "nome": "Isotônico Frutas Cítricas Gatorade Garrafa 500ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840808013.jpg?alt=media&token=922e226f-77a1-4a4a-bb03-82f15099635f",
    "descricao": "Isotônico Frutas Cítricas Gatorade Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 500ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7892840820701",
    "nome": "Isotônico Frutas Silvestres Gatorade Atividades Diárias Garrafa 350ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840820701.jpg?alt=media&token=1cbd17f4-5983-4fdf-b8cb-42b3973b04dd",
    "descricao": "Isotônico Frutas Silvestres Gatorade Atividades Diárias Garrafa 350ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 350ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7894321264073",
    "nome": "Isotônico Gatorade Frutas Cítricas",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894321264073.jpg?alt=media&token=23680f09-d777-4d7a-a6d7-e880e287bce0",
    "descricao": "Isotônico Gatorade Frutas Cítricas — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: UN. NCM: 2202.99.00."
  },
  {
    "codigo": "7892840808020",
    "nome": "Isotônico Laranja Gatorade Garrafa 500ml",
    "marca": "Gatorade (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840808020.jpg?alt=media&token=6a0088d1-2706-4036-a62e-21cee11dd145",
    "descricao": "Isotônico Laranja Gatorade Garrafa 500ml — Produto oficial do catálogo Ambev. Marca: Gatorade (Ambev). Categoria: Bebidas (Isotonicos). Apresentação/Volume: 500ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7891991000840",
    "nome": "Água Tônica Antarctica Lata 350ml",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991000840.jpg?alt=media&token=edd4f867-6e2d-45c4-8206-cdec55c06761",
    "descricao": "Água Tônica Antarctica Lata 350ml — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 350ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991298544",
    "nome": "Água Tônica Antarctica Zero Garrafa 1l",
    "marca": "Tônica Antarctica (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991298544.jpg?alt=media&token=c82f3518-ae84-4efa-add8-811c4863207a",
    "descricao": "Água Tônica Antarctica Zero Garrafa 1l — Produto oficial do catálogo Ambev. Marca: Tônica Antarctica (Ambev). Categoria: Bebidas (Refrigerantes). Apresentação/Volume: 1L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891991013055",
    "nome": "Energ.fusion Pessego Lt.310ml",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "310ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991013055.jpg?alt=media&token=fd4803ea-fb6f-4691-b89d-6a75d5da02e2",
    "descricao": "Energ.fusion Pessego Lt.310ml — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Bebida Energeticas). Apresentação/Volume: 310ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7891991010580",
    "nome": "Energético Fusion Lata 250ml",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "250ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991010580.jpg?alt=media&token=c2753719-75af-4f04-8fa1-297db2be959a",
    "descricao": "Energético Fusion Lata 250ml — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Bebida Energeticas). Apresentação/Volume: 250ML. NCM: 2202.99.00."
  },
  {
    "codigo": "7891991294751",
    "nome": "Energético Guaraná Fusion Lata 250ml",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "250ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891991294751.jpg?alt=media&token=c1d84e73-ce12-4bb8-9a4b-e4cf3e4c333d",
    "descricao": "Energético Guaraná Fusion Lata 250ml — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Bebidas Alcoolicas). Apresentação/Volume: 250ML. NCM: 2202.99.00."
  },
  {
    "codigo": "43000005859",
    "nome": "Mio Energy Tropical Fusion Liquid Water Enhancer, 1.62 Fl Oz",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F43000005859.jpg?alt=media&token=99ca4556-a05d-4c1a-b8fe-7f1bc1d108d2",
    "descricao": "Mio Energy Tropical Fusion Liquid Water Enhancer, 1.62 Fl Oz — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Agua). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000608",
    "nome": "Rokz Bloody Mary Infusion Kit For Cocktails, 12 Oz",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F855439000608.jpg?alt=media&token=b425c332-aa73-4e9e-afff-97e5859796a9",
    "descricao": "Rokz Bloody Mary Infusion Kit For Cocktails, 12 Oz — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000431",
    "nome": "Rokz Ginger Cardamom Spirit Infusion Blend For Cocktails",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F855439000431.jpg?alt=media&token=ec633c04-f1a1-4222-8e72-bf9689a0338d",
    "descricao": "Rokz Ginger Cardamom Spirit Infusion Blend For Cocktails — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000615",
    "nome": "Rokz Margarita Infusion Kit For Cocktails, 12 Oz",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F855439000615.jpg?alt=media&token=66637a30-b338-4dfa-9eef-b159e233ab49",
    "descricao": "Rokz Margarita Infusion Kit For Cocktails, 12 Oz — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "855439000387",
    "nome": "Rokz Spirit Infusion Kit For Cocktails - Fiery Pepper",
    "marca": "Fusion Energy Drink (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F855439000387.jpg?alt=media&token=5b11dbbf-546a-436c-aa34-eece633af56b",
    "descricao": "Rokz Spirit Infusion Kit For Cocktails - Fiery Pepper — Produto oficial do catálogo Ambev. Marca: Fusion Energy Drink (Ambev). Categoria: Bebidas (Aromatizantes E Misturas De Bebidas). Apresentação/Volume: UN. NCM: NCM não disponível."
  },
  {
    "codigo": "7892840815875",
    "nome": "Chá Ice Tea Pêssego Zero Açúcar Lipton Garrafa 200ml",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "200ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840815875.jpg?alt=media&token=3cf2f03d-6d6f-43d0-a497-e11753cde41e",
    "descricao": "Chá Ice Tea Pêssego Zero Açúcar Lipton Garrafa 200ml — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 200ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042103278",
    "nome": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Garrafa 1,5l",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891042103278.jpg?alt=media&token=987de356-5867-4715-b68b-4e6b62a6558d",
    "descricao": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Garrafa 1,5l — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042005206",
    "nome": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Lata 340ml",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "340ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891042005206.jpg?alt=media&token=08024798-6fe6-4829-86f5-d3b44d985b97",
    "descricao": "Chá Preto Ice Tea Limão Zero Açúcar Lipton Lata 340ml — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 340ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042005213",
    "nome": "Chá Preto Ice Tea Pêssego Lipton Lata 340ml",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "340ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891042005213.jpg?alt=media&token=01c5c59f-bf0d-4d7e-8768-bd1cb744ca08",
    "descricao": "Chá Preto Ice Tea Pêssego Lipton Lata 340ml — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 340ML. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042000195",
    "nome": "Chá Pronto Com Pêssego Lipton Ice Tea 1,5 Litro",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891042000195.jpg?alt=media&token=70df15b6-ba99-427a-a95e-3d5ec1d8684b",
    "descricao": "Chá Pronto Com Pêssego Lipton Ice Tea 1,5 Litro — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "7891042000201",
    "nome": "Lipton Ice Tea 1,5l Limao",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891042000201.jpg?alt=media&token=aac6d2e6-2353-4ecd-b241-d248afe1fb27",
    "descricao": "Lipton Ice Tea 1,5l Limao — Produto oficial do catálogo Ambev. Marca: Lipton Ice Tea (Ambev). Categoria: Bebidas (Chas). Apresentação/Volume: 1.5L. NCM: 2202.10.00."
  },
  {
    "codigo": "12000112232",
    "nome": "Lipton Ice Tea, Peach, 20 Fl Oz",
    "marca": "Lipton Ice Tea (Ambev)",
    "categoria": "Bebidas",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F12000112232.jpg?alt=media&token=03a0aa21-6b4f-4a95-b73b-76e0a6c2ac10",
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
 * Insere os produtos da Ambev no catálogo interno do aplicativo (armazenamento local)
 * sem tocar em banco de dados externo ou Firestore.
 */
export function sincronizarCatalogoAmbevLocalmente(
  catalogoAtual: ProdutoCatalogo[]
): { totalNovos: number; totalAtualizados: number; catalogoFinal: ProdutoCatalogo[] } {
  const { catalogoCompleto, novosInseridos, atualizados } = garantirCatalogoAmbevNoBancoGlobal(catalogoAtual);

  // Salva no armazenamento interno do app
  try {
    localStorage.setItem('catalogoGlobalFirebase', JSON.stringify(catalogoCompleto));
  } catch (err) {
    console.warn('Erro ao salvar catalogo interno:', err);
  }

  return {
    totalNovos: novosInseridos.length,
    totalAtualizados: atualizados.length,
    catalogoFinal: catalogoCompleto
  };
}

/**
 * Sincroniza em lote os produtos da Ambev com o Firestore do novo projeto 'adega-delivery-pdv'
 */
export async function sincronizarCatalogoAmbevComFirestore(
  catalogoAtual: ProdutoCatalogo[],
  onProgresso?: (atual: number, total: number) => void
): Promise<{ totalNovos: number; totalAtualizados: number; catalogoFinal: ProdutoCatalogo[] }> {
  const { catalogoCompleto, novosInseridos, atualizados } = garantirCatalogoAmbevNoBancoGlobal(catalogoAtual);
  const itensParaSalvar = [...novosInseridos, ...atualizados];

  try {
    localStorage.setItem('catalogoGlobalFirebase', JSON.stringify(catalogoCompleto));
  } catch (err) {
    console.warn('Erro ao salvar localmente:', err);
  }

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
