import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://giteshdesai7:7300211136Gd@cluster777.lfxztaa.mongodb.net/furniro';

export const connectDB = async () => {
    try {
        // Connection options for better stability
        const options = {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect(MONGODB_URI, options);
        
        console.log("✅ Database Connected Successfully");
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('🔄 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose disconnected from MongoDB');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};
