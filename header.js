const HEADER_HTML = `
<header class="site-header">
    <div class="logo-container">

    <div class="logo-badge">
        <img src="images/logo.jpg" class="site-logo" id="siteLogo">

        <svg class="arc-text arc-top" viewBox="-30 -40 300 300">
            <defs>
                <path id="topArc"
                    d="M 8,85 A 130,140 0 0,1 240,90" />
            </defs>

            <text>
                <textPath
                    href="#topArc"
                    startOffset="50%"
                    text-anchor="middle">
                    EVENT STATUS
                </textPath>
            </text>
        </svg>

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
            Updated May 2, 2026
            </textPath>
        </text>
        </svg>

    </div>
        <div class="overlay-for">for</div>
        <div id="statusDate" class="overlay-date"></div>

        <div id="pageLabel" class="overlay-main">EVENTS</div>

        <div id="eventTime" class="overlay-time"></div>

        <div id="eventLocation" class="overlay-location"></div>

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
    const el = document.getElementById("statusDateText");
    if (el) el.textContent = text;
};

window.setEventTime = function (start, end) {
    const el = document.getElementById("eventTime");
    if (!el) return;

    if (!start || !end) {
        el.style.display = "none";
        return;
    }

    // convert 24h → 12h
    function formatTime(t) {
        let [h, m] = t.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}${ampm}`;
    }

    const startText = formatTime(start);
    const endText = formatTime(end);

    el.innerHTML = `${startText}<br>to<br>${endText}`;
};

window.setHeaderState = function (state) {
    const location = document.getElementById("eventLocation");
    const body = document.body;
    const label = document.getElementById("pageLabel");
    const time = document.getElementById("eventTime");

    body.classList.remove(
        "status-go",
        "status-pending",
        "status-nogo"
    );

    if (!label) return;

    if (state === "GO") {
        body.classList.add("status-go");
        label.textContent = "GO";

        // TIME
        if (time) {
            time.style.display = "block";
            time.classList.remove("fade-in");
            void time.offsetWidth;
            time.style.animationDelay = "0.1s";
            time.classList.add("fade-in");
        }

        // LOCATION
        if (location) {
            location.style.display = "block";
            location.classList.remove("fade-in");
            void location.offsetWidth;
            location.style.animationDelay = "0.25s";
            location.classList.add("fade-in");
        }
    }
    else if (state === "NO_GO") {
        body.classList.add("status-nogo");
        label.textContent = "NO GO";

        if (time) time.style.display = "none";
    }
    else {
        body.classList.add("status-pending");
        label.textContent = "PENDING";

        if (time) time.style.display = "none";
    }
};

window.setEventLocation = function (name, coords) {
    const el = document.getElementById("eventLocation");
    if (!el) return;

    if (!name || !coords) {
        el.style.display = "none";
        return;
    }

    const url = `https://www.google.com/maps?q=${coords}`;

    el.innerHTML = `<a href="${url}" target="_blank">${name}</a>`;
    el.style.display = "block";
};

document.addEventListener("DOMContentLoaded", injectHeader);
