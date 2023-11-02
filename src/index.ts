import app from "./app";

app.listen({
    port: Bun.env.APP_PORT,
});

console.log("Listening in port: ", Bun.env.APP_PORT);
