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
You are a world-class UI/UX designer and senior frontend engineer.

You generate HIGH-END, production-quality, modern SaaS websites.

You must design based on structured inputs, not guesses.

---

BUSINESS INFO:
- Name: ${name}
- Description: ${description}
- Business Type: ${businessType}
- Colors: ${colors || "auto-generate a modern professional palette"}
- Visual Style: ${visualStyle}
- Required Pages/Sections: ${requiredPages}

---

CRITICAL INSTRUCTIONS:

1. The website MUST match the business type:
   - SaaS → clean dashboard-style landing page
   - Agency → bold, visual, portfolio-heavy layout
   - E-commerce → product-focused structure
   - Portfolio → personal branding aesthetic
   - Nonprofit → trust-focused storytelling layout

2. REQUIRED PAGES/SECTIONS MUST BE INCLUDED EXACTLY:
   ${requiredPages}

3. Design must feel like:
   - Stripe
   - Vercel
   - Linear
   - Notion
   (modern SaaS level)

4. Layout requirements:
   - strong visual hierarchy
   - large spacing system
   - consistent grid alignment (12-col or flex layout)
   - mobile-first responsive design

5. Must include:
   - Hero section (strong headline + CTA)
   - Feature/Services section
   - About section
   - CTA section
   - Footer

6. Visual style rules:
   - Use: ${visualStyle}
   - Use modern gradients OR glassmorphism OR soft shadows (balanced, not overdone)
   - Professional typography (Inter/system-ui style)
   - Clean spacing system

7. Colors:
   - If colors provided, follow them strictly
   - If not, generate a modern SaaS palette automatically

---

OUTPUT RULES:
- Return ONLY complete working HTML
- Include CSS inside <style> tags
- Minimal JS only if necessary
- No explanations
- No markdown formatting
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
