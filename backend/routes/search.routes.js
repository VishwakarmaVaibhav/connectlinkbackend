import express from "express";
import { searchUsers } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", searchUsers); // changed to just "/" so it works with "/search"

export default router;
