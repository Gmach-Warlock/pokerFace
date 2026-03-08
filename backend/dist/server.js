import express from "express";
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
    res.send(`Welcome to my server!`);
});
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map