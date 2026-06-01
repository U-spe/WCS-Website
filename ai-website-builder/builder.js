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
   REGENERATE
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
   TEMPLATE ENGINE V5
========================= */

function buildWebsite(data) {
    const theme = data.theme || {};
    const hero = data.hero || {};
    const features = data.features || [];
    const template = data.template || "default";
    const sections = data.sections || ["hero", "features", "about", "cta"];

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHtml(data.siteName || "AI Site")}</title>

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

/* HERO BASE */
.hero {
    padding: 140px 20px;
    text-align: center;
}

.hero.split {
    display: flex;
    text-align: left;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
}

.hero.minimal {
    padding: 100px 20px;
    text-align: left;
}

.hero h1 {
    font-size: 3rem;
}

.hero p {
    opacity: 0.8;
    max-width: 700px;
}

/* BUTTONS */
.hero-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.btn {
    padding: 12px 18px;
    border-radius: 999px;
    background: ${theme.primaryColor || "#4f46e5"};
    display: inline-block;
}

/* FEATURES */
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

${renderSection("hero", data, hero, features, template)}
${renderSection("features", data, hero, features, template)}
${renderSection("about", data, hero, features, template)}
${renderSection("cta", data, hero, features, template)}

</body>
</html>
`;
}

/* =========================
   SECTION RENDERER
========================= */

function renderSection(type, data, hero, features, template) {
    const desc = escapeHtml(data.description || "");

    if (type === "hero") {
        const buttons = (hero.buttons || [])
            .map(b => `<div class="btn">${escapeHtml(b)}</div>`)
            .join("");

        const layoutClass =
            template.includes("split") ? "split" :
            template.includes("minimal") ? "minimal" :
            "";

        return `
<section class="hero ${layoutClass}">
    <div>
        <h1>${escapeHtml(hero.headline || "")}</h1>
        <p>${escapeHtml(hero.subtext || "")}</p>

        <div class="hero-buttons">
            ${buttons}
        </div>

        <p style="opacity:0.6;margin-top:20px;">
            ${escapeHtml(hero.supportText || "")}
        </p>
    </div>
</section>
`;
    }

    if (type === "features") {
        return `
<section class="features">
    ${features.map(f => `
        <div class="card">
            <h3>${escapeHtml(f.title || "")}</h3>
            <p>${escapeHtml(f.description || "")}</p>
        </div>
    `).join("")}
</section>
`;
    }

    if (type === "about") {
        return `
<section class="about">
    <h2>About</h2>
    <p>${desc}</p>
</section>
`;
    }

    if (type === "cta") {
        return `
<section class="cta">
    <h2>Ready to build something powerful?</h2>
    <div class="btn">Get Started</div>
</section>
`;
    }

    return "";
}

/* =========================
   SECURITY HELPER (IMPORTANT)
========================= */

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
