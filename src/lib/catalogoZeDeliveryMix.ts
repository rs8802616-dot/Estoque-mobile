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
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.jif_3_MRJCUbRmgS3PJpwgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.jif_3_MRJCUbRmgS3PJpwgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.jif_3_MRJCUbRmgS3PJpwgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "9002490205935",
    "nome": "Energético Red Bull Energy Drink Lata 355ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "355ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Energy Drink 355ml (Tamanho Maior) — Ideal para quem precisa de energia extra ou para preparar drinks em copos de 500ml. Embalagem: Lata 355ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.sF32Nz5bU2fFnx8Zf_9NFAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.sF32Nz5bU2fFnx8Zf_9NFAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.sF32Nz5bU2fFnx8Zf_9NFAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "9002490207946",
    "nome": "Energético Red Bull Sugarfree Sem Açúcar Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Sugarfree 250ml — Toda a energia de Red Bull sem açúcares e com pouquíssimas calorias. Embalagem: Lata 250ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.D_gT-rak3da8zOoboZD7NwHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.D_gT-rak3da8zOoboZD7NwHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.D_gT-rak3da8zOoboZD7NwHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "9002490235376",
    "nome": "Energético Red Bull Tropical Edition Frutas Tropicais Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Yellow Edition Tropical 250ml — Sabor marcante de frutas tropicais (maracujá e manga). Perfeito para misturar com Gin Tanqueray ou Beefeater. Embalagem: Lata 250ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.Tve-7rsl_Nj9_8bqf0GYTwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.Tve-7rsl_Nj9_8bqf0GYTwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.Tve-7rsl_Nj9_8bqf0GYTwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "9002490248239",
    "nome": "Energético Red Bull Melancia Red Edition Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Red Edition Melancia 250ml — Sabor refrescante de melancia, ideal para drinks coloridos de verão e combos de gin. Embalagem: Lata 250ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.2wg8SmYAH8yauu6rZbjQngHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.2wg8SmYAH8yauu6rZbjQngHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.2wg8SmYAH8yauu6rZbjQngHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "9002490253455",
    "nome": "Energético Red Bull Pitaya Summer Edition Lata 250ml",
    "marca": "Red Bull",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "250ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Red Bull Summer Edition Pitaya 250ml — Sabor exótico de pitaya com coloração magenta vibrante para coquetelaria. Embalagem: Lata 250ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.qc51biATKgyR_x0YQE519AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.qc51biATKgyR_x0YQE519AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.qc51biATKgyR_x0YQE519AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898949800019",
    "nome": "Energético Monster Energy Tradicional Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Energy Original Lata 473ml — Sabor marcante com dose potente de taurina, cafeína e vitaminas do complexo B. Embalagem: Lata 473ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.UQAEc3yuyjdGa8_ExqhnkwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.UQAEc3yuyjdGa8_ExqhnkwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.UQAEc3yuyjdGa8_ExqhnkwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898949800231",
    "nome": "Energético Monster Energy Juice Mango Loco Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Mango Loco 473ml — Mistura irresistível de sucos de frutas tropicais com a energia de Monster. Embalagem: Lata 473ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.sLrRQfqiSVagN0fmeZ4lWwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.sLrRQfqiSVagN0fmeZ4lWwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.sLrRQfqiSVagN0fmeZ4lWwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898949800163",
    "nome": "Energético Monster Energy Ultra White Zero Açúcar Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Energy Ultra Zero 473ml (Lata Branca) — Leve, cítrico e refrescante, com zero calorias e zero açúcar. Embalagem: Lata 473ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.hOSh13Jk7xFkL2wp4tgt3AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.hOSh13Jk7xFkL2wp4tgt3AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.hOSh13Jk7xFkL2wp4tgt3AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898949800262",
    "nome": "Energético Monster Energy Ultra Paradise Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Ultra Paradise 473ml (Lata Verde) — Notas de kiwi, maçã verde e toque de pepino com zero açúcar. Embalagem: Lata 473ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.dG2-dD5_ffTDgIQx6hfGMQHaF7?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.dG2-dD5_ffTDgIQx6hfGMQHaF7?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.dG2-dD5_ffTDgIQx6hfGMQHaF7?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898949800316",
    "nome": "Energético Monster Energy Pacific Punch Lata 473ml",
    "marca": "Monster Energy",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "473ML",
    "ncm": "2202.99.00",
    "descricao": "Energético Monster Pacific Punch 473ml — Sabor de ponche de frutas com maçã, laranja, framboesa e maracujá. Embalagem: Lata 473ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.gdZZdZK8yoJFXaSMBCioEQHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.gdZZdZK8yoJFXaSMBCioEQHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.gdZZdZK8yoJFXaSMBCioEQHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896434901304",
    "nome": "Energético Baly Tradicional Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Tradicional 2L — O energético tamanho família mais vendido nas adegas para combos de Whisky Passport, Red Label e Vodka. Garrafa Pet 2 Litros.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.SBVqSXuE0jLf24VA6030fAHaKm?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.SBVqSXuE0jLf24VA6030fAHaKm?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.SBVqSXuE0jLf24VA6030fAHaKm?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896434901335",
    "nome": "Energético Baly Sabor Maçã Verde Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Maçã Verde 2L — Sabor sensação nas noites brasileiras, base favorita para o \"Copão\" com Gin ou Vodka Askov. Garrafa Pet 2 Litros.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.hP0V418F8xZHAE1mzlzFMgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.hP0V418F8xZHAE1mzlzFMgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.hP0V418F8xZHAE1mzlzFMgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896434901342",
    "nome": "Energético Baly Sabor Frutas Tropicais Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Tropical 2L — Sabor de frutas amarelas tropicais para drinks rápidos e de alto rendimento. Garrafa Pet 2 Litros.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.7D3eTYg1_ZGJIp4FOiOzjAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.7D3eTYg1_ZGJIp4FOiOzjAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.7D3eTYg1_ZGJIp4FOiOzjAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896434901359",
    "nome": "Energético Baly Sabor Melancia Garrafa Pet 2 Litros",
    "marca": "Baly Energy Drink",
    "categoria": "Energéticos & Não Alcoólicos",
    "unidade_medida": "2L",
    "ncm": "2202.99.00",
    "descricao": "Energético Baly Melancia 2L — Doce e refrescante com coloração avermelhada para coquetéis. Garrafa Pet 2 Litros.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.G_8ohNF6A7-sRtEz9_oQ0AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.G_8ohNF6A7-sRtEz9_oQ0AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.G_8ohNF6A7-sRtEz9_oQ0AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900010015",
    "nome": "Refrigerante Coca-Cola Original Lata 350ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 350ml — O refrigerante de cola mais consumido do planeta, sabor clássico e gás refrescante. Embalagem: Lata 350ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.W451kxWBJDIdfkLxLEJ9DQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.W451kxWBJDIdfkLxLEJ9DQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.W451kxWBJDIdfkLxLEJ9DQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900700015",
    "nome": "Refrigerante Coca-Cola Sem Açúcar Lata 350ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Sem Açúcar 350ml — O sabor autêntico de Coca-Cola com zero calorias e zero açúcares. Embalagem: Lata 350ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.bFtOWQFS_CPh65_4njGQhwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.bFtOWQFS_CPh65_4njGQhwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.bFtOWQFS_CPh65_4njGQhwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900011517",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 2 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 2L — Garrafa familiar para refeições, churrascos e eventos. Embalagem: Pet 2 Litros.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.DiXoY7j8Uim055lKIB2B7gHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.DiXoY7j8Uim055lKIB2B7gHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.DiXoY7j8Uim055lKIB2B7gHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900701517",
    "nome": "Refrigerante Coca-Cola Sem Açúcar Garrafa Pet 2 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Sem Açúcar 2L — Tamanho família com zero açúcares e máxima refrescância. Garrafa Pet 2 Litros.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.UAfIUHMGgyZ8BTnpVMa25wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.UAfIUHMGgyZ8BTnpVMa25wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.UAfIUHMGgyZ8BTnpVMa25wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900011609",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 1.5 Litros",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 1.5L — Tamanho prático e econômico para consumo diário. Garrafa Pet 1.5 Litros.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.DoJDScIzw6PrG8bKa5vhRQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.DoJDScIzw6PrG8bKa5vhRQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.DoJDScIzw6PrG8bKa5vhRQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900011708",
    "nome": "Refrigerante Coca-Cola Original Garrafa Pet 600ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "600ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Original 600ml — O tamanho perfeito para acompanhar lanches rápidos e pedidos individuais no delivery. Garrafa Pet 600ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.v94LPG08ZnDY71yGKxchTAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.v94LPG08ZnDY71yGKxchTAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.v94LPG08ZnDY71yGKxchTAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900010152",
    "nome": "Refrigerante Coca-Cola Garrafa Vidro KS 290ml",
    "marca": "Coca-Cola",
    "categoria": "Bebidas",
    "unidade_medida": "290ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Coca-Cola Garrafa Vidro KS 290ml — O sabor inconfundível na clássica garrafa de vidro retornável. Garrafa Vidro 290ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.FnV-v_TdIUO30tMeQMHEuwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.FnV-v_TdIUO30tMeQMHEuwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.FnV-v_TdIUO30tMeQMHEuwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900110012",
    "nome": "Refrigerante Fanta Laranja Lata 350ml",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Laranja 350ml — Sabor frutado e vibrante com suco de laranja natural e gás borbulhante. Embalagem: Lata 350ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.qF3P0pQBRGt2_33j82_2jwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.qF3P0pQBRGt2_33j82_2jwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.qF3P0pQBRGt2_33j82_2jwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900111514",
    "nome": "Refrigerante Fanta Laranja Garrafa Pet 2 Litros",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Laranja 2L — O refrigerante de laranja favorito das famílias em garrafa de 2 Litros.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.mObbwMucrdCR4vtl0S5b3wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.mObbwMucrdCR4vtl0S5b3wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.mObbwMucrdCR4vtl0S5b3wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900130010",
    "nome": "Refrigerante Fanta Uva Lata 350ml",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Uva 350ml — Sabor intenso e característico de uva roxa com alto teor de refrescância. Embalagem: Lata 350ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.P-c4skEYyz45Wa6c94TdEAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.P-c4skEYyz45Wa6c94TdEAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.P-c4skEYyz45Wa6c94TdEAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900131512",
    "nome": "Refrigerante Fanta Uva Garrafa Pet 2 Litros",
    "marca": "Fanta",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Fanta Uva 2L — Tamanho econômico de 2 litros do clássico refrigerante de uva.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.IamoD5GTWAEJjiSS1EqqZgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.IamoD5GTWAEJjiSS1EqqZgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.IamoD5GTWAEJjiSS1EqqZgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900210019",
    "nome": "Refrigerante Sprite Limão Lata 350ml",
    "marca": "Sprite",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Sprite Sabor Limão 350ml — Cristalina, crocante e com toque cítrico perfeito para matar a sede ou compor drinks. Embalagem: Lata 350ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.o81is6cvB4HOeNXsvXW-BQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.o81is6cvB4HOeNXsvXW-BQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.o81is6cvB4HOeNXsvXW-BQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900211511",
    "nome": "Refrigerante Sprite Limão Garrafa Pet 2 Litros",
    "marca": "Sprite",
    "categoria": "Bebidas",
    "unidade_medida": "2L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Sprite Limão 2L — Sabor lima-limão em garrafa familiar de 2 litros.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.joCRz2uq56eo60BxlWVaLwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.joCRz2uq56eo60BxlWVaLwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.joCRz2uq56eo60BxlWVaLwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900530018",
    "nome": "Refrigerante Schweppes Água Tônica Lata 350ml",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Tônica 350ml — O amargor nobre e gaseificação refinada da tônica mais famosa do mundo. O par ideal do Gin Tônica. Embalagem: Lata 350ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.HdD-79bfiOCsig-hA3PzEwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.HdD-79bfiOCsig-hA3PzEwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.HdD-79bfiOCsig-hA3PzEwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900500011",
    "nome": "Refrigerante Schweppes Citrus Lata 350ml",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "350ML",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Citrus 350ml — Combinação sofisticada de maçã, grapefruit e laranja. Líder em mixologia e drinks com vodka. Embalagem: Lata 350ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.l2HQd6RkFThuUBxlAGL96AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.l2HQd6RkFThuUBxlAGL96AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.l2HQd6RkFThuUBxlAGL96AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900501513",
    "nome": "Refrigerante Schweppes Citrus Garrafa Pet 1.5 Litros",
    "marca": "Schweppes",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2202.10.00",
    "descricao": "Refrigerante Schweppes Citrus 1.5L — Tamanho garrafa para festas, baladas e preparo de drinks em grande quantidade. Pet 1.5 Litros.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.NKF6nHAKtOE2D6usWxGJUwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.NKF6nHAKtOE2D6usWxGJUwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.NKF6nHAKtOE2D6usWxGJUwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900550016",
    "nome": "Água Mineral Sem Gás Crystal Garrafa 500ml",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Sem Gás Crystal 500ml — Pura, leve e cristalina, extraída de fontes naturais selecionadas. Embalagem: Garrafa 500ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.fjoAiVFbVNc4s8pM0l7-3QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.fjoAiVFbVNc4s8pM0l7-3QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.fjoAiVFbVNc4s8pM0l7-3QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900551013",
    "nome": "Água Mineral Com Gás Crystal Garrafa 500ml",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Com Gás Crystal 500ml — Borbulhas finas e agradáveis, perfeita para acompanhar café ou preparar coquetéis. Garrafa 500ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.wWmTDb7eLIh1W06cb70FtwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.wWmTDb7eLIh1W06cb70FtwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.wWmTDb7eLIh1W06cb70FtwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891025114563",
    "nome": "Água Mineral Sem Gás Bonafont Garrafa 500ml",
    "marca": "Bonafont",
    "categoria": "Bebidas",
    "unidade_medida": "500ML",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Bonafont Sem Gás 500ml — Leveza incomparável e baixo teor de sódio para o dia a dia. Garrafa 500ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.t174rLqBDuSPVnabj0u4vQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.t174rLqBDuSPVnabj0u4vQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.t174rLqBDuSPVnabj0u4vQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900550153",
    "nome": "Água Mineral Sem Gás Crystal Garrafa Pet 1.5 Litros",
    "marca": "Crystal",
    "categoria": "Bebidas",
    "unidade_medida": "1.5L",
    "ncm": "2201.10.00",
    "descricao": "Água Mineral Sem Gás Crystal 1.5L — Tamanho econômico para hidratação em casa ou no escritório. Garrafa Pet 1.5 Litros.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.pR2c40g9urVnoH-959fJ9QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.pR2c40g9urVnoH-959fJ9QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.pR2c40g9urVnoH-959fJ9QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891025100016",
    "nome": "Água de Coco Integral Kero Coco Caixa 1 Litro",
    "marca": "Kero Coco",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.89.10",
    "descricao": "Água de Coco Kero Coco 1L — 100% brasileira, sabor autêntico de coco verde esterilizado em Tetra Pak. Rica em sais minerais e isotônica natural. Caixa 1L.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.RNdA0CilH1X87xxAkQQqcQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.RNdA0CilH1X87xxAkQQqcQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.RNdA0CilH1X87xxAkQQqcQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891025100023",
    "nome": "Água de Coco Integral Kero Coco Caixa 200ml",
    "marca": "Kero Coco",
    "categoria": "Bebidas",
    "unidade_medida": "200ML",
    "ncm": "2009.89.10",
    "descricao": "Água de Coco Kero Coco 200ml — Porção individual com canudinho, prática para lanches e consumo imediato. Tetra Pak 200ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.kbr7PDZ1ZbnXEttuvOegrwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.kbr7PDZ1ZbnXEttuvOegrwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.kbr7PDZ1ZbnXEttuvOegrwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900520101",
    "nome": "Suco Del Valle 100% Suco Uva Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.69.00",
    "descricao": "Suco Del Valle 100% Uva 1L — Sem adição de açúcares, feito puramente da fruta madura selecionada. Tetra Pak 1 Litro.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.X2C5D-hvVk-_totihiCiqAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.X2C5D-hvVk-_totihiCiqAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.X2C5D-hvVk-_totihiCiqAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900520200",
    "nome": "Suco Del Valle Néctar de Pêssego Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.89.90",
    "descricao": "Suco Del Valle Néctar Pêssego 1L — Textura aveludada e sabor suave de pêssego fresco enriquecido com vitamina C. Caixa 1 Litro.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.vWi-nzzbuhdAq92imNPy1AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.vWi-nzzbuhdAq92imNPy1AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.vWi-nzzbuhdAq92imNPy1AHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7894900520309",
    "nome": "Suco Del Valle Néctar de Laranja Caixa 1 Litro",
    "marca": "Del Valle",
    "categoria": "Bebidas",
    "unidade_medida": "1L",
    "ncm": "2009.12.00",
    "descricao": "Suco Del Valle Néctar Laranja 1L — Refrescância cítrica equilibrada pronta para beber a qualquer hora. Caixa 1 Litro.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.UHMsDoqy4dg6Qisw-ZCBsgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.UHMsDoqy4dg6Qisw-ZCBsgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.UHMsDoqy4dg6Qisw-ZCBsgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5099873045367",
    "nome": "Whisky Jack Daniel's Old No. 7 Tennessee 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.30.10",
    "descricao": "Whisky Jack Daniel's Old No. 7 Tennessee Whiskey 1L — Filtrado gota a gota em carvão de bordo (Charcoal Mellowed) e maturado em barris de carvalho novos. Ícone mundial. Garrafa 1L.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.DS1cXP5oZwmCFiyQzF85XwAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.DS1cXP5oZwmCFiyQzF85XwAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.DS1cXP5oZwmCFiyQzF85XwAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5099873010723",
    "nome": "Whisky Licor Jack Daniel's Tennessee Honey 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Honey 1L — Combinação sedutora do autêntico Tennessee Whiskey com licor de mel natural. Toque aveludado e suave. Garrafa 1L.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.64HnX2eiuP4UuNQnA9xVKAHaJ4?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.64HnX2eiuP4UuNQnA9xVKAHaJ4?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.64HnX2eiuP4UuNQnA9xVKAHaJ4?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5099873003053",
    "nome": "Whisky Licor Jack Daniel's Tennessee Apple 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Apple 1L — A união crocante da maçã verde fresca com o caráter inconfundível de Jack Daniel's. Garrafa 1L.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.8AwGMo6JIcGZs7MjqXg3SgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.8AwGMo6JIcGZs7MjqXg3SgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.8AwGMo6JIcGZs7MjqXg3SgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5099873001257",
    "nome": "Whisky Licor Jack Daniel's Tennessee Fire 1L",
    "marca": "Jack Daniel's",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.70.00",
    "descricao": "Licor de Whisky Jack Daniel's Fire 1L — Aquece o paladar com licor de canela ardente combinado ao clássico Old No. 7. Garrafa 1L.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.IwMlOfEnEzcjVohLTXs2swHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.IwMlOfEnEzcjVohLTXs2swHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.IwMlOfEnEzcjVohLTXs2swHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5000267114385",
    "nome": "Whisky Johnnie Walker Gold Label Reserve 750ml",
    "marca": "Johnnie Walker",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.30.20",
    "descricao": "Whisky Johnnie Walker Gold Label Reserve 750ml — Luxuoso blend com notas de néctar dourado, baunilha e leve toque defumado de carvalho. Garrafa 750ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.3TUqOEpEq7R1Lwwg4ZX2MwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.3TUqOEpEq7R1Lwwg4ZX2MwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.3TUqOEpEq7R1Lwwg4ZX2MwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5000299222416",
    "nome": "Whisky Escocês Royal Salute 21 Anos Signature Blend 700ml",
    "marca": "Royal Salute",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.30.20",
    "descricao": "Whisky Royal Salute 21 Anos 700ml — O ápice do luxo escocês em elegante garrafa de porcelana artesanal. Maturado por no mínimo 21 anos. Garrafa 700ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.Un1zxozo5X4BiN1Doh0XIgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.Un1zxozo5X4BiN1Doh0XIgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.Un1zxozo5X4BiN1Doh0XIgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5000329002247",
    "nome": "Gin Beefeater London Dry 750ml",
    "marca": "Beefeater",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.50.00",
    "descricao": "Gin Beefeater London Dry 750ml — Destilado no coração de Londres com 9 botânicos tradicionais, zimbro marcante e cítrico equilibrado. Garrafa 750ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.QwpC--igv30Mf9ZKBVpF-gHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.QwpC--igv30Mf9ZKBVpF-gHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.QwpC--igv30Mf9ZKBVpF-gHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5010677714006",
    "nome": "Gin Bombay Sapphire London Dry 750ml",
    "marca": "Bombay Sapphire",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.50.00",
    "descricao": "Gin Bombay Sapphire 750ml — Famoso por sua icônica garrafa azul e destilação por infusão a vapor com 10 botânicos exóticos. Garrafa 750ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.vAWydHgongBcbuWZFbU9xAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.vAWydHgongBcbuWZFbU9xAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.vAWydHgongBcbuWZFbU9xAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891105005012",
    "nome": "Gin Seagers London Dry Garrafa 1 Litro",
    "marca": "Seagers",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2208.50.00",
    "descricao": "Gin Seagers London Dry 1L — O gin nacional mais tradicional e consumido para preparação de drinks e coquetéis em grande escala. Garrafa 1L.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.fby-3Km3_1QqwnaHHURSYAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.fby-3Km3_1QqwnaHHURSYAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.fby-3Km3_1QqwnaHHURSYAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "080480280024",
    "nome": "Vodka Francesa Grey Goose Original 750ml",
    "marca": "Grey Goose",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.60.00",
    "descricao": "Vodka Grey Goose 750ml — Vodka super-premium francesa elaborada com trigo de inverno da região da Picardia e água pura de fonte de Gensac. Garrafa 750ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.BfEqxbDCxCAl_Sc2jD21UgHaNu?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.BfEqxbDCxCAl_Sc2jD21UgHaNu?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.BfEqxbDCxCAl_Sc2jD21UgHaNu?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "088076161678",
    "nome": "Vodka Francesa Cîroc Snap Frost 750ml",
    "marca": "Cîroc",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.60.00",
    "descricao": "Vodka Cîroc Snap Frost 750ml — Destilada 5 vezes a partir de finas uvas francesas Gaillac, conferindo suavidade e frescor frutado sem igual. Garrafa 750ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.XeM8H796Ikvubnwhr5WXDQHaFj?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.XeM8H796Ikvubnwhr5WXDQHaFj?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.XeM8H796Ikvubnwhr5WXDQHaFj?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7501011111394",
    "nome": "Tequila José Cuervo Especial Gold Garrafa 750ml",
    "marca": "José Cuervo",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.90.00",
    "descricao": "Tequila José Cuervo Especial Ouro 750ml — A tequila número 1 do mundo, envelhecida em barris de carvalho americano. Perfeita para shots e Margaritas. Garrafa 750ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.g0KN1p-URseNDjgb3foHIAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.g0KN1p-URseNDjgb3foHIAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.g0KN1p-URseNDjgb3foHIAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7501011111400",
    "nome": "Tequila José Cuervo Clásico Silver Garrafa 750ml",
    "marca": "José Cuervo",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.90.00",
    "descricao": "Tequila José Cuervo Especial Prata 750ml — Pura, límpida e refrescante, capturando a essência fresca da planta de agave azul. Garrafa 750ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.p5NBR0hNr6Qgs9OW0T6HSgHaJ4?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.p5NBR0hNr6Qgs9OW0T6HSgHaJ4?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.p5NBR0hNr6Qgs9OW0T6HSgHaJ4?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891153000014",
    "nome": "Rum Bacardi Carta Blanca Superior Garrafa 980ml",
    "marca": "Bacardi",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "980ML",
    "ncm": "2208.40.00",
    "descricao": "Rum Bacardi Carta Blanca 980ml — O rum branco mais premiado do mundo, indispensável para Mojitos, Daiquiris e Cuba Libre. Garrafa 980ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.j66oYGhaxpE1zE4HRUgNjAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.j66oYGhaxpE1zE4HRUgNjAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.j66oYGhaxpE1zE4HRUgNjAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891153000021",
    "nome": "Rum Bacardi Carta Oro Gold Garrafa 980ml",
    "marca": "Bacardi",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "980ML",
    "ncm": "2208.40.00",
    "descricao": "Rum Bacardi Carta Oro 980ml — Notas ricas de baunilha, caramelo e amêndoas tostadas conferidas pelo carvalho. Garrafa 980ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.mFga52f85WydLLNWt9A7oAHaLO?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.mFga52f85WydLLNWt9A7oAHaLO?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.mFga52f85WydLLNWt9A7oAHaLO?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "5010284100032",
    "nome": "Rum Licor de Coco Malibu Original 750ml",
    "marca": "Malibu",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "750ML",
    "ncm": "2208.70.00",
    "descricao": "Licor de Rum Malibu Coconut 750ml — O sabor tropical do Caribe com essência natural de coco, perfeito com suco de abacaxi ou refrigerante de limão. Garrafa 750ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.AnswyomWTp5tU-odeNGhCwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.AnswyomWTp5tU-odeNGhCwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.AnswyomWTp5tU-odeNGhCwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891105001007",
    "nome": "Aperitivo Dreher Aguardente Composta Garrafa 900ml",
    "marca": "Dreher",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "900ML",
    "ncm": "2208.70.00",
    "descricao": "Aperitivo Dreher 900ml — O clássico conhaque brasileiro de gengibre e extratos vegetais aromáticos com quase um século de tradição. Garrafa 900ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.LEBVE6UkP4dVdXB_tF5odwAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.LEBVE6UkP4dVdXB_tF5odwAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.LEBVE6UkP4dVdXB_tF5odwAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891126000010",
    "nome": "Cachaça Ypióca Prata Clássica Garrafa 965ml",
    "marca": "Ypióca",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Ypióca Prata 965ml — Destilada no Ceará e descansada em tonéis de bálsamo. Ideal para a autêntica caipirinha brasileira. Garrafa 965ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.hv6PmXflPAxYrrQFOVtPQAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.hv6PmXflPAxYrrQFOVtPQAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.hv6PmXflPAxYrrQFOVtPQAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891126000027",
    "nome": "Cachaça Ypióca Ouro Envelhecida Garrafa 965ml",
    "marca": "Ypióca",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "965ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Ypióca Ouro 965ml — Envelhecida por no mínimo 1 ano em barris de carvalho, garantindo cor dourada e sabor macio. Garrafa 965ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.A7nf-4H8SivaM8aYDy4TgQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.A7nf-4H8SivaM8aYDy4TgQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.A7nf-4H8SivaM8aYDy4TgQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898952136018",
    "nome": "Cachaça Cabaré Extra Premium Ouro Garrafa 700ml",
    "marca": "Cabaré",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Cabaré Ouro 700ml — Envelhecida 15 anos em carvalho europeu em parceria com o cantor Eduardo Costa e Leonardo. Garrafa 700ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.1m9PcF7SjH_86oTzlH30gAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.1m9PcF7SjH_86oTzlH30gAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.1m9PcF7SjH_86oTzlH30gAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898018280018",
    "nome": "Cachaça Salinas Tradicional Umburana Garrafa 700ml",
    "marca": "Salinas",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "700ML",
    "ncm": "2208.40.00",
    "descricao": "Cachaça Artesanal Salinas 700ml — Produzida na capital mundial da cachaça (Salinas/MG) e envelhecida em dornas de bálsamo e umburana. Garrafa 700ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.agOKI7D_t7ODIkMwAypFJAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.agOKI7D_t7ODIkMwAypFJAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.agOKI7D_t7ODIkMwAypFJAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7891105008013",
    "nome": "Licor Fino Stock Curaçau Blue Garrafa 720ml",
    "marca": "Stock",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "720ML",
    "ncm": "2208.70.00",
    "descricao": "Licor Stock Curaçau Blue 720ml — Sabor marcante de laranjas da ilha de Curaçau com a tonalidade azul turquesa vibrante indispensável para o drink Blue Lagoon. Garrafa 720ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.k9NfmsGGsAqL1JUNzSTKxwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.k9NfmsGGsAqL1JUNzSTKxwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.k9NfmsGGsAqL1JUNzSTKxwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "8001778401344",
    "nome": "Xarope Fabbri Mixybar Maçã Verde Garrafa 1 Litro",
    "marca": "Fabbri",
    "categoria": "Destilados & Whiskies",
    "unidade_medida": "1L",
    "ncm": "2106.90.90",
    "descricao": "Xarope Fabbri Mixybar Maçã Verde 1L — Xarope italiano de alta concentração para preparação profissional de Gin Tropical, sodas italianas e coquetéis de adega. Garrafa 1L.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.bHr-_X_JD0IDsae0kz9JQAAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.bHr-_X_JD0IDsae0kz9JQAAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.bHr-_X_JD0IDsae0kz9JQAAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7897395040017",
    "nome": "Cerveja Puro Malte Petra Origem Lata 350ml",
    "marca": "Petra",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Puro Malte Petra Origem 350ml — Produzida com água das profundezas da Serra de Petrópolis e puro malte de cevada selecionada. Lata 350ml.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP._Qfack3T6NTPS1OFuroJwwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP._Qfack3T6NTPS1OFuroJwwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP._Qfack3T6NTPS1OFuroJwwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7897395040024",
    "nome": "Cerveja Puro Malte Petra Origem Long Neck 355ml",
    "marca": "Petra",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Puro Malte Petra Long Neck 355ml — Sabor equilibrado com corpo límpido e aroma lupulado suave. Garrafa Long Neck 355ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.YuYOc5cygpR_xoHsnw1tBwHaGb?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.YuYOc5cygpR_xoHsnw1tBwHaGb?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.YuYOc5cygpR_xoHsnw1tBwHaGb?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7897395010010",
    "nome": "Cerveja Pilsen Itaipava Tradicional Lata 350ml",
    "marca": "Itaipava",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Itaipava Pilsen 350ml — A cerveja do verão brasileiro, leve, saborosa e refrescante na temperatura certa. Lata 350ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.q4_Es_owfiN6IqqratpRzgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.q4_Es_owfiN6IqqratpRzgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.q4_Es_owfiN6IqqratpRzgHaNn?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7897395010058",
    "nome": "Cerveja Itaipava 100% Malte Lata 350ml",
    "marca": "Itaipava",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Itaipava 100% Malte 350ml — Mais encorpada, dourada e produzida exclusivamente com água, lúpulo e 100% cevada maltada. Lata 350ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.cB4FSB-XXW4V8AhIr5lokAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.cB4FSB-XXW4V8AhIr5lokAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.cB4FSB-XXW4V8AhIr5lokAHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898956621015",
    "nome": "Cerveja Puro Malte Império Lager Lata 350ml",
    "marca": "Império",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "350ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Império Puro Malte 350ml — Cerveja nobre estilo Lager de baixa fermentação com sabor equilibrado. Lata 350ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.VIOobGEYygbr5W2_ALGq5QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.VIOobGEYygbr5W2_ALGq5QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.VIOobGEYygbr5W2_ALGq5QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898956621022",
    "nome": "Cerveja Puro Malte Império Lager Long Neck 355ml",
    "marca": "Império",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Império Puro Malte Long Neck 355ml — Apresentação premium na clássica garrafa transparente. Long Neck 355ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.BHbvGttDth2DtbGhSRbAqwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.BHbvGttDth2DtbGhSRbAqwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.BHbvGttDth2DtbGhSRbAqwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896045506705",
    "nome": "Cerveja Blue Moon Belgian White Trigo Long Neck 355ml",
    "marca": "Blue Moon",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "355ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Especial Blue Moon 355ml — Cerveja de trigo estilo witbier belga temperada com cascas de laranja Valência e sementes de coentro. Long Neck 355ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.BCmoUjaPLAJH3a79WKpphQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.BCmoUjaPLAJH3a79WKpphQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.BCmoUjaPLAJH3a79WKpphQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896045506415",
    "nome": "Cerveja Especial Baden Baden Witbier Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden Witbier 600ml — Produzida em Campos do Jordão com trigo, casca de laranja e sementes de coentro. Premiada internacionalmente. Garrafa 600ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.WjfL-Xw_MTH_rokPmC0m6QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.WjfL-Xw_MTH_rokPmC0m6QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.WjfL-Xw_MTH_rokPmC0m6QHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896045506422",
    "nome": "Cerveja Especial Baden Baden Cristal Pilsen Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden Cristal 600ml — Pilsen clássica artesanal, límpida, com aroma floral e corpo leve. Garrafa 600ml.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.f1D-WxXnIVcfR-J-qRp-dgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.f1D-WxXnIVcfR-J-qRp-dgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.f1D-WxXnIVcfR-J-qRp-dgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896045506439",
    "nome": "Cerveja Especial Baden Baden American IPA Garrafa 600ml",
    "marca": "Baden Baden",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "600ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Baden Baden IPA 600ml — Amargor intenso e aroma de frutas tropicais provenientes da técnica de dry-hopping. Garrafa 600ml.",
    "imagem": "https://tse4.mm.bing.net/th/id/OIP.74ZH222Aox5eIMUsgiNTEwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse4.mm.bing.net/th/id/OIP.74ZH222Aox5eIMUsgiNTEwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse4.mm.bing.net/th/id/OIP.74ZH222Aox5eIMUsgiNTEwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "4066600000155",
    "nome": "Cerveja Alemã Paulaner Hefe-Weissbier Garrafa 500ml",
    "marca": "Paulaner",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "500ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja de Trigo Paulaner Hefe-Weissbier 500ml — A mais clássica cerveja de trigo da Baviera (Munique), turva, encorpada e frutada com notas de cravo e banana. Garrafa 500ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.Eik4lEo6XaEnF0sTewooEQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.Eik4lEo6XaEnF0sTewooEQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.Eik4lEo6XaEnF0sTewooEQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7896045505601",
    "nome": "Cerveja Clara Sol Premium Lager Long Neck 330ml",
    "marca": "Sol",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Sol Premium 330ml — Clara, dourada e ultra-refrescante, feita para ser saboreada gelada com uma fatia de limão. Long Neck 330ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.PFC77uWCfNk3g8kZZIEfuQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.PFC77uWCfNk3g8kZZIEfuQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.PFC77uWCfNk3g8kZZIEfuQHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "8412598000014",
    "nome": "Cerveja Espanhola Estrella Galicia Especial Long Neck 330ml",
    "marca": "Estrella Galicia",
    "categoria": "Bebidas Alcoólicas",
    "unidade_medida": "330ML",
    "ncm": "2203.00.00",
    "descricao": "Cerveja Estrella Galicia Especial 330ml — Tradicional receita da Galícia com lúpulos selecionados e fermentação cuidadosa de sabor pronunciado. Long Neck 330ml.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.RUNMSbQtcwvncPWDmWRM0wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.RUNMSbQtcwvncPWDmWRM0wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.RUNMSbQtcwvncPWDmWRM0wHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898900000500",
    "nome": "Copo Descartável Transparente 500ml Pacote com 50 Unidades",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "50UN",
    "ncm": "3924.10.00",
    "descricao": "Copo Plástico Descartável 500ml (Pacote com 50 unidades) — Resistente e transparente, ideal para chopp, refrigerante, cerveja e drinks em festas. Pacote 50 unidades.",
    "imagem": "https://tse1.mm.bing.net/th/id/OIP.O6gYaVfM7YeVsdVtAsUrWwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse1.mm.bing.net/th/id/OIP.O6gYaVfM7YeVsdVtAsUrWwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse1.mm.bing.net/th/id/OIP.O6gYaVfM7YeVsdVtAsUrWwHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898900000350",
    "nome": "Copo Acrílico Long Drink Balada Cores Neon 350ml",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "UN",
    "ncm": "3924.10.00",
    "descricao": "Copo Long Drink Acrílico 350ml — Rígido, lavável e reutilizável com cores neon brilhantes sob luz negra para festas e eventos. Unidade.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.AonwiXTsJaknsJX4-9vA8wHaG9?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.AonwiXTsJaknsJX4-9vA8wHaG9?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.AonwiXTsJaknsJX4-9vA8wHaG9?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898900000580",
    "nome": "Taça de Gin Acrílico Bicolor Degrade 580ml",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "UN",
    "ncm": "3924.10.00",
    "descricao": "Taça de Gin em Acrílico 580ml — Bojo largo e base reforçada para drinks de Gin Tônica, bastante gelo e botânicos aromáticos. Unidade.",
    "imagem": "https://tse3.mm.bing.net/th/id/OIP.KM8LvWHe0fD2YS94FoQVLAAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse3.mm.bing.net/th/id/OIP.KM8LvWHe0fD2YS94FoQVLAAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse3.mm.bing.net/th/id/OIP.KM8LvWHe0fD2YS94FoQVLAAAAA?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
  },
  {
    "codigo": "7898900000050",
    "nome": "Copo Descartável Shot e Dose 50ml Pacote com 50 Unidades",
    "marca": "Copos & Conveniência",
    "categoria": "Conveniência & Tabacaria",
    "unidade_medida": "50UN",
    "ncm": "3924.10.00",
    "descricao": "Copinhos Descartáveis para Dose/Shot 50ml (Pacote 50 unidades) — O tamanho padrão para servir tequila, cachaça e licores em doses rápidas. Pacote 50 unidades.",
    "imagem": "https://tse2.mm.bing.net/th/id/OIP.LOt44KNDp5sI1wFI9oU3vgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto": "https://tse2.mm.bing.net/th/id/OIP.LOt44KNDp5sI1wFI9oU3vgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api",
    "foto_url": "https://tse2.mm.bing.net/th/id/OIP.LOt44KNDp5sI1wFI9oU3vgHaHa?w=260&h=260&c=7&rs=1&qlt=80&pid=Api"
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
