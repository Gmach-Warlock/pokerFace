import express from "express";
import path from "path";
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
    res.send(`Welcome to my server!`);
});
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map