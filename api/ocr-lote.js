// Vercel Serverless Function: /api/ocr-lote
// Identificação de produto, lote e validade via Gemini Vision (com fallback para OCR local)
import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { image } = req.body || {};
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Imagem não fornecida' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        error: 'fallback_local',
        message: 'GEMINI_API_KEY não configurada. Usando OCR local.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          {
            text: "Analise esta foto de embalagem ou produto de supermercado. Identifique o NOME DO PRODUTO (marca, tipo e peso/volume, ex: 'Café Pilão Tradicional 500g'), a CATEGORIA mais adequada, o LOTE (ex: P120526, L123) e a DATA DE VALIDADE (VAL, VENC, EXP) no formato YYYY-MM-DD. Se houver código de barras numérico impresso visível, identifique-o também.",
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nomeProduto: { type: Type.STRING },
            categoria: { type: Type.STRING },
            lote: { type: Type.STRING },
            validade: { type: Type.STRING },
            codigoBarras: { type: Type.STRING },
            textoCompleto: { type: Type.STRING },
          },
        },
      },
    });

    const jsonText = response.text || '{}';
    return res.status(200).json(JSON.parse(jsonText));
  } catch (err) {
    return res.status(200).json({
      error: 'fallback_local',
      message: 'Acionando OCR local',
    });
  }
}
