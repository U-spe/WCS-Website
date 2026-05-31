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
        requiredPages
    } = req.body || {};

    const prompt = `
You are a senior UX architect.

You ONLY output VALID JSON.

DO NOT output HTML.
DO NOT output explanations.
DO NOT output markdown.

Create a website layout plan.

BUSINESS:
Name: ${name}
Description: ${description}
Type: ${businessType}
Colors: ${colors || "auto"}
Style: ${visualStyle}
Sections requested: ${requiredPages}

OUTPUT FORMAT (STRICT JSON):
{
  "siteName": "",
  "theme": {
    "primaryColor": "",
    "background": "",
    "style": ""
  },
  "layout": "saas | agency | portfolio | ecommerce | nonprofit",
  "sections": [
    "hero",
    "features",
    "about",
    "cta",
    "footer"
  ],
  "content": {
    "heroHeadline": "",
    "heroSubtext": "",
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
                temperature: 0.1,
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        let jsonText = data?.choices?.[0]?.message?.content;

        if (!jsonText) {
            return res.status(500).json({ error: "No output from AI" });
        }

        // IMPORTANT: parse AI JSON safely
        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (e) {
            return res.status(500).json({
                error: "AI returned invalid JSON",
                raw: jsonText
            });
        }

        return res.status(200).json(parsed);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
