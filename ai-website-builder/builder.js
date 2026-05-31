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
            alert("AI Error: check console");
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

    // small variation trigger (forces new UI feel)
    generateSite();
}

function copyCode() {
    if (!lastHTML) {
        alert("Nothing to copy yet");
        return;
    }

    navigator.clipboard.writeText(lastHTML);
    alert("Code copied!");
}

/* =========================
   WIX-STYLE RENDER ENGINE
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

.container {
    max-width: 1100px;
    margin: auto;
    padding: 80px 20px;
}

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

.section {
    padding: 80px 0;
    border-top: 1px solid rgba(255,255,255,0.08);
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

${sections.includes("hero") ? `
<section class="hero">
    <h1>${data.content?.heroHeadline || "Welcome"}</h1>
    <p>${data.content?.heroSubtext || ""}</p>
    <div class="button">${data.content?.ctaText || "Get Started"}</div>
</section>
` : ""}

${sections.includes("features") ? `
<section class="section">
    <h2>Features</h2>
    <p>Modern, fast, and built for scale.</p>
</section>
` : ""}

${sections.includes("about") ? `
<section class="section">
    <h2>About</h2>
    <p>${data.content?.heroSubtext || ""}</p>
</section>
` : ""}

${sections.includes("cta") ? `
<section class="section">
    <h2>Get Started</h2>
    <div class="button">${data.content?.ctaText || "Contact Us"}</div>
</section>
` : ""}

</div>
</body>
</html>
`;
}
