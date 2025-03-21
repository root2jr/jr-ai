import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import mongoose from 'mongoose'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch((error) => console.error('MongoDB Connection Failed:', error));



const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: String,
  conversationId: String,
  username: String,
  context: String,
})

const convoSchema = new mongoose.Schema({
  conversationId: String,
  messages: [messageSchema],
})

const Model = mongoose.model('Conversation', convoSchema);

app.post('/conversations', async (req, res) => {
  try {

    const { sender, message, timestamp, conversationId } = req.body;

    const newMessage = { sender, message, timestamp, username: "", context: "" };
    
    const { username }= req.body.username;
    const { context } = req.body.context;

    if(username){
      newMessage.username = username;
    }
    if(context){
      newMessage.context = context;
    }

    const updatedConversation = await Model.findOneAndUpdate(
      { conversationId },
      { $push: { messages: newMessage } },
      { upsert: true, new: true }
    );
    res.json(updatedConversation);

  }
  catch (error) {
    console.error('Error in Insertion:', error);
    res.status(500).json({ error: 'Failed to Insert Data!' });
  }
})
app.get('/conversations/:conversationId', async (req, res) => {
  try {
    const convo = await Model.findOne({ conversationId: req.params.conversationId });
    res.json(convo ? convo.messages : []);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});








app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;



    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const convo = await Model.findOne({ conversationId });

    let memoryText = "";
    if (convo && convo.messages.length > 0) {
      const recentMessages = convo.messages.slice(-6); // only last 6 messages
      memoryText = recentMessages
        .map(m => `${m.sender === 'user' ? "User" : "JARVIS"}: ${m.message}`)
        .join('\n');
    }
    

    // Construct the final prompt with only user context
    const finalPrompt = `${memoryText}\nUser: ${prompt}\nJARVIS:`;


    const response = await axios.post(url, {
      contents: [{ parts: [{ text: finalPrompt }] }],
    });
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ response: aiResponse });
    console.log('Response Received Successfully!', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch response from Gemini" });
  }
});

app.listen(PORT, () => {
  console.log('Server is Running Sucessfully!');
  console.log(`PORT:${PORT}`);
})