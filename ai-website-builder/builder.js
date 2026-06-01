let lastGeneratedJSON = null;
let lastHTML = "";
let regenSeed = null;
let isGenerating = false;

/* =========================
   GENERATE SITE
========================= */

async function generateSite(forceNew = false) {
    if (isGenerating) return;
    isGenerating = true;

    try {
        if (forceNew || !regenSeed) {
            regenSeed = Math.floor(Math.random() * 999999);
        }

        const getVal = (id) => document.getElementById(id)?.value || "";

        const data = {
            name: getVal("name") || "My Business",
            description: getVal("description") || "A modern business",
            businessType: getVal("industry") || "Business",
            colors: getVal("color") || "auto",
            visualStyle: getVal("tone") || "modern",
            seed: regenSeed
        };

        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (!res.ok || !json || json.error) {
            console.error("Generate error:", json);
            alert("AI Error — check console");
            isGenerating = false;
            return;
        }

        // Safety normalization (VERY IMPORTANT for first load crash fix)
        const safeJSON = normalizeJSON(json);

        lastGeneratedJSON = safeJSON;
        lastHTML = buildWebsite(safeJSON);

        const frame = document.getElementById("frame");
        if (frame) frame.srcdoc = lastHTML;

    } catch (err) {
        console.error("Request failed:", err);
        alert("Request failed");
    }

    isGenerating = false;
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
   SAFE NORMALIZER (CRITICAL FIX)
========================= */

function normalizeJSON(json) {
    return {
        siteName: json.siteName || "AI Site",
        template: json.template || "hero_center_features_grid",

        theme: {
            primaryColor: json.theme?.primaryColor || "#4f46e5",
            background: json.theme?.background || "#0b0f1a"
        },

        hero: {
            headline: json.hero?.headline || "Welcome",
            subtext: json.hero?.subtext || "",
            supportText: json.hero?.supportText || "",
            buttons: Array.isArray(json.hero?.buttons)
                ? json.hero.buttons
                : ["Get Started", "Learn More"]
        },

        features: Array.isArray(json.features)
            ? json.features
            : [],

        sections: Array.isArray(json.sections)
            ? json.sections
            : ["hero", "features", "about", "cta"],

        description: json.description || ""
    };
}

/* =========================
   TEMPLATE ENGINE V6
========================= */

function buildWebsite(data) {
    const theme = data.theme || {};
    const hero = data.hero || {};
    const features = data.features || [];
    const template = data.template || "";

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHtml(data.siteName)}</title>

<style>
body {
    margin: 0;
    font-family: Inter, system-ui;
    background: ${theme.background};
    color: white;
}

.hero {
    padding: 140px 20px;
    text-align: center;
}

.hero.split {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    gap: 40px;
}

.hero.minimal {
    text-align: left;
    padding: 100px 20px;
}

.hero h1 {
    font-size: 3rem;
}

.hero p {
    opacity: 0.8;
    max-width: 700px;
}

.hero-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.btn {
    padding: 12px 18px;
    border-radius: 999px;
    background: ${theme.primaryColor};
    display: inline-block;
}

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

.about {
    padding: 100px 20px;
    max-width: 900px;
    margin: auto;
    text-align: center;
}

.cta {
    text-align: center;
    padding: 100px 20px;
    background: rgba(99,102,241,0.15);
}
</style>

</head>

<body>

${renderSection("hero", data)}
${renderSection("features", data)}
${renderSection("about", data)}
${renderSection("cta", data)}

</body>
</html>
`;
}

/* =========================
   SECTION RENDERER (FIXED)
========================= */

function renderSection(type, data) {
    const hero = data.hero || {};
    const features = data.features || [];
    const desc = escapeHtml(data.description || "");

    if (type === "hero") {
        const layout =
            data.template.includes("split") ? "split" :
            data.template.includes("minimal") ? "minimal" :
            "";

        return `
<section class="hero ${layout}">
    <div>
        <h1>${escapeHtml(hero.headline)}</h1>
        <p>${escapeHtml(hero.subtext)}</p>

        <div class="hero-buttons">
            ${(hero.buttons || [])
                .map(b => `<div class="btn">${escapeHtml(b)}</div>`)
                .join("")}
        </div>

        <p style="opacity:0.6;margin-top:20px;">
            ${escapeHtml(hero.supportText)}
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
    <div class="btn">Get Started!</div>
</section>
`;
    }

    return "";
}

/* =========================
   SECURITY
========================= */

function escapeHtml(str) {
    return String(str || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
