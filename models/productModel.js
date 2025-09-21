import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    // Basic Information
    name:{type:String, required:true},
    description:{type:String, required:true},
    detailedDescription:{type:String, default:""},
    additionalInformation:{type:String, default:""},
    descriptionImage1:{type:String, default:""},
    descriptionImage2:{type:String, default:""},
    availableColors:[{name: String, color: String}], // Custom color options for each product
    availableSizes:[String], // Custom size options for each product
    price:{type:Number, required:true},
    image:{type:String, required:true}, // Primary image for product cards
    additionalImages:[{type:String}], // Additional images for product description page
    category:{type:String, required:true},
    sku:{type:String, default:""}, // Product SKU/Code
    tags:[{type:String}], // Product tags for filtering
    stock:{type:Number, default:0, required:true},
    
    // General Information
    salesPackage:{type:String, default:""},
    modelNumber:{type:String, default:""},
    secondaryMaterial:{type:String, default:""},
    configuration:{type:String, default:""},
    upholsteryMaterial:{type:String, default:""},
    upholsteryColor:{type:String, default:""},
    
    // Product Information
    fillingMaterial:{type:String, default:""},
    finishType:{type:String, default:""},
    adjustableHeadrest:{type:String, default:""},
    maximumLoadCapacity:{type:String, default:""},
    originOfManufacture:{type:String, default:""},
    
    // Dimensions
    width:{type:Number, default:0},
    height:{type:Number, default:0},
    depth:{type:Number, default:0},
    weight:{type:Number, default:0},
    seatHeight:{type:Number, default:0},
    legHeight:{type:Number, default:0},
    
    // Warranty
    warrantySummary:{type:String, default:""},
    warrantyServiceType:{type:String, default:""},
    coveredInWarranty:{type:String, default:""},
    notCoveredInWarranty:{type:String, default:""},
    domesticWarranty:{type:String, default:""}
}, {
    timestamps: true
})


const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;