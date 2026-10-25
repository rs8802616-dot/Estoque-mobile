// Catálogo Essencial de Adega, Tabacaria e Conveniência (Whiskies, Vinhos, Salgadinhos, Bomboniere e Cigarros)
import { ProdutoCatalogo } from '../types';
import { salvarProdutoCatalogoFirestore } from './firestoreSync';

export const CATALOGO_ADEGA_MIX_OFICIAL: ProdutoCatalogo[] = [
  {
    "codigo": "5000267014005",
    "nome": "Whisky Johnnie Walker Red Label 1L",
    "marca": "Johnnie Walker",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267014005.jpg?alt=media&token=753b5ad4-ab1d-4999-a31d-3b5bb3a05501",
    "descricao": "Whisky Johnnie Walker Red Label 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Johnnie Walker. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267024349",
    "nome": "Whisky Johnnie Walker Black Label 12 Anos 1L",
    "marca": "Johnnie Walker",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267024349.jpg?alt=media&token=dfe542a4-fabf-4179-a09b-830a6f84a108",
    "descricao": "Whisky Johnnie Walker Black Label 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Johnnie Walker. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7898945131377",
    "nome": "Kit Taça + Licor Fino De Whisky Apple Jack Daniels 1l",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898945131377.jpg?alt=media&token=494bd75d-890b-4764-a7d8-d7c36fa68499",
    "descricao": "Kit Taça + Licor Fino De Whisky Apple Jack Daniels 1l — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jack Daniel's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.70.00."
  },
  {
    "codigo": "5000299223017",
    "nome": "Whisky Chivas Regal 12 Anos 1L",
    "marca": "Chivas Regal",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299223017.jpg?alt=media&token=6321edd1-8564-4c41-8753-663773a5fc55",
    "descricao": "Whisky Chivas Regal 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chivas Regal. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5010106113127",
    "nome": "Whisky Ballantine's Finest 1L",
    "marca": "Ballantine's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010106113127.jpg?alt=media&token=1420e104-9109-41a1-a747-8104e98909f3",
    "descricao": "Whisky Ballantine's Finest 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Ballantine's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267123981",
    "nome": "Whisky White Horse Cavalo Branco 1L",
    "marca": "White Horse",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267123981.jpg?alt=media&token=8498b7fa-a9d1-4d45-a8b6-77a27f2812c9",
    "descricao": "Whisky White Horse Cavalo Branco 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: White Horse. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5011007003005",
    "nome": "Whisky Irlandês Jameson 750ml",
    "marca": "Jameson",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5011007003005.jpg?alt=media&token=5fb16ad7-9dc5-4d6b-8ee2-fb605a62a65e",
    "descricao": "Whisky Irlandês Jameson 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jameson. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.30.20."
  },
  {
    "codigo": "5000299216019",
    "nome": "Whisky Passport Scotch 1L",
    "marca": "Passport Scotch",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299216019.jpg?alt=media&token=76484298-e0aa-48c4-be37-379290eeddb7",
    "descricao": "Whisky Passport Scotch 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Passport Scotch. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267023816",
    "nome": "Whisky Grand Old Parr 12 Anos 1L",
    "marca": "Old Parr",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267023816.jpg?alt=media&token=41641794-5fc8-4a27-9d40-86d0714ce7c5",
    "descricao": "Whisky Grand Old Parr 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Old Parr. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267014203",
    "nome": "Whisky Buchanan's Deluxe 12 Anos 1L",
    "marca": "Buchanan's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267014203.jpg?alt=media&token=9b002598-5e62-4d6a-9b5d-e06bdc3bc1a3",
    "descricao": "Whisky Buchanan's Deluxe 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Buchanan's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7891105001151",
    "nome": "Whisky Natu Nobilis 1L",
    "marca": "Natu Nobilis",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001151.jpg?alt=media&token=663c33e2-0ca4-421b-9658-d11ae46a0fca",
    "descricao": "Whisky Natu Nobilis 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Natu Nobilis. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5010493011004",
    "nome": "Whisky Teacher's Highland Cream 1L",
    "marca": "Teacher's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010493011004.jpg?alt=media&token=18bef5c0-9578-4fc7-b015-f42e6ccb2e09",
    "descricao": "Whisky Teacher's Highland Cream 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Teacher's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7891105011983",
    "nome": "Vodka Smirnoff No. 21 Red 998ml",
    "marca": "Smirnoff",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "998ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105011983.jpg?alt=media&token=5298ef8a-c77e-48ba-9eb4-e55e5d915f09",
    "descricao": "Vodka Smirnoff No. 21 Red 998ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Smirnoff. Categoria: Destilados & Whiskies. Apresentação: 998ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7312040017056",
    "nome": "Vodka Sueca Absolut Original 1L",
    "marca": "Absolut",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7312040017056.jpg?alt=media&token=d4ab0a91-03cd-4cd3-90d5-319c9a86b3ab",
    "descricao": "Vodka Sueca Absolut Original 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Absolut. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.60.00."
  },
  {
    "codigo": "7896052601006",
    "nome": "Vodka Askov Tradicional 900ml",
    "marca": "Askov",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052601006.jpg?alt=media&token=7714f7bb-2b3a-47f0-b461-4faa215c417b",
    "descricao": "Vodka Askov Tradicional 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Askov. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7890000000015",
    "nome": "Bebida Alcoólica Askov Frutas Vermelhas 900ml",
    "marca": "Askov",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7890000000015.jpg?alt=media&token=4be02e42-6a27-44c5-90fd-d791f50637f8",
    "descricao": "Bebida Alcoólica Askov Frutas Vermelhas 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Askov. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7891105002165",
    "nome": "Vodka Orloff 1L",
    "marca": "Orloff",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105002165.jpg?alt=media&token=f5fe520a-65c8-40a1-8e75-d910c387a59f",
    "descricao": "Vodka Orloff 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Orloff. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.60.00."
  },
  {
    "codigo": "5000281005409",
    "nome": "Gin Tanqueray London Dry 750ml",
    "marca": "Tanqueray",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000281005409.jpg?alt=media&token=8afbcc53-7dcf-4832-8542-eda3a0741b05",
    "descricao": "Gin Tanqueray London Dry 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Tanqueray. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.50.00."
  },
  {
    "codigo": "5000281006000",
    "nome": "Gin Gordon's London Dry 750ml",
    "marca": "Gordon's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000281006000.jpg?alt=media&token=7ad9dacf-3a1e-4f40-afdb-c3939ed00450",
    "descricao": "Gin Gordon's London Dry 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Gordon's. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.50.00."
  },
  {
    "codigo": "7896052605004",
    "nome": "Gin Rock's Tradicional 995ml",
    "marca": "Rock's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "995ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052605004.jpg?alt=media&token=af16b974-76eb-4700-9123-43a206a930cf",
    "descricao": "Gin Rock's Tradicional 995ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Rock's. Categoria: Destilados & Whiskies. Apresentação: 995ML. NCM: 2208.50.00."
  },
  {
    "codigo": "7891136052000",
    "nome": "Aperitivo Campari Bitter 900ml",
    "marca": "Campari",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891136052000.jpg?alt=media&token=2bd887ab-bb62-44d7-8861-e77fc0522b8d",
    "descricao": "Aperitivo Campari Bitter 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Campari. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.70.00."
  },
  {
    "codigo": "7896052600207",
    "nome": "Vinho Composto Jurupinga Dinalle 975ml",
    "marca": "Jurupinga",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "975ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052600207.jpg?alt=media&token=18df138e-3a81-499d-93f8-7c705bc8ba85",
    "descricao": "Vinho Composto Jurupinga Dinalle 975ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jurupinga. Categoria: Destilados & Whiskies. Apresentação: 975ML. NCM: 2205.10.00."
  },
  {
    "codigo": "7891105000017",
    "nome": "Cachaça Pirassununga 51 Garrafa 965ml",
    "marca": "Cachaça 51",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105000017.jpg?alt=media&token=0647a580-062d-49bd-9e42-8e10a55d21a9",
    "descricao": "Cachaça Pirassununga 51 Garrafa 965ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Cachaça 51. Categoria: Destilados & Whiskies. Apresentação: 965ML. NCM: 2208.40.00."
  },
  {
    "codigo": "7896004000017",
    "nome": "Cachaça Velho Barreiro Tradicional 910ml",
    "marca": "Velho Barreiro",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "910ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896004000017.jpg?alt=media&token=119850d5-5b55-42fd-9f72-b93d926291c4",
    "descricao": "Cachaça Velho Barreiro Tradicional 910ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Velho Barreiro. Categoria: Destilados & Whiskies. Apresentação: 910ML. NCM: 2208.40.00."
  },
  {
    "codigo": "7896030000012",
    "nome": "Aguardente de Cana Pitú Garrafa 965ml",
    "marca": "Pitú",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896030000012.jpg?alt=media&token=89f8efda-0e17-48ee-bc17-5cb10e6c8562",
    "descricao": "Aguardente de Cana Pitú Garrafa 965ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pitú. Categoria: Destilados & Whiskies. Apresentação: 965ML. NCM: 2208.40.00."
  },
  {
    "codigo": "4067700014013",
    "nome": "Licor de Ervas Jägermeister 700ml",
    "marca": "Jägermeister",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4067700014013.jpg?alt=media&token=039874f6-05ce-4e6b-a6fe-bab6ad901e7c",
    "descricao": "Licor de Ervas Jägermeister 700ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jägermeister. Categoria: Destilados & Whiskies. Apresentação: 700ML. NCM: 2208.70.00."
  },
  {
    "codigo": "6001108000023",
    "nome": "Licor Fino Amarula Cream 750ml",
    "marca": "Amarula",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F6001108000023.jpg?alt=media&token=95348aa6-fbea-4566-a0d0-f46b84aa2fda",
    "descricao": "Licor Fino Amarula Cream 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Amarula. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.70.00."
  },
  {
    "codigo": "7896434900130",
    "nome": "Vinho de Mesa Pergola Tinto Suave 1 Litro",
    "marca": "Pérgola",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434900130.jpg?alt=media&token=5f2aff45-8547-45af-ac3c-b6bc4f7d796e",
    "descricao": "Vinho de Mesa Pergola Tinto Suave 1 Litro — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pérgola. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896434900147",
    "nome": "Vinho de Mesa Pergola Tinto Seco 1 Litro",
    "marca": "Pérgola",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434900147.jpg?alt=media&token=40ec5da6-f986-4ca7-b6f1-3041ec4bac7e",
    "descricao": "Vinho de Mesa Pergola Tinto Seco 1 Litro — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pérgola. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896056300011",
    "nome": "Vinho Tinto de Mesa Suave Campo Largo 750ml",
    "marca": "Campo Largo",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896056300011.jpg?alt=media&token=09416582-f926-4044-b1df-18d2038a6076",
    "descricao": "Vinho Tinto de Mesa Suave Campo Largo 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Campo Largo. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804320746029",
    "nome": "Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml",
    "marca": "Casillero del Diablo",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7804320746029.jpg?alt=media&token=8c3d995e-2160-4bc6-8fe1-f0fdc920bbf4",
    "descricao": "Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Casillero del Diablo. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804300100018",
    "nome": "Vinho Chileno Reservado Concha y Toro Cabernet Sauvignon 750ml",
    "marca": "Concha y Toro",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7804300100018.jpg?alt=media&token=960a7977-ff2a-4944-830a-0a56883d116f",
    "descricao": "Vinho Chileno Reservado Concha y Toro Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Concha y Toro. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7896023700011",
    "nome": "Vinho Quinta do Morgado Tinto Suave 1L",
    "marca": "Quinta do Morgado",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896023700011.jpg?alt=media&token=0710fd36-ddec-4c4c-800b-ab39c6e75bb4",
    "descricao": "Vinho Quinta do Morgado Tinto Suave 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Quinta do Morgado. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896052600108",
    "nome": "Coquetel Alcoólico de Vinho Cantina da Serra 880ml",
    "marca": "Cantina da Serra",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "880ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052600108.jpg?alt=media&token=d476c5bf-93d3-4892-9765-a130480cedee",
    "descricao": "Coquetel Alcoólico de Vinho Cantina da Serra 880ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Cantina da Serra. Categoria: Vinhos & Adega. Apresentação: 880ML. NCM: 2206.00.90."
  },
  {
    "codigo": "7896056300127",
    "nome": "Vinho de Mesa San Martin Tinto Suave 750ml",
    "marca": "San Martin",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896056300127.jpg?alt=media&token=273c5fc6-13d3-485d-afe3-bdfb7e468cd6",
    "descricao": "Vinho de Mesa San Martin Tinto Suave 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: San Martin. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804300000028",
    "nome": "Vinho Chileno Santa Helena Cabernet Sauvignon 750ml",
    "marca": "Santa Helena",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7804300000028.jpg?alt=media&token=9c8be2c2-3867-4a48-ba6f-69cf27bfcdb3",
    "descricao": "Vinho Chileno Santa Helena Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7891105030014",
    "nome": "Espumante Chandon Réserve Brut 750ml",
    "marca": "Chandon",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105030014.jpg?alt=media&token=a7653132-9826-4c6d-bc9f-cfd209c648ca",
    "descricao": "Espumante Chandon Réserve Brut 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chandon. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.10.10."
  },
  {
    "codigo": "7892840222048",
    "nome": "Salgadinho Tortilha Doritos Queijo Nacho 140g",
    "marca": "Elma Chips / Doritos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "140G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840222048.jpg?alt=media&token=2f7a07c3-2a2c-4df7-a529-946f40b0061f",
    "descricao": "Salgadinho Tortilha Doritos Queijo Nacho 140g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Doritos. Categoria: Salgadinhos & Snacks. Apresentação: 140G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840222017",
    "nome": "Salgadinho Tortilha Doritos Queijo Nacho 53g",
    "marca": "Elma Chips / Doritos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "53G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840222017.jpg?alt=media&token=61c73a1e-c93d-4cd3-a7b0-4521644c5c94",
    "descricao": "Salgadinho Tortilha Doritos Queijo Nacho 53g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Doritos. Categoria: Salgadinhos & Snacks. Apresentação: 53G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840223014",
    "nome": "Batata Palha Ondulada Ruffles Tradicional 76g",
    "marca": "Elma Chips / Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "76G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840223014.jpg?alt=media&token=165982a5-6b9c-4242-b249-275c1c872384",
    "descricao": "Batata Palha Ondulada Ruffles Tradicional 76g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Ruffles. Categoria: Salgadinhos & Snacks. Apresentação: 76G. NCM: 2005.20.00."
  },
  {
    "codigo": "7892840223021",
    "nome": "Batata Ondulada Ruffles Cebola e Salsa 76g",
    "marca": "Elma Chips / Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "76G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840223021.jpg?alt=media&token=03417ee4-24e0-458d-9b99-3eba02291f05",
    "descricao": "Batata Ondulada Ruffles Cebola e Salsa 76g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Ruffles. Categoria: Salgadinhos & Snacks. Apresentação: 76G. NCM: 2005.20.00."
  },
  {
    "codigo": "7892840224011",
    "nome": "Salgadinho de Milho Cheetos Onda Requeijão 115g",
    "marca": "Elma Chips / Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "115G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840224011.jpg?alt=media&token=c5b1ccfa-9b44-4241-8ff7-f07bda5b328d",
    "descricao": "Salgadinho de Milho Cheetos Onda Requeijão 115g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Cheetos. Categoria: Salgadinhos & Snacks. Apresentação: 115G. NCM: 1904.10.00."
  },
  {
    "codigo": "7892840225018",
    "nome": "Salgadinho de Milho Fandangos Sabor Presunto 115g",
    "marca": "Elma Chips / Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "115G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840225018.jpg?alt=media&token=288c0e3b-f4dc-4e73-b4c1-226458f733a8",
    "descricao": "Salgadinho de Milho Fandangos Sabor Presunto 115g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Fandangos. Categoria: Salgadinhos & Snacks. Apresentação: 115G. NCM: 1904.10.00."
  },
  {
    "codigo": "7892840226015",
    "nome": "Aperitivo Torcida Sabor Queijo 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840226015.jpg?alt=media&token=79b62a6c-1ea9-4bcf-ad55-0d1f7c1c5a99",
    "descricao": "Aperitivo Torcida Sabor Queijo 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840226022",
    "nome": "Aperitivo Torcida Sabor Churrasco 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840226022.jpg?alt=media&token=3cfc27f4-f88c-4ead-85b3-3fe04ff1a75b",
    "descricao": "Aperitivo Torcida Sabor Churrasco 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840226039",
    "nome": "Aperitivo Torcida Sabor Pimenta Mexicana 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840226039.jpg?alt=media&token=fb86f9c5-336a-4bfd-9c76-1e39de3e2a63",
    "descricao": "Aperitivo Torcida Sabor Pimenta Mexicana 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "5053827150119",
    "nome": "Batata Pringles Tradicional 114g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "114G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5053827150119.jpg?alt=media&token=ae4f46b3-6560-413a-ba78-738fe47b18e9",
    "descricao": "Batata Pringles Tradicional 114g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pringles. Categoria: Salgadinhos & Snacks. Apresentação: 114G. NCM: 2005.20.00."
  },
  {
    "codigo": "5053827150126",
    "nome": "Batata Pringles Creme de Cebola e Salsa 114g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "114G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5053827150126.jpg?alt=media&token=a2a1c95f-d14a-4c03-bf05-693c6f5d9d27",
    "descricao": "Batata Pringles Creme de Cebola e Salsa 114g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pringles. Categoria: Salgadinhos & Snacks. Apresentação: 114G. NCM: 2005.20.00."
  },
  {
    "codigo": "7896058500013",
    "nome": "Amendoim Tipo Japonês Dori 120g",
    "marca": "Dori",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "120G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896058500013.jpg?alt=media&token=bee77527-585d-44c8-9042-3a913f4ddca0",
    "descricao": "Amendoim Tipo Japonês Dori 120g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Dori. Categoria: Salgadinhos & Snacks. Apresentação: 120G. NCM: 2008.11.00."
  },
  {
    "codigo": "7896336000013",
    "nome": "Amendoim Japonês Mendorato Santa Helena 120g",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "120G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896336000013.jpg?alt=media&token=71fa0ecf-600d-4392-8bc7-1636e6027bf3",
    "descricao": "Amendoim Japonês Mendorato Santa Helena 120g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Salgadinhos & Snacks. Apresentação: 120G. NCM: 2008.11.00."
  },
  {
    "codigo": "7892840227012",
    "nome": "Ovinhos de Amendoim Elma Chips 65g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "65G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840227012.jpg?alt=media&token=e379267c-1b34-4069-9a3a-9d6a622dd015",
    "descricao": "Ovinhos de Amendoim Elma Chips 65g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips. Categoria: Salgadinhos & Snacks. Apresentação: 65G. NCM: 2008.11.00."
  },
  {
    "codigo": "7891515432014",
    "nome": "Snack Salamitos Sadia 36g",
    "marca": "Sadia",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "36G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891515432014.jpg?alt=media&token=a56fdee5-2364-40c7-83d2-28976c68f74b",
    "descricao": "Snack Salamitos Sadia 36g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Sadia. Categoria: Salgadinhos & Snacks. Apresentação: 36G. NCM: 1601.00.00."
  },
  {
    "codigo": "7622300990715",
    "nome": "Pastilha Halls Sabor Extra Forte Preto 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300990715.jpg?alt=media&token=ae421975-ec92-45ca-a6b8-a61bbd96e558",
    "descricao": "Pastilha Halls Sabor Extra Forte Preto 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300990722",
    "nome": "Pastilha Halls Sabor Prata Menta Gelada 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300990722.jpg?alt=media&token=e637b191-a1c2-4e98-91b8-42a8668ea318",
    "descricao": "Pastilha Halls Sabor Prata Menta Gelada 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300990739",
    "nome": "Pastilha Halls Sabor Cereja 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300990739.jpg?alt=media&token=cafbfae2-1e10-4049-a7e4-5ac1625d08d4",
    "descricao": "Pastilha Halls Sabor Cereja 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300840010",
    "nome": "Chiclete Trident Sem Açúcar Menta 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300840010.jpg?alt=media&token=058763b7-94c0-46d0-9d34-cf536d316628",
    "descricao": "Chiclete Trident Sem Açúcar Menta 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "7622300840027",
    "nome": "Chiclete Trident Sem Açúcar Hortelã 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300840027.jpg?alt=media&token=4634323e-7537-4d15-b594-e933e288da41",
    "descricao": "Chiclete Trident Sem Açúcar Hortelã 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "7622300840034",
    "nome": "Chiclete Trident Sem Açúcar Melancia 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300840034.jpg?alt=media&token=d5f40358-784b-4d24-a77d-c7ba84a44d32",
    "descricao": "Chiclete Trident Sem Açúcar Melancia 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "8410031910014",
    "nome": "Bala Drageada Mentos Fruit Stick 37.5g",
    "marca": "Mentos",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "37.5G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8410031910014.jpg?alt=media&token=1fef3da6-f329-4677-9a01-6c712f7c0a73",
    "descricao": "Bala Drageada Mentos Fruit Stick 37.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Mentos. Categoria: Doces & Bomboniere. Apresentação: 37.5G. NCM: 1704.90.20."
  },
  {
    "codigo": "8410031910021",
    "nome": "Bala Drageada Mentos Mint Stick 37.5g",
    "marca": "Mentos",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "37.5G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8410031910021.jpg?alt=media&token=d246b567-4ebe-4c14-a848-c48f9c6c2118",
    "descricao": "Bala Drageada Mentos Mint Stick 37.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Mentos. Categoria: Doces & Bomboniere. Apresentação: 37.5G. NCM: 1704.90.20."
  },
  {
    "codigo": "7896058500204",
    "nome": "Pastilha Drops Freegells Cereja 27.6g",
    "marca": "Freegells",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "27.6G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896058500204.jpg?alt=media&token=4644544b-6369-4c7b-af20-f063b3088f1c",
    "descricao": "Pastilha Drops Freegells Cereja 27.6g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Freegells. Categoria: Doces & Bomboniere. Apresentação: 27.6G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300860018",
    "nome": "Chocolate Bis Wafer Recheado Ao Leite 126g",
    "marca": "Lacta / Bis",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "126G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300860018.jpg?alt=media&token=3f83d80d-d913-4107-a02d-0ede1fa2f978",
    "descricao": "Chocolate Bis Wafer Recheado Ao Leite 126g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta / Bis. Categoria: Doces & Bomboniere. Apresentação: 126G. NCM: 1905.32.00."
  },
  {
    "codigo": "7622300860025",
    "nome": "Chocolate Bis Wafer Recheado Branco 126g",
    "marca": "Lacta / Bis",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "126G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300860025.jpg?alt=media&token=550285b6-1f42-4c34-a283-276754c610f5",
    "descricao": "Chocolate Bis Wafer Recheado Branco 126g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta / Bis. Categoria: Doces & Bomboniere. Apresentação: 126G. NCM: 1905.32.00."
  },
  {
    "codigo": "7891000100109",
    "nome": "Chocolate Kit Kat 4 Fingers Ao Leite 41.5g",
    "marca": "Nestlé / Kit Kat",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "41.5G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891000100109.jpg?alt=media&token=6438a67a-6570-43c3-86ab-c9f954e865d3",
    "descricao": "Chocolate Kit Kat 4 Fingers Ao Leite 41.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Nestlé / Kit Kat. Categoria: Doces & Bomboniere. Apresentação: 41.5G. NCM: 1905.32.00."
  },
  {
    "codigo": "7622300870017",
    "nome": "Barra de Chocolate Lacta Diamante Negro 90g",
    "marca": "Lacta",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300870017.jpg?alt=media&token=dc63c978-ff50-4d99-8fbd-a3bc12408f7a",
    "descricao": "Barra de Chocolate Lacta Diamante Negro 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7622300870024",
    "nome": "Barra de Chocolate Branco Lacta Laka 90g",
    "marca": "Lacta",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300870024.jpg?alt=media&token=ccc338f5-131c-4c21-8ec3-255cd53d9be2",
    "descricao": "Barra de Chocolate Branco Lacta Laka 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7891000100208",
    "nome": "Barra de Chocolate Nestlé Classic Ao Leite 90g",
    "marca": "Nestlé",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891000100208.jpg?alt=media&token=1fa5e4ce-b184-4490-a977-53dc27c24153",
    "descricao": "Barra de Chocolate Nestlé Classic Ao Leite 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Nestlé. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7896336000105",
    "nome": "Paçoca Tipo Rolha Santa Helena 15g",
    "marca": "Santa Helena",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "15G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896336000105.jpg?alt=media&token=2a4b437b-412a-4b5b-8a1d-2c42153da826",
    "descricao": "Paçoca Tipo Rolha Santa Helena 15g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Doces & Bomboniere. Apresentação: 15G. NCM: 1704.90.90."
  },
  {
    "codigo": "7622100800011",
    "nome": "Cigarro Marlboro Red Vermelho Box 20 Unidades",
    "marca": "Marlboro",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800011.jpg?alt=media&token=c1208194-24bb-45dc-898b-260cf47dad56",
    "descricao": "Cigarro Marlboro Red Vermelho Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Marlboro. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800028",
    "nome": "Cigarro Marlboro Gold Dourado Box 20 Unidades",
    "marca": "Marlboro",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800028.jpg?alt=media&token=3a688165-2ca9-4cf8-93d5-92d8702abd3e",
    "descricao": "Cigarro Marlboro Gold Dourado Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Marlboro. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800035",
    "nome": "Cigarro Chesterfield Original Vermelho Box 20 Unidades",
    "marca": "Chesterfield",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800035.jpg?alt=media&token=7a77795a-9293-48bb-bc61-98933e15fcf5",
    "descricao": "Cigarro Chesterfield Original Vermelho Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chesterfield. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800042",
    "nome": "Cigarro Chesterfield Blue Azul Box 20 Unidades",
    "marca": "Chesterfield",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800042.jpg?alt=media&token=3b1d580e-0932-4fcb-9fe0-dc76d9d6c273",
    "descricao": "Cigarro Chesterfield Blue Azul Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chesterfield. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030012",
    "nome": "Cigarro Lucky Strike Original Blue Box 20 Unidades",
    "marca": "Lucky Strike",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030012.jpg?alt=media&token=b3b7697d-d193-4a6a-a2dd-94d5cd4955f4",
    "descricao": "Cigarro Lucky Strike Original Blue Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lucky Strike. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030029",
    "nome": "Cigarro Winston Red Box 20 Unidades",
    "marca": "Winston",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030029.jpg?alt=media&token=05be76e2-27c6-4d65-b857-9dccc9fe4667",
    "descricao": "Cigarro Winston Red Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Winston. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030036",
    "nome": "Cigarro Rothmans Azul Box 20 Unidades",
    "marca": "Rothmans",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030036.jpg?alt=media&token=c46c465c-01fd-47f7-8e81-abcc1de7dc30",
    "descricao": "Cigarro Rothmans Azul Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Rothmans. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030043",
    "nome": "Cigarro Dunhill Carlton Blend Box 20 Unidades",
    "marca": "Dunhill",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030043.jpg?alt=media&token=c80674f9-4f25-4e40-8166-db80668b6769",
    "descricao": "Cigarro Dunhill Carlton Blend Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Dunhill. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030050",
    "nome": "Cigarro Camel Blue Filtro Box 20 Unidades",
    "marca": "Camel",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030050.jpg?alt=media&token=b551e5b8-2caf-494f-a74c-6284a309379b",
    "descricao": "Cigarro Camel Blue Filtro Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Camel. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "8414902000014",
    "nome": "Papel de Seda Smoking Master King Size Prata",
    "marca": "Smoking",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "LIVRETO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8414902000014.jpg?alt=media&token=de39d18b-b7dc-422f-b149-f13b89997cfc",
    "descricao": "Papel de Seda Smoking Master King Size Prata — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Smoking. Categoria: Tabacaria & Conveniência. Apresentação: LIVRETO. NCM: 4813.10.00."
  },
  {
    "codigo": "7898950000014",
    "nome": "Papel de Seda Zomo Slim King Size",
    "marca": "Zomo",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "LIVRETO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898950000014.jpg?alt=media&token=42130541-157e-448d-b0fc-e07e99cb6d1e",
    "descricao": "Papel de Seda Zomo Slim King Size — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Zomo. Categoria: Tabacaria & Conveniência. Apresentação: LIVRETO. NCM: 4813.10.00."
  },
  {
    "codigo": "070330600010",
    "nome": "Isqueiro Descartável BIC Grande Maxi Cores Sortidas",
    "marca": "BIC",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F070330600010.jpg?alt=media&token=82c7803f-ec2e-4c2e-a3cb-ee1f69e496e7",
    "descricao": "Isqueiro Descartável BIC Grande Maxi Cores Sortidas — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: BIC. Categoria: Tabacaria & Conveniência. Apresentação: UN. NCM: 9613.10.00."
  },
  {
    "codigo": "070330600027",
    "nome": "Isqueiro Descartável BIC Mini Cores Sortidas",
    "marca": "BIC",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F070330600027.jpg?alt=media&token=fd992ad0-ec61-4278-8ed6-9a2a24694be6",
    "descricao": "Isqueiro Descartável BIC Mini Cores Sortidas — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: BIC. Categoria: Tabacaria & Conveniência. Apresentação: UN. NCM: 9613.10.00."
  },
  {
    "codigo": "7898930000016",
    "nome": "Cigarro de Palha Souza Paiol Tradicional Maco",
    "marca": "Souza Paiol",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898930000016.jpg?alt=media&token=a64c74b5-a9c2-47b5-a8ec-d49ce181391a",
    "descricao": "Cigarro de Palha Souza Paiol Tradicional Maco — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Souza Paiol. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7898900000012",
    "nome": "Carvão Vegetal para Churrasco Saco 3kg",
    "marca": "Carvão & Brasa",
    "categoria": "Carvão & Gelo",
    "unidade_medida": "3KG",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000012.jpg?alt=media&token=c81367d4-d5ae-4afa-82ea-fde4a58ab4d5",
    "descricao": "Carvão Vegetal para Churrasco Saco 3kg — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Carvão & Brasa. Categoria: Carvão & Gelo. Apresentação: 3KG. NCM: 4402.90.00."
  },
  {
    "codigo": "7898910000019",
    "nome": "Gelo em Cubos Filtrado para Bebidas Pacote 5kg",
    "marca": "Gelo Cristal",
    "categoria": "Carvão & Gelo",
    "unidade_medida": "5KG",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898910000019.jpg?alt=media&token=354a5811-b224-4841-b8e4-2702196a59a6",
    "descricao": "Gelo em Cubos Filtrado para Bebidas Pacote 5kg — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Gelo Cristal. Categoria: Carvão & Gelo. Apresentação: 5KG. NCM: 2201.90.00."
  },
  {
    "codigo": "7896045505014",
    "nome": "Cerveja Puro Malte Heineken Long Neck 330ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505014.jpg?alt=media&token=3f50b435-063c-4b16-b356-5d84ac159047",
    "descricao": "Cerveja Puro Malte Heineken Long Neck 330ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505410",
    "nome": "Cerveja Puro Malte Heineken Lata Sleek 350ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505410.jpg?alt=media&token=b600b1b4-c58f-43d5-beaa-9a4c5d6142b1",
    "descricao": "Cerveja Puro Malte Heineken Lata Sleek 350ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505212",
    "nome": "Cerveja Puro Malte Heineken Garrafa 600ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505212.jpg?alt=media&token=e2088397-6789-4937-965c-1f7484042d95",
    "descricao": "Cerveja Puro Malte Heineken Garrafa 600ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505809",
    "nome": "Cerveja Puro Malte Heineken 0.0 Álcool Long Neck 330ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505809.jpg?alt=media&token=8e421757-f988-4a4e-85ba-7bbcf48ca62e",
    "descricao": "Cerveja Heineken 0.0 Álcool Long Neck 330ml — Versão sem álcool da cerveja Heineken."
  },
  {
    "codigo": "7896045506011",
    "nome": "Cerveja Puro Malte Amstel Lager Lata 350ml",
    "marca": "Amstel",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506011.jpg?alt=media&token=d6ac12ba-d3f3-4417-a606-8429c1e68289",
    "descricao": "Cerveja Puro Malte Amstel Lager Lata 350ml — Cerveja puro malte leve e refrescante."
  },
  {
    "codigo": "7896045506219",
    "nome": "Cerveja Puro Malte Eisenbahn Pilsen Long Neck 355ml",
    "marca": "Eisenbahn",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506219.jpg?alt=media&token=a7f49575-7cb9-4137-8b8e-2e61b7859f62",
    "descricao": "Cerveja Especial Puro Malte Eisenbahn Pilsen Long Neck 355ml."
  }
];

