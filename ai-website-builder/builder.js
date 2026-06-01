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
    
    const statusText = document.getElementById("status-text");
    const frame = document.getElementById("frame");
    
    statusText.innerText = "Generating with AI...";
    statusText.style.color = "var(--cyan)";
    
    // Show a loading screen in the iframe
    if (frame) {
        frame.srcdoc = `
            <html style="background:#0b1220; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
                <div style="text-align:center;">
                    <h2 style="margin-bottom:10px;">Architecting Website...</h2>
                    <p style="opacity:0.6;">Writing copy, structuring layouts, applying brand styles.</p>
                </div>
            </html>
        `;
    }

    try {
        if (forceNew || !regenSeed) {
            regenSeed = Math.floor(Math.random() * 999999);
        }

        const getVal = (id) => document.getElementById(id)?.value || "";

        const data = {
            name: getVal("name") || "WCS Business",
            description: getVal("description") || "A professional modern business.",
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
            statusText.innerText = "Error";
            statusText.style.color = "red";
            return;
        }

        const safeJSON = normalizeJSON(json);
        lastGeneratedJSON = safeJSON;
        lastHTML = buildWebsite(safeJSON);

        if (frame) frame.srcdoc = lastHTML;
        
        statusText.innerText = "Generation Complete";
        statusText.style.color = "#10b981"; // Success green

    } catch (err) {
        console.error("Request failed:", err);
        alert("Request failed. Is the API running?");
        statusText.innerText = "Failed";
        statusText.style.color = "red";
    }

    isGenerating = false;
}

/* =========================
   REGENERATE & COPY
========================= */

function regenerate() {
    generateSite(true);
}

function copyCode() {
    if (!lastHTML) return alert("Generate a site first!");
    navigator.clipboard.writeText(lastHTML);
    
    const statusText = document.getElementById("status-text");
    statusText.innerText = "Code Copied to Clipboard!";
    setTimeout(() => {
        statusText.innerText = "Generation Complete";
    }, 3000);
}

/* =========================
   SAFE NORMALIZER
========================= */

function normalizeJSON(json) {
    return {
        siteName: json.siteName || "AI Site",
        template: json.template || "saas_dark",
        theme: {
            primaryColor: json.theme?.primaryColor || "#2563eb",
            background: json.theme?.background || "#ffffff",
            textColor: json.theme?.textColor || "#111827"
        },
        hero: {
            headline: json.hero?.headline || "Welcome to the future",
            subtext: json.hero?.subtext || "We build amazing things.",
            supportText: json.hero?.supportText || "",
            buttons: Array.isArray(json.hero?.buttons) ? json.hero.buttons : ["Get Started"]
        },
        features: Array.isArray(json.features) ? json.features : [],
        sections: Array.isArray(json.sections) ? json.sections : ["hero", "features", "about", "cta"],
        description: json.description || ""
    };
}

/* =========================
   TEMPLATE ENGINE V7 (INTEGRATED WITH TEMPLATES.JS)
========================= */

function buildWebsite(data) {
    const theme = data.theme || {};
    // Fetch rules from templates.js, fallback to random if missing
    const tplConfig = typeof getTemplateById === 'function' ? 
        (getTemplateById(data.template) || getRandomTemplate()) : 
        { hero: "center", services: "cards" };

    // Determine contrast for text based on background (simple heuristic)
    const isDarkBg = theme.background.toLowerCase().includes("#0") || theme.background.toLowerCase().includes("#1");
    const textColor = theme.textColor || (isDarkBg ? "#ffffff" : "#111827");
    const mutedColor = isDarkBg ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
    const cardBg = isDarkBg ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
    const cardBorder = isDarkBg ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(data.siteName)}</title>
