const HEADER_HTML = `
<header class="site-header">

    <div class="logo-container">
        <img src="images/logo.jpg" class="site-logo" id="siteLogo">

        <!-- STATUS TEXT OVERLAY (THIS IS YOUR SINGLE SOURCE OF TRUTH) -->
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

function applyPageState(page) {
    const logo = document.getElementById("siteLogo");
    const label = document.getElementById("pageLabel");

    document.querySelectorAll(".site-nav a").forEach(a => {
        a.classList.toggle("active", a.dataset.page === page);
    });

    const states = {
        about: "ABOUT",
        contact: "CONTACT",
        photos: "PHOTOS",
        events: "EVENTS"
    };

    logo.className = "site-logo";

    logo.classList.add(`filter-${page}`);
    label.textContent = states[page] || "EVENTS";
}

document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("site-header");
    if (!mount) return;

    mount.innerHTML = HEADER_HTML;

    applyPageState(getCurrentPage());
});
