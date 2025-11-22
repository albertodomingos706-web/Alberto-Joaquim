import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBookMetadata = async (topic: string, genre: string): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      Atue como um especialista em Best-Sellers da Amazon KDP.
      Eu tenho um PDF/Ebook sobre o tópico: "${topic}" no gênero "${genre}".
      
      Gere o seguinte em formato JSON:
      1. Um título chamativo e otimizado para SEO (titleSuggestion).
      2. Uma descrição de venda persuasiva (formato HTML simples, max 150 palavras) (descriptionSuggestion).
      3. 7 palavras-chave de alta conversão separadas por vírgula (keywords).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleSuggestion: { type: Type.STRING },
            descriptionSuggestion: { type: Type.STRING },
            keywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error generating metadata:", error);
    throw error;
  }
};

export const analyzeCoverImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming jpeg for simplicity or convert dynamically
              data: base64Image
            }
          },
          {
            text: "Analise esta capa de ebook para venda na Amazon. Dê uma nota de 0 a 10 (score) baseada em legibilidade, design e apelo comercial. Forneça um feedback construtivo curto (coverFeedback) sobre como melhorar para vender mais."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             score: { type: Type.NUMBER },
             coverFeedback: { type: Type.STRING }
           }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing cover:", error);
    throw error;
  }
};