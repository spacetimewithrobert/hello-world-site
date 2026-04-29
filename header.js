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
    return "events"; // default homepage
}

function applyPageState(page) {
    const logo = document.getElementById("siteLogo");
    const label = document.getElementById("pageLabel");

    document.querySelectorAll(".site-nav a").forEach(a => {
        if (a.dataset.page === page) {
            a.classList.add("active");
        }
    });

    switch (page) {
        case "about":
            logo.classList.add("filter-about");
            label.textContent = "ABOUT";
            break;

        case "contact":
            logo.classList.add("filter-contact");
            label.textContent = "CONTACT";
            break;

        case "photos":
            logo.classList.add("filter-photos");
            label.textContent = "PHOTOS";
            break;

        default:
            logo.classList.add("filter-events");
            label.textContent = "EVENTS";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("site-header");
    mount.innerHTML = HEADER_HTML;

    const page = getCurrentPage();
    applyPageState(page);
});
