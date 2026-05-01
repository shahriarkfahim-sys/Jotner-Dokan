import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getProductRecommendations(userPreferences: string, allProducts: Product[]): Promise<string[]> {
  try {
    const productListString = allProducts.map(p => `- ${p.id}: ${p.name} (${p.category}) - ${p.description}`).join('\n');
    
    const prompt = `
      You are a specialized personal shopper for an inclusive e-commerce platform that sells handmade crafts from artisans with disabilities.
      
      User Preferences/Context: "${userPreferences}"
      
      Available Products:
      ${productListString}
      
      Based on the user preferences, select the top 3 most relevant product IDs.
      Return ONLY the IDs as a comma-separated list. No other text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    
    const text = response.text || '';
    return text.split(',').map(id => id.trim());
  } catch (error) {
    console.error('Gemini recommendation error:', error);
    return [];
  }
}
