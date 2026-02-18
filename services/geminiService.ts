
import { GoogleGenAI, Type } from "@google/genai";
import { DemandForecast } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIForecast = async (historicalData: any[]): Promise<DemandForecast[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this historical grid data and generate a 24-hour hourly demand forecast for the next day. Return only valid JSON. Data: ${JSON.stringify(historicalData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hour: { type: Type.STRING, description: 'Format 00:00 to 23:00' },
              predicted: { type: Type.NUMBER, description: 'Predicted MW' },
              historical: { type: Type.NUMBER, description: 'Avg historical MW for that hour' }
            },
            required: ['hour', 'predicted', 'historical']
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Forecast Error:", error);
    // Fallback static data if API fails
    return Array.from({ length: 24 }).map((_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      predicted: 400 + Math.sin(i / 3) * 150 + Math.random() * 50,
      historical: 400 + Math.sin(i / 3) * 140
    }));
  }
};

export const getSmartInsight = async (currentGridState: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert power systems engineer. Analyze this current grid state and provide a single concise insight or recommendation (max 40 words): ${JSON.stringify(currentGridState)}`,
    });
    return response.text || "Systems operating within expected parameters.";
  } catch (error) {
    return "Analyzing grid telemetry for anomalies...";
  }
};
