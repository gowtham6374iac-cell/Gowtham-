
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, URLFeatures } from "../types";

// Always use the API key from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeURLWithAI = async (features: URLFeatures, heuristicScore: number): Promise<Partial<AnalysisResult>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a cybersecurity phishing analysis on the following URL features. 
      URL: ${features.url}
      Length: ${features.length}
      Has @: ${features.hasAtSymbol}
      Is HTTPS: ${features.hasHttps}
      Dots: ${features.dotCount}
      Is IP: ${features.isIPAddress}
      Basic Heuristic Risk Score: ${heuristicScore}/100

      Provide a detailed verdict.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPhishing: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            riskScore: { type: Type.NUMBER },
            aiVerdict: { type: Type.STRING }
          },
          required: ["isPhishing", "confidence", "riskScore", "aiVerdict"]
        }
      }
    });

    // Safely extract and trim the text response before parsing as JSON.
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty model response text");
    }
    const jsonStr = responseText.trim();
    const result = JSON.parse(jsonStr);
    return result;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      isPhishing: heuristicScore > 50,
      confidence: 0.7,
      riskScore: heuristicScore,
      aiVerdict: "AI analysis unavailable. Falling back to heuristic model."
    };
  }
};
