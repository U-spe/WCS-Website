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

        const safeSeed =
            typeof seed === "number"
                ? seed
                : Math.floor(Math.random() * 999999);

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
You are a deterministic website generator.

CRITICAL RULES:
Return ONLY valid JSON.
No markdown.
No explanations.
No trailing commas.
Must match schema exactly.

IMPORTANT:
- Always choose a template from the provided list.
- Always fill ALL fields.
- Never return null or undefined.

Seed: ${safeSeed}

Business:
Name: ${name}
Description: ${description}
Type: ${businessType}
Colors: ${colors}
Style: ${visualStyle}

Templates:
${templatePool.join(", ")}

OUTPUT JSON FORMAT:

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
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" },
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
                    temperature: 0.7,
                    response_format: { type: "json_object" },
                    messages: [
                        {
                            role: "system",
                            content:
                                "Return ONLY valid JSON. No text. No markdown."
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
            return res.status(500).json({
                error: "No AI output"
            });
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
           HARD GUARANTEES (CRASH FIXES)
        ========================= */

        // template safety
        if (!templatePool.includes(parsed.template)) {
            parsed.template =
                templatePool[safeSeed % templatePool.length];
        }

        // siteName safety
        parsed.siteName = parsed.siteName || name;

        // theme safety
        parsed.theme = parsed.theme || {};
        parsed.theme.primaryColor =
            parsed.theme.primaryColor || "#4f46e5";
        parsed.theme.background =
            parsed.theme.background || "#0b0f1a";

        // hero safety (THIS FIXES YOUR FIRST LOAD CRASH)
        parsed.hero = parsed.hero || {};
        parsed.hero.headline =
            parsed.hero.headline || "Welcome";
        parsed.hero.subtext =
            parsed.hero.subtext || "";
        parsed.hero.supportText =
            parsed.hero.supportText || "";
        parsed.hero.buttons =
            Array.isArray(parsed.hero.buttons)
                ? parsed.hero.buttons
                : ["Get Started", "Learn More"];

        // features safety (CRITICAL FOR BUILD FAILS)
        if (!Array.isArray(parsed.features)) {
            parsed.features = [];
        }

        // always force 6 features so UI never breaks
        while (parsed.features.length < 6) {
            parsed.features.push({
                title: "Feature",
                description: "Description coming soon"
            });
        }

        parsed.features = parsed.features.slice(0, 6);

        // sections safety
        parsed.sections = Array.isArray(parsed.sections)
            ? parsed.sections
            : ["hero", "features", "about", "cta"];

        return res.status(200).json(parsed);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message
        });
    }
}
