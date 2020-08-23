import express from 'express';
import Score from '../models/score.model.js';
const router = express.Router();

router.get('/score', async (req, res) => {
	const scores = await Score.find();

	res.send(scores);
});

router.post('/score', async (req, res) => {
	req.body.ip = req.ip;
	const score = new Score(req.body);

	try {
		await score.save();
		res.status(201).send(score);
	} catch (e) {
		res.status(400).send(e);
	}
});

export default router;
