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
        seed: regenSeed
    };

    try {
        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (!json || json.error) {
            console.log(json);
            alert("AI Error — check console");
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
   REGENERATE (FORCES NEW LAYOUT)
========================= */

function regenerate() {
    generateSite(true);
}

/* =========================
   COPY CODE
========================= */

function copyCode() {
    if (!lastHTML) return alert("Nothing yet");
    navigator.clipboard.writeText(lastHTML);
    alert("Copied!");
}

/* =========================
   V4 TEMPLATE ENGINE
========================= */

function buildWebsite(data) {
    const theme = data.theme || {};
    const hero = data.hero || {};
    const features = data.features || [];

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.siteName || "AI Site"}</title>

<style>
body {
    margin: 0;
    font-family: Inter, system-ui;
    background: ${theme.background || "#0b0f1a"};
    color: white;
}

/* GLOBAL */
.container {
    max-width: 1100px;
    margin: auto;
    padding: 80px 20px;
}

/* HERO VARIANTS (V4 CORE) */
.hero {
    padding: 140px 20px;
    text-align: center;
}

.hero h1 {
    font-size: 3.5rem;
}

.hero p {
    opacity: 0.8;
    max-width: 700px;
    margin: auto;
}

.hero-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
}

.btn {
    padding: 12px 18px;
    border-radius: 999px;
    background: ${theme.primaryColor || "#4f46e5"};
}

/* FEATURES (NOW FULLY DYNAMIC) */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    padding: 80px 20px;
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

/* ABOUT */
.about {
    padding: 100px 20px;
    max-width: 900px;
    margin: auto;
    text-align: center;
}

/* CTA */
.cta {
    text-align: center;
    padding: 100px 20px;
    background: rgba(99,102,241,0.15);
}
</style>

</head>

<body>

<section class="hero">
    <h1>${hero.headline}</h1>
    <p>${hero.subtext}</p>

    <div class="hero-buttons">
        ${(hero.buttons || []).map(b => `<div class="btn">${b}</div>`).join("")}
    </div>

    <p style="opacity:0.6;margin-top:20px;">
        ${hero.supportText || ""}
    </p>
</section>

<section class="features">
    ${features.map(f => `
        <div class="card">
            <h3>${f.title}</h3>
            <p>${f.description}</p>
        </div>
    `).join("")}
</section>

<section class="about">
    <h2>About</h2>
    <p>${data.description || ""}</p>
</section>

<section class="cta">
    <h2>Ready to build something powerful?</h2>
    <div class="btn">Get Started</div>
</section>

</body>
</html>
`;
}
