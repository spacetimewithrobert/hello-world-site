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
    const body = document.body;
    const label = document.getElementById("pageLabel");

    if (!label) return;

    // reset all states
    body.classList.remove("status-go", "status-pending", "status-nogo");

    switch (state) {
        case "GO":
            body.classList.add("status-go");
            label.textContent = "GO";
            break;

        case "NO_GO":
            body.classList.add("status-nogo");
            label.textContent = "NO GO";
            break;

        default:
            body.classList.add("status-pending");
            label.textContent = "PENDING";
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

    document.getElementById("pageLabel").textContent = states[page] || "EVENTS";
}

document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("site-header");
    if (!mount) return;

    mount.innerHTML = HEADER_HTML;

    applyPageState(getCurrentPage());
});
