import express from 'express';
import cors from 'cors'; // Import cors
import { categorizeTask } from './groq.js';

const app = express();
const port = 3000;

// Użyj CORS, aby zezwolić na połączenia z innych domen
app.use(cors());

app.use(express.json());

app.post('/categorize', async (req, res) => {
  const { title, description } = req.body;
  try {
    const category = await categorizeTask(title, description);
    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas kategoryzacji' });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
