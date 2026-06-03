import Groq from 'groq-sdk';

// Vercel automatically pulls this from your Environment Variables settings
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  // Vercel API route security: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  const requiredSections = ['header', 'hero', 'about', 'services', 'whyUs', 'testimonials', 'FAQ', 'gallery', 'footer'];

  const systemInstructions = `
    You are an expert full-stack web developer. Generate a complete website blueprint based on the user request.
    
    CRITICAL RULES:
    1. You MUST generate data for exactly these 9 sections in this exact order: ${requiredSections.join(', ')}. Do not skip, omit, or shorten any section.
    2. Your response must be purely a valid JSON array of objects. Do NOT wrap the response in markdown blocks. Output NOTHING but valid JSON.
    3. Use professional, diverse color palettes (Hex codes) matching the theme. Do not use the same colors for every section.
    
    JSON Array Structure:
    [
      {
        "type": "header",
        "theme": { "bg": "#ffffff", "text": "#1a1a1a", "accent": "#3b82f6" },
        "title": "Brand Name",
        "content": { "links": ["About", "Services", "FAQ"] }
      },
      {
        "type": "hero",
        "theme": { "bg": "#f3f4f6", "text": "#111827", "accent": "#3b82f6" },
        "title": "Main Catchy Headline",
        "subtitle": "Supporting sub-headline text goes here.",
        "content": { "ctaText": "Get Started" }
      }
    ]
    Remember: Generate all 9 sections following this structure exactly.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: `Build a website for: ${prompt}` }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" }
    });

    let rawOutput = completion.choices[0]?.message?.content || "[]";
    
    // Safety fallback: Strip markdown wrappers if LLaMA ignores the "no markdown" rule
    rawOutput = rawOutput.replace(/```json/gi, '').replace(/```/gi, '').trim();

    const data = JSON.parse(rawOutput);
    
    // Standardize key wrapper handling
    const sectionsArray = Array.isArray(data) ? data : (data.sections || Object.values(data)[0]);

    if (!sectionsArray || !Array.isArray(sectionsArray)) {
      throw new Error("Invalid structure returned from Groq");
    }

    res.status(200).json(sectionsArray);
  } catch (error) {
    console.error("Groq Generation Error:", error);
    res.status(500).json({ error: "Failed to build layout structural data" });
  }
}
