const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
});

const json = await res.json();

console.log("FULL RESPONSE:", json);

document.getElementById("output").textContent =
    JSON.stringify(json, null, 2);
