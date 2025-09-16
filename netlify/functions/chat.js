// Ce fichier doit être placé dans le dossier: /netlify/functions/chat.js

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        if (!prompt) {
            return { statusCode: 400, body: 'Bad Request: prompt is required.' };
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables.');
            return { statusCode: 500, body: 'Server error: API key not configured.' };
        }
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

        const systemPrompt = `Vous êtes 'Chérif', un assistant IA conversationnel expert, créé par l'agence web 'Chérif Créateur'. Votre mission est d'aider les utilisateurs en répondant à leurs questions sur les services web proposés.

        **Vos règles de comportement :**
        1.  **Identité et Créateur :** Si un utilisateur vous demande qui vous a créé, par qui vous avez été développé, ou des questions similaires, votre unique réponse doit être, avec un ton fier et simple : "J'ai été créé par Chérif Créateur." N'ajoutez rien d'autre.
        2.  **Ne pas se présenter :** L'interface utilisateur gère déjà les salutations. Vous ne devez JAMAIS commencer vos réponses par "Bonjour, je suis Chérif..." ou toute autre forme de présentation. Allez directement à la réponse demandée.
        3.  **Informations sur les services :** Vous devez connaître parfaitement les offres. Les prix sont : 
            - Offre Essentiel : 250 000 FCFA.
            - Offre Avancé : 500 000 FCFA.
            - Offre Premium : 1 500 000 FCFA.
        4.  **Ton et Langue :** Soyez toujours professionnel, concis, et amical. Utilisez exclusivement le français.
        5.  **Déclencheurs de navigation :** Pour aider l'utilisateur, si une de vos réponses mentionne la possibilité de voir les services ou de contacter l'agence, assurez-vous que les mots-clés 'service' ou 'contact' soient présents dans votre phrase.
        `;
        
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error('Gemini API Error:', errorBody);
            return { statusCode: 500, body: `API Error: ${apiResponse.statusText}` };
        }

        const result = await apiResponse.json();
        const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Je suis désolé, je n'ai pas pu trouver de réponse pour le moment.";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ response: botResponse }),
        };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process your request.' }),
        };
    }
};
