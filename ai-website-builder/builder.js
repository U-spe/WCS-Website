let lastCode = "";

async function generate() {

    const payload = {
        name: document.getElementById("name").value,
        industry: document.getElementById("industry").value,
        description: document.getElementById("description").value,
        tone: document.getElementById("tone").value,
        color: document.getElementById("color").value
    };

    const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    lastCode = data.result;

    document.getElementById("frame").srcdoc = lastCode;
}

function regenerate() {
    generate();
}

function copyCode() {
    navigator.clipboard.writeText(lastCode);
    alert("Copied!");
}
