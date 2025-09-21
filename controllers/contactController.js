import contactModel from '../models/contactModel.js'

const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and message are required"
            })
        }

        // Create new contact submission
        const contact = new contactModel({
            name,
            email,
            subject: subject || "",
            message
        })

        await contact.save()

        res.json({
            success: true,
            message: "Contact form submitted successfully"
        })

    } catch (error) {
        console.log("Error submitting contact form:", error)
        res.status(500).json({
            success: false,
            message: "Error submitting contact form: " + error.message
        })
    }
}

const getContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find().sort({ createdAt: -1 })
        
        res.json({
            success: true,
            data: contacts
        })
    } catch (error) {
        console.log("Error fetching contacts:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching contacts: " + error.message
        })
    }
}

const updateContactStatus = async (req, res) => {
    try {
        const { id, status } = req.body

        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: "Contact ID and status are required"
            })
        }

        const contact = await contactModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            })
        }

        res.json({
            success: true,
            message: "Contact status updated successfully",
            data: contact
        })

    } catch (error) {
        console.log("Error updating contact status:", error)
        res.status(500).json({
            success: false,
            message: "Error updating contact status: " + error.message
        })
    }
}

const deleteContact = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Contact ID is required"
            })
        }

        const contact = await contactModel.findByIdAndDelete(id)

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            })
        }

        res.json({
            success: true,
            message: "Contact deleted successfully"
        })

    } catch (error) {
        console.log("Error deleting contact:", error)
        res.status(500).json({
            success: false,
            message: "Error deleting contact: " + error.message
        })
    }
}

export {
    submitContact,
    getContacts,
    updateContactStatus,
    deleteContact
}
