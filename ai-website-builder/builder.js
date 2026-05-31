let lastGeneratedCode = "";

async function generateSite() {

    const data = {
        name: document.getElementById("name").value,
        industry: document.getElementById("industry").value,
        description: document.getElementById("description").value,
        tone: document.getElementById("tone").value,
        color: document.getElementById("color").value
    };

    try {
        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        console.log("FULL RESPONSE:", json);

        if (json.error) {
            alert("API Error: " + json.error);
            return;
        }

        const code = json.result;

        if (!code) {
            alert("No code returned from AI");
            return;
        }

        lastGeneratedCode = code;

        document.getElementById("frame").srcdoc = code;

    } catch (err) {
        console.error(err);
        alert("Request failed: " + err.message);
    }
}

function regenerate() {
    generateSite();
}

function copyCode() {
    if (!lastGeneratedCode) {
        alert("No code to copy yet");
        return;
    }

    navigator.clipboard.writeText(lastGeneratedCode);
    alert("Code copied!");
}
