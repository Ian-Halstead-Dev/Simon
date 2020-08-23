import express from 'express';
import path from 'path';
const router = express.Router();

const __dirname = path.resolve(path.dirname(''));

const publicDirPath = path.join(__dirname, '../frontend', '/public');

router.get('', (req, res) => {
	res.sendFile(path.join(__dirname, '/frontend/index.html'));
});

export default router;
