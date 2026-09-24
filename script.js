const API_URL = "BACKEND_URL_GOES_HERE";

const shareButton =
    document.getElementById("shareButton");

const statusBox =
    document.getElementById("status");

const result =
    document.getElementById("result");

const latitudeElement =
    document.getElementById("latitude");

const longitudeElement =
    document.getElementById("longitude");

const accuracyElement =
    document.getElementById("accuracy");

const timeElement =
    document.getElementById("time");

const mapsLink =
    document.getElementById("mapsLink");


function showStatus(message, type) {

    statusBox.textContent = message;

    statusBox.className =
        "status " + type;

    statusBox.classList.remove("hidden");
}


shareButton.addEventListener(
    "click",
    function () {

        if (!window.isSecureContext) {

            showStatus(
                "This page must be opened using HTTPS.",
                "error"
            );

            return;
        }


        if (!navigator.geolocation) {

            showStatus(
                "Your browser does not support location services.",
                "error"
            );

            return;
        }


        shareButton.disabled = true;

        shareButton.textContent =
            "Requesting Location...";


        showStatus(
            "Please respond to your browser's location permission request.",
            ""
        );


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const accuracy =
                    position.coords.accuracy;

                const timestamp =
                    new Date(
                        position.timestamp
                    ).toISOString();


                latitudeElement.textContent =
                    latitude.toFixed(6);

                longitudeElement.textContent =
                    longitude.toFixed(6);

                accuracyElement.textContent =
                    Math.round(accuracy) +
                    " meters";

                timeElement.textContent =
                    new Date(
                        position.timestamp
                    ).toLocaleString();


                mapsLink.href =
                    "https://www.google.com/maps?q=" +
                    encodeURIComponent(
                        latitude + "," + longitude
                    );


                result.classList.remove(
                    "hidden"
                );


                try {

                    const response =
                        await fetch(
                            API_URL +
                            "/api/location",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        latitude:
                                            latitude,

                                        longitude:
                                            longitude,

                                        accuracy:
                                            accuracy,

                                        timestamp:
                                            timestamp
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Server rejected location."
                        );

                    }


                    showStatus(
                        "Your location was voluntarily shared successfully.",
                        "success"
                    );


                } catch (error) {

                    showStatus(
                        "Location was obtained, but the server could not receive it.",
                        "error"
                    );

                }


                shareButton.disabled =
                    false;

                shareButton.textContent =
                    "Share My Location";

            },


            function (error) {

                shareButton.disabled =
                    false;

                shareButton.textContent =
                    "Share My Location";


                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {

                    showStatus(
                        "Location permission was denied. No location was sent.",
                        "error"
                    );

                }

                else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {

                    showStatus(
                        "Your location is unavailable.",
                        "error"
                    );

                }

                else if (
                    error.code ===
                    error.TIMEOUT
                ) {

                    showStatus(
                        "The location request timed out.",
                        "error"
                    );

                }

                else {

                    showStatus(
                        "Unable to obtain your location.",
                        "error"
                    );

                }

            },

            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        );

    }
);
