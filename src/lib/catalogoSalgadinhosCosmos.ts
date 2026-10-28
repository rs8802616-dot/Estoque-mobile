import { ProdutoCatalogo } from '../types';
import { salvarProdutoCatalogoFirestore } from './firestoreSync';

/**
 * Catálogo Oficial de Salgadinhos & Snacks (Cosmos Bluesoft - https://cosmos.bluesoft.com.br/categorias/salgadinhos/produtos)
 * Extraído e filtrado: 1059 produtos novos que não existiam no banco de dados.
 * 100% com códigos de barras EAN/GTIN, marcas e fotos WebP.
 */
export const catalogoSalgadinhosCosmosMix: ProdutoCatalogo[] = [
  {
    "codigo": "7892840820060",
    "nome": "Salgadinho Doritos Pizza 78g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820060.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815196",
    "nome": "Salgadinho Bacon Torcida 450g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815196.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815202",
    "nome": "Salgadinho Cebola Torcida 450g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815202.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896094921498",
    "nome": "Salgadinho Top Snacks 51g Pizza",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896094921498.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818395",
    "nome": "Salgadinho Bacon Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818395.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817916",
    "nome": "Salgadinho Queijo Nacho Doritos 210g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817916.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820299",
    "nome": "Salgadinho Churrasco Torcida Jr. 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820299.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820602",
    "nome": "Salgadinho Sabor Vinagrete Torcida 70G",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820602.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820619",
    "nome": "Salgadinho Torcida abor Vinagrete 100g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820619.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815219",
    "nome": "Salgadinho Pimenta Mexicana Torcida 450g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815219.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821708",
    "nome": "Salgadinho de Cheddar Cheetos Patas 115g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821708.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819859",
    "nome": "Salgadinho Torcida Sabor Pão de Alho 100g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819859.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818357",
    "nome": "Salgadinho Doritos Sabor Queijo Nacho 300g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818357.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817435",
    "nome": "Salgadinho Tira Onda Original Ruffles 134 g",
    "marca": "Stax",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817435.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820138",
    "nome": "Salgadinho De Milho Sweet Chili Doritos 45G",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820138.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898380410389",
    "nome": "Salgadinho de Soja GoodSoy Sabor Queijo 25g",
    "marca": "GoodSoy",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898380410389.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821982",
    "nome": "Salgadinho Cheetos Crunchy Super Cheddar 78g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821982.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000395583",
    "nome": "Salgadinho de Milho Sabor Queijo QUALITÁ 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000395583.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817343",
    "nome": "Salgadinho De Milho Wasabi Doritos Pacote 78G",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817343.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818418",
    "nome": "Salgadinho de Trigo Cebola Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818418.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821968",
    "nome": "Salgadinho Cheetos Crunchy White Cheddar 78g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821968.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817084",
    "nome": "Salgadinho de Trigo Queijo Torcida Pacote 100g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817084.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817091",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 100G",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817091.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821739",
    "nome": "Salgadinho White Cheddar Popcorners Pacote 57g",
    "marca": "Popcorners",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821739.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004006499",
    "nome": "Salgadinho de Batata Queijo Pringles Tubo 120g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004006499.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820190",
    "nome": "Salgadinho Costelinha Com Limão Torcida Jr. 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820190.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902702",
    "nome": "Salgadinho De Milho Lobits Requeijao 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902702.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818401",
    "nome": "Salgadinho de Trigo Calabresa Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818401.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818425",
    "nome": "Salgadinho de Trigo Churrasco Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818425.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819989",
    "nome": "Salgadinho de Milho de Cheddar Cheetos Patas 61G",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819989.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000395620",
    "nome": "Salgadinho de Trigo de Bacon Qualitá Pacote 100g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000395620.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898380410365",
    "nome": "Salgadinho de Soja GoodSoy Sabor Ervas Finas 25g",
    "marca": "GoodSoy",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898380410365.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815929",
    "nome": "Salgadinho De Milho Cool Ranch Doritos Pacote 84G",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815929.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817077",
    "nome": "Salgadinho de Trigo Churrasco Torcida Pacote 100g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817077.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896319800027",
    "nome": "Salgadinho Torrado de Arroz Apimentado OKAKI 100g",
    "marca": "Okaki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896319800027.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815936",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 84G",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815936.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818388",
    "nome": "Salgadinho Costelinha com Limão Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818388.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023189",
    "nome": "Salgadinho de Milho Sabor Queijo YOKITOS Pacote 45g",
    "marca": "Yokitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023189.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840255244",
    "nome": "Salgadinho Doritos Sabor Sweet Chili Elma Chips 55g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840255244.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814595",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 30G",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814595.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815912",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 84G",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815912.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817930",
    "nome": "Salgadinho de Milho Sweet Chili Doritos Pacote 140g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817930.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820145",
    "nome": "Salgadinho de Milho Queijo Nacho Doritos Pacote 45g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820145.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821203",
    "nome": "Salgadinho Bola Queijo Suiço Elma Chips Cheetos 37g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821203.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898380410662",
    "nome": "Salgadinho de Soja GoodSoy Legumes Sabor Queijo 25g",
    "marca": "GoodSoy",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898380410662.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840253745",
    "nome": "Salgadinho Doritos Sabor Queijo Nacho Elma Chips 55g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840253745.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814540",
    "nome": "Salgadinho de Milho Queijo Nacho Doritos Pacote 140g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814540.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000395613",
    "nome": "Salgadinho de Milho Sabor Cebola QUALITÁ Pacote 100g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000395613.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023271",
    "nome": "Salgadinho de Milho Queijo Tubinho Yokitos Pacote 45g",
    "marca": "Yokitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023271.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815943",
    "nome": "Salgadinho De Milho Original Doritos Dippas Pacote 84G",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815943.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816940",
    "nome": "Salgadinho de Trigo Pastel de Carne Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816940.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819477",
    "nome": "Salgadinho de Milho Queijo Cheddar Cheetos TikTok 75 g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819477.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815134",
    "nome": "Salgadinho De Trigo TORCIDA Pimenta Mexicana Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815134.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816933",
    "nome": "Salgadinho de Trigo Pastel de Queijo Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816933.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817879",
    "nome": "Salgadinho Onda Elma Chips Cheetos Sabor Requeijão 230g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817879.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818432",
    "nome": "Salgadinho de Trigo Pimenta Mexicana Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818432.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896029600726",
    "nome": "Salgadinho a Base de Mix de Nozes Dunorte Nuts Club 50g",
    "marca": "Dunorte",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896029600726.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896319800034",
    "nome": "Salgadinho Torrado de Arroz com Alga Marinha OKAKI 100g",
    "marca": "Okaki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896319800034.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898380411591",
    "nome": "Salgadinho Vegano S/ Glúten Páprica Defumada 35g Belive",
    "marca": "Belive",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898380411591.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817107",
    "nome": "Salgadinho De Trigo Pimenta Mexicana Torcida Pacote 100G",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817107.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898557010367",
    "nome": "Salgadinho Roots To Go Natural Popps Chips de Pipoca 35g",
    "marca": "Roots To Go",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898557010367.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816636",
    "nome": "Salgadinho de Milho Elma Chips Cheetos Onda Requeijão 75g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816636.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816452",
    "nome": "Salgadinho De Milho Queijo Elma Chips Fandangos Pacote 45G",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816452.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817022",
    "nome": "Salgadinho De Trigo Camarão Com Pimenta Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817022.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818463",
    "nome": "Salgadinho de Trigo Camarão com Pimenta Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818463.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819842",
    "nome": "Salgadinho de Trigo Pão de Alho Torcida Churras Pacote 70g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819842.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896496972340",
    "nome": "Salgadinho Orgânico Infantil Mãe Terra Zooreta Cebola 45gr",
    "marca": "Ceboloko",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896496972340.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816339",
    "nome": "Salgadinho De Milho Queijo Elma Chips Fandangos Pacote 140G",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816339.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817909",
    "nome": "Salgadinho de Milho Lua Sabor Queijo Elma Chips Cheetos 40g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817909.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818043",
    "nome": "Salgadinho de Milho Sabor Bacon Elma Chips Pingo Douro 120g",
    "marca": "Pingo Douro",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818043.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896029600023",
    "nome": "Salgadinho a Base de Castanha de Caju Dunorte Nuts Club 50g",
    "marca": "Dunorte",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896029600023.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898380411218",
    "nome": "Salgadinho Palito Batata Doce Assado Tomate Seco 35g Belive",
    "marca": "Belive",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898380411218.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023226",
    "nome": "Salgadinho de Milho Sabor Queijo Rendinha Assado YOKITOS 45g",
    "marca": "Yokitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023226.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816438",
    "nome": "Salgadinho De Milho Presunto Elma Chips Fandangos Pacote 45G",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816438.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818371",
    "nome": "Salgadinho de Milho Presunto Elma Chips Fandangos Pacote 22g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818371.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896029600030",
    "nome": "Salgadinho a Base de Castanha de Caju Dunorte Nuts Club 100g",
    "marca": "Dunorte",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896029600030.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898380411232",
    "nome": "Salgadinho Palito Batata Doce Assado Sabor Frango 35g Belive",
    "marca": "Belive",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898380411232.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898962676271",
    "nome": "Salgadinho De Milho Presunto Elma Chips Fandangos Pacote 90G",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898962676271.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840120214",
    "nome": "Salgadinho de Trigo de Bacon Elma Chips Baconzitos Pacote 55g",
    "marca": "Baconzitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840120214.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816193",
    "nome": "Salgadinho De Milho Presunto Elma Chips Fandangos Pacote 230G",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816193.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816322",
    "nome": "Salgadinho de Milho Presunto Elma Chips Fandangos Pacote 140g",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816322.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821029",
    "nome": "Salgadinho de Milho Bola Queijo Suiço Elma Chips Cheetos 110g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821029.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896029600603",
    "nome": "Salgadinho a Base de Pistache com Casca Dunorte Nuts Club 50g",
    "marca": "Dunorte",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896029600603.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023240",
    "nome": "Salgadinho de Milho Sabor Lua Assado Queijo YOKITOS Pacote 45g",
    "marca": "Yokitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023240.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822941",
    "nome": "Salgadinho De Milho Elma Chips Cebolitos Clássicos Pacote 138g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822941.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023219",
    "nome": "Salgadinho de Milho Conchinha Presunto Yoki Yokitos Pacote 153g",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023219.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817763",
    "nome": "Salgadinho de Milho Lua Parmesão Elma Chips Cheetos Pacote 125g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817763.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071025188",
    "nome": "Salgadinho De Trigo Costelinha Com Limão Torcida Jr. Pacote 70G",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071025188.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023202",
    "nome": "Salgadinho de Milho Sabor Presunto Conchinhas YOKITOS Pacote 54g",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023202.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816254",
    "nome": "Salgadinho De Milho Onda Requeijão Elma Chips Cheetos Pacote 45G",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816254.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816261",
    "nome": "Salgadinho De Milho Onda Requeijão Elma Chips Cheetos Pacote 140G",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816261.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817848",
    "nome": "Salgadinho de Milho Elma Chips Cheetos Mix de Queijos Pacote 115 g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817848.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "11359645095",
    "nome": "Salgadinho Nachos CANTINA MEXICANA com Molho de Salsa Caixa com 150g",
    "marca": "Cantina Mexicana",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/11359645095.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "11359645088",
    "nome": "Salgadinho Nachos CANTINA MEXICANA com Molho de Queijo Caixa com 150g",
    "marca": "Cantina Mexicana",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/11359645088.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816278",
    "nome": "Salgadinho De Milho Tubo Queijo Cheddar Elma Chips Cheetos Pacote 45G",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816278.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818111",
    "nome": "Salgadinho De Milho Tubo Queijo Cheddar Elma Chips Cheetos Pacote 39G",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818111.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821951",
    "nome": "Salgadinho De Milho Crunchy White Cheddar Elma Chips Cheetos Pacote 48g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821951.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821975",
    "nome": "Salgadinho De Milho Crunchy Super Cheddar Elma Chips Cheetos Pacote 48g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821975.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896029602607",
    "nome": "Salgadinho a Base de Castanha de Caju Caramelizada Dunorte Sweet Nuts 50g",
    "marca": "Dunorte",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896029602607.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896496972326",
    "nome": "Salgadinho de Milho e Arroz 75% Integral Assado Orgânico Pizza Mãe Terra Zooreta 45g",
    "marca": "Mãe Terra",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896496972326.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896319800072",
    "nome": "Salgadinho Okaki",
    "marca": "Okaki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896319800072.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897164400226",
    "nome": "Salgadinho Bacoloko",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897164400226.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840187719",
    "nome": "Salgadinho Cebolitos",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840187719.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840255548",
    "nome": "Salgadinho Cebolitos",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840255548.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17897358901536",
    "nome": "Salgadinho Cristal B",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17897358901536.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898633332083",
    "nome": "Salgadinho Bacon 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898633332083.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840194017",
    "nome": "Salgadinho Cebolitos",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840194017.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840228040",
    "nome": "Salgadinho Cebolitos",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840228040.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840234447",
    "nome": "Salgadinho Cebolitos",
    "marca": "Cebolitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840234447.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033452",
    "nome": "Salgadinho Fabitos C",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033452.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033476",
    "nome": "Salgadinho Fabitos P",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033476.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481055683",
    "nome": "Salgadinho Fabitos C",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481055683.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481055690",
    "nome": "Salgadinho Fabitos P",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481055690.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481056307",
    "nome": "Salgadinho Fabitos C",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481056307.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481056338",
    "nome": "Salgadinho Fabitos C",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481056338.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897358901775",
    "nome": "Salgadinho Cristal B",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897358901775.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898633332086",
    "nome": "Salgadinho Bacon 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898633332086.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840255449",
    "nome": "Salgadinho Baconzitos",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840255449.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130472",
    "nome": "Salgadinho Fofura Mix",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130472.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840000004",
    "nome": "Salgadinho Baconzitos",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840000004.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896053552015",
    "nome": "Salgadinho Tiba Bacon",
    "marca": "Tiba",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896053552015.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130475",
    "nome": "Salgadinho Fofura Mix",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130475.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27898943316176",
    "nome": "Salgadinho.agora Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27898943316176.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033469",
    "nome": "Salgadinho Fabitos 80g",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033469.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033490",
    "nome": "Salgadinho Pelet Bacon",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033490.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481056314",
    "nome": "Salgadinho Fabitos 80g",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481056314.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898943316172",
    "nome": "Salgadinho.agora Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898943316172.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17891091061984",
    "nome": "Salgadinho Pippos Bacon",
    "marca": "Pippos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17891091061984.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27898943316183",
    "nome": "Salgadinho Agora Cebola",
    "marca": "Salgadinho Agora",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27898943316183.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091061987",
    "nome": "Salgadinho Pippos Bacon",
    "marca": "Pippos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891091061987.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897358901515",
    "nome": "Salgadinho Cristal Plus",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897358901515.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826670",
    "nome": "Salgadinho Lobits Pizza",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826670.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826687",
    "nome": "Salgadinho Lobits Pizza",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826687.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898943316189",
    "nome": "Salgadinho Agora Cebola",
    "marca": "Salgadinho Agora",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898943316189.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820425",
    "nome": "Salgadinho Fofura Queijo",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820425.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896039010246",
    "nome": "Salgadinho Ebicen Cebola",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896039010246.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898021635505",
    "nome": "Salgadinho Keleck Batata",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898021635505.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27896341103299",
    "nome": "Salgadinho Fofura Queijo",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27896341103299.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27898021635502",
    "nome": "Salgadinho Keleck Batata",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27898021635502.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "47896341101688",
    "nome": "Salgadinho.torcida Pizza",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/47896341101688.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039010218",
    "nome": "Salgadinho Ebicen Cebola",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896039010218.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039010249",
    "nome": "Salgadinho Ebicen Cebola",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896039010249.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896245709319",
    "nome": "Salgadinho Micos Galinha",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896245709319.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896319800058",
    "nome": "Salgadinho Okaki Simples",
    "marca": "Okaki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896319800058.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103295",
    "nome": "Salgadinho Fofura Queijo",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103295.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341106029",
    "nome": "Salgadinho Fofura Queijo",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341106029.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130703",
    "nome": "Salgadinho Bacon Torcida",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130703.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130710",
    "nome": "Salgadinho.torcida Pizza",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130710.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499903075",
    "nome": "Salgadinho Queijo Lobits",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499903075.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021635508",
    "nome": "Salgadinho Keleck Batata",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021635508.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898296430068",
    "nome": "Salgadinho Tittos Queijo",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898296430068.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898918533108",
    "nome": "Salgadinho Bacon Fritz 7",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898918533108.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826205",
    "nome": "Salgadinho Lobits Cebola",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826205.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826236",
    "nome": "Salgadinho Lobits Queijo",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826236.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826250",
    "nome": "Salgadinho Lobits Cebola",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826250.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130748",
    "nome": "Salgadinho Torcida Queijo",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130748.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898931140465",
    "nome": "Salgadinho De Trigo Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898931140465.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27898943316190",
    "nome": "Salgadinho Agora Romanato",
    "marca": "Roma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27898943316190.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "31146045747",
    "nome": "Salgadinho Nong Shim Lula",
    "marca": "Nongshim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/31146045747.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "31146215768",
    "nome": "Salgadinho Nong Shim Lula",
    "marca": "Nongshim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/31146215768.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "31146701087",
    "nome": "Salgadinho Nong Shim Lula",
    "marca": "Nongshim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/31146701087.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "47896341101312",
    "nome": "Salgadinho Torcida Queijo",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/47896341101312.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039010119",
    "nome": "Salgadinho Ebicen Camarao",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896039010119.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039010140",
    "nome": "Salgadinho Ebicen Camarao",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896039010140.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039015121",
    "nome": "Salgadinho Ebicen Camarao",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7896039015121.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341101314",
    "nome": "Salgadinho Torcida Queijo",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341101314.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341101796",
    "nome": "Salgadinho Torcida Cebola",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341101796.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130741",
    "nome": "Salgadinho Torcida Queijo",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130741.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898070385843",
    "nome": "Salgadinho Churrasco 150g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7898070385843.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898931140468",
    "nome": "Salgadinho De Trigo Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898931140468.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898943316196",
    "nome": "Salgadinho Agora Romanato",
    "marca": "Roma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898943316196.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840821170",
    "nome": "Salgadinho Cheetos Lua 40g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840821170.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898931140489",
    "nome": "Salgadinho De Milho Cebola",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898931140489.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4903614200742",
    "nome": "Salgadinho Wakabato Ikakko",
    "marca": "Afg",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4903614200742.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891048071205",
    "nome": "Salgadinho Coquetel Oetker",
    "marca": "Dr. Oetker",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891048071205.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821173",
    "nome": "Salgadinho Cheetos Lua 40g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821173.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902528",
    "nome": "Salgadinho Lobits Presunto",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902528.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021633054",
    "nome": "Salgadinho Keleck Presunto",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021633054.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898931140482",
    "nome": "Salgadinho De Milho Cebola",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898931140482.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826229",
    "nome": "Salgadinho Lobits Presunto",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826229.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826274",
    "nome": "Salgadinho Lobits Presunto",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826274.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17891091061595",
    "nome": "Salgadinho Pippos Pizza 60g",
    "marca": "Pippos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17891091061595.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840234246",
    "nome": "Salgadinho Fandangos Queijo",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840234246.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840256040",
    "nome": "Salgadinho Fandangos Queijo",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840256040.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091061598",
    "nome": "Salgadinho Pippos Pizza 60g",
    "marca": "Pippos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891091061598.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840207243",
    "nome": "Salgadinho Fandangos Queijo",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840207243.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840222949",
    "nome": "Salgadinho Fandangos Queijo",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840222949.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840234041",
    "nome": "Salgadinho Fandangos Queijo",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840234041.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840234249",
    "nome": "Salgadinho Fandangos Queijo",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840234249.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902511",
    "nome": "Salgadinho Lobits Churrasco",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902511.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021636000",
    "nome": "Salgadinho Keleck Max Pizza",
    "marca": "Keleck",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021636000.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021636024",
    "nome": "Salgadinho Keleck Max Bacon",
    "marca": "Keleck",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021636024.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898249760136",
    "nome": "Salgadinho Bacon Real 70grs",
    "marca": "Real Biscoitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898249760136.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826212",
    "nome": "Salgadinho Lobits Churrasco",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826212.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826267",
    "nome": "Salgadinho Lobits Churrasco",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826267.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898931140496",
    "nome": "Salgadinho De Milho Presunto",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898931140496.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7804630010254",
    "nome": "Salgadinho De Batata Natural",
    "marca": "Tika Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7804630010254.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091061826",
    "nome": "Salgadinho Pippos Milho 30 g",
    "marca": "São Braz",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891091061826.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341101284",
    "nome": "Salgadinho Torcida Big Bacon",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7896341101284.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033339",
    "nome": "Salgadinho Fabitos 90g Bacon",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033339.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033360",
    "nome": "Salgadinho Fabitos 90g Pizza",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033360.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499900562",
    "nome": "Salgadinho Tira Teima Galeto",
    "marca": "Tira Teima",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499900562.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897358901591",
    "nome": "Salgadinho Cristal Pizza 50g",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897358901591.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898931140499",
    "nome": "Salgadinho De Milho Presunto",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898931140499.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896039030565",
    "nome": "Salgadinho Glico Snack Queijo",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896039030565.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896071025192",
    "nome": "Salgadinho Lucky Penta Cebola",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896071025192.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896071025222",
    "nome": "Salgadinho Lucky Penta Queijo",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896071025222.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898937826899",
    "nome": "Salgadinho Lobits 100g Cebola",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898937826899.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898944639383",
    "nome": "Salgadinho Trigo Fritop Bacon",
    "marca": "Fritop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898944639383.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "37896039030606",
    "nome": "Salgadinho Ebicen 200g Cebola",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/37896039030606.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840138912",
    "nome": "Salgadinho Fandangos Presunto",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840138912.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840201142",
    "nome": "Salgadinho Fandangos Presunto",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840201142.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840207144",
    "nome": "Salgadinho Fandangos Presunto",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840207144.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840233945",
    "nome": "Salgadinho Fandangos Presunto",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840233945.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815257",
    "nome": "Salgadinho Ruffles Queijo 41g",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815257.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820077",
    "nome": "Salgadinho Doritos Pizza 140g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820077.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039030568",
    "nome": "Salgadinho Glico Snack Queijo",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896039030568.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039030605",
    "nome": "Salgadinho Ebicen 200g Cebola",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896039030605.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896221402456",
    "nome": "Salgadinho Kro Requeijao 100g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896221402456.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341101826",
    "nome": "Salgadinho Torcida Jr. Queijo",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341101826.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103660",
    "nome": "Salgadinho Lucky Penta Cebola",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103660.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103714",
    "nome": "Salgadinho Lucky Penta Queijo",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103714.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103721",
    "nome": "Salgadinho Lucky Penta Cebola",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103721.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033346",
    "nome": "Salgadinho Fabitos 90g Queijo",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033346.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033353",
    "nome": "Salgadinho Fabitos 90g Cebola",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033353.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499901392",
    "nome": "Salgadinho Lobits 100g Cebola",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499901392.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115103114",
    "nome": "Salgadinho Amendupa Calabresa",
    "marca": "Amendupã",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115103114.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826892",
    "nome": "Salgadinho Lobits 100g Cebola",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826892.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826922",
    "nome": "Salgadinho Lobits 100g Queijo",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826922.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898944639386",
    "nome": "Salgadinho Trigo Fritop Bacon",
    "marca": "Fritop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898944639386.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17891203060041",
    "nome": "Salgadinho Panco Bisnack Pizza",
    "marca": "Panco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17891203060041.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840221741",
    "nome": "Salgadinho Doritos Sweet Chili",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840221741.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896039012110",
    "nome": "Salgadinho Ebicen Pim Mexicana",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896039012110.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896805341413",
    "nome": "Salgadinho Selecao 100g Queijo",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896805341413.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898021636014",
    "nome": "Salgadinho Keleck 165gr Cebola",
    "marca": "Keleck",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898021636014.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "37896039030590",
    "nome": "Salgadinho Ebicen 200g Camarao",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/37896039030590.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4906040000146",
    "nome": "Salgadinho Mixed Bean Crackers",
    "marca": "Imoto",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/4906040000146.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091061765",
    "nome": "Salgadinho Pippos Queijo 200 g",
    "marca": "São Braz",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891091061765.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891203060044",
    "nome": "Salgadinho Panco Bisnack Pizza",
    "marca": "Panco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891203060044.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840194512",
    "nome": "Salgadinho Zambinos Elme Chips",
    "marca": "Pepsico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840194512.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840221744",
    "nome": "Salgadinho Doritos Sweet Chili",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840221744.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039012113",
    "nome": "Salgadinho Ebicen Pim Mexicana",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896039012113.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039030582",
    "nome": "Salgadinho Camarao 500g Ebicen",
    "marca": "Ebicen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896039030582.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896039030599",
    "nome": "Salgadinho Ebicen 200g Camarao",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896039030599.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896356275123",
    "nome": "Salgadinho Lula Crek 53g Bacon",
    "marca": "Creks",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896356275123.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805341416",
    "nome": "Salgadinho Selecao 100g Queijo",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805341416.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897546001096",
    "nome": "Salgadinho Salcique Bacon 90gr",
    "marca": "Salcique",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897546001096.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897546003007",
    "nome": "Salgadinho Salcique Bacon 90gr",
    "marca": "Salcique",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897546003007.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021636017",
    "nome": "Salgadinho Keleck 165gr Cebola",
    "marca": "Keleck",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021636017.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898041790775",
    "nome": "Salgadinho Vale Do Prata Pimen",
    "marca": "Vale Do Prata",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7898041790775.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898091150314",
    "nome": "Salgadinho Boca Do Forno Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7898091150314.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898944639249",
    "nome": "Salgadinho Fritop Tuigui Bacon",
    "marca": "Fritop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898944639249.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8480017098283",
    "nome": "Salgadinho Dia Sabor Bacon 50g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/8480017098283.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "14750127000546",
    "nome": "Salgadinho Bacon Long Chips 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/14750127000546.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "14750127300691",
    "nome": "Salgadinho Bacon Long Chips 75g",
    "marca": "Long",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/14750127300691.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840221840",
    "nome": "Salgadinho Doritos Queijo Nacho",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840221840.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896071025215",
    "nome": "Salgadinho Lucky Milho Presunto",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896071025215.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341103773",
    "nome": "Salgadinho Lucky Milho Presunto",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341103773.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898218030014",
    "nome": "Salgadinho Garytos 120g Sequoia",
    "marca": "Garytos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898218030014.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127000549",
    "nome": "Salgadinho Bacon Long Chips 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127000549.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4903614940020",
    "nome": "Salgadinho Wakabato Mix Cracker",
    "marca": "Mix",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4903614940020.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "77544008281",
    "nome": "Salgadinho Bissli Osem Defumado",
    "marca": "Bis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/77544008281.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840186814",
    "nome": "Salgadinho Doritos Queijo Nacho",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840186814.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840200145",
    "nome": "Salgadinho Doritos Queijo Nacho",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840200145.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840207045",
    "nome": "Salgadinho Cheetos Lua Parmesão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840207045.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840221843",
    "nome": "Salgadinho Doritos Queijo Nacho",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840221843.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840227449",
    "nome": "Salgadinho Cheetos Lua Parmesão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840227449.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840229740",
    "nome": "Salgadinho Doritos Queijo Nacho",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840229740.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840230944",
    "nome": "Salgadinho Lanchinho Elma Chips",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840230944.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840233747",
    "nome": "Salgadinho Cheetos Lua Parmesão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840233747.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896245708909",
    "nome": "Salgadinho Micos Presunto 175gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896245708909.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103776",
    "nome": "Salgadinho Lucky Milho Presunto",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103776.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896356275130",
    "nome": "Salgadinho Lula Crek 53g Queijo",
    "marca": "Lula Crek",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896356275130.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033391",
    "nome": "Salgadinho Fabitos 90g Presunto",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033391.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115106238",
    "nome": "Salgadinho Snack Amendupa Pizza",
    "marca": "Amendupã",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115106238.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115106245",
    "nome": "Salgadinho Snack Amendupa Bacon",
    "marca": "Amendupã",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115106245.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021633085",
    "nome": "Salgadinho Keleck Churrasco 55g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021633085.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021636093",
    "nome": "Salgadinho Keleck Max Churrasco",
    "marca": "Keleck",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021636093.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021638011",
    "nome": "Salgadinho Keleck Requeijao 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021638011.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898218030017",
    "nome": "Salgadinho Garytos 120g Sequoia",
    "marca": "Garytos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898218030017.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826243",
    "nome": "Salgadinho Lobits Queijo Palito",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826243.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826298",
    "nome": "Salgadinho Lobits Queijo Palito",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826298.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826335",
    "nome": "Salgadinho Lobits Queijo Palito",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826335.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826373",
    "nome": "Salgadinho Lobits Queijo Palito",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826373.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826915",
    "nome": "Salgadinho Lobits 100g Presunto",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826915.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8480017098290",
    "nome": "Salgadinho Dia Sabor Cebola 50g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/8480017098290.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8480017098313",
    "nome": "Salgadinho Dia Sabor Queijo 50g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/8480017098313.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8801043007344",
    "nome": "Salgadinho Nong Shim Cebola Hot",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/8801043007344.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8801043007351",
    "nome": "Salgadinho Nong Shim Cebola Hot",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/8801043007351.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "14750127000393",
    "nome": "Salgadinho Cheese Long Chips 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/14750127000393.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820432",
    "nome": "Salgadinho Fofura Presunto 100gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820432.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896071025208",
    "nome": "Salgadinho Lucky Milho Churrasco",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896071025208.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127000396",
    "nome": "Salgadinho Cheese Long Chips 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127000396.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4901313067505",
    "nome": "Salgadinho Kameda Kakinotane 100",
    "marca": "Kameda Seika",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4901313067505.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891203059253",
    "nome": "Salgadinho Panquito Cebola/salsa",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891203059253.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814403",
    "nome": "Salgadinho Cebolitos E.chips 31g",
    "marca": "Cebolitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814403.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896245708992",
    "nome": "Salgadinho Peticitos Queijo 40gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896245708992.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896308078239",
    "nome": "Salgadinho Pipoteca Cebola 110 G",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7896308078239.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341101819",
    "nome": "Salgadinho Torcida Jr. Churrasco",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341101819.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103349",
    "nome": "Salgadinho Fofura Presunto 100gr",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103349.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103707",
    "nome": "Salgadinho Lucky Milho Churrasco",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103707.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103745",
    "nome": "Salgadinho Lucky Milho Churrasco",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103745.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481056550",
    "nome": "Salgadinho Fabitos 90g Churrasco",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481056550.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499900951",
    "nome": "Salgadinho Tira Teima 1kg Galeto",
    "marca": "Tira Teima",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499900951.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499900982",
    "nome": "Salgadinho Tira Teima 1kg Queijo",
    "marca": "Tira Teima",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7896499900982.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021636055",
    "nome": "Salgadinho Keleck 165gr Presunto",
    "marca": "Keleck",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021636055.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898091150307",
    "nome": "Salgadinho Boca Do Forno Pimenta",
    "marca": "Piment",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7898091150307.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826908",
    "nome": "Salgadinho Lobits 100g Churrasco",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826908.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840227644",
    "nome": "Salgadinho Cheetos Onda Requeijão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840227644.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840247147",
    "nome": "Salgadinho Cheetos Mix De Queijos",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840247147.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816251",
    "nome": "Salgadinho Cheetos Onda Requeijão",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816251.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819139",
    "nome": "Salgadinho Fofura Requeijao 100gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819139.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820418",
    "nome": "Salgadinho Fofura Requeijao 100gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820418.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130540",
    "nome": "Salgadinho Torcida Batata Natural",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130540.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898520574220",
    "nome": "Salgadinho Trigo Nutriminas Bacon",
    "marca": "Nutriminas",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898520574220.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4901326012073",
    "nome": "Salgadinho Sabor Lula Kasugai 63g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4901326012073.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091061789",
    "nome": "Salgadinho Pippos Churrasco 200 g",
    "marca": "São Braz",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891091061789.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840207946",
    "nome": "Salgadinho Cheetos Onda Requeijão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840207946.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840213640",
    "nome": "Salgadinho Cheetos Onda Requeijão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840213640.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840219949",
    "nome": "Salgadinho Cheetos Onda Requeijão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840219949.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840222543",
    "nome": "Salgadinho Cheetos Onda Requeijão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840222543.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840227647",
    "nome": "Salgadinho Cheetos Onda Requeijão",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840227647.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840247140",
    "nome": "Salgadinho Cheetos Mix De Queijos",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840247140.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821166",
    "nome": "Salgadinho Fandangos 37g Presunto",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821166.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7893595542863",
    "nome": "Salgadinho Fritza Sabor Bacon 60g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7893595542863.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103387",
    "nome": "Salgadinho Fofura Churrasco 100gr",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103387.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103790",
    "nome": "Salgadinho Fofura Requeijao 100gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103790.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130543",
    "nome": "Salgadinho Torcida Batata Natural",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130543.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033384",
    "nome": "Salgadinho Fabitos 100g Calabresa",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033384.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481056796",
    "nome": "Salgadinho Fabitos Bacon Bits 58g",
    "marca": "Bacon Bits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481056796.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481056819",
    "nome": "Salgadinho Fabitos Bacon Bits 58g",
    "marca": "Bacon Bits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481056819.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902115",
    "nome": "Salgadinho Lobits 90g Cebola 2062",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902115.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896633800857",
    "nome": "Salgadinho Miliopa Churrasco 140g",
    "marca": "Mili",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896633800857.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021636048",
    "nome": "Salgadinho Keleck 165gr Requeijao",
    "marca": "Keleck",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021636048.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898520574223",
    "nome": "Salgadinho Trigo Nutriminas Bacon",
    "marca": "Nutriminas",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898520574223.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898908893182",
    "nome": "Salgadinho Mira Big B Batata Onda",
    "marca": "Onda",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898908893182.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8480017098306",
    "nome": "Salgadinho Dia Sabor Presunto 50g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/8480017098306.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8710873002880",
    "nome": "Salgadinho Queijo Buitemann Gouda",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/8710873002880.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "14750127000515",
    "nome": "Salgadinho Original Long Chips 75g",
    "marca": "Original",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/14750127000515.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840255241",
    "nome": "Salgadinho Sweet Chili Doritos 53g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840255241.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17897358901598",
    "nome": "Salgadinho Sabor Pizza Cristal 40g",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17897358901598.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701300150",
    "nome": "Salgadinho Casa De Mae Queijo 100g",
    "marca": "Casa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701300150.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701302062",
    "nome": "Salgadinho De Milho Sabor Presunto",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701302062.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898967127058",
    "nome": "Salgadinho Zumbitos Churrasco 50 G",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898967127058.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127000518",
    "nome": "Salgadinho Original Long Chips 75g",
    "marca": "Original",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127000518.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817152",
    "nome": "Salgadinho Doritos Flamin Hot 84 g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817152.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817206",
    "nome": "Salgadinho Cheetos Flamin Hot 90 g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817206.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819583",
    "nome": "Salgadinho Sweet Chili Doritos 53g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819583.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481022340",
    "nome": "Salgadinho Fabitos Bacon Bits 180g",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481022340.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902092",
    "nome": "Salgadinho Lobits Super 90g Queijo",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902092.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896950800080",
    "nome": "Salgadinho Pepe Legal Bacon 85 Grs",
    "marca": "Pepe Legal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896950800080.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897358901799",
    "nome": "Salgadinho Sabor Pizza Cristal 40g",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897358901799.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701300153",
    "nome": "Salgadinho Casa De Mae Queijo 100g",
    "marca": "Casa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701300153.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701302065",
    "nome": "Salgadinho De Milho Sabor Presunto",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701302065.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898967127051",
    "nome": "Salgadinho Zumbitos Churrasco 50 G",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898967127051.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17891091061762",
    "nome": "Salgadinho Acima De 40g Mais Barato",
    "marca": "Pippos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17891091061762.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840234543",
    "nome": "Salgadinho E/chips Cheetos Av Pizza",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840234543.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814721",
    "nome": "Salgadinho Elma Chips Manix Japones",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814721.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896805300717",
    "nome": "Salgadinho De Trigo Top Sabor Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896805300717.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17897358901574",
    "nome": "Salgadinho Sabor Cebola Cristal 40g",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17897358901574.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898270967037",
    "nome": "Salgadinho Sabor Bacon 80g Mandiopa",
    "marca": "Mandiopa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898270967037.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701303236",
    "nome": "Salgadinho 200g Casademae Requeijao",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701303236.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898961883080",
    "nome": "Salgadinho Sabor Arte 40g Bacon Und",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898961883080.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27896341101424",
    "nome": "Salgadinho Torcida Big Cebola 500gr",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27896341101424.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840145026",
    "nome": "Salgadinho Elma Chips Manix Japones",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840145026.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840234348",
    "nome": "Salgadinho Cebolitos Elma Chips 60g",
    "marca": "Cebolitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840234348.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840234546",
    "nome": "Salgadinho E/chips Cheetos Av Pizza",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840234546.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817060",
    "nome": "Salgadinho Torcida Flamin Hot 100 g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817060.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896245708886",
    "nome": "Salgadinho De Milho Aanelittos 165g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896245708886.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499901071",
    "nome": "Salgadinho Tira Teima 1kg Calabreza",
    "marca": "Tira Teima",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499901071.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896775101430",
    "nome": "Salgadinho Salgaditos Presunto 100g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896775101430.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805300710",
    "nome": "Salgadinho De Trigo Top Sabor Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805300710.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115103107",
    "nome": "Salgadinho Sabor Pizza Amendupa 50g",
    "marca": "Amendupa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115103107.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115106184",
    "nome": "Salgadinho Snack Amendupa Churrasco",
    "marca": "Amendupã",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115106184.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897261351308",
    "nome": "Salgadinho Home Made Karinto Cebola",
    "marca": "Home Made",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7897261351308.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897358901744",
    "nome": "Salgadinho Sabor Cebola Cristal 40g",
    "marca": "Cristal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897358901744.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897839800023",
    "nome": "Salgadinho Batata Creky Pacote 30 g",
    "marca": "Batatelle",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897839800023.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898692510173",
    "nome": "Salgadinho Top Snacks 51g Provolone",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898692510173.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701303239",
    "nome": "Salgadinho 200g Casademae Requeijao",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701303239.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898908893274",
    "nome": "Salgadinho Mira Big B Batata Cebola",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898908893274.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898961883083",
    "nome": "Salgadinho Sabor Arte 40g Bacon Und",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898961883083.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8710873002804",
    "nome": "Salgadinho Queijo Buitemann Gruyere",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/8710873002804.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "9002859043208",
    "nome": "Salgadinho Pretzels Mini Gunz 300gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/9002859043208.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896336001480",
    "nome": "Salgadinho Troféu Santa Helena Bacon",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896336001480.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896336001527",
    "nome": "Salgadinho Troféu Santa Helena Pizza",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896336001527.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896805338383",
    "nome": "Salgadinho Selecao 100g Cebola/salsa",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896805338383.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4710174107196",
    "nome": "Salgadinho Ervilha Com Mostarda 240g",
    "marca": "Triko Foods",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4710174107196.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840201845",
    "nome": "Salgadinho Cheetos Bola Queijo Suíço",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840201845.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840222642",
    "nome": "Salgadinho Cheetos Bola Queijo Suíço",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840222642.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815011",
    "nome": "Salgadinho Elma Chips Cebolitos 21 G",
    "marca": "Cebolitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7892840815011.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071022132",
    "nome": "Salgadinho Skiny 60gr Concha Natural",
    "marca": "Mabel",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7896071022132.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896308078772",
    "nome": "Salgadinho Trigo Bacon 200g Pipoteca",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896308078772.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896319800089",
    "nome": "Salgadinho Okaki Torr/arroz/gergelim",
    "marca": "Okaki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896319800089.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896336001483",
    "nome": "Salgadinho Troféu Santa Helena Bacon",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896336001483.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896336001520",
    "nome": "Salgadinho Troféu Santa Helena Pizza",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896336001520.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341101536",
    "nome": "Salgadinho Torcida Big Camarao 500gr",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7896341101536.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130260",
    "nome": "Salgadinho Torcida Sabor Cebola 120g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130260.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499901958",
    "nome": "Salgadinho Lobits Max Qjo Palito 70g",
    "marca": "Max",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499901958.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902108",
    "nome": "Salgadinho Lobits 90g Requeijao 2061",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902108.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902122",
    "nome": "Salgadinho Lobits 90g Churrasco 2063",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902122.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902153",
    "nome": "Salgadinho Lobits 90g Requeijao 2061",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902153.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902245",
    "nome": "Salgadinho Lobits Max Qjo Palito 70g",
    "marca": "Max",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902245.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805338386",
    "nome": "Salgadinho Selecao 100g Cebola/salsa",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805338386.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897014200112",
    "nome": "Salgadinho Bacon Franbert Pacote 70g",
    "marca": "Franbert",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897014200112.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115103121",
    "nome": "Salgadinho Sabor Cebola Amendupa 50g",
    "marca": "Amendupa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115103121.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115103152",
    "nome": "Salgadinho Snacks Amendupa Bacom 50g",
    "marca": "Amend",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7897115103152.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115103169",
    "nome": "Salgadinho Reizinho Snack Queijo 50g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7897115103169.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897261351209",
    "nome": "Salgadinho Home Made Karinto Pimenta",
    "marca": "Home Made",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7897261351209.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898633333984",
    "nome": "Salgadinho Sabor Queijo Romanato 70g",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7898633333984.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898908893243",
    "nome": "Salgadinho Mira Big B Spiga Presunto",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898908893243.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8801043007368",
    "nome": "Salgadinho Shrimp Chips Nongshim 75g",
    "marca": "Nongshim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/8801043007368.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819689",
    "nome": "Salgadinho Cheetos 45g Onda Requeijao",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819689.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896336001473",
    "nome": "Salgadinho Troféu Santa Helena Queijo",
    "marca": "SANTA HELENA",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896336001473.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "50539901277402",
    "nome": "Salgadinho De Batata Sour Cream Onion",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/50539901277402.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "77544008267",
    "nome": "Salgadinho Bissli Osem Churrasco 70gr",
    "marca": "Bis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/77544008267.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7804630010261",
    "nome": "Salgadinho De Batata Doce E Beterraba",
    "marca": "Tika Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7804630010261.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095031337",
    "nome": "Salgadinho Sabor Presunto Yokitos 39g",
    "marca": "Goiabeiras",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095031337.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814496",
    "nome": "Salgadinho Cheetos 42g Onda Requeijao",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814496.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821197",
    "nome": "Salgadinho Cheetos 45g Onda Requeijao",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821197.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896245708893",
    "nome": "Salgadinho Micos Kids Requeijao 175gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896245708893.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896336001476",
    "nome": "Salgadinho Troféu Santa Helena Queijo",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896336001476.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341135012",
    "nome": "Salgadinho.torcida Tortilla Qjo.nacho",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341135012.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481033377",
    "nome": "Salgadinho Bolinha Fabitos 100g Bacon",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896481033377.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902207",
    "nome": "Salgadinho Lobits Super 90g Requeijao",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902207.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898171341366",
    "nome": "Salgadinho Trigo Biscoitone 60g Bacon",
    "marca": "Bis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898171341366.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898908893113",
    "nome": "Salgadinho Mira Snack Storm Requeijao",
    "marca": "Storm",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898908893113.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898943316202",
    "nome": "Salgadinho Pimenta Mexicana Agora 50g",
    "marca": "Salgadinho Agora",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898943316202.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898943316325",
    "nome": "Salgadinho Romanato T Monica Presunto",
    "marca": "Roma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7898943316325.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899367000586",
    "nome": "Salgadinho De Calabresa Forfitos 120g",
    "marca": "Forfit",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899367000586.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17891962007042",
    "nome": "Salgadinho Fritex Snackitos 45g Queijo",
    "marca": "Le Creuset",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17891962007042.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006397",
    "nome": "Salgadinho Cheddar Cheez It Pacote 29g",
    "marca": "Bauducco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006397.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896422001165",
    "nome": "Salgadinho Pratic Leve Snack 90g Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896422001165.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898931140687",
    "nome": "Salgadinho Amavita Sabor Presunto 200g",
    "marca": "Ama",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898931140687.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891000014509",
    "nome": "Salgadinho Fritex Snackitos 45g Queijo",
    "marca": "Le Creuset",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891000014509.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840233846",
    "nome": "Salgadinho Onda Requeijão 160g Cheetos",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840233846.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840244644",
    "nome": "Salgadinho Doritos Power Taco Mexicano",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840244644.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814434",
    "nome": "Salgadinho Doritos E.chips 48g Q Nacho",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814434.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007021",
    "nome": "Salgadinho Snack Cheez It Cheddar 65 g",
    "marca": "Cheez it",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007021.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896245709012",
    "nome": "Salgadinho Trigo Peticitos Picante 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896245709012.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896319800065",
    "nome": "Salgadinho Okaki Torr/arroz/apimentado",
    "marca": "Okaki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896319800065.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896336001490",
    "nome": "Salgadinho Troféu Santa Helena Pimenta",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896336001490.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896422001168",
    "nome": "Salgadinho Pratic Leve Snack 90g Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896422001168.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896966009125",
    "nome": "Salgadinho Top Snacks 65g Cost.c/limao",
    "marca": "Top Snacks",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896966009125.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897400001965",
    "nome": "Salgadinho Jobipos Presunto Iacil 30g.",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897400001965.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897400002016",
    "nome": "Salgadinho Jobipos Presunto Iacil 30g.",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897400002016.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897400002047",
    "nome": "Salgadinho Jobipos Presunto Iacil 30g.",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897400002047.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898046610221",
    "nome": "Salgadinho Pimentinha Rosa Pacote 250g",
    "marca": "Rosa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898046610221.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898046610290",
    "nome": "Salgadinho Pimentinha Rosa Pacote 100g",
    "marca": "Rosa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898046610290.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898931140680",
    "nome": "Salgadinho Amavita Sabor Presunto 200g",
    "marca": "Ama",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898931140680.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898941863036",
    "nome": "Salgadinho Pururuca Frita Guigui 175 g",
    "marca": "Guigui",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898941863036.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898965602819",
    "nome": "Salgadinho S Glu S Lac Solo 45g Cebola",
    "marca": "Solo",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898965602819.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8982000797",
    "nome": "Salgadinho Beigel Pretzel Palito 150gr",
    "marca": "Beigel Beigel",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/8982000797.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006984",
    "nome": "Salgadinho Parmesão Cheez It Pacote 29g",
    "marca": "Bauducco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006984.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896805306009",
    "nome": "Salgadinho Trigo Selecao Queijo Pct 50g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896805306009.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17897546000812",
    "nome": "Salgadinho Batata Ondulada Salcique 40g",
    "marca": "Salcique",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17897546000812.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898021635512",
    "nome": "Salgadinho Keleck Batata Cebola E Salsa",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898021635512.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898021636069",
    "nome": "Salgadinho Milho Keleck Galinha Caipira",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898021636069.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898026321656",
    "nome": "Salgadinho De Milho Pingool 120g Queijo",
    "marca": "Pingoo",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898026321656.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898206181476",
    "nome": "Salgadinho Ovinhos Biscekami Sache 200g",
    "marca": "Bis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898206181476.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701302048",
    "nome": "Salgadinho De Trigo Sabo Bacon Defumado",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701302048.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701302079",
    "nome": "Salgadinho Sabor Bacon Casa De Mãe 100g",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701302079.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27896341101936",
    "nome": "Salgadinho Torcida Big Pimenta Mexicana",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27896341101936.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27898021635519",
    "nome": "Salgadinho Keleck Batata Cebola E Salsa",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27898021635519.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814373",
    "nome": "Salgadinho Fandangos E.chips 44g Queijo",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814373.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814793",
    "nome": "Salgadinho Pingo D&amp;#x27;Ouro Bacon 130g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814793.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004006987",
    "nome": "Salgadinho Parmesão Cheez It Pacote 29g",
    "marca": "Bauducco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004006987.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896308078499",
    "nome": "Salgadinho Cebola Metal 50g 20 Pipoteca",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896308078499.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805306002",
    "nome": "Salgadinho Trigo Selecao Queijo Pct 50g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805306002.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805320404",
    "nome": "Salgadinho Selecao Torresmo C/limao 40g",
    "marca": "Torres",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805320404.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115103077",
    "nome": "Salgadinho Sabor Churrasco Amendupa 50g",
    "marca": "Santa Amalia",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115103077.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115103183",
    "nome": "Salgadinho Amendupa Trigo Calabresa 50g",
    "marca": "Amend",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7897115103183.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897328400109",
    "nome": "Salgadinho Amendoin 300g Bolinha Branca",
    "marca": "Spinelli",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897328400109.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897546000815",
    "nome": "Salgadinho Batata Ondulada Salcique 40g",
    "marca": "Salcique",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897546000815.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897546003519",
    "nome": "Salgadinho Batata Ondulada Salcique 40g",
    "marca": "Salcique",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897546003519.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021635515",
    "nome": "Salgadinho Keleck Batata Cebola E Salsa",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021635515.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898021636062",
    "nome": "Salgadinho Milho Keleck Galinha Caipira",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898021636062.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898026321659",
    "nome": "Salgadinho De Milho Pingool 120g Queijo",
    "marca": "Pingoo",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898026321659.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898206181479",
    "nome": "Salgadinho Ovinhos Biscekami Sache 200g",
    "marca": "Bis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898206181479.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130080",
    "nome": "Salgadinho de Milho Pizza Salsitos 32 g",
    "marca": "Salsitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130080.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701302041",
    "nome": "Salgadinho De Trigo Sabo Bacon Defumado",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701302041.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701302072",
    "nome": "Salgadinho Sabor Bacon Casa De Mãe 100g",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701302072.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898908893021",
    "nome": "Salgadinho Mira Snack Big B Bacon Frito",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898908893021.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898944800106",
    "nome": "Salgadinho Queijo 200g 106 Tia Virginia",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898944800106.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840246546",
    "nome": "Salgadinho Eqlibri Panetini Pão Na Chapa",
    "marca": "EQLIBRI",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840246546.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896499903003",
    "nome": "Salgadinho De Milho Trimais 40g Presunto",
    "marca": "Trim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896499903003.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896805320517",
    "nome": "Salgadinho Selecao Pelet S Calabresa 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896805320517.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896805339397",
    "nome": "Salgadinho Selecao 100g Costelinha/limao",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896805339397.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701303212",
    "nome": "Salgadinho De Trigo Sabor Bacon Defumado",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701303212.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701303229",
    "nome": "Salgadinho De Milho Sabor Cebola E Salsa",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701303229.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898957617026",
    "nome": "Salgadinho.front.tex Mex Qjo Nacho 200gr",
    "marca": "Frontera",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898957617026.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27896319800038",
    "nome": "Salgadinho Okaki Torr/arroz/alga Marinha",
    "marca": "Okaki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27896319800038.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091061659",
    "nome": "Salgadinho Pippos 75gr Queijo Vitaminado",
    "marca": "Pippos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7891091061659.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840246549",
    "nome": "Salgadinho Eqlibri Panetini Pão Na Chapa",
    "marca": "Eqlibri",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840246549.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007007",
    "nome": "Salgadinho Provolone Cheez It Pacote 29g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007007.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007069",
    "nome": "Salgadinho Snack Cheez It Provolone 65 g",
    "marca": "Cheez it",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007069.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896336001469",
    "nome": "Salgadinho Troféu Santa Helena Churrasco",
    "marca": "Santa Helena",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896336001469.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499903020",
    "nome": "Salgadinho De Milho Trimais 40g Presunto",
    "marca": "Trim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499903020.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805320510",
    "nome": "Salgadinho Selecao Pelet S Calabresa 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805320510.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805339390",
    "nome": "Salgadinho Selecao 100g Costelinha/limao",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805339390.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701303215",
    "nome": "Salgadinho De Trigo Sabor Bacon Defumado",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701303215.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701303222",
    "nome": "Salgadinho De Milho Sabor Cebola E Salsa",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701303222.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898965602826",
    "nome": "Salgadinho S Glu S Lac Solo 45g Barbecue",
    "marca": "Solo",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898965602826.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "830757003050",
    "nome": "Salgadinho Meiji Norimiki Arroz Integral",
    "marca": "Mishima",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/830757003050.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "9000050992",
    "nome": "Salgadinho Eqlibri Panetini Pão Na Chapa",
    "marca": "Eqlibri",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/9000050992.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "14750127000409",
    "nome": "Salgadinho Sourcream Onion Long Chips 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/14750127000409.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "14750127000614",
    "nome": "Salgadinho Batata Long Crisps Pimenta 75g",
    "marca": "Long",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/14750127000614.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840251441",
    "nome": "Salgadinho.doritos 100gr Queijo Temperado",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840251441.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004007073",
    "nome": "Salgadinho Provolone Cheez It Pacote 115g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004007073.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896499903010",
    "nome": "Salgadinho De Milho Trimais 40g Churrasco",
    "marca": "Trim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896499903010.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896805320524",
    "nome": "Salgadinho Selecao Pelet S Carne Seca 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896805320524.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127000402",
    "nome": "Salgadinho Sourcream Onion Long Chips 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127000402.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127000617",
    "nome": "Salgadinho Batata Long Crisps Pimenta 75g",
    "marca": "Long",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127000617.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091061901",
    "nome": "Salgadinho Pippos São Braz Churrasco 30 g",
    "marca": "São Braz",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891091061901.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840251444",
    "nome": "Salgadinho.doritos 100gr Queijo Temperado",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840251444.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814366",
    "nome": "Salgadinho Fandangos E.chips 44g Presunto",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814366.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819958",
    "nome": "Salgadinho Sea Salt Popcorners Pacote 85g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819958.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820855",
    "nome": "Salgadinho De Milho Popcorners Pacote 85g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820855.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896245709043",
    "nome": "Salgadinho Trigo Peticitos Calabresa 40gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896245709043.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896308078536",
    "nome": "Salgadinho Manteiga Metal 25g 70 Pipoteca",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896308078536.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499903006",
    "nome": "Salgadinho De Milho Trimais 40g Requeijao",
    "marca": "Trim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499903006.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499903013",
    "nome": "Salgadinho De Milho Trimais 40g Churrasco",
    "marca": "Trim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499903013.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896805320527",
    "nome": "Salgadinho Selecao Pelet S Carne Seca 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896805320527.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896812200058",
    "nome": "Salgadinho De Trigo Bacon Ofir Pacote 40g",
    "marca": "Ofir",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896812200058.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130363",
    "nome": "Salgadinho de Trigo Pizza Delicitos 50 g",
    "marca": "Delicitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130363.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130370",
    "nome": "Salgadinho de Trigo Queijo Delicitos 50 g",
    "marca": "Delicitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130370.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898540920093",
    "nome": "Salgadinho De Trigo Bacon Bisconobre 70gr",
    "marca": "Bisconobre",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898540920093.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896002311745",
    "nome": "Salgadinho De Milho Fuego Takis Pacote 56g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896002311745.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840226343",
    "nome": "Salgadinho Eqlibri Panetini Presunto Parma",
    "marca": "Eqlibri",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840226343.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820275",
    "nome": "Salgadinho De Trigo Cebola Torcida Jr. 38G",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820275.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896002311748",
    "nome": "Salgadinho De Milho Fuego Takis Pacote 56g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896002311748.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896002311779",
    "nome": "Salgadinho De Milho Fuego Takis Pacote 90g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896002311779.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896286892537",
    "nome": "Salgadinho Pellet De Bacon Lin Pacote 130g",
    "marca": "Lin",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896286892537.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896308078819",
    "nome": "Salgadinho De Sour Cream 20x50g / Pipoteca",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896308078819.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499901590",
    "nome": "Salgadinho Tira Teima Junior Churrasco 45g",
    "marca": "Junior",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499901590.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499901637",
    "nome": "Salgadinho Tira Teima Junior Calabresa 45g",
    "marca": "Junior",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499901637.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896812200065",
    "nome": "Salgadinho De Trigo Bacon Ofir Pacote 100g",
    "marca": "Ofir",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896812200065.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898941863111",
    "nome": "Salgadinho Pele Suína Torresmo Guigui 60 g",
    "marca": "Guigui",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898941863111.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899530100020",
    "nome": "Salgadinho de Milho Sabor Queijo Kitos 30g",
    "marca": "Campo Bom",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899530100020.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899530100228",
    "nome": "Salgadinho De Milho Pizza Kitos Pacote 30g",
    "marca": "Kitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899530100228.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896292342702",
    "nome": "Salgadinho Frango Brahma Resenha Pacote 50g",
    "marca": "Brahma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896292342702.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898966369220",
    "nome": "Salgadinho Batata Pimenta Mexicana Race 45g",
    "marca": "Piment",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898966369220.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4560205300801",
    "nome": "Salgadinho Ya Rice Crackres Okaki Salad Sen",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4560205300801.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4935958868197",
    "nome": "Salgadinho Yokattara Surumeiri Ikattara 21g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4935958868197.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816834",
    "nome": "Salgadinho Cheetos E. Chips 42g Bola Queijo",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816834.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818470",
    "nome": "Salgadinho Cebola Elma Chips Cebolitos 190g",
    "marca": "Cebolitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818470.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819484",
    "nome": "Salgadinho de Trigo Torcida Sabor Bacon 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819484.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820442",
    "nome": "Salgadinho de Milho Sabor Cebola Fofura 70g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820442.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896005219973",
    "nome": "Salgadinho Sabor Pimenta Levinho&amp;#x27;s 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896005219973.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896292342705",
    "nome": "Salgadinho Frango Brahma Resenha Pacote 50g",
    "marca": "Brahma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896292342705.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896308078888",
    "nome": "Salgadinho Milho Cornetita 50g 256 Pipoteca",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896308078888.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896481056161",
    "nome": "Salgadinho Batata Ondulada Fabits Sache 45g",
    "marca": "Fabit S",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896481056161.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115106375",
    "nome": "Salgadinho De Trigo Bacon 140g 352 Amendupa",
    "marca": "Amend",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115106375.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898962676288",
    "nome": "Salgadinho Cheetos Onda Sabor Requeijão 90g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898962676288.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898966369223",
    "nome": "Salgadinho Batata Pimenta Mexicana Race 45g",
    "marca": "Piment",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898966369223.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899530100501",
    "nome": "Salgadinho De Milho Queijo Kitos Pacote 40g",
    "marca": "Kitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899530100501.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814165",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814165.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814172",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814172.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816862",
    "nome": "Salgadinho De Trigo Bacon Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816862.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816909",
    "nome": "Salgadinho De Trigo Pizza Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816909.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819023",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819023.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819054",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819054.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819078",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819078.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819115",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819115.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820067",
    "nome": "Salgadinho De Milho Pizza Doritos Pacote 78g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820067.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820449",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820449.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822559",
    "nome": "Salgadinho De Trigo Bacon Torcida Pacote 70g",
    "marca": "TORCIDA",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822559.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840823174",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840823174.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840823211",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 70g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840823211.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896292342719",
    "nome": "Salgadinho Pimenta Brahma Resenha Pacote 50g",
    "marca": "Brahma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896292342719.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896499902662",
    "nome": "Salgadinho De Milho Lobits Queijo 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896499902662.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896499903034",
    "nome": "Salgadinho De Milho Trimais 40g Cebola/salsa",
    "marca": "Trim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896499903034.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898133402347",
    "nome": "Salgadinho Snacks Kari Kari De Trigo Hot 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898133402347.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898206183937",
    "nome": "Salgadinho De Trigo Bolinha Bacon Falex 150g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898206183937.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840236144",
    "nome": "Salgadinho Eqlibri Panetini Tomate Temperado",
    "marca": "Eqlibri",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840236144.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814168",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 90g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814168.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816865",
    "nome": "Salgadinho De Trigo Bacon Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816865.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816902",
    "nome": "Salgadinho De Trigo Pizza Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816902.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819026",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819026.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819057",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819057.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819071",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819071.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819118",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819118.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819491",
    "nome": "Salgadinho De Trigo Bacon Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819491.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820053",
    "nome": "Salgadinho De Milho Pizza Doritos Pacote 48g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820053.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820428",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820428.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822422",
    "nome": "Salgadinho De Trigo Bacon Torcida Pacote 35g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822422.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822552",
    "nome": "Salgadinho De Trigo Bacon Torcida Pacote 60g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822552.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823177",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823177.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823214",
    "nome": "Salgadinho De Milho Queijo Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823214.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472185",
    "nome": "Salgadinho de Trigo Pizza Qualitá Pacote 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472185.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472215",
    "nome": "Salgadinho de Trigo Bacon Qualitá Pacote 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472215.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472246",
    "nome": "Salgadinho de Bacon com Pimenta Qualitá 100g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472246.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896020904083",
    "nome": "Salgadinho De Trigo Bacon Romanha Pacote 50g",
    "marca": "Romanha",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896020904083.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896222211910",
    "nome": "Salgadinho Bacon Bilu Pic Premium Pacote 50g",
    "marca": "Premium",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896222211910.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896222222008",
    "nome": "Salgadinho Pizza Bilu Pic Premium Pacote 50g",
    "marca": "Premium",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896222222008.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896261402423",
    "nome": "Salgadinho.agtal 62gr Milho Crocante Pimenta",
    "marca": "Agtal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896261402423.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896286802352",
    "nome": "Salgadinho De Trigo De Queijo Lin Pacote 50g",
    "marca": "Lin",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896286802352.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896292342712",
    "nome": "Salgadinho Pimenta Brahma Resenha Pacote 50g",
    "marca": "Brahma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896292342712.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103271",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 90g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103271.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341106012",
    "nome": "Salgadinho De Milho Cebola Fofura Pacote 90g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341106012.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902498",
    "nome": "Salgadinho De Milho Lobits Queijo 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902498.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902719",
    "nome": "Salgadinho De Milho Lobits Queijo 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902719.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499903037",
    "nome": "Salgadinho De Milho Trimais 40g Cebola/salsa",
    "marca": "Trim",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499903037.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898046610238",
    "nome": "Salgadinho Bolinha De Bacon Rosa Pacote 250g",
    "marca": "Rosa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898046610238.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898133402340",
    "nome": "Salgadinho Snacks Kari Kari De Trigo Hot 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898133402340.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898206183930",
    "nome": "Salgadinho De Trigo Bolinha Bacon Falex 150g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898206183930.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211132107",
    "nome": "Salgadinho de Trigo Calabresa Delicitos 50 g",
    "marca": "Delicitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211132107.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899367000609",
    "nome": "Salgadinho De Pimenta Mexicana Forfitos 120g",
    "marca": "Forfit",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899367000609.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899530100013",
    "nome": "Salgadinho de milho sabor presunto Kitos 30g",
    "marca": "Kitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899530100013.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "8809059292464",
    "nome": "Salgadinho Hosan Apetitivo De Nori Beer Mate",
    "marca": "Yulo Toys Inc",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/8809059292464.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "9000040702",
    "nome": "Salgadinho Eqlibri Panetini Tomate Temperado",
    "marca": "Eqlibri",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/9000040702.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816879",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816879.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816916",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816916.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816923",
    "nome": "Salgadinho De Trigo Galeto Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816923.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840817340",
    "nome": "Salgadinho De Milho Wasabi Doritos Pacote 78g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840817340.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820074",
    "nome": "Salgadinho De Milho Pizza Doritos Pacote 140g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820074.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820272",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820272.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820340",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820340.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822573",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 70g",
    "marca": "TORCIDA",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822573.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822641",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 70g",
    "marca": "TORCIDA",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822641.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006526",
    "nome": "Salgadinho De Batata Queijo Pringles Lata 43g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006526.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4017100537004",
    "nome": "Salgadinho De Batata Páprica Lorenz Tubo 100g",
    "marca": "Bahlsen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4017100537004.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4901035210418",
    "nome": "Salgadinho De Arroz Hitokuchi Kabuki Age 100g",
    "marca": "Ten-No-Ya",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4901035210418.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814175",
    "nome": "Salgadinho de Milho Cebola Fofura Pacote 90 g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814175.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816872",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816872.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816919",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816919.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816926",
    "nome": "Salgadinho De Trigo Galeto Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816926.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817336",
    "nome": "Salgadinho De Milho Wasabi Doritos Pacote 48g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817336.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818449",
    "nome": "Salgadinho de Trigo Queijo Torcida Pacote 45g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818449.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820435",
    "nome": "Salgadinho de Milho Sabor Presunto Fofura 70g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820435.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822460",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 35g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822460.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822521",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 35g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822521.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822576",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 60g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822576.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822644",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 60g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822644.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822682",
    "nome": "Salgadinho De Trigo Bacon Torcida Pacote 420g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822682.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823252",
    "nome": "Salgadinho De Milho Original Skiny Pacote 35g",
    "marca": "Skiny",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823252.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823269",
    "nome": "Salgadinho De Milho Presunto Skiny Pacote 35g",
    "marca": "Skiny",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823269.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823276",
    "nome": "Salgadinho De Milho Original Skiny Pacote 60g",
    "marca": "Skiny",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823276.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823283",
    "nome": "Salgadinho De Milho Presunto Skiny Pacote 60g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823283.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823290",
    "nome": "Salgadinho De Milho Original Skiny Pacote 35g",
    "marca": "Skiny",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823290.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823306",
    "nome": "Salgadinho De Milho Presunto Skiny Pacote 35g",
    "marca": "Skiny",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823306.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472222",
    "nome": "Salgadinho de Bacon com Barbecue Qualitá 100g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472222.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004006529",
    "nome": "Salgadinho De Batata Queijo Pringles Lata 43g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004006529.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896020904014",
    "nome": "Salgadinho De Trigo Queijo Romanha Pacote 50g",
    "marca": "Romanha",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896020904014.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896020904090",
    "nome": "Salgadinho De Trigo Galeto Romanha Pacote 50g",
    "marca": "Romanha",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896020904090.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896261402409",
    "nome": "Salgadinho.agtal 62gr Milho Crocante Original",
    "marca": "Agtal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896261402409.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896565005375",
    "nome": "Salgadinho Gulão Assado Presunto Fabitos 120g",
    "marca": "Fabitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896565005375.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130042",
    "nome": "Salgadinho De Milho Bacon Salsitos Pacote 32g",
    "marca": "Salsitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130042.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898937826823",
    "nome": "Salgadinho De Milho Lobits Requeijao 10 X 50g",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898937826823.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899530100518",
    "nome": "Salgadinho de Milho Sabor churrasco Kitos 40g",
    "marca": "São Lourenço",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899530100518.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814196",
    "nome": "Salgadinho De Milho Presunto Fofura Pacote 90g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814196.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819030",
    "nome": "Salgadinho De Milho Presunto Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819030.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819092",
    "nome": "Salgadinho De Milho Presunto Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819092.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840823204",
    "nome": "Salgadinho De Milho Presunto Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840823204.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896002302446",
    "nome": "Salgadinho Ondulatas Queijo Suico/ Ervas Finas",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896002302446.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896002369746",
    "nome": "Salgadinho Ondulatas Queijo Suico/ Ervas Finas",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896002369746.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006281",
    "nome": "Salgadinho De Batata Queijo Pringles Tubo 109g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006281.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006496",
    "nome": "Salgadinho De Batata Queijo Pringles Tubo 120g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006496.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896071024980",
    "nome": "Salgadinho De Milho Doritos Rainbow Pacote 55g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896071024980.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896292342733",
    "nome": "Salgadinho Churrasco Brahma Resenha Pacote 50g",
    "marca": "Brahma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896292342733.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130267",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 120g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130267.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130274",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 120g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130274.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896499902631",
    "nome": "Salgadinho De Milho Lobits Presunto 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896499902631.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898133402330",
    "nome": "Salgadinho Snacks Kari Kari De Trigo Bacon 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898133402330.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898701302055",
    "nome": "Salgadinho De Trigo Sabor Costelinha Com Limão",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898701302055.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000849800",
    "nome": "Salgadinho De Batata Queijo Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000849800.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4560205300733",
    "nome": "Salgadinho Ya Rice Crackres Okaki Kaki No Tane",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4560205300733.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "5053990110773",
    "nome": "Salgadinho De Batata Queijo Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/5053990110773.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840251345",
    "nome": "Salgadinho Doritos Elma Chips Jalapeno E Limao",
    "marca": "Rio Master",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840251345.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818517",
    "nome": "Salgadinho de Milho Doritos Rainbow Pacote 55g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818517.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819033",
    "nome": "Salgadinho De Milho Presunto Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819033.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819095",
    "nome": "Salgadinho De Milho Presunto Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819095.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819910",
    "nome": "Salgadinho White Cheddar Popcorners Pacote 85g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819910.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820459",
    "nome": "Salgadinho de Milho Sabor Churrasco Fofura 70g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820459.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822699",
    "nome": "Salgadinho De Trigo Cebola Torcida Pacote 420g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822699.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823207",
    "nome": "Salgadinho De Milho Presunto Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823207.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823610",
    "nome": "Salgadinho De Milho Ketchup Doritos Pacote 37g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823610.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000395576",
    "nome": "Salgadinho de Milho Sabor Presunto QUALITÁ 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000395576.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896002369749",
    "nome": "Salgadinho Ondulatas Queijo Suico/ Ervas Finas",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896002369749.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071024983",
    "nome": "Salgadinho De Milho Doritos Rainbow Pacote 55g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071024983.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896286803366",
    "nome": "Salgadinho de Trigo Bacon Bolinha Pacote 150 g",
    "marca": "Lin",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896286803366.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896292342736",
    "nome": "Salgadinho Churrasco Brahma Resenha Pacote 50g",
    "marca": "Brahma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896292342736.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130277",
    "nome": "Salgadinho De Trigo Queijo Torcida Pacote 120g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130277.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902696",
    "nome": "Salgadinho De Milho Lobits Presunto 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902696.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896703200280",
    "nome": "Salgadinho De Milho Queijo Vanessa Pacote 170g",
    "marca": "Vanessa",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896703200280.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897115107792",
    "nome": "Salgadinho Snacks Amendupa Cost /limao 20x50gr",
    "marca": "Amendupã",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897115107792.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898133402333",
    "nome": "Salgadinho Snacks Kari Kari De Trigo Bacon 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898133402333.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130035",
    "nome": "Salgadinho De Milho Cebola Salsitos Pacote 32g",
    "marca": "Salsitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130035.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130097",
    "nome": "Salgadinho De Milho Pipoca Salsitos Pacote 25g",
    "marca": "Salsitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130097.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898701302058",
    "nome": "Salgadinho De Trigo Sabor Costelinha Com Limão",
    "marca": "Sabor",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898701302058.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814189",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814189.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819047",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819047.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819061",
    "nome": "Salgadinho De Milho Requeijão Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819061.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840819108",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840819108.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820456",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820456.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840823198",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 70g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840823198.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840823228",
    "nome": "Salgadinho De Milho Requeijão Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840823228.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006502",
    "nome": "Salgadinho De Batata Original Pringles Lata 41g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006502.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896005219970",
    "nome": "Salgadinho De Trigo Pimenta Levinhos Pacote 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896005219970.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896499902648",
    "nome": "Salgadinho De Milho Lobits Churrasco 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896499902648.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000849961",
    "nome": "Salgadinho De Batata Original Pringles Lata 37g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000849961.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "5053990110728",
    "nome": "Salgadinho De Batata Original Pringles Lata 41g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/5053990110728.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840247041",
    "nome": "Salgadinho Cheetos Sabor Queijo Elma Chips 130g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840247041.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814182",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 90g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814182.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814199",
    "nome": "Salgadinho de Milho Presunto Fofura Pacote 90 g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814199.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819040",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819040.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819064",
    "nome": "Salgadinho De Milho Requeijão Fofura Pacote 40g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819064.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819101",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819101.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819132",
    "nome": "Salgadinho De Milho Requeijão Fofura Pacote 80g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819132.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820411",
    "nome": "Salgadinho De Milho Requeijão Fofura Pacote 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820411.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820961",
    "nome": "Salgadinho Milho Sabor Churrasco Fandangos 140g",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820961.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823191",
    "nome": "Salgadinho De Milho Churrasco Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823191.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823221",
    "nome": "Salgadinho De Milho Requeijão Fofura Pacote 60g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823221.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823771",
    "nome": "Salgadinho de Milho Ketchup Doritos Pacote 110g",
    "marca": "Único",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823771.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896181709381",
    "nome": "Salgadinho De Trigo Bacon Dacolônia Pacote 170g",
    "marca": "Dac",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896181709381.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499901613",
    "nome": "Salgadinho Tira Teima Junior Cebola E Salsa 45g",
    "marca": "Junior",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499901613.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499901699",
    "nome": "Salgadinho Tira Teima Junior Cebola E Salsa 45g",
    "marca": "Junior",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499901699.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902689",
    "nome": "Salgadinho De Milho Lobits Churrasco 10 X 40 Gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902689.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896639801513",
    "nome": "Salgadinho Multicereais Okoshi Rozen Pacote 50g",
    "marca": "Okoshi",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896639801513.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897261351001",
    "nome": "Salgadinho Home Made Karinto Acucar C/ Gengibre",
    "marca": "Home Made",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897261351001.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897836302032",
    "nome": "Salgadinho De Milho Presunto Temabi Pacote 150g",
    "marca": "Temabi",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897836302032.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897836302377",
    "nome": "Salgadinho De Milho Queijo éd Júnior Pacote 45g",
    "marca": "Éd+",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897836302377.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130028",
    "nome": "Salgadinho de Milho Queijo Salsitos Pacote 32 g",
    "marca": "Salsitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130028.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899530100808",
    "nome": "Salgadinho de Milho amanteigado Kito&amp;#x27;s 40g",
    "marca": "Dori",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899530100808.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840221048",
    "nome": "Salgadinho De Milho Original Doritos Pacote 170g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840221048.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840233041",
    "nome": "Salgadinho Elma Chips Doritos Late Night Burguer",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840233041.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815100",
    "nome": "Salgadinho De Trigo Bacon Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815100.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815155",
    "nome": "Salgadinho De Trigo Pizza Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815155.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816213",
    "nome": "Salgadinho Fandangos Sabor Queijo Elma Chips 37g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816213.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816886",
    "nome": "Salgadinho De Trigo Calabresa Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816886.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816893",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816893.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820258",
    "nome": "Salgadinho De Trigo Calabresa Torcida Pacote 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820258.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820296",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820296.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822597",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 70g",
    "marca": "TORCIDA",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822597.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006489",
    "nome": "Salgadinho De Batata Original Pringles Tubo 104g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006489.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896005219987",
    "nome": "Salgadinho De Trigo Presunto Levinhos Pacote 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896005219987.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896053800724",
    "nome": "Salgadinho De Arroz Churrasco Kalassi Pacote 70g",
    "marca": "Kalassi",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896053800724.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130755",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130755.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130786",
    "nome": "Salgadinho De Trigo Pizza Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130786.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898956286087",
    "nome": "Salgadinho Pipaozitos Crocante 70g / Und / Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898956286087.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000849763",
    "nome": "Salgadinho De Batata Original Pringles Tubo 121g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000849763.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000849824",
    "nome": "Salgadinho De Batata Barbecue Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000849824.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127300694",
    "nome": "Salgadinho De Batata Bacon Long Chips Pacote 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127300694.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "47896341101985",
    "nome": "Salgadinho De Trigo Bacon Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/47896341101985.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "5053990110759",
    "nome": "Salgadinho De Batata Original Pringles Tubo 114g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/5053990110759.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "5053990110780",
    "nome": "Salgadinho De Batata Barbecue Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/5053990110780.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840221041",
    "nome": "Salgadinho De Milho Original Doritos Pacote 170g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840221041.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840233044",
    "nome": "Salgadinho Elma Chips Doritos Late Night Burguer",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840233044.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840253240",
    "nome": "Salgadinho Fandangos Sabor Queijo Elma Chips 59g",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840253240.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815103",
    "nome": "Salgadinho De Trigo Bacon Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815103.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815158",
    "nome": "Salgadinho De Trigo Pizza Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815158.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816889",
    "nome": "Salgadinho De Trigo Calabresa Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816889.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816896",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816896.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840821159",
    "nome": "Salgadinho Fandangos Sabor Queijo Elma Chips 37g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840821159.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822477",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 35g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822477.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822590",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 60g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822590.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823764",
    "nome": "Salgadinho de Milho Mostarda Doritos Pacote 110g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823764.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472192",
    "nome": "Salgadinho de Trigo Churrasco Qualitá Pacote 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472192.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004010298",
    "nome": "Salgadinho De Batata Original Pringles Tubo 134g",
    "marca": "Original",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004010298.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896005219980",
    "nome": "Salgadinho De Trigo Presunto Levinhos Pacote 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896005219980.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896053800727",
    "nome": "Salgadinho De Arroz Churrasco Kalassi Pacote 70g",
    "marca": "Kalassi",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896053800727.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071025195",
    "nome": "Salgadinho De Milho Anel Cebola Lucky Pacote 60g",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071025195.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896181707745",
    "nome": "Salgadinho De Trigo Queijo Dacolônia Pacote 170g",
    "marca": "Dac",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896181707745.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896286800884",
    "nome": "Salgadinho De Trigo De Churrasco Lin Pacote 150g",
    "marca": "Lin",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896286800884.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896286801386",
    "nome": "Salgadinho de Trigo com Pimenta Lin Pacote 150 g",
    "marca": "Lin",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896286801386.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896839172833",
    "nome": "Salgadinho Integral Queijo Nacho Da Magrinha 30g",
    "marca": "Da Magrinha",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896839172833.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211132039",
    "nome": "Salgadinho De Trigo Pimenta Delicitos Pacote 50g",
    "marca": "Delicitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211132039.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898956286080",
    "nome": "Salgadinho Pipaozitos Crocante 70g / Und / Bacon",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898956286080.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7899530100037",
    "nome": "Salgadinho de Milho Manteiguinha Kito&amp;#x27;s 30g",
    "marca": "Vilma",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7899530100037.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "9000052910",
    "nome": "Salgadinho Elma Chips Doritos Late Night Burguer",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/9000052910.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840237742",
    "nome": "Salgadinho Elma Chips De Montao Ruf/dorit/baconzi",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840237742.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814066",
    "nome": "Salgadinho De Milho Cool Ranch Doritos Pacote 84g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814066.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815124",
    "nome": "Salgadinho De Trigo Cebola Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815124.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815162",
    "nome": "Salgadinho De Trigo Queijo Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815162.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815926",
    "nome": "Salgadinho De Milho Cool Ranch Doritos Pacote 84g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815926.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840817203",
    "nome": "Salgadinho De Milho Flamin Hot Cheetos Pacote 90g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840817203.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820210",
    "nome": "Salgadinho De Trigo Bola Bacon Torcida Pacote 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820210.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006953",
    "nome": "Salgadinho De Batata Churrasco Pringles Tubo 120g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006953.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004007028",
    "nome": "Salgadinho Snack Cheez Ir Cheddar 65g 3093 Parati",
    "marca": "Parati",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004007028.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896005219963",
    "nome": "Salgadinho De Trigo Churrasco Levinhos Pacote 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896005219963.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896024778977",
    "nome": "Salgadinho Sortido Piraquê Pacote 175g 5 Unidades",
    "marca": "Piraque",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896024778977.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130250",
    "nome": "Salgadinho De Trigo Churrasco Torcida Pacote 120g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130250.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130779",
    "nome": "Salgadinho De Trigo Cebola Torcida Jr. Pacote 50g",
    "marca": "Torcida Jr",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130779.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130793",
    "nome": "Salgadinho De Trigo Cebola Torcida Jr. Pacote 50g",
    "marca": "Torcida Jr",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130793.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896341130809",
    "nome": "Salgadinho De Trigo Queijo Torcida Jr. Pacote 50g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896341130809.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898967127317",
    "nome": "Salgadinho Zumbitos Bacon Pellet 70g 16492 Santos",
    "marca": "Santos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898967127317.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27892840817156",
    "nome": "Salgadinho De Milho Flamin Hot Doritos Pacote 84g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27892840817156.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4017100723100",
    "nome": "Salgadinho De Batata Sal Marinho Lorenz Tubo 100g",
    "marca": "Bahlsen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4017100723100.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4560205300740",
    "nome": "Salgadinho Ya Rice Crackres Okaki Nori Maki Arare",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4560205300740.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127300700",
    "nome": "Salgadinho De Batata Wasabi Long Chips Pacote 75g",
    "marca": "Long Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127300700.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840237745",
    "nome": "Salgadinho Elma Chips De Montao Ruf/dorit/baconzi",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840237745.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840255442",
    "nome": "Salgadinho Elma Chips Baconzitos Sabor Bacon 103g",
    "marca": "Baconzitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840255442.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814069",
    "nome": "Salgadinho De Milho Cool Ranch Doritos Pacote 96g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814069.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814076",
    "nome": "Salgadinho De Milho Cool Ranch Doritos Pacote 55g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814076.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815127",
    "nome": "Salgadinho De Trigo Cebola Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815127.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815165",
    "nome": "Salgadinho De Trigo Queijo Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815165.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816971",
    "nome": "Salgadinho De Milho Anel Cebola Fofura Pacote 47g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816971.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822368",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 75g",
    "marca": "Sweet",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822368.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004007042",
    "nome": "Salgadinho Snack Cheez Ir Parmesao 65g 3445 Parati",
    "marca": "Parati",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004007042.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896071024997",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 96g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896071024997.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898171340328",
    "nome": "Salgadinho De Trigo De Bacon Biscoitone Pacote 90g",
    "marca": "Biscoitone",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898171340328.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000192111",
    "nome": "Salgadinho de Batata Pizza Pringles Mega Tubo 158g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000192111.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891203063182",
    "nome": "Salgadinho De Trigo Bacon Panco Bisnack Pacote 80g",
    "marca": "Panco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891203063182.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840253141",
    "nome": "Salgadinho Fandangos Sabor Presunto Elma Chips 59g",
    "marca": "Fandangos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840253141.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816445",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 37g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816445.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822361",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 75g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822361.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822392",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 32g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822392.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822439",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 37g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822439.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071024990",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 96g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071024990.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071025225",
    "nome": "Salgadinho De Milho Palito Queijo Lucky Pacote 60g",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071025225.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103738",
    "nome": "Salgadinho De Milho Palito Queijo Lucky Pacote 60g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103738.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896639800523",
    "nome": "Salgadinho De Arroz Cebola Okoshi Rozen Pacote 50g",
    "marca": "Rozen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896639800523.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896639800530",
    "nome": "Salgadinho De Arroz Tomate Okoshi Rozen Pacote 50g",
    "marca": "Rozen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896639800530.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897836301295",
    "nome": "Salgadinho De Milho Tubo Queijo Temabi Pacote 150g",
    "marca": "Temabi",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897836301295.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7897836302407",
    "nome": "Salgadinho De Milho Churrasco éd Júnior Pacote 45g",
    "marca": "Éd+",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7897836302407.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898171340321",
    "nome": "Salgadinho de Trigo de Bacon Biscoitone Pacote 90g",
    "marca": "Biscoitone",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898171340321.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130356",
    "nome": "Salgadinho De Trigo Churrasco Delicitos Pacote 50g",
    "marca": "Delicitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130356.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898957617012",
    "nome": "Salgadinho Frontera Tex Mex Barbeque Tortilla 200g",
    "marca": "Frontera",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898957617012.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17891203060058",
    "nome": "Salgadinho De Trigo Cebola Panco Bisnack Pacote 80g",
    "marca": "Panco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17891203060058.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840253346",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 84g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840253346.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840253742",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 55g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840253742.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814592",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 30g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814592.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840817937",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 140g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840817937.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820142",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 45g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820142.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822726",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 140g",
    "marca": "Sweet",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822726.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738206",
    "nome": "Salgadinho De Milho Queijo Marilan Teens Pacote 45g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738206.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738213",
    "nome": "Salgadinho De Milho Queijo Marilan Teens Pacote 80g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738213.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004007066",
    "nome": "Salgadinho Snack Cheez Ir Provolone 65g 3449 Parati",
    "marca": "Parati",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004007066.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "39557062331105",
    "nome": "Salgadinho De Batata Queijo Mister Potato Tubo 160g",
    "marca": "Mister Potato",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/39557062331105.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7804630010247",
    "nome": "Salgadinho De Bata Doce, Beterrada E Batata Natural",
    "marca": "Tika Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7804630010247.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891203060051",
    "nome": "Salgadinho De Trigo Cebola Panco Bisnack Pacote 80g",
    "marca": "Panco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891203060051.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840237349",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 30g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840237349.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840245146",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 22g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840245146.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814236",
    "nome": "Salgadinho De Milho Concha Queijo Fofura Pacote 55g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814236.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816469",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 37g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816469.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816988",
    "nome": "Salgadinho De Milho Palito Queijo Fofura Pacote 47g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816988.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818562",
    "nome": "Salgadinho Cheetos Assado Mix de Queijos Pacote 41g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818562.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822347",
    "nome": "Salgadinho de Milho Queijo Nacho Doritos Pacote 75g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822347.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822385",
    "nome": "Salgadinho de Milho Queijo Nacho Doritos Pacote 32g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822385.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822408",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 37g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822408.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822729",
    "nome": "Salgadinho De Milho Sweet Chili Doritos Pacote 120g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822729.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000395606",
    "nome": "Salgadinho de Milho Sabor Requeijão Lua QUALITÁ 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000395606.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472208",
    "nome": "Salgadinho De Trigo QUALITÁ Sabor Queijo Pacote 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472208.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738209",
    "nome": "Salgadinho De Milho Queijo Marilan Teens Pacote 45g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738209.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738216",
    "nome": "Salgadinho De Milho Queijo Marilan Teens Pacote 80g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738216.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896639800516",
    "nome": "Salgadinho De Arroz Natural Okoshi Rozen Pacote 50g",
    "marca": "Rozen",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896639800516.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "9557062331104",
    "nome": "Salgadinho De Batata Queijo Mister Potato Tubo 160g",
    "marca": "Mister Potato",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/9557062331104.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840244641",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 210g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840244641.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840253445",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 167g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840253445.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840814547",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 140g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840814547.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815148",
    "nome": "Salgadinho De Trigo Churrasco Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815148.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840818354",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 300g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840818354.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822443",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 140g",
    "marca": "DORITOS",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822443.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006960",
    "nome": "Salgadinho De Batata Pizza Pringles Gaming Tubo 115g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006960.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "4750127300595",
    "nome": "Salgadinho De Batata Churrasco Long Chips Pacote 75g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/4750127300595.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "5053990125036",
    "nome": "Salgadinho De Batata Sal E Vinagre Pringles Tubo 70g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/5053990125036.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840224844",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 400g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840224844.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840253349",
    "nome": "Salgadinho Doritos Sabor Queijo Nacho Elma Chips 96g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840253349.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840253448",
    "nome": "Salgadinho De Milho Queijo Nacho Doritos Pacote 167g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840253448.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815110",
    "nome": "Salgadinho De Trigo Calabresa Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815110.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840815141",
    "nome": "Salgadinho De Trigo Churrasco Torcida Jr. Pacote 45g",
    "marca": "Torcida Jr.",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840815141.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820312",
    "nome": "Salgadinho De Trigo Pimenta Mexicana Torcida Jr. 38G",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820312.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822446",
    "nome": "Salgadinho de Milho Queijo Nacho Doritos Pacote 120g",
    "marca": "Doritos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822446.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004006963",
    "nome": "Salgadinho De Batata Pizza Pringles Gaming Tubo 115g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004006963.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007038",
    "nome": "Salgadinho Assado CHEEZ-IT Sabor Cheddar Pacote 115g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007038.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007045",
    "nome": "Salgadinho Assado CHEEZ-IT Sabor Parmesão Pacote 65g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007045.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071022309",
    "nome": "Salgadinho De Milho Queijo Skiny Clássico Pacote 60g",
    "marca": "Mabel",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071022309.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071025218",
    "nome": "Salgadinho De Milho Concha Presunto Lucky Pacote 60g",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071025218.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071025515",
    "nome": "Salgadinho De Milho Queijo Skiny Clássico Pacote 38g",
    "marca": "Clássico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071025515.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071025553",
    "nome": "Salgadinho De Milho Queijo Skiny Clássico Pacote 78g",
    "marca": "Clássico",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071025553.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341130796",
    "nome": "Salgadinho De Trigo Churrasco Torcida Jr. Pacote 50g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341130796.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896499902504",
    "nome": "Salgadinho De Milho Lobits Cebola E Salsa 10 X 40 Gr",
    "marca": "Lobits",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896499902504.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "10038000265614",
    "nome": "Salgadinho De Batata Sal E Vinagre Pringles Tubo 158g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/10038000265614.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "138000238007",
    "nome": "Salgadinho De Batata Barbecue Pringles Wavy Tubo 112g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/138000238007.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17891091063230",
    "nome": "Salgadinho Batata Chips Scrusch Barbecue Sao Braz 50g",
    "marca": "Scrusch",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17891091063230.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896002311752",
    "nome": "Salgadinho De Milho Picante Xplosion Takis Pacote 56g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896002311752.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738107",
    "nome": "Salgadinho De Trigo Bacon Marilan Pit Stop Pacote 50g",
    "marca": "Pit Stop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738107.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738114",
    "nome": "Salgadinho De Trigo Bacon Marilan Pit Stop Pacote 90g",
    "marca": "Pit Stop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738114.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738121",
    "nome": "Salgadinho De Trigo Queijo Marilan Da Hora Pacote 60g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738121.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738152",
    "nome": "Salgadinho De Trigo Cebola Marilan Da Hora Pacote 60g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738152.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738183",
    "nome": "Salgadinho De Milho Presunto Marilan Teens Pacote 45g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738183.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738190",
    "nome": "Salgadinho De Milho Presunto Marilan Teens Pacote 80g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738190.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006519",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Lata 43g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006519.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898133402354",
    "nome": "Salgadinho Snacks Kari Kari De Trigo Lemon Pepper 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898133402354.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000238000",
    "nome": "Salgadinho De Batata Barbecue Pringles Wavy Tubo 112g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000238000.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "39557062331129",
    "nome": "Salgadinho De Batata Original Mister Potato Tubo 160g",
    "marca": "Original",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/39557062331129.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891091063233",
    "nome": "Salgadinho Batata Chips Scrusch Barbecue Sao Braz 50g",
    "marca": "Scrusch",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891091063233.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816957",
    "nome": "Salgadinho De Milho Concha Presunto Fofura Pacote 47g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816957.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472178",
    "nome": "Salgadinho de Trigo Cebola e Salsa Qualitá Pacote 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472178.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896002311755",
    "nome": "Salgadinho De Milho Picante Xplosion Takis Pacote 56g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896002311755.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896002311786",
    "nome": "Salgadinho De Milho Picante Xplosion Takis Pacote 90g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896002311786.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738100",
    "nome": "Salgadinho De Trigo Bacon Marilan Pit Stop Pacote 50g",
    "marca": "Pit Stop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738100.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738117",
    "nome": "Salgadinho De Trigo Bacon Marilan Pit Stop Pacote 90g",
    "marca": "Pit Stop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738117.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738124",
    "nome": "Salgadinho De Trigo Queijo Marilan Da Hora Pacote 60g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738124.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738155",
    "nome": "Salgadinho De Trigo Cebola Marilan Da Hora Pacote 60g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738155.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738186",
    "nome": "Salgadinho De Milho Presunto Marilan Teens Pacote 45g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738186.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738193",
    "nome": "Salgadinho De Milho Presunto Marilan Teens Pacote 80g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738193.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004006512",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Lata 43g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004006512.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004006703",
    "nome": "Salgadinho De Batata Original Pringles Mega Tubo 152g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004006703.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007052",
    "nome": "Salgadinho Assado CHEEZ-IT Sabor Parmesão Pacote 115g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007052.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896005211366",
    "nome": "Salgadinho De Trigo Pepperoni Sol Levinhos Pacote 90g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896005211366.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896020904038",
    "nome": "Salgadinho De Trigo Cebola E Salsa Romanha Pacote 50g",
    "marca": "Romanha",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896020904038.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071025201",
    "nome": "Salgadinho De Milho Concha Churrasco Lucky Pacote 60g",
    "marca": "Lucky",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071025201.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896181707738",
    "nome": "Salgadinho De Trigo Tradicional Dacolônia Pacote 170g",
    "marca": "Dac",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896181707738.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896496917303",
    "nome": "Salgadinho Orgânico Tomate e Manjericão Mãe Terra 25g",
    "marca": "Mãe Terra",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896496917303.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898133402357",
    "nome": "Salgadinho Snacks Kari Kari De Trigo Lemon Pepper 70g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898133402357.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898380411607",
    "nome": "Salgadinho sem Glúten Veggie Belive Cream Cheese 35 g",
    "marca": "Bio Mundo",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898380411607.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "9557062331128",
    "nome": "Salgadinho De Batata Original Mister Potato Tubo 160g",
    "marca": "Original",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/9557062331128.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "10037000211669",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/10037000211669.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "10038000265638",
    "nome": "Salgadinho De Batata Mostarda E Mel Pringles Tubo 158g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/10038000265638.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815940",
    "nome": "Salgadinho De Milho Original Doritos Dippas Pacote 96g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815940.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738169",
    "nome": "Salgadinho De Milho Requeijão Marilan Teens Pacote 45g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738169.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738176",
    "nome": "Salgadinho De Milho Requeijão Marilan Teens Pacote 80g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738176.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006236",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 120g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006236.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896004006472",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 120g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896004006472.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896005219833",
    "nome": "Salgadinho De Trigo Cebola E Salsa Levinhos Pacote 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896005219833.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896005222253",
    "nome": "Salgadinho De Trigo Cebola E Salsa Levinhos Pacote 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896005222253.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896071025000",
    "nome": "Salgadinho De Milho Original Doritos Dippas Pacote 96g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896071025000.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17898966369299",
    "nome": "Salgadinho Anéis De Batata Sabor Original Playlist 50g",
    "marca": "Original",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17898966369299.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000265631",
    "nome": "Salgadinho De Batata Mostarda E Mel Pringles Tubo 158g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000265631.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000849770",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000849770.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000849787",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000849787.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "38000850974",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/38000850974.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "39557062331143",
    "nome": "Salgadinho De Batata Churrasco Mister Potato Tubo 160g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/39557062331143.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "5410076029068",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 128g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/5410076029068.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "57891095023245",
    "nome": "Salgadinho De Milho Lua Queijo Yoki Yokitos Pacote 45g",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/57891095023245.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095031351",
    "nome": "Salgadinho De Milho Lua Queijo Yoki Yokitos Pacote 39g",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095031351.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891203060082",
    "nome": "Salgadinho De Trigo Churrasco Panco Bisnack Pacote 80g",
    "marca": "Panco",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891203060082.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840252946",
    "nome": "Salgadinho Cheetos Onda Sabor Requeijão Elma Chips 57g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840252946.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816964",
    "nome": "Salgadinho De Milho Concha Churrasco Fofura Pacote 47g",
    "marca": "Fofura",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816964.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738162",
    "nome": "Salgadinho De Milho Requeijão Marilan Teens Pacote 45g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738162.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896003738179",
    "nome": "Salgadinho De Milho Requeijão Marilan Teens Pacote 80g",
    "marca": "Marilan",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896003738179.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007076",
    "nome": "Salgadinho Assado CHEEZ-IT Sabor Provolone Pacote 115g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007076.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004010304",
    "nome": "Salgadinho De Batata Creme E Cebola Pringles Tubo 141g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004010304.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896005219959",
    "nome": "Salgadinho De Trigo Cebola E Salsa Levinhos Pacote 50g",
    "marca": "Levinhos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896005219959.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896071022293",
    "nome": "Salgadinho De Milho Original Skiny Clássico Pacote 60g",
    "marca": "Skiny",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896071022293.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822637",
    "nome": "Salgadinho De Trigo Pimenta Mexicana Torcida Pacote 60g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822637.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7895000472161",
    "nome": "Salgadinho de Trigo Pimenta Mexicana Qualitá Pacote 50g",
    "marca": "Qualitá",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7895000472161.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896002311762",
    "nome": "Salgadinho De Milho Picante Hot Chilli Takis Pacote 56g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896002311762.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896002311793",
    "nome": "Salgadinho De Milho Picante Hot Chilli Takis Pacote 90g",
    "marca": "Takis",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896002311793.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004007410",
    "nome": "Salgadinho Sabor Creme e Cebola Free Fire Cheez-It 115g",
    "marca": "Cheez-It",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004007410.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004008998",
    "nome": "Salgadinho de Batata Cheddar e Bacon Pringles Tubo 105g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896004008998.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896004010465",
    "nome": "Salgadinho De Batata Limão E Pimenta Pringles Tubo 105g",
    "marca": "Pringles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-off/7896004010465.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896020904106",
    "nome": "Salgadinho De Trigo Pimenta Mexicana Romanha Pacote 50g",
    "marca": "Romanha",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896020904106.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896045318711",
    "nome": "Salgadinho Queijo Assado Magitlec Magikitos Pacote 150g",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896045318711.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896045318735",
    "nome": "Salgadinho Cebola Assada Magitlec Magikitos Pacote 150g",
    "marca": "Magitlec",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896045318735.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896261402416",
    "nome": "Salgadinho De Milho Crocante Churrasco Agtal Pacote 62g",
    "marca": "Agtal",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896261402416.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896286892971",
    "nome": "Salgadinho De Trigo De Pimenta Mexicana Lin Pacote 150g",
    "marca": "Lin",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896286892971.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211130059",
    "nome": "Salgadinho De Milho Galinha Caipira Salsitos Pacote 32g",
    "marca": "Salsitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211130059.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898211132022",
    "nome": "Salgadinho De Trigo Cebola E Salsa Delicitos Pacote 50g",
    "marca": "Delicitos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898211132022.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815186",
    "nome": "Salgadinho De Trigo Pimenta Mexicana Torcida Pacote 120g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815186.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840815230",
    "nome": "Salgadinho De Milho Churros Halloween Cheetos Pacote 47g",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840815230.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820593",
    "nome": "Salgadinho De Trigo Vinagrete Torcida Churras Pacote 38g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820593.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840820609",
    "nome": "Salgadinho De Trigo Vinagrete Torcida Churras Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840820609.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822658",
    "nome": "Salgadinho De Trigo Vinagrete Torcida Churras Pacote 70g",
    "marca": "Torcida",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822658.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17896003738060",
    "nome": "Salgadinho De Milho Parmesão Marilan Pit Stop Pacote 40g",
    "marca": "Pit Stop",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17896003738060.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818166",
    "nome": "RUFFLES L115 P101",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818166.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840247645",
    "nome": "Ruffles Cebola E Salsa",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840247645.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840217112",
    "nome": "Ruffles Original Elma Chips",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840217112.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840224745",
    "nome": "Ruffles Original Elma Chips",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840224745.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840202118",
    "nome": "Ruffles",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840202118.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840215316",
    "nome": "Ruffles Bits",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840215316.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840216818",
    "nome": "Ruffles Bits",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840216818.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840202316",
    "nome": "Ruffles Twist",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840202316.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840200411",
    "nome": "Ruffles Cebola",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840200411.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840202415",
    "nome": "Ruffles Mix C5",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840202415.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840229412",
    "nome": "Ruffles Palito",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840229412.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840219116",
    "nome": "Ruffles 2 Sabores",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840219116.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840247744",
    "nome": "Ruffles Churrasco",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840247744.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840204419",
    "nome": "Ruffles Da Mochila",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840204419.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840110611",
    "nome": "Ruffles Queijo 80gr",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840110611.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840234017",
    "nome": "Ruffles Costelinha R",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840234017.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840177119",
    "nome": "Ruffles Max Barbecue",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840177119.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840179311",
    "nome": "Ruffles Max Barbecue",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840179311.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840234010",
    "nome": "Ruffles Costelinha R",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840234010.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840256743",
    "nome": "Ruffles Burritas 90gr",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840256743.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840204914",
    "nome": "Batata Ruffles Churrasco",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840204914.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840227814",
    "nome": "Batata Ruffles Churrasco",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840227814.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816756",
    "nome": "Salg Batata Ruffles 37g Sal",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816756.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "27892840817125",
    "nome": "Salg.ruffles Flamin Hot 37g",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/27892840817125.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816759",
    "nome": "Salg Batata Ruffles 37g Sal",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816759.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817121",
    "nome": "Salg.ruffles Flamin Hot 37g",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817121.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840232648",
    "nome": "Batata Ruffles Cebola E Salsa",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840232648.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840254848",
    "nome": "Batata Ruffles Cebola E Salsa",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840254848.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840127411",
    "nome": "Batata Ruffles Cebola E Salsa",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840127411.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840216719",
    "nome": "Batata Ruffles Cebola E Salsa",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840216719.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840228644",
    "nome": "Batata Ruffles Cebola E Salsa",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840228644.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840232641",
    "nome": "Batata Ruffles Cebola E Salsa",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840232641.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840814465",
    "nome": "Salg Ruffles Batata Orig 145g",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840814465.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840111915",
    "nome": "Batata Ruffles 120gr Churrasco",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840111915.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816060",
    "nome": "Batata Frita Ruffles 92g Original",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816060.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816725",
    "nome": "Batata Frita Ruffles 92g Original",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816725.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840128111",
    "nome": "Batata Frita Original Ruffles 50g",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840128111.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816728",
    "nome": "Batata Frita Ruffles 92g Original",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816728.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840816718",
    "nome": "Batata Frita Ruffles 92g Churrasco",
    "marca": "Ruffles",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840816718.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7890000066020",
    "nome": "Elma Chips 140g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7890000066020.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840227149",
    "nome": "Elma Chips Cheetos Tubos De Queijo",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840227149.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840227142",
    "nome": "Elma Chips Cheetos Tubos De Queijo",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840227142.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840817664",
    "nome": "Elma Chips Fandangos Zambinos Pizza",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840817664.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7803757692978",
    "nome": "Elma Chips Stax",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos-ml/7803757692978.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840138219",
    "nome": "Elma Chips Cheetos 80g Tubo",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840138219.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840184117",
    "nome": "Elma Chips Doritos 86g Pizza",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840184117.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840184018",
    "nome": "Elma Chips Doritos 86g Queijo",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840184018.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840207342",
    "nome": "Elma Chips Fandangos 75g Pres",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840207342.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840206147",
    "nome": "Elma Chips Cheetos 70g Minhoca",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840206147.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840137410",
    "nome": "Elma Chips Poffets 100g Natural",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840137410.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840180713",
    "nome": "Elma Chips Poffets 100g Cheddar",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840180713.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840206116",
    "nome": "Elma Chips Sensacoes 80g Queijo",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840206116.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840208448",
    "nome": "Elma Chips Cheetos 80g X Burger",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840208448.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840133511",
    "nome": "Elma Chips Fandangos 100g Queijo",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840133511.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840137519",
    "nome": "Elma Chips Poffets 100g Manteiga",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840137519.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840139414",
    "nome": "Elma Chips Cheetos 160g Original",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840139414.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840183219",
    "nome": "Elma Chips Cheetos 90g Requeijao",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840183219.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818838",
    "nome": "Elma Chips Toddy Cookies Extra 50g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818838.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840128616",
    "nome": "Elma Chips Parker S 70g Tom.basilico",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840128616.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820381",
    "nome": "Batata Palha Tradicional Elma Chips Sachê 100g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820381.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818234",
    "nome": "Batata Palha Tradicional Elma Chips Pacote 425g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818234.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820114",
    "nome": "Batata Frita Ondulada Churrasco Elma Chips Ruffles 40g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820114.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820008",
    "nome": "Batata Frita Ondulada Baconzitos Elma Chips Ruffles 70g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820008.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822583",
    "nome": "Palitinho De Trigo Elma Chips Stiksy Clássicos Pacote 76g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822583.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840818296",
    "nome": "Kit Salgadinho Elma Chips Lanchinho Sortido 98g 5 Unidades",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840818296.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820022",
    "nome": "Batata Frita Ondulada Cheetos Elma Chips Ruffles Pacote 70g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820022.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840820121",
    "nome": "Batata Frita Ondulada Original Elma Chips Ruffles Pacote 40g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840820121.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840816049",
    "nome": "Batata Frita Ondulada Cebola E Salsa Elma Chips Ruffles Pacote 84G",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840816049.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819286",
    "nome": "Batata Frita Ondulada Hellmann&amp;#x27;s Temperada Elma Chips Ruffles Pacote 72g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819286.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896341103806",
    "nome": "Stax Cheddar Elma Chips",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896341103806.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840251748",
    "nome": "Salg.elma Chips De Montao 100gr",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840251748.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840251741",
    "nome": "Salg.elma Chips De Montao 100gr",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840251741.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840819996",
    "nome": "Batata Frita Ondulada Baconzitos Elma Chips Ruffles Pacote 35g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840819996.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822774",
    "nome": "Salgadinho De Trigo Elma Chips Baconzitos Clássicos Pacote 86g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822774.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840822798",
    "nome": "Salgadinho De Trigo Elma Chips Baconzitos Clássicos Pacote 42g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840822798.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840822788",
    "nome": "Salgadinho De Trigo Elma Chips Baconzitos Clássicos Pacote 103g",
    "marca": "RUFFLES",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840822788.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840220549",
    "nome": "Salgadinho Baconzitos",
    "marca": "Cheetos",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840220549.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "17892840248342",
    "nome": "Pipoca Elma Chips Baconzitos",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/17892840248342.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840248345",
    "nome": "Pipoca Elma Chips Baconzitos",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840248345.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840151720",
    "nome": "Salgadinho Elma Chips Baconzitos",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840151720.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7898916665610",
    "nome": "Salgadinho Baconzitos Fritell 60gr",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7898916665610.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7892840823450",
    "nome": "Salgadinho De Trigo Elma Chips Baconzitos Clássicos Pacote 34g",
    "marca": "Elma Chips",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7892840823450.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7896946900305",
    "nome": "Salgadinho Baconzito",
    "marca": "Dinho",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7896946900305.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "10009789",
    "nome": "Salg Ec Baconzit 103",
    "marca": "Alg",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/10009789.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "57891095023283",
    "nome": "Yokitos Naquinhos Queijo Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/57891095023283.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023288",
    "nome": "Yokitos Naquinhos Queijo Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023288.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095006243",
    "nome": "Yokitos Conchinha Queijo 24/rs",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095006243.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095007271",
    "nome": "Yokitos Ondulada Churrasco Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095007271.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095002368",
    "nome": "Yokitos Ondulada Salsa E Cebola Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095002368.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095010196",
    "nome": "Yokitos Ondulada Salsa E Cebola Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095010196.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "789109500726",
    "nome": "Yokitos Cebola R",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/789109500726.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095002337",
    "nome": "Yokitos Naquinhos",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095002337.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095011186",
    "nome": "Yokitos Queijo Nacho",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095011186.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095006618",
    "nome": "Yokitos Presunto Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095006618.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "57891095010207",
    "nome": "Yokitos Churrasco Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/57891095010207.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095010202",
    "nome": "Yokitos Churrasco Yoki",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095010202.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "57891095023306",
    "nome": "Yokitos Salgadinho Bacon",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/57891095023306.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095023301",
    "nome": "Yokitos Salgadinho Bacon",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095023301.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "57891095002301",
    "nome": "Yokitos Rubinho De Queijo",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/57891095002301.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "57891095006200",
    "nome": "Yokitos Rubinho De Queijo",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/57891095006200.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095002306",
    "nome": "Yokitos Rubinho De Queijo",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095002306.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095006205",
    "nome": "Yokitos Rubinho De Queijo",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095006205.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "57891095006262",
    "nome": "Yokitos Naquinhos Queijo 24/rs",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/57891095006262.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  },
  {
    "codigo": "7891095002313",
    "nome": "Yokitos Conchinhas Presunto 50",
    "marca": "Yoki",
    "categoria": "Salgadinhos & Snacks",
    "imagem": "https://consultaprodutos.com.br/assets/produtos/7891095002313.webp",
    "preco": 0,
    "origem": "Cosmos Bluesoft / Salgadinhos"
  }
];

