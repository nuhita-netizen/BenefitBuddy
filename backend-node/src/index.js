import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient.js';
import { checkEligibility } from './rulesEngine.js';
import { generateExplanation as generateGeminiExplanation, chatWithGemini } from './geminiService.js';
import { generateOpenAIExplanation } from './openaiService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import crypto from 'crypto';

app.post('/users', async (req, res) => {
    const userData = {
        id: crypto.randomUUID(),
        ...req.body
    };

    const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/users/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id)
        .single();
    if (error) return res.status(404).json({ error: "User not found" });
    res.json(data);
});

app.get('/insurance', async (req, res) => {
    const { data, error } = await supabase.from('insurance_plans').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/ask-gemini', async (req, res) => {
    try {
        const { question, user, scheme } = req.body;
        const answer = await chatWithGemini(question, user, scheme);
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/schemes', async (req, res) => {
    const { data, error } = await supabase.from('schemes').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/schemes', async (req, res) => {
    const { data, error } = await supabase
        .from('schemes')
        .insert([req.body])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/eligibility/check/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;

        // Get user
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get schemes
        const { data: schemes, error: schemesError } = await supabase.from('schemes').select('*');
        if (schemesError) return res.status(500).json({ error: schemesError.message });

        const results = [];
        const logs = [];

        for (const scheme of schemes) {
            const { isEligible, reason, criteria_checked } = checkEligibility(user, scheme);

            let explanation = "";
            try {
                explanation = await generateGeminiExplanation(user.name, scheme.name, isEligible, reason);
            } catch (geminiError) {
                console.log("Gemini failed, falling back to OpenAI...");
                try {
                    explanation = await generateOpenAIExplanation(user.name, scheme.name, isEligible, reason);
                } catch (openAiError) {
                    // Final fallback string
                    explanation = isEligible
                        ? `${user.name} is eligible for ${scheme.name}. ${reason}`
                        : `Unfortunately, ${user.name} is not eligible for ${scheme.name} because: ${reason}`;
                }
            }

            logs.push({
                user_id: user.id,
                scheme_name: scheme.name,
                is_eligible: isEligible,
                deterministic_reason: reason,
                ai_explanation: explanation
            });

            results.push({
                scheme: scheme, // pass entire scheme object to frontend
                scheme_name: scheme.name,
                is_eligible: isEligible,
                criteria_checked: criteria_checked,
                deterministic_reason: reason,
                ai_explanation: explanation
            });
        }

        // Batch insert logs
        if (logs.length > 0) {
            const { error: logError } = await supabase.from('interaction_logs').insert(logs);
            if (logError) console.error("Logging error:", logError);
        }

        res.json({ user_id: user.id, results });
    } catch (err) {
        console.error("Unhandled error in eligibility check:", err);
        res.status(500).json({ error: "An internal server error occurred." });
    }
});

app.get('/users/:user_id/history', async (req, res) => {
    const userId = req.params.user_id;
    const { data, error } = await supabase
        .from('interaction_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
