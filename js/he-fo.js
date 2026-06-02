async function loadComponent(id, file) {
    const element = document.getElementById(id);

    if (!element) return;

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(
        "navbar-container",
        "nav/header.html"
    );

    await loadComponent(
        "footer-container",
        "nav/footer.html"
    );

    let lastScroll = 0;

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 20) {
            navbar.classList.remove("navbar-hidden");
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll > lastScroll) {
            navbar.classList.add("navbar-hidden");
        } else {
            navbar.classList.remove("navbar-hidden");
        }

        lastScroll = currentScroll;
    });

});
