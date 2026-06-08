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

// Automatically builds and injects the favicon globally
function initGlobalFavicon() {
    let favicon = document.querySelector("link[rel*='icon']");
    
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/x-icon'; // Adjust to 'image/png' if your asset is a PNG
        document.head.appendChild(favicon);
    }
    
    favicon.href = '/images/logos/wcs-favicon.ico';
}

document.addEventListener("DOMContentLoaded", async () => {

    // Initialize global assets
    initGlobalFavicon();

    // Load layout structures
    await loadComponent(
        "navbar-container",
        "nav/header.html"
    );

    await loadComponent(
        "footer-container",
        "nav/footer.html"
    );

    // Navbar scroll functionality
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
