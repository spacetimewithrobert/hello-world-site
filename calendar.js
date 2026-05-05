/* calendar.js */

/* =========================
   EVENTS DATA (SOURCE OF TRUTH)
========================= */

const EVENTS = {
    "260507": {
        description: "SPACETIME!",
        start: "19:00",
        end: "21:00",
        locationName: "Zuanich Point Park",
        locationCoords: "48.754,-122.50086",
        status: "GO"
    }
};

/* =========================
   DATE HELPERS
========================= */

function buildDateKey(date) {
    return (
        String(date.getFullYear()).slice(2) +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0")
    );
}

function parseKeyToDate(key) {
    const year = 2000 + Number(key.slice(0, 2));
    const month = Number(key.slice(2, 4)) - 1; // JS months are 0-based
    const day = Number(key.slice(4, 6));

    return new Date(year, month, day); // ✅ LOCAL time
}

function formatDisplayDate(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });
}

function getUpdatedText() {
    const now = new Date();

    const month = now.toLocaleDateString("en-US", {
        month: "short"
    });

    return `As of ${month} ${now.getDate()}, ${now.getFullYear()}`;
}

function isToday(date) {
    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

/* =========================
   NEXT EVENT RESOLVER
========================= */

function getNextEvent() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedKeys = Object.keys(EVENTS).sort();

    for (let key of sortedKeys) {
        const eventDate = parseKeyToDate(key);

        if (eventDate >= today) {
            return {
                key,
                data: EVENTS[key],
                date: eventDate
            };
        }
    }

    return null;
}

/* =========================
   HEADER STATE ENGINE
========================= */

function updateState() {
    const nextEvent = getNextEvent();

    if (!nextEvent) return;

    const { data, date } = nextEvent;

    /* STATUS */

    if (typeof setHeaderState === "function") {
        setHeaderState(data.status);
    }

    /* TOP TEXT */

    if (typeof setStatusDate === "function") {

        if (isToday(date)) {
            setStatusDate(`TONIGHT`);
        } else {
            setStatusDate(`${formatDisplayDate(date)}`);
        }

    }

    /* UPDATED ARC TEXT */

    if (typeof setUpdatedText === "function") {
        setUpdatedText(getUpdatedText());
    }

    /* EVENT TIME */

    if (
        data.status === "GO" &&
        typeof setEventTime === "function"
    ) {
        setEventTime(data.start, data.end);
        setEventLocation(data.locationName, data.locationCoords);
    }
    else {
        setEventLocation(null, null);
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

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(today.getDate() - today.getDay());

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
                    <h3>${formatDisplayDate(d)}</h3>
                    <p>${eventData.description}</p>
                    <p>${eventData.start} - ${eventData.end}</p>
                    <p>${eventData.location}</p>
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
