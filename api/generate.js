export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        name,
        description,
        businessType,
        colors,
        visualStyle,
        seed
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
You are a senior UX architect.

CRITICAL:
Return ONLY valid JSON.
No markdown.
No explanations.

Variation Seed: ${seed || Math.floor(Math.random() * 999999)}

YOU MUST SELECT ONE TEMPLATE:
${templatePool.join(", ")}

RULES:
- MUST vary layout based on seed
- MUST create unique feature content every time
- MUST avoid repetition from previous outputs
- MUST behave like Wix/Framer layout engine

Business:
Name: ${name}
Description: ${description}
Type: ${businessType}
Colors: ${colors || "auto"}
Style: ${visualStyle}

OUTPUT FORMAT:

{
  "siteName": "",
  "template": "",

  "theme": {
    "primaryColor": "",
    "background": ""
  },

  "hero": {
    "headline": "",
    "subtext": "",
    "supportText": "",
    "buttons": ["Primary Action", "Secondary Action"]
  },

  "features": [
    { "title": "", "description": "" },
    { "title": "", "description": "" },
    { "title": "", "description": "" },
    { "title": "", "description": "" },
    { "title": "", "description": "" },
    { "title": "", "description": "" }
  ],

  "sections": ["hero", "features", "about", "cta"]
}
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.75,
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        const jsonText = data?.choices?.[0]?.message?.content;

        if (!jsonText) {
            return res.status(500).json({ error: "No AI output" });
        }

        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (e) {
            return res.status(500).json({
                error: "Invalid JSON from AI",
                raw: jsonText
            });
        }

        return res.status(200).json(parsed);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
