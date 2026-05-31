let lastGeneratedJSON = null;
let lastHTML = "";
let regenSeed = null;

/* =========================
   GENERATE SITE
========================= */

async function generateSite(forceNew = false) {

    if (forceNew || !regenSeed) {
        regenSeed = Math.floor(Math.random() * 999999);
    }

    const data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        businessType: document.getElementById("industry")?.value || "",
        colors: document.getElementById("color").value,
        visualStyle: document.getElementById("tone").value,
        requiredPages: ["hero", "features", "about", "cta", "footer"],
        seed: regenSeed
    };

    try {
        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        console.log("AI RESPONSE:", json);

        if (!json || json.error) {
            alert("AI Error — check console");
            console.log(json);
            return;
        }

        lastGeneratedJSON = json;
        lastHTML = buildWebsite(json);

        document.getElementById("frame").srcdoc = lastHTML;

    } catch (err) {
        console.error(err);
        alert("Request failed");
    }
}

/* =========================
   REGENERATE (FORCES NEW DESIGN)
========================= */

function regenerate() {
    generateSite(true);
}

/* =========================
   COPY CODE
========================= */

function copyCode() {
    if (!lastHTML) {
        alert("Nothing to copy");
        return;
    }

    navigator.clipboard.writeText(lastHTML);
    alert("Copied!");
}

/* =========================
   WIX-STYLE TEMPLATE ENGINE
========================= */

function buildWebsite(data) {
    const theme = data.theme || {};
    const sections = data.sections || [];

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.siteName || "AI Site"}</title>

<style>
body {
    margin: 0;
    font-family: Inter, system-ui, Arial;
    background: ${theme.background || "#0b0f1a"};
    color: white;
}

.container {
    max-width: 1100px;
    margin: auto;
    padding: 80px 20px;
}

.section {
    padding: 90px 0;
}

/* HERO */
.hero {
    text-align: center;
    padding: 140px 20px;
}

.hero h1 {
    font-size: 3.2rem;
    margin-bottom: 10px;
}

.hero p {
    opacity: 0.75;
    max-width: 700px;
    margin: auto;
}

.hero small {
    display: block;
    margin-top: 15px;
    opacity: 0.6;
}

/* FEATURES */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
}

.card {
    padding: 20px;
    border-radius: 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
}

.card h3 {
    margin-bottom: 8px;
}

/* CTA */
.cta {
    text-align: center;
    padding: 100px 20px;
    background: rgba(99,102,241,0.15);
}

.button {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 22px;
    border-radius: 999px;
    background: ${theme.primaryColor || "#4f46e5"};
    color: white;
    text-decoration: none;
    font-weight: 600;
}
</style>

</head>

<body>

<div class="container">

${renderHero(data)}
${sections.includes("features") ? renderFeatures(data) : ""}
${sections.includes("about") ? renderAbout(data) : ""}
${sections.includes("cta") ? renderCTA(data) : ""}

</div>

</body>
</html>
`;
}

/* =========================
   COMPONENTS (NOW DENSE)
========================= */

function renderHero(data) {
    return `
<section class="hero">
    <h1>${data.content?.heroHeadline || "Build Something Powerful"}</h1>
    <p>${data.content?.heroSubtext || "Modern AI-generated websites with real structure and design systems."}</p>
    <small>${data.content?.heroSupportingText || "Designed with Wix-style architecture engine"}</small>

    <div class="button">${data.content?.ctaText || "Get Started"}</div>
</section>
`;
}

function renderFeatures() {
    return `
<section class="section features">
    <div class="card">
        <h3>High Performance</h3>
        <p>Optimized layout structure for speed and scalability.</p>
    </div>

    <div class="card">
        <h3>Modern Design System</h3>
        <p>Consistent spacing, typography, and UI hierarchy.</p>
    </div>

    <div class="card">
        <h3>AI Structured Layouts</h3>
        <p>Automatically generated professional design patterns.</p>
    </div>

    <div class="card">
        <h3>Conversion Focused</h3>
        <p>Built to increase engagement and user interaction.</p>
    </div>
</section>
`;
}

function renderAbout(data) {
    return `
<section class="section">
    <h2>About</h2>
    <p>${data.content?.heroSubtext || "We build high-quality modern web experiences using AI-driven design systems."}</p>
</section>
`;
}

function renderCTA(data) {
    return `
<section class="cta">
    <h2>Ready to Launch?</h2>
    <div class="button">${data.content?.ctaText || "Start Now"}</div>
</section>
`;
}
