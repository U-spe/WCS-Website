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

        document.getElementById("output").textContent =
            JSON.stringify(json, null, 2);

    } catch (err) {
        console.error("ERROR:", err);

        document.getElementById("output").textContent =
            "Error: " + err.message;
    }
}
