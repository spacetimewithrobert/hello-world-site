/* =========================
   header.js
========================= */

function getCurrentPage() {
    return window.location.pathname.split("/").pop() || "index.html";
}

const CURRENT_PAGE = getCurrentPage();

function isEventsPage() {
    return CURRENT_PAGE === "events.html";
}

function applyHeaderMode() {

    const topArc =
        document.querySelector(".arc-top");

    const forLabel =
        document.querySelector(".overlay-for");

    const statusDate =
        document.getElementById("statusDate");

    const time =
        document.getElementById("eventTime");

    const location =
        document.getElementById("eventLocation");

    /* =========================
       EVENTS PAGE
    ========================= */

    if (isEventsPage()) {

        // SHOW EVENT UI
        if (topArc) {
            topArc.style.display = "block";
        }

        if (forLabel) {
            forLabel.style.display = "block";
        }

        if (statusDate) {
            statusDate.style.display = "block";
        }

        return;
    }

    /* =========================
       STATIC PAGES
    ========================= */

    // HIDE EVENT STATUS ARC
    if (topArc) {
        topArc.style.display = "none";
    }

    // HIDE "for"
    if (forLabel) {
        forLabel.style.display = "none";
    }

    // HIDE EVENT DATE
    if (statusDate) {
        statusDate.style.display = "none";
    }

    // HIDE TIME
    if (time) {
        time.style.display = "none";
    }

    // HIDE LOCATION
    if (location) {
        location.style.display = "none";
    }
}

/* =========================
   HEADER HTML
========================= */

const HEADER_HTML = `
<header class="site-header">
    <div class="logo-container">

        <div class="logo-badge">

            <img src="images/logo.jpg"
                 class="site-logo"
                 id="siteLogo">

            <svg class="arc-text arc-top"
                 viewBox="-30 -40 300 300">

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

            <svg class="arc-text arc-bottom"
                viewBox="-30 -40 300 300">

                <defs>
                    <path id="dateArc"
                        d="M 0,180 A 130,120 0 0,0 240,180" />
                </defs>

                <text>
                    <textPath
                        id="statusDateText"
                        href="#dateArc"
                        startOffset="50%"
                        text-anchor="middle">
                        SpaceTime With Robert
                    </textPath>
                </text>

            </svg>

        </div>

        <div class="overlay-for">for</div>

        <div id="statusDate"
             class="overlay-date"></div>

        <div id="pageLabel"
             class="overlay-main">
             LOADING
        </div>

        <div id="eventTime"
             class="overlay-time"></div>

        <div id="eventLocation"
             class="overlay-location"></div>

    </div>

    <nav class="site-nav">
        <a href="about.html">ABOUT</a>
        <a href="events.html">EVENTS</a>
        <a href="photos.html">PHOTOS</a>
        <a href="contact.html">CONTACT</a>
    </nav>

</header>
`;

/* =========================
   INJECT HEADER
========================= */

function injectHeader() {

    const mount =
        document.getElementById("site-header");

    if (!mount) return;

    mount.innerHTML = HEADER_HTML;

    setActiveNav();

    applyStaticHeaderText();

    applyHeaderMode();

    document.dispatchEvent(
        new CustomEvent("headerReady")
    );

    if (window.renderSiteState) {
        window.renderSiteState();
    }
}

/* =========================
   ACTIVE NAV LINK
========================= */

function setActiveNav() {

    const currentPage =
        window.location.pathname.split("/").pop();

    const navLinks =
        document.querySelectorAll(".site-nav a");

    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }
        else {
            link.classList.remove("active");
        }

    });
}

