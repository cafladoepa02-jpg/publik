
import { GoogleGenAI, Modality, GenerateContentResponse, StartLiveSessionResponse } from "@google/genai";
// FIX: Replaced deprecated LiveConfig with LiveRequestConfig.
import type { LiveCallbacks, LiveRequestConfig } from "@google/genai";

let ai: GoogleGenAI;

const getAi = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<GenerateContentResponse> => {
    const aiInstance = getAi();
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: prompt,
    };

    const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    return response;
};

// FIX: Replaced deprecated LiveConfig and LiveSession types.
export const connectToOracle = (callbacks: LiveCallbacks, config: LiveRequestConfig): Promise<StartLiveSessionResponse> => {
    const aiInstance = getAi();
    return aiInstance.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks,
        config,
    });
};
