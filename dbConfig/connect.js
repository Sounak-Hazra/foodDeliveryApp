import e from 'express';
import mongoose from 'mongoose';



export default async function dbConnect() {

    if(mongoose.connections[0].readyState){
        console.log('Already connected');
        return;
    }

    try {
        const connect = mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('Database connected');
        });
        connection.on('error', (error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
}