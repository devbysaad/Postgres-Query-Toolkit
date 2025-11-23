import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './src/config/db.js';
import queryRoutes from './src/routes/queryRoutes.js';
 
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/postgres_query_library';

await connectDB(MONGO_URI);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/queries', queryRoutes);
 

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});