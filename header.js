const HEADER_HTML = `
<header class="site-header">

    <div class="logo-container">
        <img src="images/logo.jpg" class="site-logo" id="siteLogo">
        <div class="page-label" id="pageLabel"></div>
    </div>

    <nav class="site-nav">
        <a href="about.html" data-page="about">ABOUT</a>
        <a href="index.html" data-page="events">EVENTS</a>
        <a href="photos.html" data-page="photos">PHOTOS</a>
        <a href="contact.html" data-page="contact">CONTACT</a>
    </nav>

</header>
`;

function getCurrentPage() {
    const path = window.location.pathname;

    if (path.includes("about")) return "about";
    if (path.includes("contact")) return "contact";
    if (path.includes("photos")) return "photos";
    return "events";
}

/**
 * GLOBAL EVENT STATE ENGINE HOOK
 * Events page can call this later
 */
function setHeaderState(state) {
    const logo = document.getElementById("siteLogo");
    const label = document.getElementById("pageLabel");

    if (!logo || !label) return;

    // reset classes
    logo.classList.remove("filter-about", "filter-contact", "filter-photos", "filter-events", "grayscale");

    switch (state) {

        case "PENDING":
            logo.classList.add("grayscale");
            label.textContent = "PENDING";
            break;

        case "GO":
            logo.classList.add("filter-events");
            label.textContent = "GO";
            break;

        case "NO_GO":
            logo.classList.add("grayscale");
            logo.style.filter = "grayscale(1) sepia(1) hue-rotate(-50deg) saturate(4)";
            label.textContent = "NO GO";
            break;

        default:
            logo.classList.add("filter-events");
            label.textContent = "EVENTS";
    }
}

function applyPageState(page) {
    const logo = document.getElementById("siteLogo");

    document.querySelectorAll(".site-nav a").forEach(a => {
        a.classList.toggle("active", a.dataset.page === page);
    });

    const states = {
        about: "ABOUT",
        contact: "CONTACT",
        photos: "PHOTOS",
        events: "EVENTS"
    };

    setHeaderState("DEFAULT");

    logo.classList.add(`filter-${page}`);
    document.getElementById("pageLabel").textContent = states[page] || "EVENTS";
}

document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("site-header");
    if (!mount) return;

    mount.innerHTML = HEADER_HTML;

    applyPageState(getCurrentPage());
});
