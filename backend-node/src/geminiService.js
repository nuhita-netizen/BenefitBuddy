import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
let model = null;

if (API_KEY) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
}

export async function generateExplanation(userName, schemeName, isEligible, reason) {
    if (!model) {
        throw new Error("Gemini API key not configured");
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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

export async function chatWithGemini(question, user, scheme) {
    if (!model) {
        throw new Error("Gemini API key not configured");
    }

    const prompt = `
    You are an AI assistant for a government benefits platform called BenefitBuddy.
    The user is asking a question about a specific scheme. 
    
    User Profile:
    Name: ${user.name}
    Age: ${user.age}
    Income: ₹${user.income}
    Category: ${user.category}
    Occupation: ${user.occupation}

    Scheme Context:
    Name: ${scheme.name}
    Description: ${scheme.description}
    Benefit: ${scheme.benefit_amount_max ? 'Up to ₹' + scheme.benefit_amount_max : 'Varies'} (${scheme.frequency || 'N/A'})
    
    User Question: "${question}"
    
    Instructions:
    Answer the user's question directly based on their profile and the scheme context. 
    Be helpful, polite, and brief (2-3 sentences max).
    If they ask if they are eligible for something not in the context, tell them to check the official guidelines.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        throw error;
    }
}
