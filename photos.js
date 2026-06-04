/* =========================
   PHOTO GALLERY
========================= */
let popup;
let popupImage;
let popupMeta;
let popupSpinner;
let currentPhotos = [];
let currentPhotoIndex = 0;

let zoomLevel = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;

let dragStartX = 0;
let dragStartY = 0;

function parseFilename(filename) {

    const clean =
        filename.replace(/\.[^/.]+$/, "");

    const parts =
        clean.split("_");

    return {

        object:
            parts[0] || "Unknown",

        photographer:
            parts[1] || "Unknown",

        date:
            parts[2] || "Unknown",

        telescope:
            parts[3] || "Unknown",

        frame:
            parts[4] || "01",
        
        location:
            parts[5] || "",

        event:
            parts[6] || ""

    };

}

function buildRow(label, value) {

    if (!value) return "";

    if (value === "Unknown") return "";

    return `
        <div class="popup-row">

            <span>${label}</span>

            <span>${value}</span>

        </div>
    `;

}

function getDriveImageUrl(id) {

    return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;

}

function getCurrentCategoryCount() {

    return currentPhotos.length;

}

function getCurrentPhotoNumber() {

    return currentPhotoIndex + 1;

}

document.addEventListener(
    "DOMContentLoaded",
    initGallery
);

const OBJECT_NAMES = {

    M031: "Andromeda Galaxy",
    M045: "Pleiades",
    M057: "Ring Nebula",
    M027: "Dumbbell Nebula",
    M016: "Eagle Nebula",
    M017: "Omega Nebula"

};

const GALLERY_PHOTOS =
    PHOTO_INDEX.map(photo => {

        const meta =
            parseFilename(photo.file);

        const info =
            OBJECT_INFO[meta.object] || {};

        return {

            ...meta,

            info,

            name:
                info.name || meta.object,

            category:
                photo.category || "uncategorized",

            thumbnail:
                getDriveImageUrl(
                    photo.driveId
                ),

            full:
                getDriveImageUrl(
                    photo.driveId
                )

        };

    });


function updateCategoryTabs() {

    const counts = {};

    GALLERY_PHOTOS.forEach(photo => {

        counts[photo.category] =
            (counts[photo.category] || 0) + 1;

    });

    const totalPhotos =
        GALLERY_PHOTOS.length;

    document
        .querySelectorAll(".photo-tab")
        .forEach(tab => {

            const category =
                tab.dataset.category;

            if (
                category === "all"
            ) {

                tab.textContent =
                    `All (${totalPhotos})`;

                return;

            }

            const count =
                counts[category] || 0;

            if (count === 0) {

                tab.style.display =
                    "none";

                return;

            }

            tab.style.display = "";

            const label =
                tab.dataset.label ||
                tab.textContent.replace(
                    /\s*\(\d+\)$/,
                    ""
                );

            tab.dataset.label =
                label;

            tab.textContent =
                `${label} (${count})`;

        });

}

function initGallery() {

    popupSpinner =
    document.getElementById(
        "popupSpinner"
    );
    
    updateCategoryTabs();

    renderPhotos("all");

    document
        .querySelectorAll(".photo-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".photo-tab")
                        .forEach(btn =>
                            btn.classList.remove("active")
                        );

                    tab.classList.add("active");

                    renderPhotos(
                        tab.dataset.category
                    );

                }
            );

        });

        popup =
        document.getElementById(
            "photoPopup"
        );

        popupImage =
            document.getElementById(
                "popupImage"
            );

        popupImage.addEventListener(
            "click",
            toggleZoom
        );

        popupImage.addEventListener(
            "mousedown",
            startDrag
        );

        window.addEventListener(
            "mousemove",
            dragImage
        );

        window.addEventListener(
            "mouseup",
            stopDrag
        );

        popupMeta =
            document.getElementById(
                "popupMeta"
            );

        document
            .getElementById(
                "popupNext"
            )
            .addEventListener(
                "click",
                showNextPhoto
            );

        document
            .getElementById(
                "popupPrev"
            )
            .addEventListener(
                "click",
                showPreviousPhoto
                );

        document
            .getElementById(
                "photoPopupClose"
            )
            .addEventListener(
                "click",
                closePopup
            );

        document
            .querySelector(
                ".photo-popup-backdrop"
            )
            .addEventListener(
                "click",
                closePopup
            );

        document
            .getElementById(
                "popupPrevMobile"
            )
            ?.addEventListener(
                "click",
                showPreviousPhoto
            );

        document
            .getElementById(
                "popupNextMobile"
            )
            ?.addEventListener(
                "click",
                showNextPhoto
            );
            
        document.addEventListener(
            "keydown",
        event => {

            if (
                event.key === "Escape"
                &&
                popup.classList.contains(
                    "open"
                )
            ) {

                closePopup();

            }
            
            if (
                event.key === "ArrowRight"
            ) {

                showNextPhoto();

            }

            if (
                event.key === "ArrowLeft"
            ) {

                showPreviousPhoto();

            }

        }
    );
}

