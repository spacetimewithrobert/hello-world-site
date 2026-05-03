const HEADER_HTML = `
<header class="site-header">
    <div class="logo-container">

    <div class="logo-badge">
        <img src="images/logo.jpg" class="site-logo" id="siteLogo">

        <svg class="arc-text" viewBox="-30 -40 300 300">
        <defs>
            <path id="dateArc"
                d="M 0,180 A 130,120 0 0,0 240,180" />
        </defs>

        <text>
            <textPath id="statusDateText"
                    href="#dateArc"
                    startOffset="50%"
                    text-anchor="middle">
            Updated May 3, 2026
            </textPath>
        </text>
        </svg>

    </div>
        <div id="statusDate" class="overlay-date"></div>

        <div id="pageLabel" class="overlay-main">EVENTS</div>

    </div>
    
    <nav class="site-nav">
        <a href="about.html">ABOUT</a>
        <a href="index.html" class="active">EVENTS</a>
        <a href="photos.html">PHOTOS</a>
        <a href="contact.html">CONTACT</a>
    </nav>

</header>
`;

function injectHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;

    mount.innerHTML = HEADER_HTML;

    // notify page that header is ready
    document.dispatchEvent(new CustomEvent("headerReady"));
}

/* =========================
   TEXT HELPERS
========================= */

window.setStatusDate = function (text) {
    const el = document.getElementById("statusDate");
    if (el) el.innerHTML = text;
};

window.setUpdatedText = function (text) {
    const el = document.getElementById("updatedText");
    if (el) el.textContent = text;
};

window.setHeaderState = function (state) {
    const body = document.body;
    const label = document.getElementById("pageLabel");

    body.classList.remove(
        "status-go",
        "status-pending",
        "status-nogo"
    );

    if (!label) return;

    if (state === "GO") {
        body.classList.add("status-go");
        label.textContent = "GO";
    }
    else if (state === "NO_GO") {
        body.classList.add("status-nogo");
        label.textContent = "NO GO";
    }
    else {
        body.classList.add("status-pending");
        label.textContent = "PENDING";
    }
};

document.addEventListener("DOMContentLoaded", injectHeader);
