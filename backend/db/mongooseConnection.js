import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionUrl = process.env.dbName;

const connectToDb = () => {
	mongoose.connect(connectionUrl, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	});
};

export default connectToDb;
