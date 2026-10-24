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
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.tZKbiUu32k5ogtCiFh86zAHaJk?r=0&pid=Api",
    "descricao": "Whisky Johnnie Walker Red Label 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Johnnie Walker. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267024349",
    "nome": "Whisky Johnnie Walker Black Label 12 Anos 1L",
    "marca": "Johnnie Walker",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.4ba94_KYtfcnMK5xR1Ry1QHaJg?r=0&pid=Api",
    "descricao": "Whisky Johnnie Walker Black Label 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Johnnie Walker. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7898945131377",
    "nome": "Kit Taça + Licor Fino De Whisky Apple Jack Daniels 1l",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://pub-648fead133cf496f97cfd8bcb74e4314.r2.dev/7898945131377.png",
    "descricao": "Kit Taça + Licor Fino De Whisky Apple Jack Daniels 1l — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jack Daniel's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.70.00."
  },
  {
    "codigo": "5000299223017",
    "nome": "Whisky Chivas Regal 12 Anos 1L",
    "marca": "Chivas Regal",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.Vq9z7mlfearvQm1DmbHnkwHaJk?r=0&pid=Api",
    "descricao": "Whisky Chivas Regal 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chivas Regal. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5010106113127",
    "nome": "Whisky Ballantine's Finest 1L",
    "marca": "Ballantine's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.ovBJ5NAzyjFAlNi8fWUBowHaNn?r=0&pid=Api",
    "descricao": "Whisky Ballantine's Finest 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Ballantine's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267123981",
    "nome": "Whisky White Horse Cavalo Branco 1L",
    "marca": "White Horse",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.8CkrwM2RwLCx8Dj4QFyppQHaIo?r=0&pid=Api",
    "descricao": "Whisky White Horse Cavalo Branco 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: White Horse. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5011007003005",
    "nome": "Whisky Irlandês Jameson 750ml",
    "marca": "Jameson",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.fkjdiRfpU9kfi2laO5i6qAHaJ4?r=0&pid=Api",
    "descricao": "Whisky Irlandês Jameson 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jameson. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.30.20."
  },
  {
    "codigo": "5000299216019",
    "nome": "Whisky Passport Scotch 1L",
    "marca": "Passport Scotch",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.xyn3kjp-zIvnr1Iebs3oiAHaHa?r=0&pid=Api",
    "descricao": "Whisky Passport Scotch 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Passport Scotch. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267023816",
    "nome": "Whisky Grand Old Parr 12 Anos 1L",
    "marca": "Old Parr",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.NiWKlsiTZZZGUo0DYgfuSgHaIq?r=0&pid=Api",
    "descricao": "Whisky Grand Old Parr 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Old Parr. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5000267014203",
    "nome": "Whisky Buchanan's Deluxe 12 Anos 1L",
    "marca": "Buchanan's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.SJDCss-g9LTideQBGUw4SgHaJk?r=0&pid=Api",
    "descricao": "Whisky Buchanan's Deluxe 12 Anos 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Buchanan's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7891105001151",
    "nome": "Whisky Natu Nobilis 1L",
    "marca": "Natu Nobilis",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.aOlgoPLR8BLT55AIs1hwhwHaHa?r=0&pid=Api",
    "descricao": "Whisky Natu Nobilis 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Natu Nobilis. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "5010493011004",
    "nome": "Whisky Teacher's Highland Cream 1L",
    "marca": "Teacher's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.VdJTZnMw9i_ch-Ue8VlUvwAAAA?r=0&pid=Api",
    "descricao": "Whisky Teacher's Highland Cream 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Teacher's. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.30.20."
  },
  {
    "codigo": "7891105011983",
    "nome": "Vodka Smirnoff No. 21 Red 998ml",
    "marca": "Smirnoff",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "998ML",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.qHvfiyfKvvKA-EJLh9wBOwHaHa?r=0&pid=Api",
    "descricao": "Vodka Smirnoff No. 21 Red 998ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Smirnoff. Categoria: Destilados & Whiskies. Apresentação: 998ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7312040017056",
    "nome": "Vodka Sueca Absolut Original 1L",
    "marca": "Absolut",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.PABNvTXFer_lH3nexN676gHaHa?r=0&pid=Api",
    "descricao": "Vodka Sueca Absolut Original 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Absolut. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.60.00."
  },
  {
    "codigo": "7896052601006",
    "nome": "Vodka Askov Tradicional 900ml",
    "marca": "Askov",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.HaJVhqxmF90gT_KJeZEEpgHaHa?r=0&pid=Api",
    "descricao": "Vodka Askov Tradicional 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Askov. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7890000000015",
    "nome": "Bebida Alcoólica Askov Frutas Vermelhas 900ml",
    "marca": "Askov",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.yIGNjONyLNoBPtteQ_aFYwHaHY?r=0&pid=Api",
    "descricao": "Bebida Alcoólica Askov Frutas Vermelhas 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Askov. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.60.00."
  },
  {
    "codigo": "7891105002165",
    "nome": "Vodka Orloff 1L",
    "marca": "Orloff",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.LKRNOl3wxt3dCWIsUkG7AgHaHa?r=0&pid=Api",
    "descricao": "Vodka Orloff 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Orloff. Categoria: Destilados & Whiskies. Apresentação: 1L. NCM: 2208.60.00."
  },
  {
    "codigo": "5000281005409",
    "nome": "Gin Tanqueray London Dry 750ml",
    "marca": "Tanqueray",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.WnIOlR_RAySpI9mYi-hpegHaHa?r=0&pid=Api",
    "descricao": "Gin Tanqueray London Dry 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Tanqueray. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.50.00."
  },
  {
    "codigo": "5000281006000",
    "nome": "Gin Gordon's London Dry 750ml",
    "marca": "Gordon's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.mvngkQTPctAzEa_5vwchrQHaHa?r=0&pid=Api",
    "descricao": "Gin Gordon's London Dry 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Gordon's. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.50.00."
  },
  {
    "codigo": "7896052605004",
    "nome": "Gin Rock's Tradicional 995ml",
    "marca": "Rock's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "995ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.nwSYZ5jReHSI8c3h13lCiAHaHa?r=0&pid=Api",
    "descricao": "Gin Rock's Tradicional 995ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Rock's. Categoria: Destilados & Whiskies. Apresentação: 995ML. NCM: 2208.50.00."
  },
  {
    "codigo": "7891136052000",
    "nome": "Aperitivo Campari Bitter 900ml",
    "marca": "Campari",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.QBVYyJPJ160RZjBJjoybXAHaHa?r=0&pid=Api",
    "descricao": "Aperitivo Campari Bitter 900ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Campari. Categoria: Destilados & Whiskies. Apresentação: 900ML. NCM: 2208.70.00."
  },
  {
    "codigo": "7896052600207",
    "nome": "Vinho Composto Jurupinga Dinalle 975ml",
    "marca": "Jurupinga",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "975ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.Fa7Lbs3WsA0Z1RegB62P8gHaHa?r=0&pid=Api",
    "descricao": "Vinho Composto Jurupinga Dinalle 975ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jurupinga. Categoria: Destilados & Whiskies. Apresentação: 975ML. NCM: 2205.10.00."
  },
  {
    "codigo": "7891105000017",
    "nome": "Cachaça Pirassununga 51 Garrafa 965ml",
    "marca": "Cachaça 51",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.oqjAeZfADCcoIYqDZQv30QHaHa?r=0&pid=Api",
    "descricao": "Cachaça Pirassununga 51 Garrafa 965ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Cachaça 51. Categoria: Destilados & Whiskies. Apresentação: 965ML. NCM: 2208.40.00."
  },
  {
    "codigo": "7896004000017",
    "nome": "Cachaça Velho Barreiro Tradicional 910ml",
    "marca": "Velho Barreiro",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "910ML",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.5FpluxATfWhZyolYpF0c5AHaHa?r=0&pid=Api",
    "descricao": "Cachaça Velho Barreiro Tradicional 910ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Velho Barreiro. Categoria: Destilados & Whiskies. Apresentação: 910ML. NCM: 2208.40.00."
  },
  {
    "codigo": "7896030000012",
    "nome": "Aguardente de Cana Pitú Garrafa 965ml",
    "marca": "Pitú",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.s4z9fJpbWSCni9k8cvGjkQHaHa?r=0&pid=Api",
    "descricao": "Aguardente de Cana Pitú Garrafa 965ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pitú. Categoria: Destilados & Whiskies. Apresentação: 965ML. NCM: 2208.40.00."
  },
  {
    "codigo": "4067700014013",
    "nome": "Licor de Ervas Jägermeister 700ml",
    "marca": "Jägermeister",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.hWGWzNzAdDzr1ts6CxOXcwAAAA?r=0&pid=Api",
    "descricao": "Licor de Ervas Jägermeister 700ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Jägermeister. Categoria: Destilados & Whiskies. Apresentação: 700ML. NCM: 2208.70.00."
  },
  {
    "codigo": "6001108000023",
    "nome": "Licor Fino Amarula Cream 750ml",
    "marca": "Amarula",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.eZ-vEc0cybz3QSLSDPWEDgHaHa?r=0&pid=Api",
    "descricao": "Licor Fino Amarula Cream 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Amarula. Categoria: Destilados & Whiskies. Apresentação: 750ML. NCM: 2208.70.00."
  },
  {
    "codigo": "7896434900130",
    "nome": "Vinho de Mesa Pergola Tinto Suave 1 Litro",
    "marca": "Pérgola",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP._LyuiFDgunnHv5t6-AIWVgHaHa?r=0&pid=Api",
    "descricao": "Vinho de Mesa Pergola Tinto Suave 1 Litro — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pérgola. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896434900147",
    "nome": "Vinho de Mesa Pergola Tinto Seco 1 Litro",
    "marca": "Pérgola",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.6-NThKq-YBaVaI4gfEPxtgHaHa?r=0&pid=Api",
    "descricao": "Vinho de Mesa Pergola Tinto Seco 1 Litro — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pérgola. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896056300011",
    "nome": "Vinho Tinto de Mesa Suave Campo Largo 750ml",
    "marca": "Campo Largo",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.o3VKqowPU1jjHJCLnSlwtgHaHa?r=0&pid=Api",
    "descricao": "Vinho Tinto de Mesa Suave Campo Largo 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Campo Largo. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804320746029",
    "nome": "Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml",
    "marca": "Casillero del Diablo",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.9sNXjUlG62wG7_AFAEqyXQHaHa?r=0&pid=Api",
    "descricao": "Vinho Chileno Casillero del Diablo Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Casillero del Diablo. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804300100018",
    "nome": "Vinho Chileno Reservado Concha y Toro Cabernet Sauvignon 750ml",
    "marca": "Concha y Toro",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.euuI4rmoofCyrQkdvtMjhQHaHa?r=0&pid=Api",
    "descricao": "Vinho Chileno Reservado Concha y Toro Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Concha y Toro. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7896023700011",
    "nome": "Vinho Quinta do Morgado Tinto Suave 1L",
    "marca": "Quinta do Morgado",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "1L",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.M0k1vMRd4sCbbekafiEu5AHaWp?r=0&pid=Api",
    "descricao": "Vinho Quinta do Morgado Tinto Suave 1L — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Quinta do Morgado. Categoria: Vinhos & Adega. Apresentação: 1L. NCM: 2204.21.00."
  },
  {
    "codigo": "7896052600108",
    "nome": "Coquetel Alcoólico de Vinho Cantina da Serra 880ml",
    "marca": "Cantina da Serra",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "880ML",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.tYLQyHe3nG6d_TB21cUXAQHaHa?r=0&pid=Api",
    "descricao": "Coquetel Alcoólico de Vinho Cantina da Serra 880ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Cantina da Serra. Categoria: Vinhos & Adega. Apresentação: 880ML. NCM: 2206.00.90."
  },
  {
    "codigo": "7896056300127",
    "nome": "Vinho de Mesa San Martin Tinto Suave 750ml",
    "marca": "San Martin",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.GIwUlCtGwNXa3L3cALAbAQAAAA?r=0&pid=Api",
    "descricao": "Vinho de Mesa San Martin Tinto Suave 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: San Martin. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7804300000028",
    "nome": "Vinho Chileno Santa Helena Cabernet Sauvignon 750ml",
    "marca": "Santa Helena",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.EuEclYwj4HlA7Oe_bhwskwHaHa?r=0&pid=Api",
    "descricao": "Vinho Chileno Santa Helena Cabernet Sauvignon 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.21.00."
  },
  {
    "codigo": "7891105030014",
    "nome": "Espumante Chandon Réserve Brut 750ml",
    "marca": "Chandon",
    "categoria": "Vinhos & Adega",
    "unidade_medida": "750ML",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.5zUG2Tv_R6162_lnSvd-2QHaLQ?r=0&pid=Api",
    "descricao": "Espumante Chandon Réserve Brut 750ml — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chandon. Categoria: Vinhos & Adega. Apresentação: 750ML. NCM: 2204.10.10."
  },
  {
    "codigo": "7892840222048",
    "nome": "Salgadinho Tortilha Doritos Queijo Nacho 140g",
    "marca": "Elma Chips / Doritos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "140G",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.DRQAJUuCsKiehHMKm6OVNwHaFj?r=0&pid=Api",
    "descricao": "Salgadinho Tortilha Doritos Queijo Nacho 140g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Doritos. Categoria: Salgadinhos & Snacks. Apresentação: 140G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840222017",
    "nome": "Salgadinho Tortilha Doritos Queijo Nacho 53g",
    "marca": "Elma Chips / Doritos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "53G",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.JH2RAUpyfdZZfSUGMmiA0gHaHa?r=0&pid=Api",
    "descricao": "Salgadinho Tortilha Doritos Queijo Nacho 53g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Doritos. Categoria: Salgadinhos & Snacks. Apresentação: 53G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840223014",
    "nome": "Batata Palha Ondulada Ruffles Tradicional 76g",
    "marca": "Elma Chips / Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "76G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.hulqVfQAXrGEaqPLNXN83QHaHa?r=0&pid=Api",
    "descricao": "Batata Palha Ondulada Ruffles Tradicional 76g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Ruffles. Categoria: Salgadinhos & Snacks. Apresentação: 76G. NCM: 2005.20.00."
  },
  {
    "codigo": "7892840223021",
    "nome": "Batata Ondulada Ruffles Cebola e Salsa 76g",
    "marca": "Elma Chips / Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "76G",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.nMulTUAnk18KhW2DpZ8MWAHaHa?r=0&pid=Api",
    "descricao": "Batata Ondulada Ruffles Cebola e Salsa 76g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Ruffles. Categoria: Salgadinhos & Snacks. Apresentação: 76G. NCM: 2005.20.00."
  },
  {
    "codigo": "7892840224011",
    "nome": "Salgadinho de Milho Cheetos Onda Requeijão 115g",
    "marca": "Elma Chips / Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "115G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.STHVvNgjlyxIyFSQrWSMYQHaHa?r=0&pid=Api",
    "descricao": "Salgadinho de Milho Cheetos Onda Requeijão 115g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Cheetos. Categoria: Salgadinhos & Snacks. Apresentação: 115G. NCM: 1904.10.00."
  },
  {
    "codigo": "7892840225018",
    "nome": "Salgadinho de Milho Fandangos Sabor Presunto 115g",
    "marca": "Elma Chips / Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "115G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.6upMAXBxNZprrvYolev41gHaHa?r=0&pid=Api",
    "descricao": "Salgadinho de Milho Fandangos Sabor Presunto 115g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips / Fandangos. Categoria: Salgadinhos & Snacks. Apresentação: 115G. NCM: 1904.10.00."
  },
  {
    "codigo": "7892840226015",
    "nome": "Aperitivo Torcida Sabor Queijo 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.B04hLwRbOKhyv-Mg1vUguQHaHa?r=0&pid=Api",
    "descricao": "Aperitivo Torcida Sabor Queijo 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840226022",
    "nome": "Aperitivo Torcida Sabor Churrasco 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.6U40ifaLP2gqhQhpvAwX9gHaHa?r=0&pid=Api",
    "descricao": "Aperitivo Torcida Sabor Churrasco 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "7892840226039",
    "nome": "Aperitivo Torcida Sabor Pimenta Mexicana 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "70G",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.roUrkhetm4NT0AQxZT97QwHaHa?r=0&pid=Api",
    "descricao": "Aperitivo Torcida Sabor Pimenta Mexicana 70g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Torcida. Categoria: Salgadinhos & Snacks. Apresentação: 70G. NCM: 1905.90.90."
  },
  {
    "codigo": "5053827150119",
    "nome": "Batata Pringles Tradicional 114g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "114G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.PBTnijTxNV_e4oMTQU7CLAAAAA?r=0&pid=Api",
    "descricao": "Batata Pringles Tradicional 114g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pringles. Categoria: Salgadinhos & Snacks. Apresentação: 114G. NCM: 2005.20.00."
  },
  {
    "codigo": "5053827150126",
    "nome": "Batata Pringles Creme de Cebola e Salsa 114g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "114G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.WL6tip3_Qidqf4JgThfdYgHaHa?r=0&pid=Api",
    "descricao": "Batata Pringles Creme de Cebola e Salsa 114g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Pringles. Categoria: Salgadinhos & Snacks. Apresentação: 114G. NCM: 2005.20.00."
  },
  {
    "codigo": "7896058500013",
    "nome": "Amendoim Tipo Japonês Dori 120g",
    "marca": "Dori",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "120G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.jGRM30-BFmyHt73P1By9lgHaLg?r=0&pid=Api",
    "descricao": "Amendoim Tipo Japonês Dori 120g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Dori. Categoria: Salgadinhos & Snacks. Apresentação: 120G. NCM: 2008.11.00."
  },
  {
    "codigo": "7896336000013",
    "nome": "Amendoim Japonês Mendorato Santa Helena 120g",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "120G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.TEWuPnfMTWRCxLfDoyPaTAHaHa?r=0&pid=Api",
    "descricao": "Amendoim Japonês Mendorato Santa Helena 120g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Salgadinhos & Snacks. Apresentação: 120G. NCM: 2008.11.00."
  },
  {
    "codigo": "7892840227012",
    "nome": "Ovinhos de Amendoim Elma Chips 65g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "65G",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.L_iX89vvW2HUPFIoq6LjDQHaHa?r=0&pid=Api",
    "descricao": "Ovinhos de Amendoim Elma Chips 65g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Elma Chips. Categoria: Salgadinhos & Snacks. Apresentação: 65G. NCM: 2008.11.00."
  },
  {
    "codigo": "7891515432014",
    "nome": "Snack Salamitos Sadia 36g",
    "marca": "Sadia",
    "categoria": "Salgadinhos & Snacks",
    "unidade_medida": "36G",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.Hiz914MKHyEuK0dQxguS7AHaHa?r=0&pid=Api",
    "descricao": "Snack Salamitos Sadia 36g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Sadia. Categoria: Salgadinhos & Snacks. Apresentação: 36G. NCM: 1601.00.00."
  },
  {
    "codigo": "7622300990715",
    "nome": "Pastilha Halls Sabor Extra Forte Preto 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.ZW0B2Wyit2iLjMQnBjXnLgHaHa?r=0&pid=Api",
    "descricao": "Pastilha Halls Sabor Extra Forte Preto 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300990722",
    "nome": "Pastilha Halls Sabor Prata Menta Gelada 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.q9i-XFFZO8UQ9SgMhbmOyAHaHa?r=0&pid=Api",
    "descricao": "Pastilha Halls Sabor Prata Menta Gelada 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300990739",
    "nome": "Pastilha Halls Sabor Cereja 28g",
    "marca": "Halls",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "28G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.FXV_FUZ6k0tXShyPI31nowHaHa?r=0&pid=Api",
    "descricao": "Pastilha Halls Sabor Cereja 28g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Halls. Categoria: Doces & Bomboniere. Apresentação: 28G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300840010",
    "nome": "Chiclete Trident Sem Açúcar Menta 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.ec5b3l6im6mCNeGGf1C9dwHaHa?r=0&pid=Api",
    "descricao": "Chiclete Trident Sem Açúcar Menta 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "7622300840027",
    "nome": "Chiclete Trident Sem Açúcar Hortelã 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.S6LRnOav97bR-g5qw1dOUQHaHa?r=0&pid=Api",
    "descricao": "Chiclete Trident Sem Açúcar Hortelã 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "7622300840034",
    "nome": "Chiclete Trident Sem Açúcar Melancia 5 Unidades 25.2g",
    "marca": "Trident",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "25.2G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.V52HZexoYiqiIGahk28oSwHaHa?r=0&pid=Api",
    "descricao": "Chiclete Trident Sem Açúcar Melancia 5 Unidades 25.2g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Trident. Categoria: Doces & Bomboniere. Apresentação: 25.2G. NCM: 1704.10.00."
  },
  {
    "codigo": "8410031910014",
    "nome": "Bala Drageada Mentos Fruit Stick 37.5g",
    "marca": "Mentos",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "37.5G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.Y2FhMh9reazxaVOLcqOV5AHaHa?r=0&pid=Api",
    "descricao": "Bala Drageada Mentos Fruit Stick 37.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Mentos. Categoria: Doces & Bomboniere. Apresentação: 37.5G. NCM: 1704.90.20."
  },
  {
    "codigo": "8410031910021",
    "nome": "Bala Drageada Mentos Mint Stick 37.5g",
    "marca": "Mentos",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "37.5G",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.zWFSeDpK9huGVlPPuKxXegHaHa?r=0&pid=Api",
    "descricao": "Bala Drageada Mentos Mint Stick 37.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Mentos. Categoria: Doces & Bomboniere. Apresentação: 37.5G. NCM: 1704.90.20."
  },
  {
    "codigo": "7896058500204",
    "nome": "Pastilha Drops Freegells Cereja 27.6g",
    "marca": "Freegells",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "27.6G",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.RKane0N87PnBkSh5810j2AHaHa?r=0&pid=Api",
    "descricao": "Pastilha Drops Freegells Cereja 27.6g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Freegells. Categoria: Doces & Bomboniere. Apresentação: 27.6G. NCM: 1704.90.20."
  },
  {
    "codigo": "7622300860018",
    "nome": "Chocolate Bis Wafer Recheado Ao Leite 126g",
    "marca": "Lacta / Bis",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "126G",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.yLa48RreX-LWQKw6I06sdwHaHa?r=0&pid=Api",
    "descricao": "Chocolate Bis Wafer Recheado Ao Leite 126g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta / Bis. Categoria: Doces & Bomboniere. Apresentação: 126G. NCM: 1905.32.00."
  },
  {
    "codigo": "7622300860025",
    "nome": "Chocolate Bis Wafer Recheado Branco 126g",
    "marca": "Lacta / Bis",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "126G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.RVQ-VihV7GWJBZOnDjtkoAHaHa?r=0&pid=Api",
    "descricao": "Chocolate Bis Wafer Recheado Branco 126g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta / Bis. Categoria: Doces & Bomboniere. Apresentação: 126G. NCM: 1905.32.00."
  },
  {
    "codigo": "7891000100109",
    "nome": "Chocolate Kit Kat 4 Fingers Ao Leite 41.5g",
    "marca": "Nestlé / Kit Kat",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "41.5G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.edoyL_3P8P7uy2j5QW3vMQHaHa?r=0&pid=Api",
    "descricao": "Chocolate Kit Kat 4 Fingers Ao Leite 41.5g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Nestlé / Kit Kat. Categoria: Doces & Bomboniere. Apresentação: 41.5G. NCM: 1905.32.00."
  },
  {
    "codigo": "7622300870017",
    "nome": "Barra de Chocolate Lacta Diamante Negro 90g",
    "marca": "Lacta",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.8o5dIyAjPk0_wW8rAHgK5gHaHa?r=0&pid=Api",
    "descricao": "Barra de Chocolate Lacta Diamante Negro 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7622300870024",
    "nome": "Barra de Chocolate Branco Lacta Laka 90g",
    "marca": "Lacta",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.U7iUcokHYgHYHkHemMozywHaHa?r=0&pid=Api",
    "descricao": "Barra de Chocolate Branco Lacta Laka 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lacta. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7891000100208",
    "nome": "Barra de Chocolate Nestlé Classic Ao Leite 90g",
    "marca": "Nestlé",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "90G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.F58tnwz0-FilfmPrCNXWrQHaHa?r=0&pid=Api",
    "descricao": "Barra de Chocolate Nestlé Classic Ao Leite 90g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Nestlé. Categoria: Doces & Bomboniere. Apresentação: 90G. NCM: 1806.32.10."
  },
  {
    "codigo": "7896336000105",
    "nome": "Paçoca Tipo Rolha Santa Helena 15g",
    "marca": "Santa Helena",
    "categoria": "Doces & Bomboniere",
    "unidade_medida": "15G",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.McFJEp6tyrJZuJM5EtJrywHaHa?r=0&pid=Api",
    "descricao": "Paçoca Tipo Rolha Santa Helena 15g — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Santa Helena. Categoria: Doces & Bomboniere. Apresentação: 15G. NCM: 1704.90.90."
  },
  {
    "codigo": "7622100800011",
    "nome": "Cigarro Marlboro Red Vermelho Box 20 Unidades",
    "marca": "Marlboro",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.i3xsogD8QClRdcZPgxCQoQHaIL?r=0&pid=Api",
    "descricao": "Cigarro Marlboro Red Vermelho Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Marlboro. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800028",
    "nome": "Cigarro Marlboro Gold Dourado Box 20 Unidades",
    "marca": "Marlboro",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.KrOx-GDsHEPBYJdLo4TS5gHaHa?r=0&pid=Api",
    "descricao": "Cigarro Marlboro Gold Dourado Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Marlboro. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800035",
    "nome": "Cigarro Chesterfield Original Vermelho Box 20 Unidades",
    "marca": "Chesterfield",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.Pp-t04_AKWrqrNwADa2U3wHaHa?r=0&pid=Api",
    "descricao": "Cigarro Chesterfield Original Vermelho Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chesterfield. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7622100800042",
    "nome": "Cigarro Chesterfield Blue Azul Box 20 Unidades",
    "marca": "Chesterfield",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.a9341Iyzhd3QVMugPKGbdAHaHa?r=0&pid=Api",
    "descricao": "Cigarro Chesterfield Blue Azul Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Chesterfield. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030012",
    "nome": "Cigarro Lucky Strike Original Blue Box 20 Unidades",
    "marca": "Lucky Strike",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.qC3YpQfp3Q7yQnEsPFciowHaHa?r=0&pid=Api",
    "descricao": "Cigarro Lucky Strike Original Blue Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Lucky Strike. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030029",
    "nome": "Cigarro Winston Red Box 20 Unidades",
    "marca": "Winston",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.HFE_ZjRRBQz_XH5w0JXiLgHaHa?r=0&pid=Api",
    "descricao": "Cigarro Winston Red Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Winston. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030036",
    "nome": "Cigarro Rothmans Azul Box 20 Unidades",
    "marca": "Rothmans",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.C37ILq1wnZbJwctaDs3NGgHaHa?r=0&pid=Api",
    "descricao": "Cigarro Rothmans Azul Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Rothmans. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030043",
    "nome": "Cigarro Dunhill Carlton Blend Box 20 Unidades",
    "marca": "Dunhill",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.kiodK2xclkq8w8k1fV03kwHaHa?r=0&pid=Api",
    "descricao": "Cigarro Dunhill Carlton Blend Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Dunhill. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7891048030050",
    "nome": "Cigarro Camel Blue Filtro Box 20 Unidades",
    "marca": "Camel",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.PeWzBhodRwucZic0wy1ajAHaLd?r=0&pid=Api",
    "descricao": "Cigarro Camel Blue Filtro Box 20 Unidades — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Camel. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "8414902000014",
    "nome": "Papel de Seda Smoking Master King Size Prata",
    "marca": "Smoking",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "LIVRETO",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.UJV6tPmKBFUkj802SejCzQHaHa?r=0&pid=Api",
    "descricao": "Papel de Seda Smoking Master King Size Prata — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Smoking. Categoria: Tabacaria & Conveniência. Apresentação: LIVRETO. NCM: 4813.10.00."
  },
  {
    "codigo": "7898950000014",
    "nome": "Papel de Seda Zomo Slim King Size",
    "marca": "Zomo",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "LIVRETO",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.bBGtPchSdwvINRyy3IRSzQHaHa?r=0&pid=Api",
    "descricao": "Papel de Seda Zomo Slim King Size — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Zomo. Categoria: Tabacaria & Conveniência. Apresentação: LIVRETO. NCM: 4813.10.00."
  },
  {
    "codigo": "070330600010",
    "nome": "Isqueiro Descartável BIC Grande Maxi Cores Sortidas",
    "marca": "BIC",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "UN",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.4zaUeZFGsEFvJHQsC6c0CQHaHa?r=0&pid=Api",
    "descricao": "Isqueiro Descartável BIC Grande Maxi Cores Sortidas — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: BIC. Categoria: Tabacaria & Conveniência. Apresentação: UN. NCM: 9613.10.00."
  },
  {
    "codigo": "070330600027",
    "nome": "Isqueiro Descartável BIC Mini Cores Sortidas",
    "marca": "BIC",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "UN",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.6-M_rmRC9pckY85A8hGkYwHaHa?r=0&pid=Api",
    "descricao": "Isqueiro Descartável BIC Mini Cores Sortidas — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: BIC. Categoria: Tabacaria & Conveniência. Apresentação: UN. NCM: 9613.10.00."
  },
  {
    "codigo": "7898930000016",
    "nome": "Cigarro de Palha Souza Paiol Tradicional Maco",
    "marca": "Souza Paiol",
    "categoria": "Tabacaria & Conveniência",
    "unidade_medida": "MACO",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.lCyuVwUF1lpiOfdxvCZqMgHaHa?r=0&pid=Api",
    "descricao": "Cigarro de Palha Souza Paiol Tradicional Maco — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Souza Paiol. Categoria: Tabacaria & Conveniência. Apresentação: MACO. NCM: 2402.20.00."
  },
  {
    "codigo": "7898900000012",
    "nome": "Carvão Vegetal para Churrasco Saco 3kg",
    "marca": "Carvão & Brasa",
    "categoria": "Carvão & Gelo",
    "unidade_medida": "3KG",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.i342-mYaGDHKcCtj7iHTTAHaHa?r=0&pid=Api",
    "descricao": "Carvão Vegetal para Churrasco Saco 3kg — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Carvão & Brasa. Categoria: Carvão & Gelo. Apresentação: 3KG. NCM: 4402.90.00."
  },
  {
    "codigo": "7898910000019",
    "nome": "Gelo em Cubos Filtrado para Bebidas Pacote 5kg",
    "marca": "Gelo Cristal",
    "categoria": "Carvão & Gelo",
    "unidade_medida": "5KG",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.oQ1O41eC1UpqMGoQdR7xYQAAAA?r=0&pid=Api",
    "descricao": "Gelo em Cubos Filtrado para Bebidas Pacote 5kg — Produto de alta demanda e giro rápido para adegas, distribuidoras e conveniências. Marca: Gelo Cristal. Categoria: Carvão & Gelo. Apresentação: 5KG. NCM: 2201.90.00."
  },
  {
    "codigo": "7896045505014",
    "nome": "Cerveja Puro Malte Heineken Long Neck 330ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.Qx6cwPrXoaj3OH7unBypPwHaFj?r=0&pid=Api",
    "descricao": "Cerveja Puro Malte Heineken Long Neck 330ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505410",
    "nome": "Cerveja Puro Malte Heineken Lata Sleek 350ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.UUbSge0dimoIEPIm5A8s2gHaEK?r=0&pid=Api",
    "descricao": "Cerveja Puro Malte Heineken Lata Sleek 350ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505212",
    "nome": "Cerveja Puro Malte Heineken Garrafa 600ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.u1zWsx0TeGX-U-TtigcoyQHaHa?r=0&pid=Api",
    "descricao": "Cerveja Puro Malte Heineken Garrafa 600ml — Cerveja Premium líder de vendas em adegas e conveniências."
  },
  {
    "codigo": "7896045505809",
    "nome": "Cerveja Puro Malte Heineken 0.0 Álcool Long Neck 330ml",
    "marca": "Heineken",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.Q2W8BXdSy9LnF94ZSRlzbQHaHa?r=0&pid=Api",
    "descricao": "Cerveja Heineken 0.0 Álcool Long Neck 330ml — Versão sem álcool da cerveja Heineken."
  },
  {
    "codigo": "7896045506011",
    "nome": "Cerveja Puro Malte Amstel Lager Lata 350ml",
    "marca": "Amstel",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.U4vBDbsnNrbBNRjmGh93qwHaHa?r=0&pid=Api",
    "descricao": "Cerveja Puro Malte Amstel Lager Lata 350ml — Cerveja puro malte leve e refrescante."
  },
  {
    "codigo": "7896045506219",
    "nome": "Cerveja Puro Malte Eisenbahn Pilsen Long Neck 355ml",
    "marca": "Eisenbahn",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.rG4K_LFyj36zMH98ybolZQHaHa?r=0&pid=Api",
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
