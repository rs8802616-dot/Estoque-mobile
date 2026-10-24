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
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490100070.jpg?alt=media&token=c7dac798-165c-444d-a0d2-bc1c44a7fbb7",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490100070.jpg?alt=media&token=c7dac798-165c-444d-a0d2-bc1c44a7fbb7",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490100070.jpg?alt=media&token=c7dac798-165c-444d-a0d2-bc1c44a7fbb7"
  },
  {
    "codigo": "9002490205935",
    "nome": "Energético Red Bull Energy Drink Lata 355ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "355ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Energy Drink 355ml (Tamanho Maior) — Ideal para quem precisa de energia extra ou para preparar drinks em copos de 500ml. Embalagem: Lata 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490205935.jpg?alt=media&token=7e860720-10bc-4ec1-b909-e52aa1f3bf5c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490205935.jpg?alt=media&token=7e860720-10bc-4ec1-b909-e52aa1f3bf5c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490205935.jpg?alt=media&token=7e860720-10bc-4ec1-b909-e52aa1f3bf5c"
  },
  {
    "codigo": "9002490207946",
    "nome": "Energético Red Bull Sugarfree Sem Açúcar Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Sugarfree 250ml — Toda a energia de Red Bull sem açúcares e com pouquíssimas calorias. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490207946.jpg?alt=media&token=f0e70659-6077-4168-b47f-87601a78cfa9",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490207946.jpg?alt=media&token=f0e70659-6077-4168-b47f-87601a78cfa9",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490207946.jpg?alt=media&token=f0e70659-6077-4168-b47f-87601a78cfa9"
  },
  {
    "codigo": "9002490235376",
    "nome": "Energético Red Bull Tropical Edition Frutas Tropicais Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Yellow Edition Tropical 250ml — Sabor marcante de frutas tropicais (maracujá e manga). Perfeito para misturar com Gin Tanqueray ou Beefeater. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490235376.jpg?alt=media&token=f8e11294-8af1-463d-8d6c-91abdfde7f46",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490235376.jpg?alt=media&token=f8e11294-8af1-463d-8d6c-91abdfde7f46",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490235376.jpg?alt=media&token=f8e11294-8af1-463d-8d6c-91abdfde7f46"
  },
  {
    "codigo": "9002490248239",
    "nome": "Energético Red Bull Melancia Red Edition Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Red Edition Melancia 250ml — Sabor refrescante de melancia, ideal para drinks coloridos de verão e combos de gin. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490248239.jpg?alt=media&token=32157467-c8a2-4121-bcc5-b74f3f24e6aa",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490248239.jpg?alt=media&token=32157467-c8a2-4121-bcc5-b74f3f24e6aa",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490248239.jpg?alt=media&token=32157467-c8a2-4121-bcc5-b74f3f24e6aa"
  },
  {
    "codigo": "9002490253455",
    "nome": "Energético Red Bull Pitaya Summer Edition Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Summer Edition Pitaya 250ml — Sabor exótico de pitaya com coloração magenta vibrante para coquetelaria. Embalagem: Lata 250ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490253455.jpg?alt=media&token=1da18328-255a-4a89-9d04-455663a6d21b",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490253455.jpg?alt=media&token=1da18328-255a-4a89-9d04-455663a6d21b",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F9002490253455.jpg?alt=media&token=1da18328-255a-4a89-9d04-455663a6d21b"
  },
  {
    "codigo": "7898949800019",
    "nome": "Energético Monster Energy Tradicional Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Energy Original Lata 473ml — Sabor marcante com dose potente de taurina, cafeína e vitaminas do complexo B. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800019.jpg?alt=media&token=14192374-e5a5-46a3-a282-2136a499176f",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800019.jpg?alt=media&token=14192374-e5a5-46a3-a282-2136a499176f",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800019.jpg?alt=media&token=14192374-e5a5-46a3-a282-2136a499176f"
  },
  {
    "codigo": "7898949800231",
    "nome": "Energético Monster Energy Juice Mango Loco Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Mango Loco 473ml — Mistura irresistível de sucos de frutas tropicais com a energia de Monster. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800231.jpg?alt=media&token=98d0e345-b6c6-42f1-9e60-dde2fd997a74",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800231.jpg?alt=media&token=98d0e345-b6c6-42f1-9e60-dde2fd997a74",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800231.jpg?alt=media&token=98d0e345-b6c6-42f1-9e60-dde2fd997a74"
  },
  {
    "codigo": "7898949800163",
    "nome": "Energético Monster Energy Ultra White Zero Açúcar Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Energy Ultra Zero 473ml (Lata Branca) — Leve, cítrico e refrescante, com zero calorias e zero açúcar. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800163.jpg?alt=media&token=048b0ea0-483f-4cf9-ae5e-9bf2783d137e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800163.jpg?alt=media&token=048b0ea0-483f-4cf9-ae5e-9bf2783d137e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800163.jpg?alt=media&token=048b0ea0-483f-4cf9-ae5e-9bf2783d137e"
  },
  {
    "codigo": "7898949800262",
    "nome": "Energético Monster Energy Ultra Paradise Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Ultra Paradise 473ml (Lata Verde) — Notas de kiwi, maçã verde e toque de pepino com zero açúcar. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800262.jpg?alt=media&token=0b499a3b-a972-4201-a3ea-514f9283f12c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800262.jpg?alt=media&token=0b499a3b-a972-4201-a3ea-514f9283f12c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800262.jpg?alt=media&token=0b499a3b-a972-4201-a3ea-514f9283f12c"
  },
  {
    "codigo": "7898949800316",
    "nome": "Energético Monster Energy Pacific Punch Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Pacific Punch 473ml — Sabor de ponche de frutas com maçã, laranja, framboesa e maracujá. Embalagem: Lata 473ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800316.jpg?alt=media&token=a5d4ff00-2678-440f-9dbc-2c93f2783683",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800316.jpg?alt=media&token=a5d4ff00-2678-440f-9dbc-2c93f2783683",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898949800316.jpg?alt=media&token=a5d4ff00-2678-440f-9dbc-2c93f2783683"
  },
  {
    "codigo": "7896434901304",
    "nome": "Energético Baly Tradicional Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Tradicional 2L — O energético tamanho família mais vendido nas adegas para combos de Whisky Passport, Red Label e Vodka. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901304.jpg?alt=media&token=a8df3591-3a73-485f-932d-8fad8ef117e8",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901304.jpg?alt=media&token=a8df3591-3a73-485f-932d-8fad8ef117e8",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901304.jpg?alt=media&token=a8df3591-3a73-485f-932d-8fad8ef117e8"
  },
  {
    "codigo": "7896434901335",
    "nome": "Energético Baly Sabor Maçã Verde Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Maçã Verde 2L — Sabor sensação nas noites brasileiras, base favorita para o \"Copão\" com Gin ou Vodka Askov. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901335.jpg?alt=media&token=75d377c3-d95c-484f-806f-a1b17a3df944",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901335.jpg?alt=media&token=75d377c3-d95c-484f-806f-a1b17a3df944",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901335.jpg?alt=media&token=75d377c3-d95c-484f-806f-a1b17a3df944"
  },
  {
    "codigo": "7896434901342",
    "nome": "Energético Baly Sabor Frutas Tropicais Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Tropical 2L — Sabor de frutas amarelas tropicais para drinks rápidos e de alto rendimento. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901342.jpg?alt=media&token=abf9a835-6649-44f6-a3cd-e10cbb6ffe47",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901342.jpg?alt=media&token=abf9a835-6649-44f6-a3cd-e10cbb6ffe47",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901342.jpg?alt=media&token=abf9a835-6649-44f6-a3cd-e10cbb6ffe47"
  },
  {
    "codigo": "7896434901359",
    "nome": "Energético Baly Sabor Melancia Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Melancia 2L — Doce e refrescante com coloração avermelhada para coquetéis. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901359.jpg?alt=media&token=d3a3b636-2cf7-421a-adb2-5ca70c686a86",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901359.jpg?alt=media&token=d3a3b636-2cf7-421a-adb2-5ca70c686a86",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896434901359.jpg?alt=media&token=d3a3b636-2cf7-421a-adb2-5ca70c686a86"
  },
  {
    "codigo": "7894900010015",
    "nome": "Refrigerante Coca-Cola Original Lata 350ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 350ml — O refrigerante de cola mais consumido do planeta, sabor clássico e gás refrescante. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010015.jpg?alt=media&token=56de610e-5fb9-4b8a-a524-26fc66719f1e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010015.jpg?alt=media&token=56de610e-5fb9-4b8a-a524-26fc66719f1e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010015.jpg?alt=media&token=56de610e-5fb9-4b8a-a524-26fc66719f1e"
  },
  {
    "codigo": "7894900700015",
    "nome": "Refrigerante Coca-Cola Sem Açúcar Lata 350ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Sem Açúcar 350ml — O sabor autêntico de Coca-Cola com zero calorias e zero açúcares. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900700015.jpg?alt=media&token=f08f691a-20ce-4502-99c5-6c7ec8f03209",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900700015.jpg?alt=media&token=f08f691a-20ce-4502-99c5-6c7ec8f03209",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900700015.jpg?alt=media&token=f08f691a-20ce-4502-99c5-6c7ec8f03209"
  },
  {
    "codigo": "7894900011517",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 2 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 2L — Garrafa familiar para refeições, churrascos e eventos. Embalagem: Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011517.jpg?alt=media&token=73bd21ac-0464-46a7-a7c7-4164b964de21",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011517.jpg?alt=media&token=73bd21ac-0464-46a7-a7c7-4164b964de21",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011517.jpg?alt=media&token=73bd21ac-0464-46a7-a7c7-4164b964de21"
  },
  {
    "codigo": "7894900701517",
    "nome": "Refrigerante Coca-Cola Sem Açúcar Garrafa Pet 2 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Sem Açúcar 2L — Tamanho família com zero açúcares e máxima refrescância. Garrafa Pet 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900701517.jpg?alt=media&token=118544ab-9541-4d5f-85f8-17367f4f2a90",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900701517.jpg?alt=media&token=118544ab-9541-4d5f-85f8-17367f4f2a90",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900701517.jpg?alt=media&token=118544ab-9541-4d5f-85f8-17367f4f2a90"
  },
  {
    "codigo": "7894900011609",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 1.5 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 1.5L — Tamanho prático e econômico para consumo diário. Garrafa Pet 1.5 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011609.jpg?alt=media&token=62da1b26-926e-4e43-806d-d04b5388cbe4",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011609.jpg?alt=media&token=62da1b26-926e-4e43-806d-d04b5388cbe4",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011609.jpg?alt=media&token=62da1b26-926e-4e43-806d-d04b5388cbe4"
  },
  {
    "codigo": "7894900011708",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 600ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "600ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 600ml — O tamanho perfeito para acompanhar lanches rápidos e pedidos individuais no delivery. Garrafa Pet 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011708.jpg?alt=media&token=79788612-568c-4087-807a-51d038073fbf",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011708.jpg?alt=media&token=79788612-568c-4087-807a-51d038073fbf",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900011708.jpg?alt=media&token=79788612-568c-4087-807a-51d038073fbf"
  },
  {
    "codigo": "7894900010152",
    "nome": "Refrigerante Coca-Cola Garrafa Vidro KS 290ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "290ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Garrafa Vidro KS 290ml — O sabor inconfundível na clássica garrafa de vidro retornável. Garrafa Vidro 290ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010152.jpg?alt=media&token=a1834a21-494b-4a97-a3f8-be3a4f0dd1ef",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010152.jpg?alt=media&token=a1834a21-494b-4a97-a3f8-be3a4f0dd1ef",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900010152.jpg?alt=media&token=a1834a21-494b-4a97-a3f8-be3a4f0dd1ef"
  },
  {
    "codigo": "7894900110012",
    "nome": "Refrigerante Fanta Laranja Lata 350ml",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Laranja 350ml — Sabor frutado e vibrante com suco de laranja natural e gás borbulhante. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900110012.jpg?alt=media&token=ebb59d1c-ba22-42a4-99e6-9587f166848a",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900110012.jpg?alt=media&token=ebb59d1c-ba22-42a4-99e6-9587f166848a",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900110012.jpg?alt=media&token=ebb59d1c-ba22-42a4-99e6-9587f166848a"
  },
  {
    "codigo": "7894900111514",
    "nome": "Refrigerante Fanta Laranja Garrafa Pet 2 Litros",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Laranja 2L — O refrigerante de laranja favorito das famílias em garrafa de 2 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900111514.jpg?alt=media&token=28895db1-488d-4315-95d1-e2702e2b8cf4",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900111514.jpg?alt=media&token=28895db1-488d-4315-95d1-e2702e2b8cf4",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900111514.jpg?alt=media&token=28895db1-488d-4315-95d1-e2702e2b8cf4"
  },
  {
    "codigo": "7894900130010",
    "nome": "Refrigerante Fanta Uva Lata 350ml",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Uva 350ml — Sabor intenso e característico de uva roxa com alto teor de refrescância. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900130010.jpg?alt=media&token=cb1fb983-2edf-4330-8780-f45c35f7775c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900130010.jpg?alt=media&token=cb1fb983-2edf-4330-8780-f45c35f7775c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900130010.jpg?alt=media&token=cb1fb983-2edf-4330-8780-f45c35f7775c"
  },
  {
    "codigo": "7894900131512",
    "nome": "Refrigerante Fanta Uva Garrafa Pet 2 Litros",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Uva 2L — Tamanho econômico de 2 litros do clássico refrigerante de uva.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900131512.jpg?alt=media&token=db223815-e315-4f28-8715-c2bea212852e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900131512.jpg?alt=media&token=db223815-e315-4f28-8715-c2bea212852e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900131512.jpg?alt=media&token=db223815-e315-4f28-8715-c2bea212852e"
  },
  {
    "codigo": "7894900210019",
    "nome": "Refrigerante Sprite Limão Lata 350ml",
    "marca": "Sprite",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Sprite Sabor Limão 350ml — Cristalina, crocante e com toque cítrico perfeito para matar a sede ou compor drinks. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900210019.jpg?alt=media&token=f1ac9db7-a0a7-4b67-8def-0355141d7e60",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900210019.jpg?alt=media&token=f1ac9db7-a0a7-4b67-8def-0355141d7e60",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900210019.jpg?alt=media&token=f1ac9db7-a0a7-4b67-8def-0355141d7e60"
  },
  {
    "codigo": "7894900211511",
    "nome": "Refrigerante Sprite Limão Garrafa Pet 2 Litros",
    "marca": "Sprite",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Sprite Limão 2L — Sabor lima-limão em garrafa familiar de 2 litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900211511.jpg?alt=media&token=1e8b72e1-2c36-409b-9dd0-ca21bf84cbe0",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900211511.jpg?alt=media&token=1e8b72e1-2c36-409b-9dd0-ca21bf84cbe0",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900211511.jpg?alt=media&token=1e8b72e1-2c36-409b-9dd0-ca21bf84cbe0"
  },
  {
    "codigo": "7894900530018",
    "nome": "Refrigerante Schweppes Água Tônica Lata 350ml",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Tônica 350ml — O amargor nobre e gaseificação refinada da tônica mais famosa do mundo. O par ideal do Gin Tônica. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900530018.jpg?alt=media&token=d6299ecd-2e13-4162-8bd2-90995ee92bb8",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900530018.jpg?alt=media&token=d6299ecd-2e13-4162-8bd2-90995ee92bb8",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900530018.jpg?alt=media&token=d6299ecd-2e13-4162-8bd2-90995ee92bb8"
  },
  {
    "codigo": "7894900500011",
    "nome": "Refrigerante Schweppes Citrus Lata 350ml",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Citrus 350ml — Combinação sofisticada de maçã, grapefruit e laranja. Líder em mixologia e drinks com vodka. Embalagem: Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900500011.jpg?alt=media&token=18c03d00-c807-4213-9de4-9fd0130df6b8",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900500011.jpg?alt=media&token=18c03d00-c807-4213-9de4-9fd0130df6b8",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900500011.jpg?alt=media&token=18c03d00-c807-4213-9de4-9fd0130df6b8"
  },
  {
    "codigo": "7894900501513",
    "nome": "Refrigerante Schweppes Citrus Garrafa Pet 1.5 Litros",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Citrus 1.5L — Tamanho garrafa para festas, baladas e preparo de drinks em grande quantidade. Pet 1.5 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900501513.jpg?alt=media&token=d18d4204-1cdd-4572-84d2-8eed0255efa6",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900501513.jpg?alt=media&token=d18d4204-1cdd-4572-84d2-8eed0255efa6",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900501513.jpg?alt=media&token=d18d4204-1cdd-4572-84d2-8eed0255efa6"
  },
  {
    "codigo": "7894900550016",
    "nome": "Água Mineral Sem Gás Crystal Garrafa 500ml",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Sem Gás Crystal 500ml — Pura, leve e cristalina, extraída de fontes naturais selecionadas. Embalagem: Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550016.jpg?alt=media&token=d91e6457-8853-45d9-bdc2-548867a44e26",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550016.jpg?alt=media&token=d91e6457-8853-45d9-bdc2-548867a44e26",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550016.jpg?alt=media&token=d91e6457-8853-45d9-bdc2-548867a44e26"
  },
  {
    "codigo": "7894900551013",
    "nome": "Água Mineral Com Gás Crystal Garrafa 500ml",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Com Gás Crystal 500ml — Borbulhas finas e agradáveis, perfeita para acompanhar café ou preparar coquetéis. Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900551013.jpg?alt=media&token=12f492d9-6c02-4346-a773-955867ab938b",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900551013.jpg?alt=media&token=12f492d9-6c02-4346-a773-955867ab938b",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900551013.jpg?alt=media&token=12f492d9-6c02-4346-a773-955867ab938b"
  },
  {
    "codigo": "7891025114563",
    "nome": "Água Mineral Sem Gás Bonafont Garrafa 500ml",
    "marca": "Bonafont",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Bonafont Sem Gás 500ml — Leveza incomparável e baixo teor de sódio para o dia a dia. Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025114563.jpg?alt=media&token=da109fd5-fbbc-47d0-a83f-be1b8176a9e3",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025114563.jpg?alt=media&token=da109fd5-fbbc-47d0-a83f-be1b8176a9e3",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025114563.jpg?alt=media&token=da109fd5-fbbc-47d0-a83f-be1b8176a9e3"
  },
  {
    "codigo": "7894900550153",
    "nome": "Água Mineral Sem Gás Crystal Garrafa Pet 1.5 Litros",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Sem Gás Crystal 1.5L — Tamanho econômico para hidratação em casa ou no escritório. Garrafa Pet 1.5 Litros.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550153.jpg?alt=media&token=c37f8087-8e47-4d7e-81a8-8f675f9f892c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550153.jpg?alt=media&token=c37f8087-8e47-4d7e-81a8-8f675f9f892c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900550153.jpg?alt=media&token=c37f8087-8e47-4d7e-81a8-8f675f9f892c"
  },
  {
    "codigo": "7891025100016",
    "nome": "Água de Coco Integral Kero Coco Caixa 1 Litro",
    "marca": "Kero Coco",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.89.10",
    "descricao": "Água de Coco Kero Coco 1L — 100% brasileira, sabor autêntico de coco verde esterilizado em Tetra Pak. Rica em sais minerais e isotônica natural. Caixa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100016.jpg?alt=media&token=6f0d7b25-a151-4ee5-89a2-495a0fef5264",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100016.jpg?alt=media&token=6f0d7b25-a151-4ee5-89a2-495a0fef5264",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100016.jpg?alt=media&token=6f0d7b25-a151-4ee5-89a2-495a0fef5264"
  },
  {
    "codigo": "7891025100023",
    "nome": "Água de Coco Integral Kero Coco Caixa 200ml",
    "marca": "Kero Coco",
    "categoria": "Bebidas",
    "unidade_medida": "200ML",
    "ncm": "2009.89.10",
    "descricao": "Água de Coco Kero Coco 200ml — Porção individual com canudinho, prática para lanches e consumo imediato. Tetra Pak 200ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100023.jpg?alt=media&token=d9a18e63-571a-4524-9a4d-03f648e64fd3",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100023.jpg?alt=media&token=d9a18e63-571a-4524-9a4d-03f648e64fd3",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891025100023.jpg?alt=media&token=d9a18e63-571a-4524-9a4d-03f648e64fd3"
  },
  {
    "codigo": "7894900520101",
    "nome": "Suco Del Valle 100% Suco Uva Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.69.00",
    "descricao": "Suco Del Valle 100% Uva 1L — Sem adição de açúcares, feito puramente da fruta madura selecionada. Tetra Pak 1 Litro.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520101.jpg?alt=media&token=f80ee0d3-990a-4de9-879b-6d5028b2232e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520101.jpg?alt=media&token=f80ee0d3-990a-4de9-879b-6d5028b2232e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520101.jpg?alt=media&token=f80ee0d3-990a-4de9-879b-6d5028b2232e"
  },
  {
    "codigo": "7894900520200",
    "nome": "Suco Del Valle Néctar de Pêssego Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.89.90",
    "descricao": "Suco Del Valle Néctar Pêssego 1L — Textura aveludada e sabor suave de pêssego fresco enriquecido com vitamina C. Caixa 1 Litro.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520200.jpg?alt=media&token=fb475646-564f-49b9-9921-fc70854de66c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520200.jpg?alt=media&token=fb475646-564f-49b9-9921-fc70854de66c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520200.jpg?alt=media&token=fb475646-564f-49b9-9921-fc70854de66c"
  },
  {
    "codigo": "7894900520309",
    "nome": "Suco Del Valle Néctar de Laranja Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.12.00",
    "descricao": "Suco Del Valle Néctar Laranja 1L — Refrescância cítrica equilibrada pronta para beber a qualquer hora. Caixa 1 Litro.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520309.jpg?alt=media&token=dff40407-01d4-4f62-a1e6-31a7f34eb19f",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520309.jpg?alt=media&token=dff40407-01d4-4f62-a1e6-31a7f34eb19f",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7894900520309.jpg?alt=media&token=dff40407-01d4-4f62-a1e6-31a7f34eb19f"
  },
  {
    "codigo": "5099873045367",
    "nome": "Whisky Jack Daniel's Old No. 7 Tennessee 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.30.10",
    "descricao": "Whisky Jack Daniel's Old No. 7 Tennessee Whiskey 1L — Filtrado gota a gota em carvão de bordo (Charcoal Mellowed) e maturado em barris de carvalho novos. Ícone mundial. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873045367.jpg?alt=media&token=91699ad3-db17-4c16-b32e-9aaf29bd9dda",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873045367.jpg?alt=media&token=91699ad3-db17-4c16-b32e-9aaf29bd9dda",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873045367.jpg?alt=media&token=91699ad3-db17-4c16-b32e-9aaf29bd9dda"
  },
  {
    "codigo": "5099873010723",
    "nome": "Whisky Licor Jack Daniel's Tennessee Honey 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Honey 1L — Combinação sedutora do autêntico Tennessee Whiskey com licor de mel natural. Toque aveludado e suave. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873010723.jpg?alt=media&token=5503d763-b5fc-4080-b48f-ad3680ec0721",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873010723.jpg?alt=media&token=5503d763-b5fc-4080-b48f-ad3680ec0721",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873010723.jpg?alt=media&token=5503d763-b5fc-4080-b48f-ad3680ec0721"
  },
  {
    "codigo": "5099873003053",
    "nome": "Whisky Licor Jack Daniel's Tennessee Apple 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Apple 1L — A união crocante da maçã verde fresca com o caráter inconfundível de Jack Daniel's. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873003053.jpg?alt=media&token=970aa54a-cc9e-45e5-9860-45a783b7aff8",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873003053.jpg?alt=media&token=970aa54a-cc9e-45e5-9860-45a783b7aff8",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873003053.jpg?alt=media&token=970aa54a-cc9e-45e5-9860-45a783b7aff8"
  },
  {
    "codigo": "5099873001257",
    "nome": "Whisky Licor Jack Daniel's Tennessee Fire 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Fire 1L — Aquece o paladar com licor de canela ardente combinado ao clássico Old No. 7. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873001257.jpg?alt=media&token=63faebdb-8133-49fd-a25f-eb3a2eecb592",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873001257.jpg?alt=media&token=63faebdb-8133-49fd-a25f-eb3a2eecb592",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5099873001257.jpg?alt=media&token=63faebdb-8133-49fd-a25f-eb3a2eecb592"
  },
  {
    "codigo": "5000267114385",
    "nome": "Whisky Johnnie Walker Gold Label Reserve 750ml",
    "marca": "Johnnie Walker",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.30.20",
    "descricao": "Whisky Johnnie Walker Gold Label Reserve 750ml — Luxuoso blend com notas de néctar dourado, baunilha e leve toque defumado de carvalho. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267114385.jpg?alt=media&token=bf237365-ea4c-4e3d-b400-bfeb7836c077",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267114385.jpg?alt=media&token=bf237365-ea4c-4e3d-b400-bfeb7836c077",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000267114385.jpg?alt=media&token=bf237365-ea4c-4e3d-b400-bfeb7836c077"
  },
  {
    "codigo": "5000299222416",
    "nome": "Whisky Escocês Royal Salute 21 Anos Signature Blend 700ml",
    "marca": "Royal Salute",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.30.20",
    "descricao": "Whisky Royal Salute 21 Anos 700ml — O ápice do luxo escocês em elegante garrafa de porcelana artesanal. Maturado por no mínimo 21 anos. Garrafa 700ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299222416.jpg?alt=media&token=2a7b860c-eddb-4898-8dd3-b61db1acfd12",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299222416.jpg?alt=media&token=2a7b860c-eddb-4898-8dd3-b61db1acfd12",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000299222416.jpg?alt=media&token=2a7b860c-eddb-4898-8dd3-b61db1acfd12"
  },
  {
    "codigo": "5000329002247",
    "nome": "Gin Beefeater London Dry 750ml",
    "marca": "Beefeater",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.50.00",
    "descricao": "Gin Beefeater London Dry 750ml — Destilado no coração de Londres com 9 botânicos tradicionais, zimbro marcante e cítrico equilibrado. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000329002247.jpg?alt=media&token=63357c36-2c91-4873-9082-f6a61a6db705",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000329002247.jpg?alt=media&token=63357c36-2c91-4873-9082-f6a61a6db705",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5000329002247.jpg?alt=media&token=63357c36-2c91-4873-9082-f6a61a6db705"
  },
  {
    "codigo": "5010677714006",
    "nome": "Gin Bombay Sapphire London Dry 750ml",
    "marca": "Bombay Sapphire",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.50.00",
    "descricao": "Gin Bombay Sapphire 750ml — Famoso por sua icônica garrafa azul e destilação por infusão a vapor com 10 botânicos exóticos. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010677714006.jpg?alt=media&token=45385f9c-fbe2-4f64-ab28-4ce77ce68952",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010677714006.jpg?alt=media&token=45385f9c-fbe2-4f64-ab28-4ce77ce68952",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010677714006.jpg?alt=media&token=45385f9c-fbe2-4f64-ab28-4ce77ce68952"
  },
  {
    "codigo": "7891105005012",
    "nome": "Gin Seagers London Dry Garrafa 1 Litro",
    "marca": "Seagers",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.50.00",
    "descricao": "Gin Seagers London Dry 1L — O gin nacional mais tradicional e consumido para preparação de drinks e coquetéis em grande escala. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105005012.jpg?alt=media&token=f0f5ef9b-48a2-4c1c-bd71-60134f7971cc",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105005012.jpg?alt=media&token=f0f5ef9b-48a2-4c1c-bd71-60134f7971cc",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105005012.jpg?alt=media&token=f0f5ef9b-48a2-4c1c-bd71-60134f7971cc"
  },
  {
    "codigo": "080480280024",
    "nome": "Vodka Francesa Grey Goose Original 750ml",
    "marca": "Grey Goose",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.60.00",
    "descricao": "Vodka Grey Goose 750ml — Vodka super-premium francesa elaborada com trigo de inverno da região da Picardia e água pura de fonte de Gensac. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F080480280024.jpg?alt=media&token=23a75508-86ff-48a7-8dd3-6c52ecabb0be",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F080480280024.jpg?alt=media&token=23a75508-86ff-48a7-8dd3-6c52ecabb0be",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F080480280024.jpg?alt=media&token=23a75508-86ff-48a7-8dd3-6c52ecabb0be"
  },
  {
    "codigo": "088076161678",
    "nome": "Vodka Francesa Cîroc Snap Frost 750ml",
    "marca": "Cîroc",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.60.00",
    "descricao": "Vodka Cîroc Snap Frost 750ml — Destilada 5 vezes a partir de finas uvas francesas Gaillac, conferindo suavidade e frescor frutado sem igual. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F088076161678.jpg?alt=media&token=09575765-d69d-46a1-aa52-8fd10f0c16ce",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F088076161678.jpg?alt=media&token=09575765-d69d-46a1-aa52-8fd10f0c16ce",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F088076161678.jpg?alt=media&token=09575765-d69d-46a1-aa52-8fd10f0c16ce"
  },
  {
    "codigo": "7501011111394",
    "nome": "Tequila José Cuervo Especial Gold Garrafa 750ml",
    "marca": "José Cuervo",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.90.00",
    "descricao": "Tequila José Cuervo Especial Ouro 750ml — A tequila número 1 do mundo, envelhecida em barris de carvalho americano. Perfeita para shots e Margaritas. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111394.jpg?alt=media&token=31d8c296-204d-4db8-a149-e159c74d00b3",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111394.jpg?alt=media&token=31d8c296-204d-4db8-a149-e159c74d00b3",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111394.jpg?alt=media&token=31d8c296-204d-4db8-a149-e159c74d00b3"
  },
  {
    "codigo": "7501011111400",
    "nome": "Tequila José Cuervo Clásico Silver Garrafa 750ml",
    "marca": "José Cuervo",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.90.00",
    "descricao": "Tequila José Cuervo Especial Prata 750ml — Pura, límpida e refrescante, capturando a essência fresca da planta de agave azul. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111400.jpg?alt=media&token=4f74979e-8b38-45b3-826a-50d500bcf651",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111400.jpg?alt=media&token=4f74979e-8b38-45b3-826a-50d500bcf651",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7501011111400.jpg?alt=media&token=4f74979e-8b38-45b3-826a-50d500bcf651"
  },
  {
    "codigo": "7891153000014",
    "nome": "Rum Bacardi Carta Blanca Superior Garrafa 980ml",
    "marca": "Bacardi",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "980ML",
    "ncm": "2208.40.00",
    "descricao": "Rum Bacardi Carta Blanca 980ml — O rum branco mais premiado do mundo, indispensável para Mojitos, Daiquiris e Cuba Libre. Garrafa 980ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000014.jpg?alt=media&token=ac090e6a-23a6-4736-935c-812cb76aa60d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000014.jpg?alt=media&token=ac090e6a-23a6-4736-935c-812cb76aa60d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000014.jpg?alt=media&token=ac090e6a-23a6-4736-935c-812cb76aa60d"
  },
  {
    "codigo": "7891153000021",
    "nome": "Rum Bacardi Carta Oro Gold Garrafa 980ml",
    "marca": "Bacardi",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "980ML",
    "ncm": "2208.40.00",
    "descricao": "Rum Bacardi Carta Oro 980ml — Notas ricas de baunilha, caramelo e amêndoas tostadas conferidas pelo carvalho. Garrafa 980ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000021.jpg?alt=media&token=34ba52e7-a4c8-4770-8ac8-63256fce0dda",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000021.jpg?alt=media&token=34ba52e7-a4c8-4770-8ac8-63256fce0dda",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891153000021.jpg?alt=media&token=34ba52e7-a4c8-4770-8ac8-63256fce0dda"
  },
  {
    "codigo": "5010284100032",
    "nome": "Rum Licor de Coco Malibu Original 750ml",
    "marca": "Malibu",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.70.00",
    "descricao": "Licor de Rum Malibu Coconut 750ml — O sabor tropical do Caribe com essência natural de coco, perfeito com suco de abacaxi ou refrigerante de limão. Garrafa 750ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010284100032.jpg?alt=media&token=c1805a08-7fc3-4112-bda9-c33ad0d4c74d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010284100032.jpg?alt=media&token=c1805a08-7fc3-4112-bda9-c33ad0d4c74d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F5010284100032.jpg?alt=media&token=c1805a08-7fc3-4112-bda9-c33ad0d4c74d"
  },
  {
    "codigo": "7891105001007",
    "nome": "Aperitivo Dreher Aguardente Composta Garrafa 900ml",
    "marca": "Dreher",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "ncm": "2208.70.00",
    "descricao": "Aperitivo Dreher 900ml — O clássico conhaque brasileiro de gengibre e extratos vegetais aromáticos com quase um século de tradição. Garrafa 900ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001007.jpg?alt=media&token=96d7a215-34d6-483a-9fb9-4eed6d01886e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001007.jpg?alt=media&token=96d7a215-34d6-483a-9fb9-4eed6d01886e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105001007.jpg?alt=media&token=96d7a215-34d6-483a-9fb9-4eed6d01886e"
  },
  {
    "codigo": "7891126000010",
    "nome": "Cachaça Ypióca Prata Clássica Garrafa 965ml",
    "marca": "Ypióca",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Ypióca Prata 965ml — Destilada no Ceará e descansada em tonéis de bálsamo. Ideal para a autêntica caipirinha brasileira. Garrafa 965ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000010.jpg?alt=media&token=c29295c0-2426-4690-80e1-ebf06d164100",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000010.jpg?alt=media&token=c29295c0-2426-4690-80e1-ebf06d164100",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000010.jpg?alt=media&token=c29295c0-2426-4690-80e1-ebf06d164100"
  },
  {
    "codigo": "7891126000027",
    "nome": "Cachaça Ypióca Ouro Envelhecida Garrafa 965ml",
    "marca": "Ypióca",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Ypióca Ouro 965ml — Envelhecida por no mínimo 1 ano em barris de carvalho, garantindo cor dourada e sabor macio. Garrafa 965ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000027.jpg?alt=media&token=0e9df9e6-d713-4bd0-a4e4-c2a142a33a26",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000027.jpg?alt=media&token=0e9df9e6-d713-4bd0-a4e4-c2a142a33a26",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891126000027.jpg?alt=media&token=0e9df9e6-d713-4bd0-a4e4-c2a142a33a26"
  },
  {
    "codigo": "7898952136018",
    "nome": "Cachaça Cabaré Extra Premium Ouro Garrafa 700ml",
    "marca": "Cabaré",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Cabaré Ouro 700ml — Envelhecida 15 anos em carvalho europeu em parceria com o cantor Eduardo Costa e Leonardo. Garrafa 700ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898952136018.jpg?alt=media&token=df2f514b-504c-41d6-8edb-5589e59baeee",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898952136018.jpg?alt=media&token=df2f514b-504c-41d6-8edb-5589e59baeee",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898952136018.jpg?alt=media&token=df2f514b-504c-41d6-8edb-5589e59baeee"
  },
  {
    "codigo": "7898018280018",
    "nome": "Cachaça Salinas Tradicional Umburana Garrafa 700ml",
    "marca": "Salinas",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Artesanal Salinas 700ml — Produzida na capital mundial da cachaça (Salinas/MG) e envelhecida em dornas de bálsamo e umburana. Garrafa 700ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898018280018.jpg?alt=media&token=3fa3905b-0e7f-4fe3-bcc6-6f61861d9fff",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898018280018.jpg?alt=media&token=3fa3905b-0e7f-4fe3-bcc6-6f61861d9fff",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898018280018.jpg?alt=media&token=3fa3905b-0e7f-4fe3-bcc6-6f61861d9fff"
  },
  {
    "codigo": "7891105008013",
    "nome": "Licor Fino Stock Curaçau Blue Garrafa 720ml",
    "marca": "Stock",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "720ML",
    "ncm": "2208.70.00",
    "descricao": "Licor Stock Curaçau Blue 720ml — Sabor marcante de laranjas da ilha de Curaçau com a tonalidade azul turquesa vibrante indispensável para o drink Blue Lagoon. Garrafa 720ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105008013.jpg?alt=media&token=805b4256-ddeb-4082-abc7-aca276f943d1",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105008013.jpg?alt=media&token=805b4256-ddeb-4082-abc7-aca276f943d1",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7891105008013.jpg?alt=media&token=805b4256-ddeb-4082-abc7-aca276f943d1"
  },
  {
    "codigo": "8001778401344",
    "nome": "Xarope Fabbri Mixybar Maçã Verde Garrafa 1 Litro",
    "marca": "Fabbri",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2106.90.90",
    "descricao": "Xarope Fabbri Mixybar Maçã Verde 1L — Xarope italiano de alta concentração para preparação profissional de Gin Tropical, sodas italianas e coquetéis de adega. Garrafa 1L.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8001778401344.jpg?alt=media&token=ad343b60-2b97-43c5-b14b-ace5716c77d2",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8001778401344.jpg?alt=media&token=ad343b60-2b97-43c5-b14b-ace5716c77d2",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8001778401344.jpg?alt=media&token=ad343b60-2b97-43c5-b14b-ace5716c77d2"
  },
  {
    "codigo": "7897395040017",
    "nome": "Cerveja Puro Malte Petra Origem Lata 350ml",
    "marca": "Petra",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Puro Malte Petra Origem 350ml — Produzida com água das profundezas da Serra de Petrópolis e puro malte de cevada selecionada. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040017.jpg?alt=media&token=00d69c6f-cb25-4b2e-9e79-37de85474e1e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040017.jpg?alt=media&token=00d69c6f-cb25-4b2e-9e79-37de85474e1e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040017.jpg?alt=media&token=00d69c6f-cb25-4b2e-9e79-37de85474e1e"
  },
  {
    "codigo": "7897395040024",
    "nome": "Cerveja Puro Malte Petra Origem Long Neck 355ml",
    "marca": "Petra",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Puro Malte Petra Long Neck 355ml — Sabor equilibrado com corpo límpido e aroma lupulado suave. Garrafa Long Neck 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040024.jpg?alt=media&token=ef66aed5-6018-44ed-a8d8-992b138fab5d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040024.jpg?alt=media&token=ef66aed5-6018-44ed-a8d8-992b138fab5d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395040024.jpg?alt=media&token=ef66aed5-6018-44ed-a8d8-992b138fab5d"
  },
  {
    "codigo": "7897395010010",
    "nome": "Cerveja Pilsen Itaipava Tradicional Lata 350ml",
    "marca": "Itaipava",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Itaipava Pilsen 350ml — A cerveja do verão brasileiro, leve, saborosa e refrescante na temperatura certa. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010010.jpg?alt=media&token=93ecc653-f6fd-47e6-a6ba-249e13957b3c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010010.jpg?alt=media&token=93ecc653-f6fd-47e6-a6ba-249e13957b3c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010010.jpg?alt=media&token=93ecc653-f6fd-47e6-a6ba-249e13957b3c"
  },
  {
    "codigo": "7897395010058",
    "nome": "Cerveja Itaipava 100% Malte Lata 350ml",
    "marca": "Itaipava",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Itaipava 100% Malte 350ml — Mais encorpada, dourada e produzida exclusivamente com água, lúpulo e 100% cevada maltada. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010058.jpg?alt=media&token=f3b31baa-f0b7-4c06-983a-9174b5361f83",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010058.jpg?alt=media&token=f3b31baa-f0b7-4c06-983a-9174b5361f83",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7897395010058.jpg?alt=media&token=f3b31baa-f0b7-4c06-983a-9174b5361f83"
  },
  {
    "codigo": "7898956621015",
    "nome": "Cerveja Puro Malte Império Lager Lata 350ml",
    "marca": "Império",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Império Puro Malte 350ml — Cerveja nobre estilo Lager de baixa fermentação com sabor equilibrado. Lata 350ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621015.jpg?alt=media&token=fb943da4-2325-42e8-8765-5f2a1eb56f32",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621015.jpg?alt=media&token=fb943da4-2325-42e8-8765-5f2a1eb56f32",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621015.jpg?alt=media&token=fb943da4-2325-42e8-8765-5f2a1eb56f32"
  },
  {
    "codigo": "7898956621022",
    "nome": "Cerveja Puro Malte Império Lager Long Neck 355ml",
    "marca": "Império",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Império Puro Malte Long Neck 355ml — Apresentação premium na clássica garrafa transparente. Long Neck 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621022.jpg?alt=media&token=af974ac8-c950-45eb-b84a-7ceb7e161a1a",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621022.jpg?alt=media&token=af974ac8-c950-45eb-b84a-7ceb7e161a1a",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898956621022.jpg?alt=media&token=af974ac8-c950-45eb-b84a-7ceb7e161a1a"
  },
  {
    "codigo": "7896045506705",
    "nome": "Cerveja Blue Moon Belgian White Trigo Long Neck 355ml",
    "marca": "Blue Moon",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Especial Blue Moon 355ml — Cerveja de trigo estilo witbier belga temperada com cascas de laranja Valência e sementes de coentro. Long Neck 355ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506705.jpg?alt=media&token=4afd6d3f-db71-4588-8e7a-0eccbf27a63c",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506705.jpg?alt=media&token=4afd6d3f-db71-4588-8e7a-0eccbf27a63c",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506705.jpg?alt=media&token=4afd6d3f-db71-4588-8e7a-0eccbf27a63c"
  },
  {
    "codigo": "7896045506415",
    "nome": "Cerveja Especial Baden Baden Witbier Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden Witbier 600ml — Produzida em Campos do Jordão com trigo, casca de laranja e sementes de coentro. Premiada internacionalmente. Garrafa 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506415.jpg?alt=media&token=eabc6655-39aa-4069-8006-97e7ffeb370e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506415.jpg?alt=media&token=eabc6655-39aa-4069-8006-97e7ffeb370e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506415.jpg?alt=media&token=eabc6655-39aa-4069-8006-97e7ffeb370e"
  },
  {
    "codigo": "7896045506422",
    "nome": "Cerveja Especial Baden Baden Cristal Pilsen Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden Cristal 600ml — Pilsen clássica artesanal, límpida, com aroma floral e corpo leve. Garrafa 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506422.jpg?alt=media&token=10d5777c-935e-45dc-97fa-92428ae51a03",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506422.jpg?alt=media&token=10d5777c-935e-45dc-97fa-92428ae51a03",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506422.jpg?alt=media&token=10d5777c-935e-45dc-97fa-92428ae51a03"
  },
  {
    "codigo": "7896045506439",
    "nome": "Cerveja Especial Baden Baden American IPA Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden IPA 600ml — Amargor intenso e aroma de frutas tropicais provenientes da técnica de dry-hopping. Garrafa 600ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506439.jpg?alt=media&token=f702726b-e234-49c4-8a48-3bcfb2d7c8cd",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506439.jpg?alt=media&token=f702726b-e234-49c4-8a48-3bcfb2d7c8cd",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045506439.jpg?alt=media&token=f702726b-e234-49c4-8a48-3bcfb2d7c8cd"
  },
  {
    "codigo": "4066600000155",
    "nome": "Cerveja Alemã Paulaner Hefe-Weissbier Garrafa 500ml",
    "marca": "Paulaner",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "500ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja de Trigo Paulaner Hefe-Weissbier 500ml — A mais clássica cerveja de trigo da Baviera (Munique), turva, encorpada e frutada com notas de cravo e banana. Garrafa 500ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4066600000155.jpg?alt=media&token=73fde104-417d-4f8d-affd-3d7d57121b2e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4066600000155.jpg?alt=media&token=73fde104-417d-4f8d-affd-3d7d57121b2e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F4066600000155.jpg?alt=media&token=73fde104-417d-4f8d-affd-3d7d57121b2e"
  },
  {
    "codigo": "7896045505601",
    "nome": "Cerveja Clara Sol Premium Lager Long Neck 330ml",
    "marca": "Sol",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Sol Premium 330ml — Clara, dourada e ultra-refrescante, feita para ser saboreada gelada com uma fatia de limão. Long Neck 330ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505601.jpg?alt=media&token=3faa2741-da73-4e87-831a-d10183c89b3e",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505601.jpg?alt=media&token=3faa2741-da73-4e87-831a-d10183c89b3e",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7896045505601.jpg?alt=media&token=3faa2741-da73-4e87-831a-d10183c89b3e"
  },
  {
    "codigo": "8412598000014",
    "nome": "Cerveja Espanhola Estrella Galicia Especial Long Neck 330ml",
    "marca": "Estrella Galicia",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Estrella Galicia Especial 330ml — Tradicional receita da Galícia com lúpulos selecionados e fermentação cuidadosa de sabor pronunciado. Long Neck 330ml.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8412598000014.jpg?alt=media&token=4cb6fd8a-0de5-415e-abf5-c7f5893a7f3b",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8412598000014.jpg?alt=media&token=4cb6fd8a-0de5-415e-abf5-c7f5893a7f3b",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F8412598000014.jpg?alt=media&token=4cb6fd8a-0de5-415e-abf5-c7f5893a7f3b"
  },
  {
    "codigo": "7898900000500",
    "nome": "Copo Descartável Transparente 500ml Pacote com 50 Unidades",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "50UN",
    "ncm": "3924.10.00",
    "descricao": "Copo Plástico Descartável 500ml (Pacote com 50 unidades) — Resistente e transparente, ideal para chopp, refrigerante, cerveja e drinks em festas. Pacote 50 unidades.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000500.jpg?alt=media&token=abcf904f-6b88-4827-96cb-689c4d1ac410",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000500.jpg?alt=media&token=abcf904f-6b88-4827-96cb-689c4d1ac410",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000500.jpg?alt=media&token=abcf904f-6b88-4827-96cb-689c4d1ac410"
  },
  {
    "codigo": "7898900000350",
    "nome": "Copo Acrílico Long Drink Balada Cores Neon 350ml",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "UN",
    "ncm": "3924.10.00",
    "descricao": "Copo Long Drink Acrílico 350ml — Rígido, lavável e reutilizável com cores neon brilhantes sob luz negra para festas e eventos. Unidade.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000350.jpg?alt=media&token=f12b435c-9a47-45de-a8c1-1428d9b31f58",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000350.jpg?alt=media&token=f12b435c-9a47-45de-a8c1-1428d9b31f58",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000350.jpg?alt=media&token=f12b435c-9a47-45de-a8c1-1428d9b31f58"
  },
  {
    "codigo": "7898900000580",
    "nome": "Taça de Gin Acrílico Bicolor Degrade 580ml",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "UN",
    "ncm": "3924.10.00",
    "descricao": "Taça de Gin em Acrílico 580ml — Bojo largo e base reforçada para drinks de Gin Tônica, bastante gelo e botânicos aromáticos. Unidade.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000580.jpg?alt=media&token=6042d28c-7648-4425-9803-938eb3b2a954",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000580.jpg?alt=media&token=6042d28c-7648-4425-9803-938eb3b2a954",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000580.jpg?alt=media&token=6042d28c-7648-4425-9803-938eb3b2a954"
  },
  {
    "codigo": "7898900000050",
    "nome": "Copo Descartável Shot e Dose 50ml Pacote com 50 Unidades",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "50UN",
    "ncm": "3924.10.00",
    "descricao": "Copinhos Descartáveis para Dose/Shot 50ml (Pacote 50 unidades) — O tamanho padrão para servir tequila, cachaça e licores em doses rápidas. Pacote 50 unidades.",
    "imagem": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000050.jpg?alt=media&token=2fd9aa46-1f02-416a-ae3a-a3c18a5fb98d",
    "foto": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000050.jpg?alt=media&token=2fd9aa46-1f02-416a-ae3a-a3c18a5fb98d",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/adega-delivery-pdv.firebasestorage.app/o/produtos_catalogo%2F7898900000050.jpg?alt=media&token=2fd9aa46-1f02-416a-ae3a-a3c18a5fb98d"
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
