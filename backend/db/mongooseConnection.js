import mongoose from 'mongoose';

const connectionUrl = 'mongodb://127.0.0.1:27017/simon-api';

const connectToDb = () => {
	mongoose.connect(connectionUrl, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	});
};

export default connectToDb;
