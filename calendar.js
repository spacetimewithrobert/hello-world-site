/* calendar.js */

/* =========================
   WEATHER FORECAST
========================= */

const WEATHER = {};

/* =========================
   WEATHER ICONS
========================= */

function getWeatherInfo(code) {

    // Clear
    if (code === 0)
        return {
            emoji: "☀️",
            label: "Clear"
        };

    // Partly cloudy
    if ([1, 2].includes(code))
        return {
            emoji: "⛅",
            label: "Partly Cloudy"
        };

    // Overcast
    if (code === 3)
        return {
            emoji: "☁️",
            label: "Cloudy"
        };

    // Fog
    if ([45, 48].includes(code))
        return {
            emoji: "☁️",
            label: "Fog"
        };

    // Rain
    if (
        [51,53,55,61,63,65,80,81,82]
        .includes(code)
    )
        return {
            emoji: "🌧️",
            label: "Rain"
        };

    // Snow
    if (
        [71,73,75,77,85,86]
        .includes(code)
    )
        return {
            emoji: "❄️",
            label: "Snow"
        };

    // Thunderstorm
    if ([95,96,99].includes(code))
        return {
            emoji: "⛈️",
            label: "Thunderstorms"
        };

    return {
        emoji: "",
        label: ""
    };
}

/* =========================
   MOON PHASE
========================= */

function getMoonPhase(date) {

    const knownNewMoon =
        new Date("2026-04-17T11:51:00Z");

    const lunarCycle = 29.53058867;

    const diff =
        (date - knownNewMoon) /
        (1000 * 60 * 60 * 24);

    const phase =
        ((diff % lunarCycle) + lunarCycle) %
        lunarCycle;

    // Tolerance window (≈ half a day)
    const threshold = 0.5;

    // Distance to New Moon (wrap-aware)
    const distToNew =
        Math.min(phase, lunarCycle - phase);

    // Distance to Full Moon (mid-cycle)
    const distToFull =
        Math.abs(phase - lunarCycle / 2);

    // 🌑 NEW MOON (single point event)
    if (distToNew < threshold) {
        return {
            emoji: "🌑",
            name: "New Moon",
            isMajorEvent: true
        };
    }

    // 🌕 FULL MOON (single point event)
    if (distToFull < threshold) {
        return {
            emoji: "🌕",
            name: "Full Moon",
            isMajorEvent: true
        };
    }

    // Everything else becomes background phase only
    if (phase < 1.84566)
        return { emoji: "🌒", name: "Waxing Crescent" };

    if (phase < 9.22831)
        return { emoji: "🌓", name: "First Quarter" };

    if (phase < 12.91963)
        return { emoji: "🌔", name: "Waxing Gibbous" };

    if (phase < 20.30228)
        return { emoji: "🌖", name: "Waning Gibbous" };

    if (phase < 23.99361)
        return { emoji: "🌗", name: "Last Quarter" };

    return { emoji: "🌘", name: "Waning Crescent" };
}

/* =========================
   WEATHER FETCH
========================= */

