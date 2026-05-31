export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, industry, description, tone, color } = req.body || {};

    const prompt = `
You are an expert web designer.

Generate a COMPLETE SINGLE PAGE WEBSITE using ONLY:
- HTML
- CSS (inside <style>)
- minimal JS if needed

Business:
Name: ${name}
Industry: ${industry}
Description: ${description}
Style: ${tone}
Colors: ${color || "auto choose modern palette"}

RULES:
- Professional SaaS-level design
- Modern UI (glassmorphism / gradients allowed)
- Fully responsive
- Include: hero, about, services, CTA
- NO explanations
- RETURN ONLY CODE
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        // ❌ Handle Groq request failure properly
        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({
                error: "Groq API error",
                details: errText
            });
        }

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            return res.status(500).json({
                error: "Groq returned invalid JSON",
                raw: text
            });
        }

        const output = data?.choices?.[0]?.message?.content;

        if (!output) {
            return res.status(500).json({
                error: "No AI output returned",
                raw: data
            });
        }

        return res.status(200).json({
            result: output
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
