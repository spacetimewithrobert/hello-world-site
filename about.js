/* =========================
   ABOUT PAGE LOG RENDERER
========================= */

function renderOutreachLogs() {

    const containers =
        document.querySelectorAll(".log-container");

    containers.forEach(container => {

        const era =
            container.dataset.era;

        const logs =
            window.OUTREACH_LOGS?.[era];

        if (!logs || !logs.length) return;

        logs.forEach(log => {

            const entry =
                document.createElement("div");

            entry.className =
                "log-entry";

            entry.innerHTML = `

                <div class="log-date">
                    ${log.date}
                </div>

                <div class="log-meta">
                    ${log.time} •
                    ${log.location} •
                    ${log.visitors} Visitors
                </div>

                <p class="log-summary">
                    ${log.summary}
                </p>

            `;

            container.appendChild(entry);

        });

    });

}

document.addEventListener(
    "DOMContentLoaded",
    renderOutreachLogs
);