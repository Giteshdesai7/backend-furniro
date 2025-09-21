import productModel from "../models/productModel.js";
import fs from 'fs'


//add product item

const addProduct = async (req, res)=>{
    try {
        
        // Handle primary image
        let image_filename = '';
        if (req.files && req.files.image && req.files.image[0]) {
            image_filename = req.files.image[0].filename;
            console.log("Primary image filename:", image_filename);
        } else {
            console.log("ERROR: No primary image found");
            console.log("req.files structure:", JSON.stringify(req.files, null, 2));
            return res.status(400).json({success: false, message: "Primary image is required"});
        }
        
        // Handle additional images
        let additionalImages = [];
        if (req.files && req.files.additionalImages) {
            additionalImages = req.files.additionalImages.map(file => file.filename);
            console.log("Additional images filenames:", additionalImages);
        } else {
            console.log("No additional images provided");
        }

        // Handle description images
        let descriptionImage1 = '';
        let descriptionImage2 = '';
        if (req.files && req.files.descriptionImage1 && req.files.descriptionImage1[0]) {
            descriptionImage1 = req.files.descriptionImage1[0].filename;
            console.log("Description image 1 filename:", descriptionImage1);
        }
        if (req.files && req.files.descriptionImage2 && req.files.descriptionImage2[0]) {
            descriptionImage2 = req.files.descriptionImage2[0].filename;
            console.log("Description image 2 filename:", descriptionImage2);
        }

        // Debug availableSizes and availableColors
        console.log("Raw availableSizes from request:", req.body.availableSizes);
        console.log("Raw availableColors from request:", req.body.availableColors);
        console.log("Type of availableSizes:", typeof req.body.availableSizes);
        console.log("Type of availableColors:", typeof req.body.availableColors);
        
        let parsedAvailableSizes = [];
        let parsedAvailableColors = [];
        
        try {
            if (req.body.availableSizes) {
                const sizesArray = JSON.parse(req.body.availableSizes);
                parsedAvailableSizes = sizesArray.map(size => size.type).filter(type => type && type.trim() !== '');
                console.log("Parsed availableSizes:", parsedAvailableSizes);
            }
        } catch (error) {
            console.log("Error parsing availableSizes:", error);
        }
        
        try {
            if (req.body.availableColors) {
                parsedAvailableColors = JSON.parse(req.body.availableColors);
                console.log("Parsed availableColors:", parsedAvailableColors);
            }
        } catch (error) {
            console.log("Error parsing availableColors:", error);
        }

    const product = new productModel({
        // Basic Information
        name: req.body.name,
        description: req.body.description,
        detailedDescription: req.body.detailedDescription || "",
        additionalInformation: req.body.additionalInformation || "",
        descriptionImage1: descriptionImage1,
        descriptionImage2: descriptionImage2,
        availableColors: parsedAvailableColors,
        availableSizes: parsedAvailableSizes,
        price: req.body.price,
        image: image_filename,
        additionalImages: additionalImages,
        category: req.body.category,
        sku: req.body.sku || "",
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        stock: req.body.stock || 0,
        
        // General Information
        salesPackage: req.body.salesPackage || "",
        modelNumber: req.body.modelNumber || "",
        secondaryMaterial: req.body.secondaryMaterial || "",
        configuration: req.body.configuration || "",
        upholsteryMaterial: req.body.upholsteryMaterial || "",
        upholsteryColor: req.body.upholsteryColor || "",
        
        // Product Information
        fillingMaterial: req.body.fillingMaterial || "",
        finishType: req.body.finishType || "",
        adjustableHeadrest: req.body.adjustableHeadrest || "",
        maximumLoadCapacity: req.body.maximumLoadCapacity || "",
        originOfManufacture: req.body.originOfManufacture || "",
        
        // Dimensions
        width: req.body.width || 0,
        height: req.body.height || 0,
        depth: req.body.depth || 0,
        weight: req.body.weight || 0,
        seatHeight: req.body.seatHeight || 0,
        legHeight: req.body.legHeight || 0,
        
        // Warranty
        warrantySummary: req.body.warrantySummary || "",
        warrantyServiceType: req.body.warrantyServiceType || "",
        coveredInWarranty: req.body.coveredInWarranty || "",
        notCoveredInWarranty: req.body.notCoveredInWarranty || "",
        domesticWarranty: req.body.domesticWarranty || ""
    })

        console.log("Saving product to database...");
        await product.save();
        console.log("Product saved successfully!");
        res.json({success:true, message:"Product Added Successfully"})
    } catch (error) {
        console.log("Error adding product:", error)
        res.status(500).json({success:false, message:"Error adding product: " + error.message})
    }
}

//all product list
const listProduct= async (req, res)=> {
    try {
        const products= await productModel.find({});
        res.json({success:true, data:products})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})

        
    }

}

//remove product item
const removeProduct = async (req, res)=>{
    try {
        const product=await productModel.findById(req.body.id);
        fs.unlink(`uploads/${product.image}`, ()=> {})

        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Product Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//update stock
const updateStock = async (req, res)=>{
    try {
        await productModel.findByIdAndUpdate(req.body.id, {stock: req.body.stock});
        res.json({success:true, message:"Stock Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//decrease stock when ordered
const decreaseStock = async (req, res)=>{
    try {
        const product = await productModel.findById(req.body.id);
        if(product.stock >= req.body.quantity) {
            product.stock -= req.body.quantity;
            await product.save();
            res.json({success:true, message:"Stock Updated"})
        } else {
            res.json({success:false, message:"Insufficient Stock"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id, detailedDescription, additionalInformation } = req.body;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        if (detailedDescription !== undefined) {
            product.detailedDescription = detailedDescription;
        }
        if (additionalInformation !== undefined) {
            product.additionalInformation = additionalInformation;
        }
        
        await product.save();
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating product" });
    }
}

export {addProduct, listProduct, removeProduct, updateStock, decreaseStock, updateProduct}