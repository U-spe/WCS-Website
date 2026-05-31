let lastGeneratedJSON = null;
let lastHTML = "";

async function generateSite() {
    const data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        businessType: document.getElementById("industry")?.value || "",
        colors: document.getElementById("color").value,
        visualStyle: document.getElementById("tone").value,
        requiredPages: ["hero", "features", "about", "cta", "footer"]
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

function regenerate() {
    if (!lastGeneratedJSON) {
        alert("Generate a site first");
        return;
    }
    generateSite();
}

function copyCode() {
    if (!lastHTML) {
        alert("Nothing to copy yet");
        return;
    }

    navigator.clipboard.writeText(lastHTML);
    alert("Copied!");
}

/* =========================
   WIX-LEVEL RENDER ENGINE (FIXED)
========================= */

function buildWebsite(data) {
    const theme = data.theme || {};
    const sections = data.sections || [];

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.siteName || "Website"}</title>

<style>
body {
    margin: 0;
    font-family: Inter, system-ui, Arial;
    background: ${theme.background || "#0b0f1a"};
    color: white;
}

/* GLOBAL */
.container {
    max-width: 1100px;
    margin: auto;
    padding: 80px 20px;
}

.section {
    padding: 80px 0;
}

/* HERO */
.hero {
    text-align: center;
    padding: 120px 20px;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 10px;
}

.hero p {
    opacity: 0.8;
    max-width: 600px;
    margin: auto;
}

/* FEATURES */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
}

.card {
    padding: 20px;
    border-radius: 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
}

/* CTA */
.cta {
    text-align: center;
    padding: 90px 20px;
    background: rgba(99,102,241,0.15);
    border-top: 1px solid rgba(255,255,255,0.08);
}

/* BUTTON */
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

${sections.includes("features") ? renderFeatures() : ""}

${sections.includes("about") ? renderAbout(data) : ""}

${sections.includes("cta") ? renderCTA(data) : ""}

</div>

</body>
</html>
`;
}

/* =========================
   COMPONENTS (THIS FIXES YOUR CRASH)
========================= */

function renderHero(data) {
    return `
<section class="hero">
    <h1>${data.content?.heroHeadline || "Build Something Amazing"}</h1>
    <p>${data.content?.heroSubtext || "Modern websites generated instantly."}</p>
    <div class="button">${data.content?.ctaText || "Get Started"}</div>
</section>
`;
}

function renderFeatures() {
    return `
<section class="section features">
    <div class="card">Fast Performance</div>
    <div class="card">Modern Design</div>
    <div class="card">AI Powered</div>
</section>
`;
}

function renderAbout(data) {
    return `
<section class="section">
    <h2>About</h2>
    <p>${data.content?.heroSubtext || "We build modern web experiences."}</p>
</section>
`;
}

function renderCTA(data) {
    return `
<section class="cta">
    <h2>Ready to Start?</h2>
    <div class="button">${data.content?.ctaText || "Contact Us"}</div>
</section>
`;
}
