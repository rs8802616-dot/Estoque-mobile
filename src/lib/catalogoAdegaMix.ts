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
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267014005.jpg?alt=media&token=0f1e28ab-55bd-48c6-ab5e-8a012be28883",
    "descricao": "Whisky Johnnie Walker Red Label 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Johnnie Walker. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267024349",
    "nome": "Whisky Johnnie Walker Black Label 12 Anos 1L",
    "marca": "Johnnie Walker",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267024349.jpg?alt=media&token=1601d7b4-a115-455a-a5a2-e29e7bc56197",
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
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299223017.jpg?alt=media&token=962b38f2-86f6-434e-9288-05277dc52644",
    "descricao": "Whisky Chivas Regal 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chivas Regal. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5010106113127",
    "nome": "Whisky Ballantine's Finest 1L",
    "marca": "Ballantine's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010106113127.jpg?alt=media&token=dd446e28-547d-48eb-a530-b8576ea3988e",
    "descricao": "Whisky Ballantine's Finest 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Ballantine's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267123981",
    "nome": "Whisky White Horse Cavalo Branco 1L",
    "marca": "White Horse",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267123981.jpg?alt=media&token=9b64af96-934b-48ba-bc2f-107efda82567",
    "descricao": "Whisky White Horse Cavalo Branco 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: White Horse. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5011007003005",
    "nome": "Whisky Irlandês Jameson 750ml",
    "marca": "Jameson",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5011007003005.jpg?alt=media&token=92845fd7-228d-49f0-aba2-41b8ca631816",
    "descricao": "Whisky Irlandês Jameson 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jameson. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.30.20."
  },
  {
    "codigo": "5000299216019",
    "nome": "Whisky Passport Scotch 1L",
    "marca": "Passport Scotch",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299216019.jpg?alt=media&token=8bab37ab-08a9-40b6-ac54-c0491c94be33",
    "descricao": "Whisky Passport Scotch 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Passport Scotch. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267023816",
    "nome": "Whisky Grand Old Parr 12 Anos 1L",
    "marca": "Old Parr",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267023816.jpg?alt=media&token=56c0c2cd-09a1-4520-90b3-956d11c2fb42",
    "descricao": "Whisky Grand Old Parr 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Old Parr. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267014203",
    "nome": "Whisky Buchanan's Deluxe 12 Anos 1L",
    "marca": "Buchanan's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267014203.jpg?alt=media&token=f0fcaa1d-3dc3-44ad-8223-3c844e42986e",
    "descricao": "Whisky Buchanan's Deluxe 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Buchanan's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7891105001151",
    "nome": "Whisky Natu Nobilis 1L",
    "marca": "Natu Nobilis",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001151.jpg?alt=media&token=f7749000-d36f-49fd-af56-25c4bb8c486f",
    "descricao": "Whisky Natu Nobilis 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Natu Nobilis. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5010493011004",
    "nome": "Whisky Teacher's Highland Cream 1L",
    "marca": "Teacher's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010493011004.jpg?alt=media&token=8b67a6ac-0347-400e-94cf-19b250603328",
    "descricao": "Whisky Teacher's Highland Cream 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Teacher's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7891105011983",
    "nome": "Vodka Smirnoff No. 21 Red 998ml",
    "marca": "Smirnoff",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "998ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105011983.jpg?alt=media&token=b1bc92d7-f536-470c-9cfe-58bb092b4f68",
    "descricao": "Vodka Smirnoff No. 21 Red 998ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Smirnoff. Categoria: Destilados & Whiskies. Apresentação: 998ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7312040017056",
    "nome": "Vodka Sueca Absolut Original 1L",
    "marca": "Absolut",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7312040017056.jpg?alt=media&token=947c860f-b8d1-4092-b4e4-d6b97b3b4d26",
    "descricao": "Vodka Sueca Absolut Original 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Absolut. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.60.00."
  },
  {
    "codigo": "7896052601006",
    "nome": "Vodka Askov Tradicional 900ml",
    "marca": "Askov",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052601006.jpg?alt=media&token=3973bcf6-61a3-4722-b229-b6f3f7dec6a4",
    "descricao": "Vodka Askov Tradicional 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Askov. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7890000000015",
    "nome": "Bebida Alcoólica Askov Frutas Vermelhas 900ml",
    "marca": "Askov",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7890000000015.jpg?alt=media&token=3d53190d-a7bc-445f-bd3a-392328d8339f",
    "descricao": "Bebida Alcoólica Askov Frutas Vermelhas 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Askov. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7891105002165",
    "nome": "Vodka Orloff 1L",
    "marca": "Orloff",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105002165.jpg?alt=media&token=63058f9b-1fd4-4b88-8c0d-a1fe3add79e9",
    "descricao": "Vodka Orloff 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Orloff. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.60.00."
  },
  {
    "codigo": "5000281005409",
    "nome": "Gin Tanqueray London Dry 750ml",
    "marca": "Tanqueray",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000281005409.jpg?alt=media&token=998f4e75-6f6b-4d8d-83dc-b08de840c4d1",
    "descricao": "Gin Tanqueray London Dry 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Tanqueray. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.50.00."
  },
  {
    "codigo": "5000281006000",
    "nome": "Gin Gordon's London Dry 750ml",
    "marca": "Gordon's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000281006000.jpg?alt=media&token=2f77ddc7-a613-477f-9a49-4dea527c0b70",
    "descricao": "Gin Gordon's London Dry 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Gordon's. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.50.00."
  },
  {
    "codigo": "7896052605004",
    "nome": "Gin Rock's Tradicional 995ml",
    "marca": "Rock's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "995ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052605004.jpg?alt=media&token=bace1070-b714-4a32-9a1c-5bc9da3131e6",
    "descricao": "Gin Rock's Tradicional 995ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Rock's. Categoria: Destilados & Whiskies. Apresentação: 995ML. NCM: 2208.50.00."
  },
  {
    "codigo": "7891136052000",
    "nome": "Aperitivo Campari Bitter 900ml",
    "marca": "Campari",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891136052000.jpg?alt=media&token=28e0753e-ad6a-41f3-a840-94fe4dc4f11b",
    "descricao": "Aperitivo Campari Bitter 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Campari. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.70.00."
  },
  {
    "codigo": "7896052600207",
    "nome": "Vinho Composto Jurupinga Dinalle 975ml",
    "marca": "Jurupinga",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "975ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052600207.jpg?alt=media&token=a929428d-3f8f-4ce4-ace4-2b60664b9039",
    "descricao": "Vinho Composto Jurupinga Dinalle 975ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jurupinga. Categoria: Destilados & Whiskies. Apresentação: 975ML. NCM: 2205.10.00."
  },
  {
    "codigo": "7891105000017",
    "nome": "Cachaça Pirassununga 51 Garrafa 965ml",
    "marca": "Cachaça 51",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105000017.jpg?alt=media&token=b4e2a7b9-f3b7-41c5-b3ce-d0749b9c7dce",
    "descricao": "Cachaça Pirassununga 51 Garrafa 965ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Cachaça 51. Categoria: Destilados & Whiskies. Apresentação: 965ML. NCM: 2208.40.00."
  },
  {
    "codigo": "7896004000017",
    "nome": "Cachaça Velho Barreiro Tradicional 910ml",
    "marca": "Velho Barreiro",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "910ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896004000017.jpg?alt=media&token=036e2dd0-eda2-4c39-8b12-d2ab7065139e",
    "descricao": "Cachaça Velho Barreiro Tradicional 910ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Velho Barreiro. Categoria: Destilados & Whiskies. Apresentação: 910ML. NCM: 2208.40.00."
  },
  {
    "codigo": "7896030000012",
    "nome": "Aguardente de Cana Pitú Garrafa 965ml",
    "marca": "Pitú",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896030000012.jpg?alt=media&token=a5e55b12-dfe9-4b7e-94d6-79ba8413e48b",
    "descricao": "Aguardente de Cana Pitú Garrafa 965ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pitú. Categoria: Destilados & Whiskies. Apresentação: 965ML. NCM: 2208.40.00."
  },
  {
    "codigo": "4067700014013",
    "nome": "Licor de Ervas Jägermeister 700ml",
    "marca": "Jägermeister",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4067700014013.jpg?alt=media&token=56c81869-4e78-49e4-b5f2-29ab274133e0",
    "descricao": "Licor de Ervas Jägermeister 700ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jägermeister. Categoria: Destilados & Whiskies. Apresentação: 700ML. NCM: 2208.70.00."
  },
  {
    "codigo": "6001108000023",
    "nome": "Licor Fino Amarula Cream 750ml",
    "marca": "Amarula",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F6001108000023.jpg?alt=media&token=b4435963-8f5d-43fc-98ec-7531a88837c3",
    "descricao": "Licor Fino Amarula Cream 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Amarula. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.70.00."
  },
  {
    "codigo": "7896434900130",
    "nome": "Vinho de Mesa Pergola Tinto Suave 1 Litro",
    "marca": "Pérgola",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434900130.jpg?alt=media&token=15e2d44b-0b51-4d03-bb5a-03e9afbd085a",
    "descricao": "Vinho de Mesa Pergola Tinto Suave 1 Litro — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pérgola. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896434900147",
    "nome": "Vinho de Mesa Pergola Tinto Seco 1 Litro",
    "marca": "Pérgola",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434900147.jpg?alt=media&token=8f7a4db1-0261-4c28-8e9e-01c2749b5e5b",
    "descricao": "Vinho de Mesa Pergola Tinto Seco 1 Litro — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pérgola. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896056300011",
    "nome": "Vinho Tinto de Mesa Suave Campo Largo 750ml",
    "marca": "Campo Largo",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896056300011.jpg?alt=media&token=be480153-68bb-449a-b4f6-9eb6dbd055fa",
    "descricao": "Vinho Tinto de Mesa Suave Campo Largo 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Campo Largo. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804320746029",
    "nome": "Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml",
    "marca": "Casillero del Diablo",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7804320746029.jpg?alt=media&token=fde6b800-abf8-4909-a4ff-b5cce73aea29",
    "descricao": "Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Casillero del Diablo. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804300100018",
    "nome": "Vinho Chileno Reservado Concha y Toro Cabernet Sauvignon 750ml",
    "marca": "Concha y Toro",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7804300100018.jpg?alt=media&token=89497b5d-0011-4f25-b92e-138c9385f49d",
    "descricao": "Vinho Chileno Reservado Concha y Toro Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Concha y Toro. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7896023700011",
    "nome": "Vinho Quinta do Morgado Tinto Suave 1L",
    "marca": "Quinta do Morgado",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896023700011.jpg?alt=media&token=4eccdbc8-2f8c-42cd-9b43-2e9a5d6d3f51",
    "descricao": "Vinho Quinta do Morgado Tinto Suave 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Quinta do Morgado. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896052600108",
    "nome": "Coquetel Alcoólico de Vinho Cantina da Serra 880ml",
    "marca": "Cantina da Serra",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "880ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896052600108.jpg?alt=media&token=fd0624cf-4cbb-44ee-95f1-fef2324d9271",
    "descricao": "Coquetel Alcoólico de Vinho Cantina da Serra 880ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Cantina da Serra. Categoria: Vinhos & Adega. Apresentação: 880ML. NCM: 2206.00.90."
  },
  {
    "codigo": "7896056300127",
    "nome": "Vinho de Mesa San Martin Tinto Suave 750ml",
    "marca": "San Martin",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896056300127.jpg?alt=media&token=c0a1cd5f-30ab-4e57-9e02-e7b545f618a4",
    "descricao": "Vinho de Mesa San Martin Tinto Suave 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: San Martin. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804300000028",
    "nome": "Vinho Chileno Santa Helena Cabernet Sauvignon 750ml",
    "marca": "Santa Helena",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7804300000028.jpg?alt=media&token=52902036-f26d-4256-b2b2-a8177c4c00ec",
    "descricao": "Vinho Chileno Santa Helena Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7891105030014",
    "nome": "Espumante Chandon Réserve Brut 750ml",
    "marca": "Chandon",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105030014.jpg?alt=media&token=c791447a-d7c7-4247-bddd-dd734ba2b168",
    "descricao": "Espumante Chandon Réserve Brut 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chandon. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.10.10."
  },
  {
    "codigo": "7892840222048",
    "nome": "Salgadinho Tortilha Doritos Queijo Nacho 140g",
    "marca": "Elma Chips / Doritos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "140G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840222048.jpg?alt=media&token=dac7a28b-7d82-43a8-bd03-22d615755703",
    "descricao": "Salgadinho Tortilha Doritos Queijo Nacho 140g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Doritos. Categoria: Salgadinhos & Snacks. Apresentação: 140G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840222017",
    "nome": "Salgadinho Tortilha Doritos Queijo Nacho 53g",
    "marca": "Elma Chips / Doritos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "53G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840222017.jpg?alt=media&token=3bd13028-ff14-45be-b959-8648e8e720c3",
    "descricao": "Salgadinho Tortilha Doritos Queijo Nacho 53g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Doritos. Categoria: Salgadinhos & Snacks. Apresentação: 53G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840223014",
    "nome": "Batata Palha Ondulada Ruffles Tradicional 76g",
    "marca": "Elma Chips / Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "76G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840223014.jpg?alt=media&token=33deabf2-0bdf-4a46-9868-9cf784a19e58",
    "descricao": "Batata Palha Ondulada Ruffles Tradicional 76g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Ruffles. Categoria: Salgadinhos & Snacks. Apresentação: 76G. NCM: 2005.20.00."
  },
  {
    "codigo": "7892840223021",
    "nome": "Batata Ondulada Ruffles Cebola e Salsa 76g",
    "marca": "Elma Chips / Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "76G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840223021.jpg?alt=media&token=6d0d79a7-9c2f-4e2e-ac5a-c64ff92303b8",
    "descricao": "Batata Ondulada Ruffles Cebola e Salsa 76g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Ruffles. Categoria: Salgadinhos & Snacks. Apresentação: 76G. NCM: 2005.20.00."
  },
  {
    "codigo": "7892840224011",
    "nome": "Salgadinho de Milho Cheetos Onda Requeijão 115g",
    "marca": "Elma Chips / Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "115G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840224011.jpg?alt=media&token=048f95a7-0855-4bcb-8b5c-5fdd9e6616b3",
    "descricao": "Salgadinho de Milho Cheetos Onda Requeijão 115g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Cheetos. Categoria: Salgadinhos & Snacks. Apresentação: 115G. NCM: 1904.10.00."
  },
  {
    "codigo": "7892840225018",
    "nome": "Salgadinho de Milho Fandangos Sabor Presunto 115g",
    "marca": "Elma Chips / Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "115G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840225018.jpg?alt=media&token=261655c3-8bc3-4a85-a242-3f73e43757b4",
    "descricao": "Salgadinho de Milho Fandangos Sabor Presunto 115g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Fandangos. Categoria: Salgadinhos & Snacks. Apresentação: 115G. NCM: 1904.10.00."
  },
  {
    "codigo": "7892840226015",
    "nome": "Aperitivo Torcida Sabor Queijo 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840226015.jpg?alt=media&token=8481604b-1097-4885-8cc9-fc980b0edac8",
    "descricao": "Aperitivo Torcida Sabor Queijo 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840226022",
    "nome": "Aperitivo Torcida Sabor Churrasco 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840226022.jpg?alt=media&token=8dde60c9-5903-40c2-96e5-509b2426d703",
    "descricao": "Aperitivo Torcida Sabor Churrasco 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840226039",
    "nome": "Aperitivo Torcida Sabor Pimenta Mexicana 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840226039.jpg?alt=media&token=f6c6d9e2-ead8-41d6-adb8-ddad4f8559b1",
    "descricao": "Aperitivo Torcida Sabor Pimenta Mexicana 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "5053827150119",
    "nome": "Batata Pringles Tradicional 114g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "114G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5053827150119.jpg?alt=media&token=ac91137d-8b6e-4474-b3f5-6effbbb8d889",
    "descricao": "Batata Pringles Tradicional 114g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pringles. Categoria: Salgadinhos & Snacks. Apresentação: 114G. NCM: 2005.20.00."
  },
  {
    "codigo": "5053827150126",
    "nome": "Batata Pringles Creme de Cebola e Salsa 114g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "114G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5053827150126.jpg?alt=media&token=99aeffe0-3e82-4e65-8206-6fefd306d5f9",
    "descricao": "Batata Pringles Creme de Cebola e Salsa 114g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pringles. Categoria: Salgadinhos & Snacks. Apresentação: 114G. NCM: 2005.20.00."
  },
  {
    "codigo": "7896058500013",
    "nome": "Amendoim Tipo Japonês Dori 120g",
    "marca": "Dori",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "120G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896058500013.jpg?alt=media&token=a5f0b70e-47e3-4832-b36c-388ae018bf82",
    "descricao": "Amendoim Tipo Japonês Dori 120g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Dori. Categoria: Salgadinhos & Snacks. Apresentação: 120G. NCM: 2008.11.00."
  },
  {
    "codigo": "7896336000013",
    "nome": "Amendoim Japonês Mendorato Santa Helena 120g",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "120G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896336000013.jpg?alt=media&token=244229f6-520a-49e1-90b3-90367599b95a",
    "descricao": "Amendoim Japonês Mendorato Santa Helena 120g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Salgadinhos & Snacks. Apresentação: 120G. NCM: 2008.11.00."
  },
  {
    "codigo": "7892840227012",
    "nome": "Ovinhos de Amendoim Elma Chips 65g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "65G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7892840227012.jpg?alt=media&token=0863424b-c71c-4494-b568-7de4e8196ea9",
    "descricao": "Ovinhos de Amendoim Elma Chips 65g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips. Categoria: Salgadinhos & Snacks. Apresentação: 65G. NCM: 2008.11.00."
  },
  {
    "codigo": "7891515432014",
    "nome": "Snack Salamitos Sadia 36g",
    "marca": "Sadia",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "36G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891515432014.jpg?alt=media&token=75f3a24d-879d-416c-bea9-1f6925066d81",
    "descricao": "Snack Salamitos Sadia 36g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Sadia. Categoria: Salgadinhos & Snacks. Apresentação: 36G. NCM: 1601.00.00."
  },
  {
    "codigo": "7622300990715",
    "nome": "Pastilha Halls Sabor Extra Forte Preto 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300990715.jpg?alt=media&token=cacee249-02bb-4f52-a08d-5723be79278c",
    "descricao": "Pastilha Halls Sabor Extra Forte Preto 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300990722",
    "nome": "Pastilha Halls Sabor Prata Menta Gelada 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300990722.jpg?alt=media&token=edad34cd-21bd-4e1d-8c67-ecb754a2f9cf",
    "descricao": "Pastilha Halls Sabor Prata Menta Gelada 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300990739",
    "nome": "Pastilha Halls Sabor Cereja 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300990739.jpg?alt=media&token=4bfcc0b8-64a4-4fc8-95e3-ef9664932d8f",
    "descricao": "Pastilha Halls Sabor Cereja 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300840010",
    "nome": "Chiclete Trident Sem Açúcar Menta 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300840010.jpg?alt=media&token=9b73dc3c-89ce-4e37-af59-b412eb60f3e4",
    "descricao": "Chiclete Trident Sem Açúcar Menta 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "7622300840027",
    "nome": "Chiclete Trident Sem Açúcar Hortelã 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300840027.jpg?alt=media&token=dbf4561a-1dc3-42fa-b084-91ec4ece38f1",
    "descricao": "Chiclete Trident Sem Açúcar Hortelã 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "7622300840034",
    "nome": "Chiclete Trident Sem Açúcar Melancia 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300840034.jpg?alt=media&token=72e695d5-1932-4d94-875a-20d05dcdb34e",
    "descricao": "Chiclete Trident Sem Açúcar Melancia 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "8410031910014",
    "nome": "Bala Drageada Mentos Fruit Stick 37.5g",
    "marca": "Mentos",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "37.5G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8410031910014.jpg?alt=media&token=a5355e32-a47a-4fc8-8a78-40aefb95d87e",
    "descricao": "Bala Drageada Mentos Fruit Stick 37.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Mentos. Categoria: Doces & Bomboniere. Apresentação: 37.5G. NCM: 1704.90.20."
  },
  {
    "codigo": "8410031910021",
    "nome": "Bala Drageada Mentos Mint Stick 37.5g",
    "marca": "Mentos",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "37.5G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8410031910021.jpg?alt=media&token=b6bd5137-1f7a-406c-95b9-ac18da888f22",
    "descricao": "Bala Drageada Mentos Mint Stick 37.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Mentos. Categoria: Doces & Bomboniere. Apresentação: 37.5G. NCM: 1704.90.20."
  },
  {
    "codigo": "7896058500204",
    "nome": "Pastilha Drops Freegells Cereja 27.6g",
    "marca": "Freegells",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "27.6G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896058500204.jpg?alt=media&token=84efcc70-f24b-4db3-b4dd-da5ea75b361d",
    "descricao": "Pastilha Drops Freegells Cereja 27.6g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Freegells. Categoria: Doces & Bomboniere. Apresentação: 27.6G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300860018",
    "nome": "Chocolate Bis Wafer Recheado Ao Leite 126g",
    "marca": "Lacta / Bis",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "126G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300860018.jpg?alt=media&token=f71c4b17-6cf8-42d3-8957-1b3f3ed8d0b6",
    "descricao": "Chocolate Bis Wafer Recheado Ao Leite 126g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta / Bis. Categoria: Doces & Bomboniere. Apresentação: 126G. NCM: 1905.32.00."
  },
  {
    "codigo": "7622300860025",
    "nome": "Chocolate Bis Wafer Recheado Branco 126g",
    "marca": "Lacta / Bis",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "126G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300860025.jpg?alt=media&token=e3108bdc-bd64-4cd9-8513-deac5c5015b1",
    "descricao": "Chocolate Bis Wafer Recheado Branco 126g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta / Bis. Categoria: Doces & Bomboniere. Apresentação: 126G. NCM: 1905.32.00."
  },
  {
    "codigo": "7891000100109",
    "nome": "Chocolate Kit Kat 4 Fingers Ao Leite 41.5g",
    "marca": "Nestlé / Kit Kat",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "41.5G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891000100109.jpg?alt=media&token=483c8f71-cb8e-46f4-87ff-bf4ae315e976",
    "descricao": "Chocolate Kit Kat 4 Fingers Ao Leite 41.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Nestlé / Kit Kat. Categoria: Doces & Bomboniere. Apresentação: 41.5G. NCM: 1905.32.00."
  },
  {
    "codigo": "7622300870017",
    "nome": "Barra de Chocolate Lacta Diamante Negro 90g",
    "marca": "Lacta",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300870017.jpg?alt=media&token=7aa4d024-dc52-45a9-b9fe-2ac825e22993",
    "descricao": "Barra de Chocolate Lacta Diamante Negro 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7622300870024",
    "nome": "Barra de Chocolate Branco Lacta Laka 90g",
    "marca": "Lacta",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622300870024.jpg?alt=media&token=91b74efd-7713-48f8-ac8e-b669529dfed4",
    "descricao": "Barra de Chocolate Branco Lacta Laka 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7891000100208",
    "nome": "Barra de Chocolate Nestlé Classic Ao Leite 90g",
    "marca": "Nestlé",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891000100208.jpg?alt=media&token=c48205ab-a313-4442-9039-a1b07c26432f",
    "descricao": "Barra de Chocolate Nestlé Classic Ao Leite 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Nestlé. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7896336000105",
    "nome": "Paçoca Tipo Rolha Santa Helena 15g",
    "marca": "Santa Helena",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "15G",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896336000105.jpg?alt=media&token=363c6c8d-2836-47ed-868a-fb7e84d17288",
    "descricao": "Paçoca Tipo Rolha Santa Helena 15g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Doces & Bomboniere. Apresentação: 15G. NCM: 1704.90.90."
  },
  {
    "codigo": "7622100800011",
    "nome": "Cigarro Marlboro Red Vermelho Box 20 Unidades",
    "marca": "Marlboro",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800011.jpg?alt=media&token=008c71fe-55e7-4b0a-aec8-7a9cb2232a80",
    "descricao": "Cigarro Marlboro Red Vermelho Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Marlboro. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800028",
    "nome": "Cigarro Marlboro Gold Dourado Box 20 Unidades",
    "marca": "Marlboro",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800028.jpg?alt=media&token=3d63056c-3a76-425c-8127-b5c604a14a09",
    "descricao": "Cigarro Marlboro Gold Dourado Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Marlboro. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800035",
    "nome": "Cigarro Chesterfield Original Vermelho Box 20 Unidades",
    "marca": "Chesterfield",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800035.jpg?alt=media&token=49167b6e-0bb0-4f8c-abd6-102df525a99c",
    "descricao": "Cigarro Chesterfield Original Vermelho Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chesterfield. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800042",
    "nome": "Cigarro Chesterfield Blue Azul Box 20 Unidades",
    "marca": "Chesterfield",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7622100800042.jpg?alt=media&token=c24566ab-822a-442d-b616-0075dae1a251",
    "descricao": "Cigarro Chesterfield Blue Azul Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chesterfield. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030012",
    "nome": "Cigarro Lucky Strike Original Blue Box 20 Unidades",
    "marca": "Lucky Strike",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030012.jpg?alt=media&token=a4d6634a-8116-460a-9681-7410a90be0f8",
    "descricao": "Cigarro Lucky Strike Original Blue Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lucky Strike. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030029",
    "nome": "Cigarro Winston Red Box 20 Unidades",
    "marca": "Winston",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030029.jpg?alt=media&token=aa631823-4983-47d1-a994-d100ca855b9f",
    "descricao": "Cigarro Winston Red Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Winston. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030036",
    "nome": "Cigarro Rothmans Azul Box 20 Unidades",
    "marca": "Rothmans",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030036.jpg?alt=media&token=706eb7ad-46fd-4192-be26-dd3e41616d90",
    "descricao": "Cigarro Rothmans Azul Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Rothmans. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030043",
    "nome": "Cigarro Dunhill Carlton Blend Box 20 Unidades",
    "marca": "Dunhill",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030043.jpg?alt=media&token=5bfb2e92-800f-4fca-a359-4efb7b8d38f6",
    "descricao": "Cigarro Dunhill Carlton Blend Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Dunhill. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030050",
    "nome": "Cigarro Camel Blue Filtro Box 20 Unidades",
    "marca": "Camel",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891048030050.jpg?alt=media&token=1b97760b-2473-478c-9acc-ac59a73e54aa",
    "descricao": "Cigarro Camel Blue Filtro Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Camel. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "8414902000014",
    "nome": "Papel de Seda Smoking Master King Size Prata",
    "marca": "Smoking",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "LIVRETO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8414902000014.jpg?alt=media&token=44f29296-cf4d-41a5-9f9a-dedb12a09ec9",
    "descricao": "Papel de Seda Smoking Master King Size Prata — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Smoking. Categoria: Tabacaria & Conveniência. Apresentação: LIVRETO. NCM: 4813.10.00."
  },
  {
    "codigo": "7898950000014",
    "nome": "Papel de Seda Zomo Slim King Size",
    "marca": "Zomo",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "LIVRETO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898950000014.jpg?alt=media&token=5b0745ab-4001-4705-bc1f-5bb9f698fc29",
    "descricao": "Papel de Seda Zomo Slim King Size — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Zomo. Categoria: Tabacaria & Conveniência. Apresentação: LIVRETO. NCM: 4813.10.00."
  },
  {
    "codigo": "070330600010",
    "nome": "Isqueiro Descartável BIC Grande Maxi Cores Sortidas",
    "marca": "BIC",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F070330600010.jpg?alt=media&token=88addcf0-3236-4784-86fb-40dcd56e9781",
    "descricao": "Isqueiro Descartável BIC Grande Maxi Cores Sortidas — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: BIC. Categoria: Tabacaria & Conveniência. Apresentação: UN. NCM: 9613.10.00."
  },
  {
    "codigo": "070330600027",
    "nome": "Isqueiro Descartável BIC Mini Cores Sortidas",
    "marca": "BIC",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "UN",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F070330600027.jpg?alt=media&token=f0633bc0-aa16-4ecc-9e0d-e2b891ade320",
    "descricao": "Isqueiro Descartável BIC Mini Cores Sortidas — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: BIC. Categoria: Tabacaria & Conveniência. Apresentação: UN. NCM: 9613.10.00."
  },
  {
    "codigo": "7898930000016",
    "nome": "Cigarro de Palha Souza Paiol Tradicional Maco",
    "marca": "Souza Paiol",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898930000016.jpg?alt=media&token=2261d347-01c5-49ce-9dc8-263315e1494d",
    "descricao": "Cigarro de Palha Souza Paiol Tradicional Maco — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Souza Paiol. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7898900000012",
    "nome": "Carvão Vegetal para Churrasco Saco 3kg",
    "marca": "Carvão & Brasa",
    "categoria": "Carvão & Gelo",
    "unidade_medida": "3KG",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000012.jpg?alt=media&token=5c729744-5399-492e-a1b4-bf3aa5f988e8",
    "descricao": "Carvão Vegetal para Churrasco Saco 3kg — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Carvão & Brasa. Categoria: Carvão & Gelo. Apresentação: 3KG. NCM: 4402.90.00."
  },
  {
    "codigo": "7898910000019",
    "nome": "Gelo em Cubos Filtrado para Bebidas Pacote 5kg",
    "marca": "Gelo Cristal",
    "categoria": "Carvão & Gelo",
    "unidade_medida": "5KG",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898910000019.jpg?alt=media&token=6d766dee-e5bb-48a0-a2e1-6b1226c85066",
    "descricao": "Gelo em Cubos Filtrado para Bebidas Pacote 5kg — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Gelo Cristal. Categoria: Carvão & Gelo. Apresentação: 5KG. NCM: 2201.90.00."
  },
  {
    "codigo": "7896045505014",
    "nome": "Cerveja Puro Malte Heineken Long Neck 330ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505014.jpg?alt=media&token=95529dde-bf29-479e-82a9-83ff07bc2ffe",
    "descricao": "Cerveja Puro Malte Heineken Long Neck 330ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505410",
    "nome": "Cerveja Puro Malte Heineken Lata Sleek 350ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505410.jpg?alt=media&token=b73c5c62-e0f4-4e43-9e73-0381abac2c1c",
    "descricao": "Cerveja Puro Malte Heineken Lata Sleek 350ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505212",
    "nome": "Cerveja Puro Malte Heineken Garrafa 600ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505212.jpg?alt=media&token=d68ffa94-3ced-49ea-b6bd-76f2daaece23",
    "descricao": "Cerveja Puro Malte Heineken Garrafa 600ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505809",
    "nome": "Cerveja Puro Malte Heineken 0.0 Álcool Long Neck 330ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505809.jpg?alt=media&token=43317a14-96cc-4f0e-8284-8ad42a100b40",
    "descricao": "Cerveja Heineken 0.0 Álcool Long Neck 330ml — Versão sem álcool da cerveja Heineken."
  },
  {
    "codigo": "7896045506011",
    "nome": "Cerveja Puro Malte Amstel Lager Lata 350ml",
    "marca": "Amstel",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506011.jpg?alt=media&token=0aaa883a-fcbc-41ad-a4b2-26cd44eeb137",
    "descricao": "Cerveja Puro Malte Amstel Lager Lata 350ml — Cerveja puro malte leve e refrescante."
  },
  {
    "codigo": "7896045506219",
    "nome": "Cerveja Puro Malte Eisenbahn Pilsen Long Neck 355ml",
    "marca": "Eisenbahn",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506219.jpg?alt=media&token=3178d434-244c-48bd-998d-6546a6ddfa67",
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
