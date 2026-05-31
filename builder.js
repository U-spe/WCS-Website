let lastCode = "";

async function generate() {

    const data = getForm();

    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();

    lastCode = json.result;

    render(lastCode);
}

function regenerate() {
    generate();
}

function render(code) {
    const iframe = document.getElementById("frame");

    iframe.srcdoc = code;
}

function getForm() {
    return {
        name: document.getElementById("name").value,
        industry: document.getElementById("industry").value,
        description: document.getElementById("description").value,
        tone: document.getElementById("tone").value,
        color: document.getElementById("color").value
    };
}

function copyCode() {
    navigator.clipboard.writeText(lastCode);
    alert("Code copied!");
}
