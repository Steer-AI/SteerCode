import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import fileContentRouter from './routes/fileContent';
import fileTreeRouter from './routes/fileTree';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(fileTreeRouter);
app.use(fileContentRouter);

const port = process.env.BACKEND_PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
