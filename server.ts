import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it via the Secrets panel in the Settings menu of AI Studio.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Reusable schema definition for structured Gemini responses
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    detectedText: {
      type: Type.STRING,
      description: "For image inputs, this is the exact original native script detected in the image (Thai, Japanese, Chinese, Korean, Arabic, Hindi, Vietnamese, etc.). For text inputs, this is the original native text."
    },
    transliteration: { 
      type: Type.STRING, 
      description: "Full Romanized/Pinyin/RTGS transliteration of the entire text, utilizing spaces between phonetic word segments." 
    },
    translation: { 
      type: Type.STRING, 
      description: "A natural, cohesive English translation of the entire phrase or text." 
    },
    ipa: { 
      type: Type.STRING, 
      description: "Full International Phonetic Alphabet (IPA) representation of the text, including tone, pitch, or stress markers if applicable." 
    },
    syllablesCount: { 
      type: Type.INTEGER, 
      description: "Estimated total number of syllables/morphemes in the text." 
    },
    words: {
      type: Type.ARRAY,
      description: "Segmented word-by-word or morph-by-morph breakdown of the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          thai: { 
            type: Type.STRING, 
            description: "The native script part of this word/segment (e.g., Thai script, Kanji/Kana, Hanzi, Hangul, Arabic letters, Devanagari, or Vietnamese word)." 
          },
          romanization: { 
            type: Type.STRING, 
            description: "The romanized phonetic representation (e.g., sa-wat-dee, konnichiwa, ni hao)." 
          },
          tone: { 
            type: Type.STRING, 
            description: "Tone contour, pitch accent, syllable stress, or grammatical role (e.g. 'mid', 'low', 'rising', 'pitch accent', 'stressed', or 'N/A' as appropriate)." 
          },
          meaning: { 
            type: Type.STRING, 
            description: "English translation/meaning of this specific segment." 
          },
          ipa: { 
            type: Type.STRING, 
            description: "IPA representation of this segment." 
          }
        },
        required: ["thai", "romanization", "tone", "meaning", "ipa"]
      }
    },
    pronunciationGuide: { 
      type: Type.STRING, 
      description: "Linguistic or phonetic tips detailing vowel lengths, consonant shifts, pitch accents, or specific tone details for English learners." 
    },
    languageNotes: { 
      type: Type.STRING, 
      description: "Linguistic or cultural notes about the phrase, politeness level, particle usage, or compound word etymology." 
    }
  },
  required: ["detectedText", "transliteration", "translation", "ipa", "syllablesCount", "words", "pronunciationGuide", "languageNotes"]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body limit to support camera image uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // API endpoint for text transliteration
  app.post("/api/transliterate", async (req, res) => {
    try {
      const { text, mode = "thai-to-roman", language = "th" } = req.body;
      if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({ error: "Input text is required." });
      }

      const ai = getGeminiClient();

      const langNames: Record<string, string> = {
        th: "Thai",
        ja: "Japanese",
        ko: "Korean",
        zh: "Chinese",
        vi: "Vietnamese",
        hi: "Hindi",
        ar: "Arabic"
      };
      const langName = langNames[language] || "Thai";

      let prompt = "";
      if (mode.endsWith("to-roman") || mode === "thai-to-roman") {
        prompt = `Analyze the following ${langName} script: "${text}". Perform a precise transliteration/romanization (phonetics/Pinyin/Hepburn/RTGS as appropriate for ${langName}), English translation, IPA (International Phonetic Alphabet) transcription, syllable/morpheme count, word-by-word/segment breakdown, pronunciation guide, and linguistic/cultural notes. Set 'detectedText' to "${text}".`;
      } else {
        prompt = `Identify the intended ${langName} script for the following Romanized phonetics/transliteration: "${text}". Then perform a complete transliteration analysis back to the native ${langName} script, Romanized form, IPA, syllable/morpheme count, segment breakdown, translation, pronunciation guide, and linguistic/cultural notes. Set 'detectedText' to the reconstructed ${langName} script.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are an expert ${langName}-English linguist, lexicographer, and transcription service. Your task is to analyze the input text and return a beautifully structured, highly accurate transliteration and linguistic analysis in JSON format. Ensure all words/segments are separated cleanly in the 'words' array, mapping the native characters to the 'thai' property to preserve format.`,
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini API.");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Transliteration Error:", error);
      res.status(500).json({ 
        error: error.message || "An error occurred during transliteration.",
        details: error.stack
      });
    }
  });

  // API endpoint for image-based (camera) transliteration
  app.post("/api/transliterate-image", async (req, res) => {
    try {
      const { image, mimeType = "image/jpeg", language = "th" } = req.body;
      if (!image || typeof image !== "string") {
        return res.status(400).json({ error: "Image data (base64) is required." });
      }

      // Strip potential header like data:image/jpeg;base64,
      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

      const ai = getGeminiClient();

      const langNames: Record<string, string> = {
        th: "Thai",
        ja: "Japanese",
        ko: "Korean",
        zh: "Chinese",
        vi: "Vietnamese",
        hi: "Hindi",
        ar: "Arabic"
      };
      const langName = langNames[language] || "Thai";

      const prompt = `Locate and read any prominent ${langName} script, text, signs, labels, or words present in this image. Extract the ${langName} text (set as 'detectedText'), and then perform a precise Romanized transliteration, English translation, IPA transcription, syllable count, segmented breakdown, pronunciation guide, and linguistic/cultural notes on it. If there are multiple parts, combine them or focus on the main subject.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Use gemini-2.5-flash for strong vision + json schema support
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          },
          prompt
        ],
        config: {
          systemInstruction: `You are an expert ${langName}-English visual linguist, OCR scanner, and transcription service. Your task is to extract ${langName} text from the image and return a beautifully structured, highly accurate transliteration and linguistic analysis in JSON format. Ensure you extract the real ${langName} text accurately and map native characters to the 'thai' property to preserve format.`,
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini API vision model.");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Vision Transliteration Error:", error);
      res.status(500).json({ 
        error: error.message || "An error occurred during image transliteration.",
        details: error.stack
      });
    }
  });

  // Serve static assets or mount Vite middleware depending on the environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
