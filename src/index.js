export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Allow browser preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Location endpoint
    if (url.pathname === "/api/location" && request.method === "POST") {
      try {
        const location = await request.json();

        if (
          typeof location.latitude !== "number" ||
          typeof location.longitude !== "number"
        ) {
          return new Response(
            JSON.stringify({
              message: "Invalid location data."
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
          );
        }

        console.log("Location voluntarily shared:", location);

        return new Response(
          JSON.stringify({
            success: true,
            message: "Location received successfully."
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            message: "Invalid request."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    return new Response("Location backend is running.", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