/**
 * Garante que todos os produtos essenciais do mix de adega (whiskies, vinhos, salgados, bomboniere, cigarros)
 * estejam presentes e enriquecidos no catálogo global do usuário.
 */
export function garantirCatalogoAdegaNoBancoGlobal(catalogoAtual: ProdutoCatalogo[]): {
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

  for (const item of CATALOGO_ADEGA_MIX_OFICIAL) {
    const cod = item.codigo.trim();
    if (!mapaExistentes.has(cod)) {
      const novo: ProdutoCatalogo = { ...item };
      mapaExistentes.set(cod, novo);
      novosInseridos.push(novo);
    } else {
      const existente = mapaExistentes.get(cod)!;
      let alterado = false;

      if (!existente.imagem && item.imagem) {
        existente.imagem = item.imagem;
        alterado = true;
      }
      if ((!existente.marca || existente.marca === 'Geral' || existente.marca === 'Não informado') && item.marca) {
        existente.marca = item.marca;
        alterado = true;
      }
      if ((!existente.categoria || existente.categoria === 'Geral') && item.categoria) {
        existente.categoria = item.categoria;
        alterado = true;
      }
      if (!existente.descricao && item.descricao) {
        existente.descricao = item.descricao;
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
 * Sincroniza em lote os itens essenciais de adega com o Firestore (coleção 'catalogo_global')
 */
export async function sincronizarCatalogoAdegaComFirestore(
  catalogoAtual: ProdutoCatalogo[],
  onProgresso?: (atual: number, total: number) => void
): Promise<{ totalNovos: number; totalAtualizados: number; catalogoFinal: ProdutoCatalogo[] }> {
  const { catalogoCompleto, novosInseridos, atualizados } = garantirCatalogoAdegaNoBancoGlobal(catalogoAtual);
  const itensParaSalvar = [...novosInseridos, ...atualizados];

  try {
    localStorage.setItem('catalogoGlobalFirebase', JSON.stringify(catalogoCompleto));
  } catch (err) {
    console.warn('Erro ao salvar catalogoGlobalFirebase:', err);
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
          console.warn('Erro ao salvar item de adega no Firestore:', item.codigo, e);
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
