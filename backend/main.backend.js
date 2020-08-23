import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import scoreRouter from './routers/score.router.js';
import frontendRouter from './routers/frontend.router.js';
import dbConnect from './db/mongooseConnection.js';

dbConnect();
const app = express();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve(path.dirname(''));

const publicDirPath = path.join(__dirname, '/frontend/public');
console.log(publicDirPath);
app.use(express.static(publicDirPath));

app.use(express.json());

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(scoreRouter);
app.use(frontendRouter);

// app.get('/test', (req, res) => {
// 	res.send({ test: false });
// });

// app.post('/test', (req, res) => {
// 	console.log(req.body);
// });

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
