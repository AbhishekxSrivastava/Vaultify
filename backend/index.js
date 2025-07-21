import express from "express";

const PORT = 3000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello there !!!");
});


app.listen(PORT, (req, res) => {
    console.log("Server started at http://localhost:3000")
})