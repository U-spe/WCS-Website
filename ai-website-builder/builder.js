async function generateSite() {
    const data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        businessType: document.getElementById("businessType")?.value,
        colors: document.getElementById("color").value,
        visualStyle: document.getElementById("tone").value,
        requiredPages: ["hero", "features", "about", "cta", "footer"]
    };

    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();

    console.log("AI PLAN:", json);

    const frame = document.getElementById("frame");

    const siteHTML = buildWebsite(json);

    frame.srcdoc = siteHTML;
}
