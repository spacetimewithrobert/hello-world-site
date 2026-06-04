document.addEventListener("DOMContentLoaded", () => {

    const footer =
        document.getElementById("site-footer");

    if (!footer) return;

    footer.innerHTML = `
        <div class="site-footer-simple">

            <div class="footer-links">

                <a
                    href="https://instagram.com/space_time_with_robert"
                    target="_blank"
                >
                    Instagram
                </a>

                <a
                    href="https://www.youtube.com/@spacetimewithrobert4438"
                    target="_blank"
                >
                    YouTube
                </a>

                <a
                    href="https://www.facebook.com/spacetimewithrobert/"
                    target="_blank"
                >
                    Facebook
                </a>

            </div>

            <div class="footer-policy">

                <a href="privacy.html">
                    Privacy Policy
                </a>

            </div>

            <div class="footer-copy">

                Copyright © SpaceTimeWithRobert
                2017-${new Date().getFullYear()}
                <br>
                All rights reserved.

            </div>

        </div>
    `;
});