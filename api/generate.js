export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
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
You are an extrodniary, elite website generation engine.

IMPORTANT:
Return ONLY valid JSON.
Do NOT wrap JSON in markdown.
Do NOT explain anything.
Do NOT include comments.

Seed: ${seed}

Business Information:
Name: ${name}
Description: ${description}
Type: ${businessType}
Colors: ${colors}
Style: ${visualStyle}

Select ONE template from:
${templatePool.join(", ")}

JSON Schema:

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
    "buttons": [
      "string",
      "string"
    ]
  },

  "features": [
    {
      "title": "string",
      "description": "string"
    }
  ],

  "sections": [
    "hero",
    "features",
    "about",
    "cta"
  ]
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
                    temperature: 0.9,
                    response_format: {
                        type: "json_object"
                    },
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a JSON API. Return valid JSON only."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
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

        const content =
            data?.choices?.[0]?.message?.content;

        if (!content) {
            return res.status(500).json({
                error: "No content returned from AI"
            });
        }

        let parsed;

        try {
            parsed = JSON.parse(content);
        } catch {
            return res.status(500).json({
                error: "AI returned invalid JSON",
                raw: content
            });
        }

        return res.status(200).json(parsed);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message
        });
    }
}
