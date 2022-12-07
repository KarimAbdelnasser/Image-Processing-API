import express from 'express';
const app = express();
const PORT = 8080;
import { router } from './routes/imgRoute';

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

export default app;
