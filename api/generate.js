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
        requiredPages,
        seed
    } = req.body || {};

    const templatePool = [
        "saas_dark_glow_v1",
        "saas_dark_glass_v2",
        "saas_light_minimal_v1",
        "startup_modern_v1",
        "startup_modern_v2",
        "agency_split_hero_v1",
        "agency_gradient_v1",
        "portfolio_grid_v1",
        "portfolio_masonry_v1",
        "ecommerce_showcase_v1",
        "ecommerce_luxury_v1",
        "ecommerce_product_v1",
        "landing_conversion_v1",
        "landing_conversion_v2",
        "app_saas_v1",
        "app_saas_v2",
        "dashboard_preview_v1",
        "nonprofit_story_v1",
        "nonprofit_impact_v1",
        "creative_studio_v1"
    ];

    const prompt = `
You are a senior UX architect and product designer.

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanations

Variation Seed: ${seed || Math.floor(Math.random() * 99999)}

Pick ONE template from this list:
${templatePool.join(", ")}

RULES:
- Must vary design based on seed
- Must NOT repeat same layout patterns
- Must feel like Stripe / Vercel / Linear quality
- MUST include rich content (not minimal)
- Add multiple text layers per section

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
  "sections": ["hero", "features", "about", "cta", "footer"],
  "content": {
    "heroHeadline": "",
    "heroSubtext": "",
    "heroSupportingText": "",
    "ctaText": ""
  }
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
                temperature: 0.6,
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
