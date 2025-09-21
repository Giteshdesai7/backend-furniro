import express from 'express'
import multer from 'multer'
import { 
    addBlog, 
    listBlogs, 
    getBlogById, 
    getBlogCategories, 
    getRecentBlogs, 
    updateBlog, 
    deleteBlog, 
    getAllBlogs 
} from '../controllers/blogController.js'

const blogRouter = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

// Public routes for frontend
blogRouter.get("/list", listBlogs)
blogRouter.get("/categories", getBlogCategories)
blogRouter.get("/recent", getRecentBlogs)
blogRouter.get("/:id", getBlogById)

// Admin routes (no authentication required like other admin endpoints)
blogRouter.post("/add", upload.single('image'), addBlog)
blogRouter.get("/admin/list", getAllBlogs)
blogRouter.post("/update", upload.single('image'), updateBlog)
blogRouter.post("/delete", deleteBlog)

export default blogRouter
