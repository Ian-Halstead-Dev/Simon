import mongoose from 'mongoose';
import Filter from 'bad-words';

const filter = new Filter();

const scoreSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
		trim: true,
		maxlength: 15,
		validate(value) {
			if (filter.isProfane(value)) {
				throw new Error('Name must not contain profane language');
			}
		}
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
	date: {
		type: Date,
		default: Date.now
	}
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;
