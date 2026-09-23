import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
let openai = null;

if (API_KEY) {
    openai = new OpenAI({ apiKey: API_KEY });
}

export async function generateOpenAIExplanation(userName, schemeName, isEligible, reason) {
    if (!openai) {
        if (isEligible) {
            return `${userName} is eligible for ${schemeName}. ${reason}`;
        } else {
            return `Unfortunately, ${userName} is not eligible for ${schemeName} because: ${reason}`;
        }
    }

    const prompt = `
    You are an AI assistant for a government benefits platform. 
    Explain to the user '${userName}' whether they are eligible for the scheme '${schemeName}'.
    
    Verdict: ${isEligible ? 'Eligible' : 'Not Eligible'}
    Technical Reason: ${reason}
    
    Write a short, polite, and easy-to-understand explanation (1-2 sentences). 
    Do not change the verdict, only explain the technical reason in plain language.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
        });
        
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
}