function applyStaticHeaderText() {

    const label =
        document.getElementById("pageLabel");

    const arcText =
        document.getElementById("statusDateText");

    if (!label) return;

    /* =========================
       EVENTS PAGE
    ========================= */

    if (isEventsPage()) {

        label.textContent = "PENDING";

        if (arcText) {

            const now = new Date();

            const month =
                now.toLocaleString(
                    "en-US",
                    { month: "long" }
                );

            const day =
                now.getDate();

            function getOrdinal(n) {

                if (n > 3 && n < 21) {
                    return "th";
                }

                switch (n % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
            }

            arcText.textContent =
                `As of ${month} ${day}${getOrdinal(day)}`;
        }

        return;
    }

    /* =========================
       STATIC PAGES
    ========================= */

    const pageTitles = {

        "about.html": "ABOUT",
        "photos.html": "PHOTOS",
        "contact.html": "CONTACT",
        "privacy.html": "PRIVACY\nPOLICY"
    };

    label.textContent =
        pageTitles[CURRENT_PAGE] || "EVENTS";

    if (arcText) {

        arcText.textContent = "As of May 2026";

        arcText.classList.remove("fade-ready");

        void arcText.offsetWidth;

        arcText.classList.add("fade-ready");
    }
}

/* =========================
   TEXT HELPERS
========================= */

window.setStatusDate = function (text) {

    const el =
        document.getElementById("statusDate");

    const forLabel =
        document.querySelector(".overlay-for");

    if (el) {
        el.innerHTML = text || "";
    }

    // Hide "for" if no date exists
    if (forLabel) {

        if (!text || !isEventsPage()) {
            forLabel.style.display = "none";
        }
        else {
            forLabel.style.display = "block";
        }
    }
};

window.setUpdatedText = function (text) {

    const el =
        document.getElementById("statusDateText");

    if (el) {
        el.textContent = text;
    }
};

window.setEventTime = function (start, end) {

    const el =
        document.getElementById("eventTime");

    if (!el) return;

    // HIDE CONDITIONS
    if (
        !isEventsPage() ||
        getStatusName() !== "GO" ||
        !start ||
        !end
    ) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        return;
    }

    function formatTime(t) {

        let [h] =
            t.split(":").map(Number);

        const ampm =
            h >= 12 ? "PM" : "AM";

        h = h % 12 || 12;

        return `${h}${ampm}`;
    }

    el.innerHTML =
        `${formatTime(start)}<br>to<br>${formatTime(end)}`;

    // SHOW CLEANLY
    el.style.visibility = "visible";

    requestAnimationFrame(() => {
        el.style.opacity = "1";
    });
};

window.setHeaderState = function (state) {

    console.log("HEADER STATE:", state);

    const body = document.body;

    const label =
        document.getElementById("pageLabel");

    const time =
        document.getElementById("eventTime");

    const location =
        document.getElementById("eventLocation");

    body.classList.remove(
        "status-go",
        "status-pending",
        "status-nogo"
    );

    /* =========================
       GLOBAL ATMOSPHERE
    ========================= */

    if (state === "GO") {

        body.classList.add("status-go");

        // EVENTS PAGE ONLY:
        // change title to GO
        if (isEventsPage() && label) {
            label.textContent = "GO";
        }

    }
    else if (state === "NO_GO") {

        body.classList.add("status-nogo");

        if (isEventsPage() && label) {
            label.textContent = "NO GO";
        }

    }
    else {

        body.classList.add("status-pending");

        if (isEventsPage() && label) {
            label.textContent = "PENDING";
        }
    }
};


/* =========================
   EVENT LOCATION
========================= */

window.setEventLocation = function (name, coords) {

    const el =
        document.getElementById("eventLocation");

    if (!el) return;

    // HIDE CONDITIONS
    if (
        !isEventsPage() ||
        getStatusName() !== "GO" ||
        !name ||
        !coords
    ) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        return;
    }

    const url =
        `https://www.google.com/maps?q=${coords}`;

    el.innerHTML =
        `<a href="${url}" target="_blank">${name}</a>`;

    // SHOW CLEANLY
    el.style.visibility = "visible";

    requestAnimationFrame(() => {
        el.style.opacity = "1";
    });
};

/* =========================
   INIT
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        injectHeader();
    }
);
