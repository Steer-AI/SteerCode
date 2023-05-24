import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import fileContentRouter from './routes/fileContent';
import fileTreeRouter from './routes/fileTree';
import selectDirectoryRouter from './routes/selectDirectory';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all CORS requests
app.use(fileTreeRouter);
app.use(fileContentRouter);
app.use(selectDirectoryRouter);

const port = process.env.BACKEND_PORT || 3000;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
