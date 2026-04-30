const HEADER_HTML = `
<header class="site-header">
    <div class="logo-container">
        <img src="images/logo.jpg" alt="SpaceTime With Robert" class="site-logo">
        <div id="pageLabel" class="page-label">EVENTS</div>
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
}

window.setHeaderState = function (state) {
    const body = document.body;
    const label = document.getElementById("pageLabel");

    if (!label) return;

    body.classList.remove(
        "status-go",
        "status-pending",
        "status-nogo"
    );

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
};

document.addEventListener("DOMContentLoaded", injectHeader);
