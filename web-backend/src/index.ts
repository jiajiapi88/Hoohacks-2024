import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './user';

const Post = require('./models/Post'); // Import your model
const app = express();
const PORT = 3001;

//Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://jiajiapi88:<password>@hoohackcluster.a32ym9r.mongodb.net/')
.then(() => console.log('MongoDB connection successful'))
.catch(err => console.error('MongoDB connection error:', err));

// POST endpoint to create a new user
app.post('/users', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const newUser = new User({ title, content, author });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    const message = (error as Error).message;
    res.status(400).json({ message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});