async function fetchWeather() {

    const cached =
    localStorage.getItem("weatherData");

    const timestamp =
        localStorage.getItem("weatherTimestamp");

    const oneHour = 1000 * 60 * 60;

    if (
        cached &&
        timestamp &&
        Date.now() - timestamp < oneHour
    ) {

        const data = JSON.parse(cached);

        const dates = data.daily.time;
        const codes = data.daily.weather_code;

        for (let i = 0; i < dates.length; i++) {

            const date = new Date(dates[i]);

            const key = buildDateKey(date);

            WEATHER[key] = getWeatherInfo(codes[i]);
        }

        createCalendar();

        return;
    }

    try {

        // Bellingham coordinates
        const lat = 48.75;
        const lon = -122.48;

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}` +
            `&longitude=${lon}` +
            `&daily=weather_code` +
            `&timezone=America%2FLos_Angeles`;

        const response = await fetch(url);

        const data = await response.json();

        localStorage.setItem(
            "weatherData",
            JSON.stringify(data)
        );

        localStorage.setItem(
            "weatherTimestamp",
            Date.now()
        );

        const dates = data.daily.time;
        const codes = data.daily.weather_code;

        for (let i = 0; i < dates.length; i++) {

            const date = new Date(dates[i]);

            const key = buildDateKey(date);

            WEATHER[key] = getWeatherInfo(codes[i]);
        }

        createCalendar();

    } catch (err) {

        console.error(
            "Weather fetch failed:",
            err
        );
    }
}

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
   DAY DATA MODEL
========================= */

function buildDayData(date) {

    const key = buildDateKey(date);

    const SKY_EVENTS = {
        ...(window.SKY_EVENTS_2026 || {}),
        ...(window.SKY_EVENTS_2027 || {}),
        ...(window.SKY_EVENTS_2028 || {}),
        ...(window.SKY_EVENTS_2029 || {}),
        ...(window.SKY_EVENTS_2030 || {}),
        ...(window.SKY_EVENTS_2031 || {})
    };

    return {
        date,
        key,
        moon: getMoonPhase(date),
        weather: WEATHER[key] || {},
        event: OUTREACH_EVENTS[key] || null,
        skyEvents: SKY_EVENTS[key] || [],
        skyEvent: getPrimarySkyEvent(SKY_EVENTS[key] || []),
        isToday: isToday(date)
    };
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

    const weekdayNames = [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT"
    ];

    weekdayNames.forEach(day => {

        const label = document.createElement("div");

        label.className = "weekday-label";
        label.textContent = day;

        calendar.appendChild(label);

    });

    for (let i = 0; i < 28; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const dayData = buildDayData(d);

        const {
            moon,
            weather,
            event: eventData,
            skyEvents,
            skyEvent,
            isToday: todayState
        } = dayData;

        const cell = document.createElement("div");
        cell.className = "day";

        if (todayState) {
            cell.classList.add("today");
        }

        const weatherEmoji = weather.emoji || "";

        cell.classList.add(
            moon.name.toLowerCase().replace(/\s/g, "-")
        );

        if (moon.name === "Full Moon") {
            cell.classList.add("full-moon");
        }

        cell.innerHTML = `
            <span class="date-num">
                ${d.getDate()}
            </span>

            <span class="moon-phase">
                ${moon.emoji}
            </span>

            <span class="weather-icon">
                ${weatherEmoji}
            </span>
            <span class="sky-event">
                ${skyEvent?.icon || ""}
            </span>
        `;
        
        let popupHTML = `
            <h3>${formatDisplayDate(d)}</h3>

            <p>
                <span class="popup-moon ${moon.name.toLowerCase().replace(/\s/g,'-')}">
                    ${moon.emoji}
                </span>
                ${moon.name}
            </p>
        `;

        if (weatherEmoji) {

            popupHTML += `
                <p>
                    <span class="popup-weather">${weather.emoji}</span>
                    ${weather.label}
                </p>
            `;
        }

        if (skyEvents.length) {

            skyEvents.forEach(event => {

                popupHTML += `
                    <p>
                        ${event.icon}
                        ${event.title}
                    </p>
                `;

            });
        }

        if (eventData) {

            popupHTML += `
                <hr>

                <p>
                    ${eventData.description}
                </p>

                <p>
                    ${eventData.startTime}
                    -
                    ${eventData.endTime}
                </p>

                ${eventData.coords
                ? `
                <p>
                    <a
                        href="https://maps.google.com/?q=${eventData.coords}"
                        target="_blank"
                        class="popup-map-link"
                    >
                        📍 ${eventData.locationName}
                    </a>
                </p>
                `
                : ""
                }

                <p>
                    STATUS:
                    ${getStatusLabel(eventData.status)}
                </p>
            `;
        }

        cell.addEventListener("click", () => {
            openPopup(popupHTML);
        });

        if (eventData) {

            if (eventData.status === 1 ||
                eventData.status === "GO") {
                cell.classList.add("go-event");
            }
            cell.classList.add("has-event");
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
    bindPopupControls();
    fetchWeather();
});
