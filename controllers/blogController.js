import blogModel from '../models/blogModel.js'

const addBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, author } = req.body
        const image_filename = req.file ? req.file.filename : ''

        // Validate required fields
        if (!title || !content || !category || !image_filename) {
            return res.status(400).json({
                success: false,
                message: "Title, content, category, and image are required"
            })
        }

        const blog = new blogModel({
            title,
            content,
            excerpt: excerpt || "",
            image: image_filename,
            category,
            author: author || "Admin"
        })

        await blog.save()

        res.json({
            success: true,
            message: "Blog post created successfully"
        })

    } catch (error) {
        console.log("Error creating blog post:", error)
        res.status(500).json({
            success: false,
            message: "Error creating blog post: " + error.message
        })
    }
}

const listBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find({ status: 'published' }).sort({ createdAt: -1 })
        
        res.json({
            success: true,
            data: blogs
        })
    } catch (error) {
        console.log("Error fetching blogs:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching blogs: " + error.message
        })
    }
}

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params
        const blog = await blogModel.findById(id)

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            })
        }

        // Increment view count
        blog.views += 1
        await blog.save()

        res.json({
            success: true,
            data: blog
        })
    } catch (error) {
        console.log("Error fetching blog:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching blog: " + error.message
        })
    }
}

const getBlogCategories = async (req, res) => {
    try {
        const categories = await blogModel.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        const formattedCategories = categories.map(cat => ({
            _id: cat._id,
            name: cat._id,
            count: cat.count
        }))

        res.json({
            success: true,
            data: formattedCategories
        })
    } catch (error) {
        console.log("Error fetching categories:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching categories: " + error.message
        })
    }
}

const getRecentBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find({ status: 'published' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title image createdAt')
        
        res.json({
            success: true,
            data: blogs
        })
    } catch (error) {
        console.log("Error fetching recent blogs:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching recent blogs: " + error.message
        })
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id, title, content, excerpt, category, author, status } = req.body
        const blog = await blogModel.findById(id)

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            })
        }

        // Update fields
        if (title) blog.title = title
        if (content) blog.content = content
        if (excerpt !== undefined) blog.excerpt = excerpt
        if (category) blog.category = category
        if (author) blog.author = author
        if (status) blog.status = status

        // Handle image update
        if (req.file) {
            blog.image = req.file.filename
        }

        await blog.save()

        res.json({
            success: true,
            message: "Blog post updated successfully"
        })

    } catch (error) {
        console.log("Error updating blog:", error)
        res.status(500).json({
            success: false,
            message: "Error updating blog: " + error.message
        })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            })
        }

        const blog = await blogModel.findByIdAndDelete(id)

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            })
        }

        res.json({
            success: true,
            message: "Blog post deleted successfully"
        })

    } catch (error) {
        console.log("Error deleting blog:", error)
        res.status(500).json({
            success: false,
            message: "Error deleting blog: " + error.message
        })
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find().sort({ createdAt: -1 })
        
        res.json({
            success: true,
            data: blogs
        })
    } catch (error) {
        console.log("Error fetching all blogs:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching all blogs: " + error.message
        })
    }
}

export {
    addBlog,
    listBlogs,
    getBlogById,
    getBlogCategories,
    getRecentBlogs,
    updateBlog,
    deleteBlog,
    getAllBlogs
}
