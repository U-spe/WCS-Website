export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {
            name = "Business",
            description = "",
            businessType = "Business",
            colors = "auto",
            visualStyle = "modern",
            seed
        } = req.body || {};

        const safeSeed = typeof seed === "number" ? seed : Math.floor(Math.random() * 999999);

        // Aligned with IDs from your templates.js library
        const templatePool = [
            "saas_dark", "saas_light", "agency_modern", "agency_luxury", 
            "tech_product", "ecommerce_modern", "portfolio_creator", 
            "consulting", "software_company", "marketing_agency"
        ];

        const prompt = `
You are an elite UX/UI determinist AI for an automated website builder.

CRITICAL RULES:
Return ONLY valid JSON.
No markdown. No explanations. No trailing commas.
Must match schema exactly.

IMPORTANT:
- Pick ONE template ID exactly from the list provided.
- Fill ALL fields with professional, high-converting copy.
- Never return null.

Seed: ${safeSeed}

Business Context:
Name: ${name}
Description: ${description}
Type: ${businessType}
Requested Colors: ${colors}
Style Vibe: ${visualStyle}

Allowed Templates:
${templatePool.join(", ")}

OUTPUT JSON SCHEMA:
{
  "siteName": "string",
  "template": "string",
  "theme": {
    "primaryColor": "Hex Code",
    "background": "Hex Code",
    "textColor": "Hex Code (Ensure contrast with background)"
  },
  "hero": {
    "headline": "Punchy H1",
    "subtext": "Persuasive subheadline",
    "buttons": ["Primary CTA", "Secondary CTA"]
  },
  "features": [
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" }
  ],
  "sections": ["hero", "features", "cta"]
}
`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: "Return ONLY valid JSON. No text. No markdown."
                    },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({
                error: "Groq API Error",
                details: errorText
            });
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content) return res.status(500).json({ error: "No AI output" });

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (err) {
            return res.status(500).json({ error: "Invalid JSON", raw: content });
        }

        // --- HARD GUARANTEES (CRASH FIXES) ---
        if (!templatePool.includes(parsed.template)) {
            parsed.template = templatePool[safeSeed % templatePool.length];
        }

        parsed.siteName = parsed.siteName || name;
        parsed.theme = parsed.theme || {};
        parsed.theme.primaryColor = parsed.theme.primaryColor || "#2563eb";
        parsed.theme.background = parsed.theme.background || "#0b0f1a";
        parsed.theme.textColor = parsed.theme.textColor || "#ffffff";

        parsed.hero = parsed.hero || {};
        parsed.hero.headline = parsed.hero.headline || "Welcome";
        parsed.hero.subtext = parsed.hero.subtext || "Let's build something great.";
        parsed.hero.buttons = Array.isArray(parsed.hero.buttons) ? parsed.hero.buttons : ["Get Started"];

        if (!Array.isArray(parsed.features)) parsed.features = [];
        
        while (parsed.features.length < 3) {
            parsed.features.push({ title: "Feature", description: "Coming soon." });
        }
        parsed.features = parsed.features.slice(0, 6);

        return res.status(200).json(parsed);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
}
