
import { GoogleGenAI } from "@google/genai";

// Lazy-load AI client at runtime to ensure API key is available
let ai: any = null;

const getAIClient = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const getSpiritualGuidance = async (message: string) => {
  try {
    const aiClient = getAIClient();
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `Eres un asistente espiritual católico amable y compasivo para la aplicación "Radio Diaconía San Romero". 
        Tu misión es brindar consuelo, sugerir versículos de la Biblia y ofrecer oraciones. 
        Te inspiras en el legado de justicia y amor de San Arnulfo Romero. 
        Siempre mantén un tono de respeto, amor y fe católica. 
        Responde en español de forma concisa.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hijo/a mío/a. En este momento no puedo responder, pero Dios siempre te escucha. Eleva una oración desde tu corazón.";
  }
};

export const generateDailyVerse = async () => {
  try {
    const aiClient = getAIClient();
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Dame un versículo bíblico de esperanza y una breve reflexión para hoy que resuene con el espíritu de servicio y diaconía.',
      config: {
        systemInstruction: 'Eres un capellán digital inspirado en San Arnulfo Romero. Proporciona un versículo y una reflexión corta de 2 frases.',
      }
    });
    return response.text;
  } catch (error) {
    return "La palabra de Dios no está encadenada. (2 Timoteo 2:9) - Reflexión: Que nada nos detenga en nuestra misión de anunciar la esperanza.";
  }
};

export const generateFeaturedImage = async (): Promise<string | null> => {
  try {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A powerful, epic, and modern spiritual artwork of a glowing wooden cross standing on a mountain peak at dawn. Radiant light beams are bursting from behind the cross, symbolizing the resurrection of Jesus Christ. Subtle, ethereal digital waves or a glowing aura suggesting a spiritual broadcast. Dramatic cinematic lighting, high-contrast, professional digital art style, inspiring and awe-striking.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};

export const editImage = async (base64ImageWithHeader: string, prompt: string): Promise<string | null> => {
  try {
    const base64Data = base64ImageWithHeader.split(',')[1];
    const mimeType = base64ImageWithHeader.split(';')[0].split(':')[1];

    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image editing error:", error);
    return null;
  }
};
