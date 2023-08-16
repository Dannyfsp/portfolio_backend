require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs").promises;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const mail = require("@sendgrid/mail");

app.get("/", (_, res) => {
  res.json({ message: "Welcome to Aghogho Daniel Bogare portfolio API" });
});

app.get("/api/resume", async (_, res) => {
  const cv = "bogare.pdf";
  const cvPath = path.join(__dirname, "public", cv);

  try {
    await fs.access(cvPath);
    return res.download(cvPath, "bogare.pdf");
  } catch (error) {
    res.status(500).json({ message: "Error downloading CV" });
  }
});

mail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/api/hire", (req, res) => {
  const { names, email, message } = req.body;

  const msg = `
    Name: ${names}\r\n
    Email: ${email}\r\n
    Message: ${message}
    `;

  const data = {
    to: "danbogare@gmail.com",
    from: "admin@danbogare.tech",
    subject: "Message from Portfolio",
    text: msg,
    html: msg.replace(/\r\n/g, "<br/>"),
  };

  const sendMail = async () => {
    try {
      await mail.send(data);
    } catch (error) {
      console.error(error);
    }
  };

  sendMail();

  res.status(200).json({ status: "Ok" });
});

const port = process.env.PORT;

app.listen(port, () => console.log(`server running on port ${port}`));
