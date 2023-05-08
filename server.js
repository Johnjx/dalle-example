import * as dotenv from "dotenv";
dotenv.config();

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// dream endpoint
app.post("/dream", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const image = aiResponse.data.data[0].url;
    res.send({ image });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error?.response.data.error.message || "something went wrong");
  }
});

// health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

// error handler

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });
});

app.listen(8080, () =>
  console.log("Server running on http://localhost:8080/dream")
);