/**
 * Garante que todos os 1059 salgadinhos estejam no catálogo local da aplicação (localStorage / Memória)
 * sem necessidade de chamadas de leitura na nuvem (Custo: 0 leituras).
 */
export function garantirCatalogoSalgadinhosNoBancoGlobal(catalogoAtual: ProdutoCatalogo[]): {
  catalogoCompleto: ProdutoCatalogo[];
  novosInseridos: ProdutoCatalogo[];
  atualizados: ProdutoCatalogo[];
} {
  const mapaExistentes = new Map<string, ProdutoCatalogo>();
  (catalogoAtual || []).forEach((p) => {
    if (p && p.codigo) {
      mapaExistentes.set(String(p.codigo).trim(), p);
    }
  });

  const novosInseridos: ProdutoCatalogo[] = [];
  const atualizados: ProdutoCatalogo[] = [];

  catalogoSalgadinhosCosmosMix.forEach((itemNovo) => {
    const codLimpo = String(itemNovo.codigo).trim();
    if (!mapaExistentes.has(codLimpo)) {
      mapaExistentes.set(codLimpo, itemNovo);
      novosInseridos.push(itemNovo);
    } else {
      const existente = mapaExistentes.get(codLimpo)!;
      let alterou = false;
      const fotoMelhor = (!existente.imagem || existente.imagem.length < 10) && itemNovo.imagem ? itemNovo.imagem : existente.imagem;
      const nomeMelhor = (!existente.nome || existente.nome.trim().length === 0) && itemNovo.nome ? itemNovo.nome : existente.nome;

      if (fotoMelhor !== existente.imagem || nomeMelhor !== existente.nome) {
        alterou = true;
      }

      if (alterou) {
        const itemAtualizado: ProdutoCatalogo = {
          ...existente,
          nome: nomeMelhor,
          imagem: fotoMelhor,
          categoria: existente.categoria || itemNovo.categoria,
          marca: existente.marca || itemNovo.marca,
        };
        mapaExistentes.set(codLimpo, itemAtualizado);
        atualizados.push(itemAtualizado);
      }
    }
  });

  return {
    catalogoCompleto: Array.from(mapaExistentes.values()),
    novosInseridos,
    atualizados,
  };
}

