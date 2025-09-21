import { GoogleGenerativeAI } from "@google/generative-ai";

exports.handler = async (event) => {
    // 1. Récupérez votre clé d'API de manière sécurisée depuis les variables d'environnement de Netlify
    const API_KEY = process.env.VOTRE_CLE_API_GEMINI;

    // 2. Initialisez l'API Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 3. Récupérez le prompt de l'utilisateur depuis la requête HTTP
    const { prompt } = JSON.parse(event.body);

    try {
        // 4. Appelez l'API Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. Renvoyez la réponse de l'IA au client
        return {
            statusCode: 200,
            body: JSON.stringify({ response: text }),
        };
    } catch (error) {
        console.error("Erreur avec l'API Gemini :", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erreur lors de la communication avec l'assistant IA." }),
        };
    }
};
