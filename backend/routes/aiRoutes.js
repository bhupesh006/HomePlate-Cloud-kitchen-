const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { openai, getAIRecommendations } = require('../utils/recommendations');

// AI Recommendations
router.post('/recommendations', authMiddleware, async (req, res) => {
  try {
    const { cartItems } = req.body;
    const recommendations = await getAIRecommendations(req.userId, cartItems || []);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chatbot Route
router.post('/chatbot', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const systemPrompt = "You are a helpful assistant for a food delivery app called 'Home Plate'. You answer questions for both customers and sellers. Keep your answers concise, friendly, and helpful. For customers, you can answer questions about orders or food. For sellers, you can answer questions about managing their menu or orders.";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ error: 'Failed to get response from AI assistant.' });
  }
});

module.exports = router;
