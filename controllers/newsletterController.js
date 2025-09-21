import newsletterModel from "../models/newsletterModel.js";

export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Check if email already exists
        const existingSubscriber = await newsletterModel.findOne({ email: email.toLowerCase() });
        
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already subscribed to newsletter"
                });
            } else {
                // Reactivate subscription
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = new Date();
                await existingSubscriber.save();
                
                return res.status(200).json({
                    success: true,
                    message: "Successfully resubscribed to newsletter"
                });
            }
        }

        // Create new subscription
        const newSubscriber = new newsletterModel({
            email: email.toLowerCase()
        });

        await newSubscriber.save();

        res.status(200).json({
            success: true,
            message: "Successfully subscribed to newsletter"
        });

    } catch (error) {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getNewsletterSubscribers = async (req, res) => {
    try {
        const subscribers = await newsletterModel.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .select('email subscribedAt');

        res.status(200).json({
            success: true,
            data: subscribers,
            count: subscribers.length
        });

    } catch (error) {
        console.error("Get newsletter subscribers error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const subscriber = await newsletterModel.findOne({ email: email.toLowerCase() });
        
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Email not found in newsletter subscription"
            });
        }

        if (!subscriber.isActive) {
            return res.status(400).json({
                success: false,
                message: "Email is already unsubscribed"
            });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.status(200).json({
            success: true,
            message: "Successfully unsubscribed from newsletter"
        });

    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