function renderPhotos(category) {

    const grid =
        document.getElementById(
            "photoGrid"
        );

    if (!grid) return;

    grid.innerHTML = "";

    currentPhotos =
    category === "all"
        ? GALLERY_PHOTOS
        : GALLERY_PHOTOS.filter(
            photo =>
                photo.category === category
        );

    currentPhotos.forEach(photo => {

        const card =
            document.createElement("div");

        card.className =
            "photo-card";

        card.innerHTML = `

            <img
                loading="lazy"
                src="${photo.thumbnail}"
                alt="${photo.name}"
            >

            <div class="photo-object-badge">
                ${photo.object}
            </div>

            <div class="photo-date-badge">
                ${photo.date}
            </div>

            <div class="photo-overlay">
                ${photo.photographer}
            </div>

`;

        card.addEventListener(
            "click",
            () => {

                currentPhotoIndex =
                    currentPhotos.indexOf(photo);

                openPopup(photo);

            }
        );

        grid.appendChild(card);

    });

}

function openPopup(photo) {

    zoomLevel = 1;
    translateX = 0;
    translateY = 0;

    popupImage.classList.remove(
        "zoomed"
    );

    popupImage.classList.remove(
        "dragging"
    );

    updateImageTransform();

    const positionText =
    `${photo.category}
     •
     ${getCurrentPhotoNumber()}
     of
     ${getCurrentCategoryCount()}`;

    popupImage.classList.remove(
        "loaded"
    );

    popupImage.onload = () => {

    popupSpinner.classList.remove(
            "visible"
        );

        popupImage.classList.add(
            "loaded"
        );

    };

    popupSpinner.classList.add(
        "visible"
    );

    popupImage.src = photo.full;


    popupImage.alt =
        photo.name;

    popupMeta.innerHTML = `

        <div class="popup-title">
            ${photo.object}
        </div>

        <div class="popup-subtitle">
            ${photo.name}
        </div>

        <div class="popup-position">
            ${positionText}
        </div>

        <div class="popup-details">

        ${buildRow(
            "Object Type",
            photo.info.type
        )}

        ${buildRow(
            "Constellation",
            photo.info.constellation
        )}

        ${buildRow(
            "Distance",
            photo.info.distance
        )}

        ${buildRow(
            "Magnitude",
            photo.info.magnitude
        )}

        ${buildRow(
            "Photographer",
            photo.photographer
        )}

        ${buildRow(
            "Telescope",
            photo.telescope
        )}

        ${buildRow(
            "Date",
            photo.date
        )}

        ${buildRow(
            "Location",
            photo.location
        )}

        ${buildRow(
            "Session",
            photo.event
        )}

        </div>

    `;

    popup.classList.add(
        "open"
    );

    document.body.classList.add(
        "popup-open"
    );

}

function showNextPhoto() {

    currentPhotoIndex++;

    if (
        currentPhotoIndex >=
        currentPhotos.length
    ) {

        currentPhotoIndex = 0;

    }

    openPopup(
        currentPhotos[
            currentPhotoIndex
        ]
    );

}

function showPreviousPhoto() {

    currentPhotoIndex--;

    if (
        currentPhotoIndex < 0
    ) {

        currentPhotoIndex =
            currentPhotos.length - 1;

    }

    openPopup(
        currentPhotos[
            currentPhotoIndex
        ]
    );

}

function updateImageTransform() {

    popupImage.style.transform =
        `
        translate(
            ${translateX}px,
            ${translateY}px
        )
        scale(${zoomLevel})
        `;

}

function toggleZoom() {

    if (zoomLevel === 1) {

        zoomLevel = 2;

        popupImage.classList.add(
            "zoomed"
        );

    } else {

        zoomLevel = 1;

        translateX = 0;
        translateY = 0;

        popupImage.classList.remove(
            "zoomed"
        );

    }

    updateImageTransform();

}

function startDrag(event) {

    if (zoomLevel === 1) return;

    popupImage.classList.add(
        "dragging"
    );

    isDragging = true;

    dragStartX =
        event.clientX - translateX;

    dragStartY =
        event.clientY - translateY;

}

function dragImage(event) {

    if (!isDragging) return;

    translateX =
        event.clientX - dragStartX;

    translateY =
        event.clientY - dragStartY;

    updateImageTransform();

}

function stopDrag() {

    isDragging = false;

    popupImage.classList.remove(
        "dragging"
    );

}

function closePopup() {

    popup.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "popup-open"
    );

}