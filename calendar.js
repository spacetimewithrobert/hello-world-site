/* calendar.js */

/* =========================
   CONTROL PANEL
========================= */

const CONFIG = {
    override: true,

    // 0 = PENDING | 1 = GO | 2 = NO GO
    status: 1,

    // Used only when override = true
    overrideDate: "Sunday May 3",

    // Sunday = 0
    defaultEventDay: 0,

    updatedStamp: true
};

/* =========================
   EVENTS DATA
========================= */

const EVENTS = {
    "260503": {
        description: "SPACETIME! (PENDING)",
        start: "6:00 PM",
        end: "9:00 PM"
    }
};

/* =========================
   DATE HELPERS
========================= */

function getNextEventDate() {
    if (CONFIG.override) return CONFIG.overrideDate;

    const now = new Date();
    const d = new Date(now);

    const diff =
        (CONFIG.defaultEventDay - d.getDay() + 7) % 7;

    d.setDate(d.getDate() + diff);

    const weekday = d.toLocaleDateString("en-US", {
        weekday: "long"
    });

    const month = d.toLocaleDateString("en-US", {
        month: "short"
    });

    return `${weekday} ${month} ${d.getDate()}`;
}

function getUpdatedText() {
    const now = new Date();

    const month = now.toLocaleDateString("en-US", {
        month: "short"
    });

    return `Updated ${month} ${now.getDate()}, ${now.getFullYear()}`;
}

function buildDateKey(date) {
    return (
        String(date.getFullYear()).slice(2) +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0")
    );
}

/* =========================
   HEADER STATE ENGINE
========================= */

function updateState() {
    let state = "PENDING";

    if (CONFIG.status === 1) state = "GO";
    if (CONFIG.status === 2) state = "NO_GO";

    if (typeof setHeaderState === "function") {
        setHeaderState(state);
    }

    if (typeof setStatusDate === "function") {
        setStatusDate(`Status for<br>${getNextEventDate()}`);
    }

    if (
        CONFIG.updatedStamp &&
        typeof setUpdatedText === "function"
    ) {
        setUpdatedText(getUpdatedText());
    }
}

/* =========================
   CALENDAR
========================= */

function createCalendar() {
    const calendar = document.getElementById("calendar");

    if (!calendar) return;

    calendar.innerHTML = "";

    const today = new Date();

    // Start on previous/current Sunday
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(today.getDate() - today.getDay());

    // 4 week rolling grid
    for (let i = 0; i < 28; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const key = buildDateKey(d);
        const eventData = EVENTS[key];

        const cell = document.createElement("div");
        cell.className = "day";

        cell.innerHTML = `
            <span class="date-num">${d.getDate()}</span>
        `;

        if (eventData) {
            cell.classList.add("has-event");

            cell.addEventListener("click", () => {
                openPopup(`
                    <h3>${d.toDateString()}</h3>
                    <p>${eventData.description}</p>
                    <p>${eventData.start} - ${eventData.end}</p>
                `);
            });
        }

        calendar.appendChild(cell);
    }
}

/* =========================
   POPUP
========================= */

function openPopup(html) {
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const content = document.getElementById("popup-content");

    if (!overlay || !popup || !content) return;

    content.innerHTML = html;
    overlay.style.display = "block";
    popup.style.display = "block";
}

function closePopup() {
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");

    if (overlay) overlay.style.display = "none";
    if (popup) popup.style.display = "none";
}

/* =========================
   EVENTS
========================= */

function bindPopupControls() {
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closePopupBtn");

    if (overlay) {
        overlay.addEventListener("click", closePopup);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closePopup);
    }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
    createCalendar();
    bindPopupControls();
});

document.addEventListener("headerReady", () => {
    updateState();
});
