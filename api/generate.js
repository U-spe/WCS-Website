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
You are a senior UI/UX designer and expert frontend engineer.

You generate ONLY production-grade, modern SaaS websites.

────────────────────────
BUSINESS DATA
────────────────────────
Name: ${name}
Description: ${description}
Business Type: ${businessType}
Colors: ${colors || "auto-generate a modern SaaS palette"}
Visual Style: ${visualStyle}
Required Sections: ${requiredPages}

────────────────────────
DESIGN SYSTEM (STRICT)
────────────────────────
- Font: Inter, system-ui, sans-serif
- Max width: 1200px centered layout
- Background: dark modern SaaS style (#050505 or deep gradient)
- Primary accent: derived from Colors or modern blue/purple
- Spacing system: 8px / 16px / 24px / 32px / 64px
- Cards: glassmorphism (blur(12px), semi-transparent backgrounds)
- Border radius: 16px–24px
- Buttons: gradient + hover lift (-3px transform)
- Layout: flex or grid (clean alignment only)
- Must be fully responsive (mobile-first)

────────────────────────
HARD REQUIREMENTS
────────────────────────
- MUST include all required sections exactly:
${requiredPages}

- MUST include:
  • Hero section (strong headline + CTA button)
  • Features or Services section
  • About section
  • CTA section
  • Footer

- MUST adapt layout to business type:
  • SaaS → clean product-focused layout
  • Agency → bold portfolio style
  • E-commerce → product grid layout
  • Portfolio → personal branding layout
  • Nonprofit → trust + storytelling layout

────────────────────────
CRITICAL OUTPUT RULES (IMPORTANT)
────────────────────────
- OUTPUT ONLY RAW HTML
- NO explanations
- NO comments
- NO markdown (no \`\`\`)
- NO text before or after code
- FIRST CHARACTER must be "<"
- LAST CHARACTER must be ">"
- If you break this rule, output is invalid

────────────────────────
FINAL TASK
────────────────────────
Generate a complete single-page website using:
- HTML
- CSS inside <style>
- minimal JS only if required
`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.6
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({
                error: "Groq API error",
                details: errText
            });
        }

        const data = await response.json();

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
