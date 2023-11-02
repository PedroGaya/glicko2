import app from "./app";

app.listen(
    {
        hostname: Bun.env.APP_HOST,
        port: Bun.env.APP_PORT,
    },
    ({ hostname, port }) => {
        console.log(`Running at http://${hostname}:${port}`);
    }
);