/**
 * Sincroniza em lote os produtos de Salgadinhos com o Cloud Firestore
 */
export async function sincronizarCatalogoSalgadinhosComFirestore(
  catalogoAtual: ProdutoCatalogo[],
  onProgresso?: (atual: number, total: number) => void
): Promise<{ totalNovos: number; totalAtualizados: number; catalogoFinal: ProdutoCatalogo[] }> {
  const { catalogoCompleto, novosInseridos, atualizados } = garantirCatalogoSalgadinhosNoBancoGlobal(catalogoAtual);
  const itensParaSalvar = [...novosInseridos, ...atualizados];

  try {
    localStorage.setItem('catalogoGlobalFirebase', JSON.stringify(catalogoCompleto));
  } catch (err) {
    console.warn('Erro ao salvar localmente:', err);
  }

  let processados = 0;
  const total = itensParaSalvar.length;
  const BATCH_SIZE = 10;

  for (let i = 0; i < itensParaSalvar.length; i += BATCH_SIZE) {
    const lote = itensParaSalvar.slice(i, i + BATCH_SIZE);
    await Promise.all(
      lote.map(async (item) => {
        try {
          await salvarProdutoCatalogoFirestore(item);
        } catch (e) {
          console.warn('Erro ao salvar salgadinho no Firestore:', item.codigo, e);
        }
      })
    );
    processados += lote.length;
    if (onProgresso) onProgresso(Math.min(processados, total), total);
  }

  return {
    totalNovos: novosInseridos.length,
    totalAtualizados: atualizados.length,
    catalogoFinal: catalogoCompleto,
  };
}
