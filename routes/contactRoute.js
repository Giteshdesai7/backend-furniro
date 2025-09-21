import express from 'express'
import { submitContact, getContacts, updateContactStatus, deleteContact } from '../controllers/contactController.js'

const contactRouter = express.Router()

// Public route for submitting contact forms
contactRouter.post("/submit", submitContact)

// Admin panel routes (no authentication required like other admin endpoints)
contactRouter.get("/list", getContacts)
contactRouter.post("/update-status", updateContactStatus)
contactRouter.post("/delete", deleteContact)

export default contactRouter
