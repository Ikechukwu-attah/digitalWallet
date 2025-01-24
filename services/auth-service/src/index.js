const express = require("express");
const app = express();

// Basic route for testing
app.get("/", (req, res) => {
    res.send("Auth Service is up and running!");
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
});