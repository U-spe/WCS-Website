let lastScroll = 0;

const navbar = document.querySelector(".navbar");

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
