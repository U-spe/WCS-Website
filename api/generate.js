// /api/generate.js
import { OpenAI } from 'openai'; // or your preferred AI SDK client

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;

  // Strict enforcement array
  const requiredSections = ['header', 'hero', 'about', 'services', 'whyUs', 'testimonials', 'FAQ', 'gallery', 'footer'];

  const systemInstructions = `
    You are an expert full-stack web developer. Generate a complete website blueprint based on the user request.
    
    CRITICAL RULES:
    1. You MUST generate data for exactly these 9 sections in this exact order: ${requiredSections.join(', ')}. Do not skip, omit, or shorten any section.
    2. Your response must be purely a valid JSON array of objects. Do not wrap the response in markdown blocks like \`\`\`json.
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
      },
      ... repeat for every single section type listed above, creating tailored content structures for each.
    ]
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gemini-1.5-pro' depending on your ecosystem
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: `Build a website for: ${prompt}` }
      ],
      response_format: { type: "json_object" } // Enforces strict valid JSON
    });

    const data = JSON.parse(completion.choices[0].message.content);
    // Standardize key wrapper handling if AI nests it inside a root property
    const sectionsArray = Array.isArray(data) ? data : (data.sections || Object.values(data)[0]);

    res.status(200).json(sectionsArray);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to build layout structural data" });
  }
}
