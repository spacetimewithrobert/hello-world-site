// site-state.js
// ========================================
// GLOBAL SITE STATE ENGINE
// ========================================

window.SITE_STATE = {
    currentEvent: null,
    status: 0 // 0=PENDING, 1=GO, 2=NO_GO
};

/* ========================================
   STATUS HELPERS
======================================== */

window.getStatusName = function () {

    const map = [
        "PENDING",
        "GO",
        "NO_GO"
    ];

    return map[window.SITE_STATE.status] || "PENDING";
};

window.getStatusLabel = function (status) {

    if (typeof status === "number") {
        return getStatusName(status);
    }

    return status || "PENDING";
};

/* ========================================
   APPLY SITE STATE
======================================== */

window.applySiteState = function () {

    const body = document.body;

    const currentEvent =
        getCurrentOutreachEvent();

    window.SITE_STATE.currentEvent =
        currentEvent;

    /* =========================
       STATUS
    ========================= */

    if (currentEvent) {

        if (
            typeof currentEvent.status === "number"
        ) {

            window.SITE_STATE.status =
                currentEvent.status;
        }
        else {

            const map = {
                "PENDING": 0,
                "GO": 1,
                "NO_GO": 2
            };

            window.SITE_STATE.status =
                map[currentEvent.status] || 0;
        }

    } else {

        window.SITE_STATE.status = 0;
    }

    const current =
        getStatusName();

    /* =========================
       BODY CLASSES
    ========================= */

    body.classList.remove(
        "status-pending",
        "status-go",
        "status-nogo"
    );

    if (current === "GO") {
        body.classList.add("status-go");
    }
    else if (current === "NO_GO") {
        body.classList.add("status-nogo");
    }
    else {
        body.classList.add("status-pending");
    }

    /* =========================
       HEADER
    ========================= */

    console.log(
        "[SITE STATE]",
        current,
        currentEvent
    );
};

/* ========================================
   INIT
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        applySiteState();

    }
);  

/* ========================================
   ACTIVE EVENT ENGINE
======================================== */

window.getCurrentOutreachEvent = function () {

    if (!window.OUTREACH_EVENTS) return null;

    const today = new Date();

    const events =
        Object.entries(OUTREACH_EVENTS)
        .sort(([a], [b]) => a.localeCompare(b));

    for (const [key, event] of events) {

        const year =
            2000 + Number(key.slice(0, 2));

        const month =
            Number(key.slice(2, 4)) - 1;

        const day =
            Number(key.slice(4, 6));

        const eventDate =
            new Date(year, month, day);

        eventDate.setHours(0,0,0,0);

        const compare =
            new Date(today);

        compare.setHours(0,0,0,0);

        if (eventDate >= compare) {

            window.SITE_STATE.status =
                event.status ?? 0;

            return {
                key,
                ...event
            };
        }
    }

    window.SITE_STATE.status = 0;

    return null;
};

/* ========================================
   MASTER SITE RENDER
======================================== */

window.renderSiteState = function () {

    const event =
        getCurrentOutreachEvent();

    if (!event) return;

    const current = getStatusName();

    if (typeof setHeaderState === "function") {
        setHeaderState(current);
    }

    if (typeof setStatusDate === "function") {

        const eventDate =
            new Date(
                2000 + Number(event.key.slice(0,2)),
                Number(event.key.slice(2,4)) - 1,
                Number(event.key.slice(4,6))
            );

        setStatusDate(
            eventDate.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    month: "short",
                    day: "numeric"
                }
            )
        );
    }

    if (
        getStatusName() === "GO"
    ) {

        if (typeof setEventTime === "function") {

            setEventTime(
                event.startTime,
                event.endTime
            );
        }

        if (typeof setEventLocation === "function") {

            setEventLocation(
                event.locationName,
                event.coords
            );
        }
    }
    else {

        setEventTime(null, null);
        setEventLocation(null, null);
    }
};