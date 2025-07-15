import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/trending", async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${apiKey}`;

    const response = await axios.get(url);

    res.json({
      articles: response.data.articles.slice(0, 5)
    });
  } catch (error) {
    console.error("Error fetching news:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

export default router;
