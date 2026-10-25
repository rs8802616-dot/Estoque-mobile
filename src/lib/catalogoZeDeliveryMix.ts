// Catálogo Oficial de Alta Demanda Zé Delivery & Conveniência
import { ProdutoCatalogo } from '../types';
import { salvarProdutoCatalogoFirestore } from './firestoreSync';

export const CATALOGO_ZE_DELIVERY_MIX_OFICIAL: ProdutoCatalogo[] = [
  {
    "codigo": "9002490100070",
    "nome": "Energético Red Bull Energy Drink Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Energy Drink 250ml — Vitaliza mente e corpo. O energético mais vendido do mundo e campeão absoluto de vendas no Zé Delivery e adegas. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490100070.jpg?alt=media&token=c042b870-f7d8-4248-8b47-0d1ec5bf6852",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490100070.jpg?alt=media&token=c042b870-f7d8-4248-8b47-0d1ec5bf6852",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490100070.jpg?alt=media&token=c042b870-f7d8-4248-8b47-0d1ec5bf6852"
  },
  {
    "codigo": "9002490205935",
    "nome": "Energético Red Bull Energy Drink Lata 355ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "355ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Energy Drink 355ml (Tamanho Maior) — Ideal para quem precisa de energia extra ou para preparar drinks em copos de 500ml. Embalagem: Lata 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490205935.jpg?alt=media&token=771cfde5-531e-4e5a-8032-9879280f1f2d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490205935.jpg?alt=media&token=771cfde5-531e-4e5a-8032-9879280f1f2d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490205935.jpg?alt=media&token=771cfde5-531e-4e5a-8032-9879280f1f2d"
  },
  {
    "codigo": "9002490207946",
    "nome": "Energético Red Bull Sugarfree Sem Açúcar Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Sugarfree 250ml — Toda a energia de Red Bull sem açúcares e com pouquíssimas calorias. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490207946.jpg?alt=media&token=f1013fd3-7945-4267-8115-6e6f521d56a2",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490207946.jpg?alt=media&token=f1013fd3-7945-4267-8115-6e6f521d56a2",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490207946.jpg?alt=media&token=f1013fd3-7945-4267-8115-6e6f521d56a2"
  },
  {
    "codigo": "9002490235376",
    "nome": "Energético Red Bull Tropical Edition Frutas Tropicais Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Yellow Edition Tropical 250ml — Sabor marcante de frutas tropicais (maracujá e manga). Perfeito para misturar com Gin Tanqueray ou Beefeater. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490235376.jpg?alt=media&token=b71fb533-f0fd-4181-ac26-c4f9ecf6ae92",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490235376.jpg?alt=media&token=b71fb533-f0fd-4181-ac26-c4f9ecf6ae92",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490235376.jpg?alt=media&token=b71fb533-f0fd-4181-ac26-c4f9ecf6ae92"
  },
  {
    "codigo": "9002490248239",
    "nome": "Energético Red Bull Melancia Red Edition Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Red Edition Melancia 250ml — Sabor refrescante de melancia, ideal para drinks coloridos de verão e combos de gin. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490248239.jpg?alt=media&token=ccb43fa9-8bc4-48ae-a289-01780d7311a9",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490248239.jpg?alt=media&token=ccb43fa9-8bc4-48ae-a289-01780d7311a9",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490248239.jpg?alt=media&token=ccb43fa9-8bc4-48ae-a289-01780d7311a9"
  },
  {
    "codigo": "9002490253455",
    "nome": "Energético Red Bull Pitaya Summer Edition Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Summer Edition Pitaya 250ml — Sabor exótico de pitaya com coloração magenta vibrante para coquetelaria. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490253455.jpg?alt=media&token=6736080f-ddc0-45f8-a7c3-99512e912cc9",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490253455.jpg?alt=media&token=6736080f-ddc0-45f8-a7c3-99512e912cc9",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490253455.jpg?alt=media&token=6736080f-ddc0-45f8-a7c3-99512e912cc9"
  },
  {
    "codigo": "7898949800019",
    "nome": "Energético Monster Energy Tradicional Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Energy Original Lata 473ml — Sabor marcante com dose potente de taurina, cafeína e vitaminas do complexo B. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800019.jpg?alt=media&token=0127ae10-3c29-46f6-b451-954f0df09186",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800019.jpg?alt=media&token=0127ae10-3c29-46f6-b451-954f0df09186",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800019.jpg?alt=media&token=0127ae10-3c29-46f6-b451-954f0df09186"
  },
  {
    "codigo": "7898949800231",
    "nome": "Energético Monster Energy Juice Mango Loco Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Mango Loco 473ml — Mistura irresistível de sucos de frutas tropicais com a energia de Monster. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800231.jpg?alt=media&token=7297e97b-3a30-4d86-8912-91f127b49d96",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800231.jpg?alt=media&token=7297e97b-3a30-4d86-8912-91f127b49d96",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800231.jpg?alt=media&token=7297e97b-3a30-4d86-8912-91f127b49d96"
  },
  {
    "codigo": "7898949800163",
    "nome": "Energético Monster Energy Ultra White Zero Açúcar Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Energy Ultra Zero 473ml (Lata Branca) — Leve, cítrico e refrescante, com zero calorias e zero açúcar. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800163.jpg?alt=media&token=87c1593f-34c7-4fda-9bc7-59c1cb967a24",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800163.jpg?alt=media&token=87c1593f-34c7-4fda-9bc7-59c1cb967a24",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800163.jpg?alt=media&token=87c1593f-34c7-4fda-9bc7-59c1cb967a24"
  },
  {
    "codigo": "7898949800262",
    "nome": "Energético Monster Energy Ultra Paradise Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Ultra Paradise 473ml (Lata Verde) — Notas de kiwi, maçã verde e toque de pepino com zero açúcar. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800262.jpg?alt=media&token=6e1cab51-f0e7-4084-af9d-d5132ffc5f1a",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800262.jpg?alt=media&token=6e1cab51-f0e7-4084-af9d-d5132ffc5f1a",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800262.jpg?alt=media&token=6e1cab51-f0e7-4084-af9d-d5132ffc5f1a"
  },
  {
    "codigo": "7898949800316",
    "nome": "Energético Monster Energy Pacific Punch Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Pacific Punch 473ml — Sabor de ponche de frutas com maçã, laranja, framboesa e maracujá. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800316.jpg?alt=media&token=b25b26c0-14b4-4daf-a2ae-b54e4cbfb69b",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800316.jpg?alt=media&token=b25b26c0-14b4-4daf-a2ae-b54e4cbfb69b",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800316.jpg?alt=media&token=b25b26c0-14b4-4daf-a2ae-b54e4cbfb69b"
  },
  {
    "codigo": "7896434901304",
    "nome": "Energético Baly Tradicional Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Tradicional 2L — O energético tamanho família mais vendido nas adegas para combos de Whisky Passport, Red Label e Vodka. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901304.jpg?alt=media&token=777e0121-5a1b-49fc-80d3-77eb71c3a920",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901304.jpg?alt=media&token=777e0121-5a1b-49fc-80d3-77eb71c3a920",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901304.jpg?alt=media&token=777e0121-5a1b-49fc-80d3-77eb71c3a920"
  },
  {
    "codigo": "7896434901335",
    "nome": "Energético Baly Sabor Maçã Verde Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Maçã Verde 2L — Sabor sensação nas noites brasileiras, base favorita para o \"Copão\" com Gin ou Vodka Askov. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901335.jpg?alt=media&token=c954bd12-bd01-4022-b22a-e07d32049cf6",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901335.jpg?alt=media&token=c954bd12-bd01-4022-b22a-e07d32049cf6",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901335.jpg?alt=media&token=c954bd12-bd01-4022-b22a-e07d32049cf6"
  },
  {
    "codigo": "7896434901342",
    "nome": "Energético Baly Sabor Frutas Tropicais Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Tropical 2L — Sabor de frutas amarelas tropicais para drinks rápidos e de alto rendimento. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901342.jpg?alt=media&token=6792033a-5a74-4218-81d6-5503e17b59c5",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901342.jpg?alt=media&token=6792033a-5a74-4218-81d6-5503e17b59c5",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901342.jpg?alt=media&token=6792033a-5a74-4218-81d6-5503e17b59c5"
  },
  {
    "codigo": "7896434901359",
    "nome": "Energético Baly Sabor Melancia Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Melancia 2L — Doce e refrescante com coloração avermelhada para coquetéis. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901359.jpg?alt=media&token=02382bf7-7f09-46d0-a834-14eb5ff6105d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901359.jpg?alt=media&token=02382bf7-7f09-46d0-a834-14eb5ff6105d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901359.jpg?alt=media&token=02382bf7-7f09-46d0-a834-14eb5ff6105d"
  },
  {
    "codigo": "7894900010015",
    "nome": "Refrigerante Coca-Cola Original Lata 350ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 350ml — O refrigerante de cola mais consumido do planeta, sabor clássico e gás refrescante. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010015.jpg?alt=media&token=e4ac1536-c236-42a5-8f7a-cb86850eae3e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010015.jpg?alt=media&token=e4ac1536-c236-42a5-8f7a-cb86850eae3e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010015.jpg?alt=media&token=e4ac1536-c236-42a5-8f7a-cb86850eae3e"
  },
  {
    "codigo": "7894900700015",
    "nome": "Refrigerante Coca-Cola Sem Açúcar Lata 350ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Sem Açúcar 350ml — O sabor autêntico de Coca-Cola com zero calorias e zero açúcares. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900700015.jpg?alt=media&token=af213681-c8d1-402f-ae07-168ad2c59817",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900700015.jpg?alt=media&token=af213681-c8d1-402f-ae07-168ad2c59817",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900700015.jpg?alt=media&token=af213681-c8d1-402f-ae07-168ad2c59817"
  },
  {
    "codigo": "7894900011517",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 2 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 2L — Garrafa familiar para refeições, churrascos e eventos. Embalagem: Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011517.jpg?alt=media&token=d7ec9ea7-fb86-47c0-9ab1-463f30ebebbf",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011517.jpg?alt=media&token=d7ec9ea7-fb86-47c0-9ab1-463f30ebebbf",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011517.jpg?alt=media&token=d7ec9ea7-fb86-47c0-9ab1-463f30ebebbf"
  },
  {
    "codigo": "7894900701517",
    "nome": "Refrigerante Coca-Cola Sem Açúcar Garrafa Pet 2 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Sem Açúcar 2L — Tamanho família com zero açúcares e máxima refrescância. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900701517.jpg?alt=media&token=ad607d49-f950-491e-9a6b-6e1fcbf8781b",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900701517.jpg?alt=media&token=ad607d49-f950-491e-9a6b-6e1fcbf8781b",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900701517.jpg?alt=media&token=ad607d49-f950-491e-9a6b-6e1fcbf8781b"
  },
  {
    "codigo": "7894900011609",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 1.5 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 1.5L — Tamanho prático e econômico para consumo diário. Garrafa Pet 1.5 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011609.jpg?alt=media&token=e5bdd2b2-e0e3-4aaf-86ea-40f25a7b7abc",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011609.jpg?alt=media&token=e5bdd2b2-e0e3-4aaf-86ea-40f25a7b7abc",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011609.jpg?alt=media&token=e5bdd2b2-e0e3-4aaf-86ea-40f25a7b7abc"
  },
  {
    "codigo": "7894900011708",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 600ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "600ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 600ml — O tamanho perfeito para acompanhar lanches rápidos e pedidos individuais no delivery. Garrafa Pet 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011708.jpg?alt=media&token=8a60209c-cd99-409b-a9f7-30e53bb93610",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011708.jpg?alt=media&token=8a60209c-cd99-409b-a9f7-30e53bb93610",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011708.jpg?alt=media&token=8a60209c-cd99-409b-a9f7-30e53bb93610"
  },
  {
    "codigo": "7894900010152",
    "nome": "Refrigerante Coca-Cola Garrafa Vidro KS 290ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "290ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Garrafa Vidro KS 290ml — O sabor inconfundível na clássica garrafa de vidro retornável. Garrafa Vidro 290ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010152.jpg?alt=media&token=0885e6ba-6da4-41ac-ade5-5505edb480c5",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010152.jpg?alt=media&token=0885e6ba-6da4-41ac-ade5-5505edb480c5",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010152.jpg?alt=media&token=0885e6ba-6da4-41ac-ade5-5505edb480c5"
  },
  {
    "codigo": "7894900110012",
    "nome": "Refrigerante Fanta Laranja Lata 350ml",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Laranja 350ml — Sabor frutado e vibrante com suco de laranja natural e gás borbulhante. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900110012.jpg?alt=media&token=d1487ae1-9940-4f3b-8290-980a9167ad3a",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900110012.jpg?alt=media&token=d1487ae1-9940-4f3b-8290-980a9167ad3a",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900110012.jpg?alt=media&token=d1487ae1-9940-4f3b-8290-980a9167ad3a"
  },
  {
    "codigo": "7894900111514",
    "nome": "Refrigerante Fanta Laranja Garrafa Pet 2 Litros",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Laranja 2L — O refrigerante de laranja favorito das famílias em garrafa de 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900111514.jpg?alt=media&token=80ab04ce-417c-4b30-9c3b-c6e8e80bfcf3",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900111514.jpg?alt=media&token=80ab04ce-417c-4b30-9c3b-c6e8e80bfcf3",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900111514.jpg?alt=media&token=80ab04ce-417c-4b30-9c3b-c6e8e80bfcf3"
  },
  {
    "codigo": "7894900130010",
    "nome": "Refrigerante Fanta Uva Lata 350ml",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Uva 350ml — Sabor intenso e característico de uva roxa com alto teor de refrescância. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900130010.jpg?alt=media&token=68ca6d82-d058-4690-b247-989c336d2564",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900130010.jpg?alt=media&token=68ca6d82-d058-4690-b247-989c336d2564",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900130010.jpg?alt=media&token=68ca6d82-d058-4690-b247-989c336d2564"
  },
  {
    "codigo": "7894900131512",
    "nome": "Refrigerante Fanta Uva Garrafa Pet 2 Litros",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Uva 2L — Tamanho econômico de 2 litros do clássico refrigerante de uva.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900131512.jpg?alt=media&token=6a32c3d5-7a0a-4333-8c23-9c75795996ce",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900131512.jpg?alt=media&token=6a32c3d5-7a0a-4333-8c23-9c75795996ce",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900131512.jpg?alt=media&token=6a32c3d5-7a0a-4333-8c23-9c75795996ce"
  },
  {
    "codigo": "7894900210019",
    "nome": "Refrigerante Sprite Limão Lata 350ml",
    "marca": "Sprite",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Sprite Sabor Limão 350ml — Cristalina, crocante e com toque cítrico perfeito para matar a sede ou compor drinks. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900210019.jpg?alt=media&token=6658411a-e9fe-4fd5-8606-7b7e072de5b9",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900210019.jpg?alt=media&token=6658411a-e9fe-4fd5-8606-7b7e072de5b9",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900210019.jpg?alt=media&token=6658411a-e9fe-4fd5-8606-7b7e072de5b9"
  },
  {
    "codigo": "7894900211511",
    "nome": "Refrigerante Sprite Limão Garrafa Pet 2 Litros",
    "marca": "Sprite",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Sprite Limão 2L — Sabor lima-limão em garrafa familiar de 2 litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900211511.jpg?alt=media&token=be601bdc-6215-4c5f-a7c3-e4f2f44e8c38",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900211511.jpg?alt=media&token=be601bdc-6215-4c5f-a7c3-e4f2f44e8c38",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900211511.jpg?alt=media&token=be601bdc-6215-4c5f-a7c3-e4f2f44e8c38"
  },
  {
    "codigo": "7894900530018",
    "nome": "Refrigerante Schweppes Água Tônica Lata 350ml",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Tônica 350ml — O amargor nobre e gaseificação refinada da tônica mais famosa do mundo. O par ideal do Gin Tônica. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900530018.jpg?alt=media&token=5698782c-4d88-4573-b422-f7f7ea038947",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900530018.jpg?alt=media&token=5698782c-4d88-4573-b422-f7f7ea038947",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900530018.jpg?alt=media&token=5698782c-4d88-4573-b422-f7f7ea038947"
  },
  {
    "codigo": "7894900500011",
    "nome": "Refrigerante Schweppes Citrus Lata 350ml",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Citrus 350ml — Combinação sofisticada de maçã, grapefruit e laranja. Líder em mixologia e drinks com vodka. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900500011.jpg?alt=media&token=48011355-c09d-494a-b4ce-75a5ec3cea70",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900500011.jpg?alt=media&token=48011355-c09d-494a-b4ce-75a5ec3cea70",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900500011.jpg?alt=media&token=48011355-c09d-494a-b4ce-75a5ec3cea70"
  },
  {
    "codigo": "7894900501513",
    "nome": "Refrigerante Schweppes Citrus Garrafa Pet 1.5 Litros",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Citrus 1.5L — Tamanho garrafa para festas, baladas e preparo de drinks em grande quantidade. Pet 1.5 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900501513.jpg?alt=media&token=f55bd672-6a0d-46bd-90d0-e7eb6974409c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900501513.jpg?alt=media&token=f55bd672-6a0d-46bd-90d0-e7eb6974409c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900501513.jpg?alt=media&token=f55bd672-6a0d-46bd-90d0-e7eb6974409c"
  },
  {
    "codigo": "7894900550016",
    "nome": "Água Mineral Sem Gás Crystal Garrafa 500ml",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Sem Gás Crystal 500ml — Pura, leve e cristalina, extraída de fontes naturais selecionadas. Embalagem: Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550016.jpg?alt=media&token=bb7d4c7c-1ac8-4062-8212-2cdd028d2bae",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550016.jpg?alt=media&token=bb7d4c7c-1ac8-4062-8212-2cdd028d2bae",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550016.jpg?alt=media&token=bb7d4c7c-1ac8-4062-8212-2cdd028d2bae"
  },
  {
    "codigo": "7894900551013",
    "nome": "Água Mineral Com Gás Crystal Garrafa 500ml",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Com Gás Crystal 500ml — Borbulhas finas e agradáveis, perfeita para acompanhar café ou preparar coquetéis. Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900551013.jpg?alt=media&token=44265707-e5d9-435f-b2a1-456c37c1c542",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900551013.jpg?alt=media&token=44265707-e5d9-435f-b2a1-456c37c1c542",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900551013.jpg?alt=media&token=44265707-e5d9-435f-b2a1-456c37c1c542"
  },
  {
    "codigo": "7891025114563",
    "nome": "Água Mineral Sem Gás Bonafont Garrafa 500ml",
    "marca": "Bonafont",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Bonafont Sem Gás 500ml — Leveza incomparável e baixo teor de sódio para o dia a dia. Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025114563.jpg?alt=media&token=14c0412a-b88b-49fe-a537-9716f64ad411",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025114563.jpg?alt=media&token=14c0412a-b88b-49fe-a537-9716f64ad411",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025114563.jpg?alt=media&token=14c0412a-b88b-49fe-a537-9716f64ad411"
  },
  {
    "codigo": "7894900550153",
    "nome": "Água Mineral Sem Gás Crystal Garrafa Pet 1.5 Litros",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Sem Gás Crystal 1.5L — Tamanho econômico para hidratação em casa ou no escritório. Garrafa Pet 1.5 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550153.jpg?alt=media&token=a7357948-654f-47ef-b325-0f9d5ca1a89d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550153.jpg?alt=media&token=a7357948-654f-47ef-b325-0f9d5ca1a89d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550153.jpg?alt=media&token=a7357948-654f-47ef-b325-0f9d5ca1a89d"
  },
  {
    "codigo": "7891025100016",
    "nome": "Água de Coco Integral Kero Coco Caixa 1 Litro",
    "marca": "Kero Coco",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.89.10",
    "descricao": "Água de Coco Kero Coco 1L — 100% brasileira, sabor autêntico de coco verde esterilizado em Tetra Pak. Rica em sais minerais e isotônica natural. Caixa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100016.jpg?alt=media&token=28d5c8c9-6967-4ee6-84a5-78f477bc5714",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100016.jpg?alt=media&token=28d5c8c9-6967-4ee6-84a5-78f477bc5714",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100016.jpg?alt=media&token=28d5c8c9-6967-4ee6-84a5-78f477bc5714"
  },
  {
    "codigo": "7891025100023",
    "nome": "Água de Coco Integral Kero Coco Caixa 200ml",
    "marca": "Kero Coco",
    "categoria": "Bebidas",
    "unidade_medida": "200ML",
    "ncm": "2009.89.10",
    "descricao": "Água de Coco Kero Coco 200ml — Porção individual com canudinho, prática para lanches e consumo imediato. Tetra Pak 200ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100023.jpg?alt=media&token=f8dc013d-d20b-4482-a034-6458bd652dc0",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100023.jpg?alt=media&token=f8dc013d-d20b-4482-a034-6458bd652dc0",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100023.jpg?alt=media&token=f8dc013d-d20b-4482-a034-6458bd652dc0"
  },
  {
    "codigo": "7894900520101",
    "nome": "Suco Del Valle 100% Suco Uva Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.69.00",
    "descricao": "Suco Del Valle 100% Uva 1L — Sem adição de açúcares, feito puramente da fruta madura selecionada. Tetra Pak 1 Litro.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520101.jpg?alt=media&token=27959aeb-7dbd-4264-afb9-4565588b59cb",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520101.jpg?alt=media&token=27959aeb-7dbd-4264-afb9-4565588b59cb",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520101.jpg?alt=media&token=27959aeb-7dbd-4264-afb9-4565588b59cb"
  },
  {
    "codigo": "7894900520200",
    "nome": "Suco Del Valle Néctar de Pêssego Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.89.90",
    "descricao": "Suco Del Valle Néctar Pêssego 1L — Textura aveludada e sabor suave de pêssego fresco enriquecido com vitamina C. Caixa 1 Litro.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520200.jpg?alt=media&token=096ec3ec-1287-4ce9-9d7a-665ba9db657e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520200.jpg?alt=media&token=096ec3ec-1287-4ce9-9d7a-665ba9db657e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520200.jpg?alt=media&token=096ec3ec-1287-4ce9-9d7a-665ba9db657e"
  },
  {
    "codigo": "7894900520309",
    "nome": "Suco Del Valle Néctar de Laranja Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.12.00",
    "descricao": "Suco Del Valle Néctar Laranja 1L — Refrescância cítrica equilibrada pronta para beber a qualquer hora. Caixa 1 Litro.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520309.jpg?alt=media&token=6e5a28af-6c04-4a77-8d35-1dec719b03eb",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520309.jpg?alt=media&token=6e5a28af-6c04-4a77-8d35-1dec719b03eb",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520309.jpg?alt=media&token=6e5a28af-6c04-4a77-8d35-1dec719b03eb"
  },
  {
    "codigo": "5099873045367",
    "nome": "Whisky Jack Daniel's Old No. 7 Tennessee 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.30.10",
    "descricao": "Whisky Jack Daniel's Old No. 7 Tennessee Whiskey 1L — Filtrado gota a gota em carvão de bordo (Charcoal Mellowed) e maturado em barris de carvalho novos. Ícone mundial. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873045367.jpg?alt=media&token=96c2ee24-881b-4c68-b350-6fe80c1e6fef",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873045367.jpg?alt=media&token=96c2ee24-881b-4c68-b350-6fe80c1e6fef",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873045367.jpg?alt=media&token=96c2ee24-881b-4c68-b350-6fe80c1e6fef"
  },
  {
    "codigo": "5099873010723",
    "nome": "Whisky Licor Jack Daniel's Tennessee Honey 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Honey 1L — Combinação sedutora do autêntico Tennessee Whiskey com licor de mel natural. Toque aveludado e suave. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873010723.jpg?alt=media&token=d6fd505f-a21a-4d7c-8593-b99cb9f88e55",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873010723.jpg?alt=media&token=d6fd505f-a21a-4d7c-8593-b99cb9f88e55",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873010723.jpg?alt=media&token=d6fd505f-a21a-4d7c-8593-b99cb9f88e55"
  },
  {
    "codigo": "5099873003053",
    "nome": "Whisky Licor Jack Daniel's Tennessee Apple 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Apple 1L — A união crocante da maçã verde fresca com o caráter inconfundível de Jack Daniel's. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873003053.jpg?alt=media&token=240198c6-4e22-40bf-8b2e-82ed20081bca",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873003053.jpg?alt=media&token=240198c6-4e22-40bf-8b2e-82ed20081bca",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873003053.jpg?alt=media&token=240198c6-4e22-40bf-8b2e-82ed20081bca"
  },
  {
    "codigo": "5099873001257",
    "nome": "Whisky Licor Jack Daniel's Tennessee Fire 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Fire 1L — Aquece o paladar com licor de canela ardente combinado ao clássico Old No. 7. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873001257.jpg?alt=media&token=a7950e30-275c-41df-bdf0-9b30895e4b3e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873001257.jpg?alt=media&token=a7950e30-275c-41df-bdf0-9b30895e4b3e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873001257.jpg?alt=media&token=a7950e30-275c-41df-bdf0-9b30895e4b3e"
  },
  {
    "codigo": "5000267114385",
    "nome": "Whisky Johnnie Walker Gold Label Reserve 750ml",
    "marca": "Johnnie Walker",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.30.20",
    "descricao": "Whisky Johnnie Walker Gold Label Reserve 750ml — Luxuoso blend com notas de néctar dourado, baunilha e leve toque defumado de carvalho. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267114385.jpg?alt=media&token=7ba1c7f2-6405-4e1a-ad23-1bb6288d53e8",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267114385.jpg?alt=media&token=7ba1c7f2-6405-4e1a-ad23-1bb6288d53e8",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267114385.jpg?alt=media&token=7ba1c7f2-6405-4e1a-ad23-1bb6288d53e8"
  },
  {
    "codigo": "5000299222416",
    "nome": "Whisky Escocês Royal Salute 21 Anos Signature Blend 700ml",
    "marca": "Royal Salute",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.30.20",
    "descricao": "Whisky Royal Salute 21 Anos 700ml — O ápice do luxo escocês em elegante garrafa de porcelana artesanal. Maturado por no mínimo 21 anos. Garrafa 700ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299222416.jpg?alt=media&token=b9f4d21b-f9b1-4080-9293-de7fa31acdb0",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299222416.jpg?alt=media&token=b9f4d21b-f9b1-4080-9293-de7fa31acdb0",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299222416.jpg?alt=media&token=b9f4d21b-f9b1-4080-9293-de7fa31acdb0"
  },
  {
    "codigo": "5000329002247",
    "nome": "Gin Beefeater London Dry 750ml",
    "marca": "Beefeater",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.50.00",
    "descricao": "Gin Beefeater London Dry 750ml — Destilado no coração de Londres com 9 botânicos tradicionais, zimbro marcante e cítrico equilibrado. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000329002247.jpg?alt=media&token=bb2e4601-9232-4e04-89c7-ae12011cb7ee",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000329002247.jpg?alt=media&token=bb2e4601-9232-4e04-89c7-ae12011cb7ee",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000329002247.jpg?alt=media&token=bb2e4601-9232-4e04-89c7-ae12011cb7ee"
  },
  {
    "codigo": "5010677714006",
    "nome": "Gin Bombay Sapphire London Dry 750ml",
    "marca": "Bombay Sapphire",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.50.00",
    "descricao": "Gin Bombay Sapphire 750ml — Famoso por sua icônica garrafa azul e destilação por infusão a vapor com 10 botânicos exóticos. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010677714006.jpg?alt=media&token=ae571b44-8d43-48ed-ac33-8a567df2258a",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010677714006.jpg?alt=media&token=ae571b44-8d43-48ed-ac33-8a567df2258a",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010677714006.jpg?alt=media&token=ae571b44-8d43-48ed-ac33-8a567df2258a"
  },
  {
    "codigo": "7891105005012",
    "nome": "Gin Seagers London Dry Garrafa 1 Litro",
    "marca": "Seagers",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.50.00",
    "descricao": "Gin Seagers London Dry 1L — O gin nacional mais tradicional e consumido para preparação de drinks e coquetéis em grande escala. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105005012.jpg?alt=media&token=248a460e-6b02-4756-8d89-8b23632c7120",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105005012.jpg?alt=media&token=248a460e-6b02-4756-8d89-8b23632c7120",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105005012.jpg?alt=media&token=248a460e-6b02-4756-8d89-8b23632c7120"
  },
  {
    "codigo": "080480280024",
    "nome": "Vodka Francesa Grey Goose Original 750ml",
    "marca": "Grey Goose",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.60.00",
    "descricao": "Vodka Grey Goose 750ml — Vodka super-premium francesa elaborada com trigo de inverno da região da Picardia e água pura de fonte de Gensac. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F080480280024.jpg?alt=media&token=b812f456-987f-44d7-b269-8b0a1e719eb3",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F080480280024.jpg?alt=media&token=b812f456-987f-44d7-b269-8b0a1e719eb3",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F080480280024.jpg?alt=media&token=b812f456-987f-44d7-b269-8b0a1e719eb3"
  },
  {
    "codigo": "088076161678",
    "nome": "Vodka Francesa Cîroc Snap Frost 750ml",
    "marca": "Cîroc",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.60.00",
    "descricao": "Vodka Cîroc Snap Frost 750ml — Destilada 5 vezes a partir de finas uvas francesas Gaillac, conferindo suavidade e frescor frutado sem igual. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F088076161678.jpg?alt=media&token=321b2199-cfc6-4734-a2c7-40129742ba09",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F088076161678.jpg?alt=media&token=321b2199-cfc6-4734-a2c7-40129742ba09",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F088076161678.jpg?alt=media&token=321b2199-cfc6-4734-a2c7-40129742ba09"
  },
  {
    "codigo": "7501011111394",
    "nome": "Tequila José Cuervo Especial Gold Garrafa 750ml",
    "marca": "José Cuervo",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.90.00",
    "descricao": "Tequila José Cuervo Especial Ouro 750ml — A tequila número 1 do mundo, envelhecida em barris de carvalho americano. Perfeita para shots e Margaritas. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111394.jpg?alt=media&token=1e316a39-42d8-4891-a6ab-920827196c02",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111394.jpg?alt=media&token=1e316a39-42d8-4891-a6ab-920827196c02",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111394.jpg?alt=media&token=1e316a39-42d8-4891-a6ab-920827196c02"
  },
  {
    "codigo": "7501011111400",
    "nome": "Tequila José Cuervo Clásico Silver Garrafa 750ml",
    "marca": "José Cuervo",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.90.00",
    "descricao": "Tequila José Cuervo Especial Prata 750ml — Pura, límpida e refrescante, capturando a essência fresca da planta de agave azul. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111400.jpg?alt=media&token=de0b58c2-eb7f-486c-90a2-39943b182b59",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111400.jpg?alt=media&token=de0b58c2-eb7f-486c-90a2-39943b182b59",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111400.jpg?alt=media&token=de0b58c2-eb7f-486c-90a2-39943b182b59"
  },
  {
    "codigo": "7891153000014",
    "nome": "Rum Bacardi Carta Blanca Superior Garrafa 980ml",
    "marca": "Bacardi",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "980ML",
    "ncm": "2208.40.00",
    "descricao": "Rum Bacardi Carta Blanca 980ml — O rum branco mais premiado do mundo, indispensável para Mojitos, Daiquiris e Cuba Libre. Garrafa 980ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000014.jpg?alt=media&token=50f41747-d90d-4722-86a5-89fc3ef7d769",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000014.jpg?alt=media&token=50f41747-d90d-4722-86a5-89fc3ef7d769",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000014.jpg?alt=media&token=50f41747-d90d-4722-86a5-89fc3ef7d769"
  },
  {
    "codigo": "7891153000021",
    "nome": "Rum Bacardi Carta Oro Gold Garrafa 980ml",
    "marca": "Bacardi",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "980ML",
    "ncm": "2208.40.00",
    "descricao": "Rum Bacardi Carta Oro 980ml — Notas ricas de baunilha, caramelo e amêndoas tostadas conferidas pelo carvalho. Garrafa 980ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000021.jpg?alt=media&token=11269663-2a36-4277-b9a9-ffbf50d02112",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000021.jpg?alt=media&token=11269663-2a36-4277-b9a9-ffbf50d02112",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000021.jpg?alt=media&token=11269663-2a36-4277-b9a9-ffbf50d02112"
  },
  {
    "codigo": "5010284100032",
    "nome": "Rum Licor de Coco Malibu Original 750ml",
    "marca": "Malibu",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.70.00",
    "descricao": "Licor de Rum Malibu Coconut 750ml — O sabor tropical do Caribe com essência natural de coco, perfeito com suco de abacaxi ou refrigerante de limão. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010284100032.jpg?alt=media&token=8ee79f8f-ab83-4f12-9894-d1d2dbbda58d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010284100032.jpg?alt=media&token=8ee79f8f-ab83-4f12-9894-d1d2dbbda58d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010284100032.jpg?alt=media&token=8ee79f8f-ab83-4f12-9894-d1d2dbbda58d"
  },
  {
    "codigo": "7891105001007",
    "nome": "Aperitivo Dreher Aguardente Composta Garrafa 900ml",
    "marca": "Dreher",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "ncm": "2208.70.00",
    "descricao": "Aperitivo Dreher 900ml — O clássico conhaque brasileiro de gengibre e extratos vegetais aromáticos com quase um século de tradição. Garrafa 900ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001007.jpg?alt=media&token=00d0c677-a5fe-4d3d-8a3f-64d364ca34b5",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001007.jpg?alt=media&token=00d0c677-a5fe-4d3d-8a3f-64d364ca34b5",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001007.jpg?alt=media&token=00d0c677-a5fe-4d3d-8a3f-64d364ca34b5"
  },
  {
    "codigo": "7891126000010",
    "nome": "Cachaça Ypióca Prata Clássica Garrafa 965ml",
    "marca": "Ypióca",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Ypióca Prata 965ml — Destilada no Ceará e descansada em tonéis de bálsamo. Ideal para a autêntica caipirinha brasileira. Garrafa 965ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000010.jpg?alt=media&token=cfbdcfe1-3c6b-41fd-abc3-48457b8494c3",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000010.jpg?alt=media&token=cfbdcfe1-3c6b-41fd-abc3-48457b8494c3",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000010.jpg?alt=media&token=cfbdcfe1-3c6b-41fd-abc3-48457b8494c3"
  },
  {
    "codigo": "7891126000027",
    "nome": "Cachaça Ypióca Ouro Envelhecida Garrafa 965ml",
    "marca": "Ypióca",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Ypióca Ouro 965ml — Envelhecida por no mínimo 1 ano em barris de carvalho, garantindo cor dourada e sabor macio. Garrafa 965ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000027.jpg?alt=media&token=87cd6b6f-4639-49e1-87e5-e0a25b63a215",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000027.jpg?alt=media&token=87cd6b6f-4639-49e1-87e5-e0a25b63a215",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000027.jpg?alt=media&token=87cd6b6f-4639-49e1-87e5-e0a25b63a215"
  },
  {
    "codigo": "7898952136018",
    "nome": "Cachaça Cabaré Extra Premium Ouro Garrafa 700ml",
    "marca": "Cabaré",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Cabaré Ouro 700ml — Envelhecida 15 anos em carvalho europeu em parceria com o cantor Eduardo Costa e Leonardo. Garrafa 700ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898952136018.jpg?alt=media&token=8045c078-df34-4f58-b2ab-393ee01a5b2e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898952136018.jpg?alt=media&token=8045c078-df34-4f58-b2ab-393ee01a5b2e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898952136018.jpg?alt=media&token=8045c078-df34-4f58-b2ab-393ee01a5b2e"
  },
  {
    "codigo": "7898018280018",
    "nome": "Cachaça Salinas Tradicional Umburana Garrafa 700ml",
    "marca": "Salinas",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Artesanal Salinas 700ml — Produzida na capital mundial da cachaça (Salinas/MG) e envelhecida em dornas de bálsamo e umburana. Garrafa 700ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898018280018.jpg?alt=media&token=821148c0-4513-455a-ab52-6ac5009ddf0e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898018280018.jpg?alt=media&token=821148c0-4513-455a-ab52-6ac5009ddf0e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898018280018.jpg?alt=media&token=821148c0-4513-455a-ab52-6ac5009ddf0e"
  },
  {
    "codigo": "7891105008013",
    "nome": "Licor Fino Stock Curaçau Blue Garrafa 720ml",
    "marca": "Stock",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "720ML",
    "ncm": "2208.70.00",
    "descricao": "Licor Stock Curaçau Blue 720ml — Sabor marcante de laranjas da ilha de Curaçau com a tonalidade azul turquesa vibrante indispensável para o drink Blue Lagoon. Garrafa 720ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105008013.jpg?alt=media&token=42e0347c-c467-4929-85c7-3e80c6d3be96",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105008013.jpg?alt=media&token=42e0347c-c467-4929-85c7-3e80c6d3be96",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105008013.jpg?alt=media&token=42e0347c-c467-4929-85c7-3e80c6d3be96"
  },
  {
    "codigo": "8001778401344",
    "nome": "Xarope Fabbri Mixybar Maçã Verde Garrafa 1 Litro",
    "marca": "Fabbri",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2106.90.90",
    "descricao": "Xarope Fabbri Mixybar Maçã Verde 1L — Xarope italiano de alta concentração para preparação profissional de Gin Tropical, sodas italianas e coquetéis de adega. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8001778401344.jpg?alt=media&token=1e6049fe-3ee9-4f55-87a2-37dca7dff917",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8001778401344.jpg?alt=media&token=1e6049fe-3ee9-4f55-87a2-37dca7dff917",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8001778401344.jpg?alt=media&token=1e6049fe-3ee9-4f55-87a2-37dca7dff917"
  },
  {
    "codigo": "7897395040017",
    "nome": "Cerveja Puro Malte Petra Origem Lata 350ml",
    "marca": "Petra",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Puro Malte Petra Origem 350ml — Produzida com água das profundezas da Serra de Petrópolis e puro malte de cevada selecionada. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040017.jpg?alt=media&token=19156008-1746-42b3-8563-33b9ada0fd3e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040017.jpg?alt=media&token=19156008-1746-42b3-8563-33b9ada0fd3e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040017.jpg?alt=media&token=19156008-1746-42b3-8563-33b9ada0fd3e"
  },
  {
    "codigo": "7897395040024",
    "nome": "Cerveja Puro Malte Petra Origem Long Neck 355ml",
    "marca": "Petra",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Puro Malte Petra Long Neck 355ml — Sabor equilibrado com corpo límpido e aroma lupulado suave. Garrafa Long Neck 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040024.jpg?alt=media&token=af731d02-364a-4021-a83a-28d2d77f7abf",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040024.jpg?alt=media&token=af731d02-364a-4021-a83a-28d2d77f7abf",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040024.jpg?alt=media&token=af731d02-364a-4021-a83a-28d2d77f7abf"
  },
  {
    "codigo": "7897395010010",
    "nome": "Cerveja Pilsen Itaipava Tradicional Lata 350ml",
    "marca": "Itaipava",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Itaipava Pilsen 350ml — A cerveja do verão brasileiro, leve, saborosa e refrescante na temperatura certa. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010010.jpg?alt=media&token=f3424913-bab4-40b6-8534-e437d8596db6",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010010.jpg?alt=media&token=f3424913-bab4-40b6-8534-e437d8596db6",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010010.jpg?alt=media&token=f3424913-bab4-40b6-8534-e437d8596db6"
  },
  {
    "codigo": "7897395010058",
    "nome": "Cerveja Itaipava 100% Malte Lata 350ml",
    "marca": "Itaipava",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Itaipava 100% Malte 350ml — Mais encorpada, dourada e produzida exclusivamente com água, lúpulo e 100% cevada maltada. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010058.jpg?alt=media&token=00ddabbd-c799-4efd-8cc4-077d59077af4",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010058.jpg?alt=media&token=00ddabbd-c799-4efd-8cc4-077d59077af4",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010058.jpg?alt=media&token=00ddabbd-c799-4efd-8cc4-077d59077af4"
  },
  {
    "codigo": "7898956621015",
    "nome": "Cerveja Puro Malte Império Lager Lata 350ml",
    "marca": "Império",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Império Puro Malte 350ml — Cerveja nobre estilo Lager de baixa fermentação com sabor equilibrado. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621015.jpg?alt=media&token=fc17bd63-93e2-4b81-ac84-7f5d55a7368a",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621015.jpg?alt=media&token=fc17bd63-93e2-4b81-ac84-7f5d55a7368a",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621015.jpg?alt=media&token=fc17bd63-93e2-4b81-ac84-7f5d55a7368a"
  },
  {
    "codigo": "7898956621022",
    "nome": "Cerveja Puro Malte Império Lager Long Neck 355ml",
    "marca": "Império",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Império Puro Malte Long Neck 355ml — Apresentação premium na clássica garrafa transparente. Long Neck 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621022.jpg?alt=media&token=5efef4dd-9e2f-4c51-89a2-cc6f1d94bea6",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621022.jpg?alt=media&token=5efef4dd-9e2f-4c51-89a2-cc6f1d94bea6",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621022.jpg?alt=media&token=5efef4dd-9e2f-4c51-89a2-cc6f1d94bea6"
  },
  {
    "codigo": "7896045506705",
    "nome": "Cerveja Blue Moon Belgian White Trigo Long Neck 355ml",
    "marca": "Blue Moon",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Especial Blue Moon 355ml — Cerveja de trigo estilo witbier belga temperada com cascas de laranja Valência e sementes de coentro. Long Neck 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506705.jpg?alt=media&token=1d662a60-b980-4c2d-8469-83ace7ace72e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506705.jpg?alt=media&token=1d662a60-b980-4c2d-8469-83ace7ace72e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506705.jpg?alt=media&token=1d662a60-b980-4c2d-8469-83ace7ace72e"
  },
  {
    "codigo": "7896045506415",
    "nome": "Cerveja Especial Baden Baden Witbier Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden Witbier 600ml — Produzida em Campos do Jordão com trigo, casca de laranja e sementes de coentro. Premiada internacionalmente. Garrafa 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506415.jpg?alt=media&token=a38db034-0ef0-420f-a4b1-98cb0ab35a68",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506415.jpg?alt=media&token=a38db034-0ef0-420f-a4b1-98cb0ab35a68",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506415.jpg?alt=media&token=a38db034-0ef0-420f-a4b1-98cb0ab35a68"
  },
  {
    "codigo": "7896045506422",
    "nome": "Cerveja Especial Baden Baden Cristal Pilsen Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden Cristal 600ml — Pilsen clássica artesanal, límpida, com aroma floral e corpo leve. Garrafa 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506422.jpg?alt=media&token=5b160b14-8cae-42a2-b98f-f8ba9305a273",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506422.jpg?alt=media&token=5b160b14-8cae-42a2-b98f-f8ba9305a273",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506422.jpg?alt=media&token=5b160b14-8cae-42a2-b98f-f8ba9305a273"
  },
  {
    "codigo": "7896045506439",
    "nome": "Cerveja Especial Baden Baden American IPA Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden IPA 600ml — Amargor intenso e aroma de frutas tropicais provenientes da técnica de dry-hopping. Garrafa 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506439.jpg?alt=media&token=f3ef2e48-b531-4395-8edc-ccf4a17359b6",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506439.jpg?alt=media&token=f3ef2e48-b531-4395-8edc-ccf4a17359b6",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506439.jpg?alt=media&token=f3ef2e48-b531-4395-8edc-ccf4a17359b6"
  },
  {
    "codigo": "4066600000155",
    "nome": "Cerveja Alemã Paulaner Hefe-Weissbier Garrafa 500ml",
    "marca": "Paulaner",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "500ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja de Trigo Paulaner Hefe-Weissbier 500ml — A mais clássica cerveja de trigo da Baviera (Munique), turva, encorpada e frutada com notas de cravo e banana. Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4066600000155.jpg?alt=media&token=d9e199e7-733f-4088-9836-8a1b19fcc887",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4066600000155.jpg?alt=media&token=d9e199e7-733f-4088-9836-8a1b19fcc887",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4066600000155.jpg?alt=media&token=d9e199e7-733f-4088-9836-8a1b19fcc887"
  },
  {
    "codigo": "7896045505601",
    "nome": "Cerveja Clara Sol Premium Lager Long Neck 330ml",
    "marca": "Sol",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Sol Premium 330ml — Clara, dourada e ultra-refrescante, feita para ser saboreada gelada com uma fatia de limão. Long Neck 330ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505601.jpg?alt=media&token=0cd360ed-9d76-4d83-80d3-aad2931f5928",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505601.jpg?alt=media&token=0cd360ed-9d76-4d83-80d3-aad2931f5928",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505601.jpg?alt=media&token=0cd360ed-9d76-4d83-80d3-aad2931f5928"
  },
  {
    "codigo": "8412598000014",
    "nome": "Cerveja Espanhola Estrella Galicia Especial Long Neck 330ml",
    "marca": "Estrella Galicia",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Estrella Galicia Especial 330ml — Tradicional receita da Galícia com lúpulos selecionados e fermentação cuidadosa de sabor pronunciado. Long Neck 330ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8412598000014.jpg?alt=media&token=1e5b8951-96ad-4919-9b24-0fc1f22fa772",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8412598000014.jpg?alt=media&token=1e5b8951-96ad-4919-9b24-0fc1f22fa772",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8412598000014.jpg?alt=media&token=1e5b8951-96ad-4919-9b24-0fc1f22fa772"
  },
  {
    "codigo": "7898900000500",
    "nome": "Copo Descartável Transparente 500ml Pacote com 50 Unidades",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "50UN",
    "ncm": "3924.10.00",
    "descricao": "Copo Plástico Descartável 500ml (Pacote com 50 unidades) — Resistente e transparente, ideal para chopp, refrigerante, cerveja e drinks em festas. Pacote 50 unidades.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000500.jpg?alt=media&token=163dc71b-2169-4a1f-ac3a-9d9e7dbf7ff0",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000500.jpg?alt=media&token=163dc71b-2169-4a1f-ac3a-9d9e7dbf7ff0",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000500.jpg?alt=media&token=163dc71b-2169-4a1f-ac3a-9d9e7dbf7ff0"
  },
  {
    "codigo": "7898900000350",
    "nome": "Copo Acrílico Long Drink Balada Cores Neon 350ml",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "UN",
    "ncm": "3924.10.00",
    "descricao": "Copo Long Drink Acrílico 350ml — Rígido, lavável e reutilizável com cores neon brilhantes sob luz negra para festas e eventos. Unidade.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000350.jpg?alt=media&token=4be898a9-5ae2-425c-bb07-0ed160f0d55c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000350.jpg?alt=media&token=4be898a9-5ae2-425c-bb07-0ed160f0d55c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000350.jpg?alt=media&token=4be898a9-5ae2-425c-bb07-0ed160f0d55c"
  },
  {
    "codigo": "7898900000580",
    "nome": "Taça de Gin Acrílico Bicolor Degrade 580ml",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "UN",
    "ncm": "3924.10.00",
    "descricao": "Taça de Gin em Acrílico 580ml — Bojo largo e base reforçada para drinks de Gin Tônica, bastante gelo e botânicos aromáticos. Unidade.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000580.jpg?alt=media&token=bb26cdd1-d872-4f49-b2f4-d56b8360b5fc",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000580.jpg?alt=media&token=bb26cdd1-d872-4f49-b2f4-d56b8360b5fc",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000580.jpg?alt=media&token=bb26cdd1-d872-4f49-b2f4-d56b8360b5fc"
  },
  {
    "codigo": "7898900000050",
    "nome": "Copo Descartável Shot e Dose 50ml Pacote com 50 Unidades",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "50UN",
    "ncm": "3924.10.00",
    "descricao": "Copinhos Descartáveis para Dose/Shot 50ml (Pacote 50 unidades) — O tamanho padrão para servir tequila, cachaça e licores em doses rápidas. Pacote 50 unidades.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000050.jpg?alt=media&token=7be036d8-e143-4be7-bad2-6d9cf7f539ca",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000050.jpg?alt=media&token=7be036d8-e143-4be7-bad2-6d9cf7f539ca",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000050.jpg?alt=media&token=7be036d8-e143-4be7-bad2-6d9cf7f539ca"
  }
];

/**
 * Garante que todos os produtos essenciais do mix Zé Delivery & Conveniência
 * estejam presentes e enriquecidos no catálogo global do usuário.
 */
export function garantirCatalogoZeDeliveryNoBancoGlobal(catalogoAtual: ProdutoCatalogo[]): {
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

  for (const item of CATALOGO_ZE_DELIVERY_MIX_OFICIAL) {
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
 * Sincroniza em lote os itens de alta demanda Zé Delivery com o Firestore (coleção 'catalogo_global')
 */
export async function sincronizarCatalogoZeDeliveryComFirestore(
  catalogoAtual: ProdutoCatalogo[],
  onProgresso?: (atual: number, total: number) => void
): Promise<{ totalNovos: number; totalAtualizados: number; catalogoFinal: ProdutoCatalogo[] }> {
  const { catalogoCompleto, novosInseridos, atualizados } = garantirCatalogoZeDeliveryNoBancoGlobal(catalogoAtual);
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
          console.warn('Erro ao salvar item Zé Delivery no Firestore:', item.codigo, e);
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
