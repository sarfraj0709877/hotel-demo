const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

// Main website
app.use(express.static(path.join(__dirname, "..")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Admin page
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Save booking
app.post("/booking", (req, res) => {
  console.log("Booking Data:", req.body);

  let bookings = [];

  try {
    bookings = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "bookings.json"),
        "utf8"
      )
    );
  } catch (err) {
    bookings = [];
  }

  bookings.push(req.body);

  fs.writeFileSync(
    path.join(__dirname, "bookings.json"),
    JSON.stringify(bookings, null, 2)
  );

  res.json({
    success: true,
    message: "Booking received and saved"
  });
});

// Get all bookings
app.get("/bookings", (req, res) => {
  try {
    const bookings = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "bookings.json"),
        "utf8"
      )
    );

    res.json(bookings);
  } catch (err) {
    res.json([]);
  }
});

// Delete booking
app.delete("/bookings/:index", (req, res) => {
  try {
    const filePath = path.join(__dirname, "bookings.json");

    const bookings = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    const index = Number(req.params.index);

    if (index < 0 || index >= bookings.length) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    bookings.splice(index, 1);

    fs.writeFileSync(
      filePath,
      JSON.stringify(bookings, null, 2)
    );

    res.json({
      success: true,
      message: "Booking deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting booking"
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});