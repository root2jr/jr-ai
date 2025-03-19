import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;

app.post('/api/gemini', async (req,res) =>{
    try {
        const { prompt } = req.body;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
        const response = await axios.post(url, {
          contents: [{ parts: [{ text: prompt }] }],
        });
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        res.json({ response: aiResponse });        
        console.log('Response Received Successfully!', JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to fetch response from Gemini" });
      }
}); 

app.listen(PORT, () =>{
    console.log('Server is Running Sucessfully!');
    console.log(`PORT:${PORT}`);
})