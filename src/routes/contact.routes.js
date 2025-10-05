import express from "express";
import { createContact, getAllContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getAllContacts); // for admin or testing later

export default router;
