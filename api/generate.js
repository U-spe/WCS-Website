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
            seed = Math.floor(Math.random() * 999999)
        } = req.body || {};

        const templatePool = [
            "hero_center_features_grid",
            "hero_split_right_media",
            "hero_gradient_overlay",
            "hero_minimal_text_focus",
            "hero_dark_glass_saas",
            "agency_storytelling_layout",
            "startup_pitch_deck_style",
            "portfolio_masonry_flow",
            "ecommerce_showcase_grid",
            "ecommerce_luxury_focus",
            "app_dashboard_preview",
            "app_feature_highlight_stack",
            "nonprofit_story_driven",
            "landing_conversion_funnel",
            "product_waitlist_launch",
            "modern_saas_sections",
            "bold_typography_layout",
            "image_first_visual_flow",
            "grid_based_modern_ui",
            "editorial_magazine_style"
        ];

        const prompt = `
You are a world-class website generation engine.

CRITICAL RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- Must strictly follow schema

Seed: ${seed}

Business:
Name: ${name}
Description: ${description}
Type: ${businessType}
Colors: ${colors}
Style: ${visualStyle}

YOU MUST SELECT EXACTLY ONE TEMPLATE FROM THIS LIST:
${templatePool.join(", ")}

OUTPUT SCHEMA:
{
  "siteName": "string",
  "template": "string",
  "theme": {
    "primaryColor": "string",
    "background": "string"
  },
  "hero": {
    "headline": "string",
    "subtext": "string",
    "supportText": "string",
    "buttons": ["string", "string"]
  },
  "features": [
    { "title": "string", "description": "string" }
  ],
  "sections": ["hero", "features", "about", "cta"]
}
`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.8,
                    response_format: { type: "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: "You are a strict JSON generator. Output valid JSON only."
                        },
                        { role: "user", content: prompt }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({
                error: "Groq API Error",
                details: errorText
            });
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content) {
            return res.status(500).json({ error: "No AI output" });
        }

        let parsed;

        try {
            parsed = JSON.parse(content);
        } catch (err) {
            return res.status(500).json({
                error: "Invalid JSON from AI",
                raw: content
            });
        }

        /* =========================
           🔥 CRITICAL FIX: TEMPLATE VALIDATION
        ========================= */

        if (!templatePool.includes(parsed.template)) {
            parsed.template =
                templatePool[
                    Math.floor(Math.random() * templatePool.length)
                ];
        }

        /* =========================
           SAFETY FALLBACKS
        ========================= */

        parsed.siteName = parsed.siteName || name;

        parsed.hero = parsed.hero || {
            headline: "Welcome",
            subtext: "",
            supportText: "",
            buttons: ["Get Started", "Learn More"]
        };

        parsed.features = Array.isArray(parsed.features)
            ? parsed.features
            : [];

        parsed.sections = Array.isArray(parsed.sections)
            ? parsed.sections
            : ["hero", "features", "about", "cta"];

        parsed.theme = parsed.theme || {
            primaryColor: "#4f46e5",
            background: "#0b0f1a"
        };

        return res.status(200).json(parsed);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message
        });
    }
}
