// Inside dbConfig/connect.js or wherever you handle dbConnect
import mongoose from 'mongoose';

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Database already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw new Error('Database connection failed');
    }
};

export default dbConnect;
