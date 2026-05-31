export function buildWebsite(data) {
    const theme = data.theme || {};
    const sections = data.sections || [];

    let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${data.siteName}</title>

<style>
body {
    margin: 0;
    font-family: Inter, system-ui;
    background: ${theme.background || "#050505"};
    color: white;
}

.container {
    max-width: 1200px;
    margin: auto;
    padding: 80px 20px;
}

.hero {
    text-align: center;
    padding: 120px 20px;
}

.hero h1 {
    font-size: 3rem;
}

.section {
    padding: 80px 0;
    border-top: 1px solid rgba(255,255,255,0.1);
}

.button {
    padding: 12px 24px;
    background: ${theme.primaryColor || "#4f46e5"};
    border-radius: 999px;
    display: inline-block;
    margin-top: 20px;
}
</style>

</head>

<body>
<div class="container">
`;

    if (sections.includes("hero")) {
        html += `
<section class="hero">
    <h1>${data.content.heroHeadline}</h1>
    <p>${data.content.heroSubtext}</p>
    <div class="button">${data.content.ctaText}</div>
</section>`;
    }

    if (sections.includes("features")) {
        html += `
<section class="section">
    <h2>Features</h2>
    <p>Built for performance and scalability.</p>
</section>`;
    }

    if (sections.includes("about")) {
        html += `
<section class="section">
    <h2>About</h2>
    <p>${data.content.heroSubtext}</p>
</section>`;
    }

    if (sections.includes("cta")) {
        html += `
<section class="section">
    <h2>Get Started</h2>
    <div class="button">${data.content.ctaText}</div>
</section>`;
    }

    html += `
</div>
</body>
</html>`;

    return html;
}