<style>
    :root {
        --primary: ${theme.primaryColor};
        --bg: ${theme.background};
        --text: ${textColor};
        --muted: ${mutedColor};
        --card-bg: ${cardBg};
        --card-border: ${cardBorder};
    }
    
    body {
        margin: 0;
        font-family: 'Inter', system-ui, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
        overflow-x: hidden;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    /* Navbar */
    header {
        padding: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--card-border);
    }
    .logo { font-weight: 800; font-size: 1.5rem; letter-spacing: -0.5px; }

    /* Hero Variations */
    .hero {
        padding: 120px 24px;
    }
    .hero-center { text-align: center; }
    .hero-center .hero-content { max-width: 800px; margin: 0 auto; }
    
    .hero-split {
        display: flex;
        align-items: center;
        gap: 60px;
        max-width: 1200px;
        margin: 0 auto;
    }
    .hero-split .hero-content { flex: 1; text-align: left; }
    .hero-split .hero-visual {
        flex: 1;
        height: 400px;
        background: linear-gradient(135deg, var(--primary), transparent);
        border-radius: 24px;
        border: 1px solid var(--card-border);
    }

    .hero h1 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        line-height: 1.1;
        margin-bottom: 24px;
        font-weight: 800;
        letter-spacing: -1px;
    }
    .hero p {
        font-size: 1.25rem;
        color: var(--muted);
        margin-bottom: 32px;
    }

    .btn-group {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }
    .btn {
        padding: 16px 32px;
        border-radius: 99px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
    }
    .btn-primary {
        background: var(--primary);
        color: #fff;
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
    .btn-outline {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--card-border);
    }

    /* Features Grid */
    .features {
        padding: 100px 24px;
        background: var(--card-bg);
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 32px;
        max-width: 1200px;
        margin: 0 auto;
    }
    .card {
        padding: 32px;
        background: var(--bg);
        border-radius: 20px;
        border: 1px solid var(--card-border);
        transition: transform 0.3s ease;
    }
    .card:hover { transform: translateY(-5px); }
    .card h3 { margin-top: 0; font-size: 1.25rem; }
    .card p { color: var(--muted); margin-bottom: 0; }

    /* CTA Section */
    .cta {
        padding: 120px 24px;
        text-align: center;
        background: linear-gradient(45deg, var(--bg), var(--card-bg));
    }
    .cta h2 { font-size: 2.5rem; margin-bottom: 24px; }
</style>
</head>
<body>

<header>
    <div class="logo">${escapeHtml(data.siteName)}</div>
    <div class="btn btn-primary" style="padding: 10px 20px; font-size: 0.9rem;">Contact Us</div>
</header>

${renderSection("hero", data, tplConfig)}
${renderSection("features", data, tplConfig)}
${renderSection("cta", data, tplConfig)}

</body>
</html>`;
}

/* =========================
   SECTION RENDERER
========================= */

function renderSection(type, data, config) {
    const hero = data.hero || {};
    const features = data.features || [];

    if (type === "hero") {
        const layoutClass = config.hero === "split" || config.hero === "image-right" ? "hero-split" : "hero-center";
        
        return `
        <section class="hero">
            <div class="${layoutClass}">
                <div class="hero-content">
                    <h1>${escapeHtml(hero.headline)}</h1>
                    <p>${escapeHtml(hero.subtext)}</p>
                    <div class="btn-group" ${layoutClass === "hero-center" ? 'style="justify-content:center;"' : ''}>
                        ${(hero.buttons || ["Get Started"]).map((b, i) => `
                            <div class="btn ${i === 0 ? 'btn-primary' : 'btn-outline'}">${escapeHtml(b)}</div>
                        `).join("")}
                    </div>
                </div>
                ${layoutClass === "hero-split" ? `<div class="hero-visual"></div>` : ""}
            </div>
        </section>`;
    }

    if (type === "features") {
        return `
        <section class="features">
            <div class="container" style="text-align:center; margin-bottom: 48px;">
                <h2 style="font-size: 2.5rem; margin-bottom:16px;">Our Services</h2>
                <p style="color: var(--muted); max-width:600px; margin:0 auto;">Everything you need to scale and succeed.</p>
            </div>
            <div class="grid">
                ${features.map(f => `
                    <div class="card">
                        <h3>${escapeHtml(f.title || "Feature")}</h3>
                        <p>${escapeHtml(f.description || "Description")}</p>
                    </div>
                `).join("")}
            </div>
        </section>`;
    }

    if (type === "cta") {
        return `
        <section class="cta">
            <div class="container">
                <h2>Ready to elevate your business?</h2>
                <p style="color: var(--muted); font-size: 1.25rem; margin-bottom: 32px;">Join us today and see the difference.</p>
                <div class="btn btn-primary" style="font-size: 1.25rem; padding: 20px 40px;">${escapeHtml(hero.buttons?.[0] || "Get Started")}</div>
            </div>
        </section>`;
    }

    return "";
}

function escapeHtml(str) {
    return String(str || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
