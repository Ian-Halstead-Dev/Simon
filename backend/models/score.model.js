import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
		trim: true,
		maxlength: 15
	},
	score: {
		type: Number,
		required: true,

		validate(value) {
			if (value < 0) {
				throw new Error('score must be positive');
			}
		}
	},

	ip: {
		type: String,
		required: true
	},

	date: {
		type: Date,
		default: Date.now
	}
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;
