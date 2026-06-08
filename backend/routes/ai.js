const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Team = require('../models/Team');
const Player = require('../models/Player');
const Match = require('../models/Match');
const { verifyToken } = require('../middleware/auth');
const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function to get basketball context from database
async function getBasketballContext() {
  try {
    const teams = await Team.find().select('name city coach wins losses');
    const players = await Player.find().populate('team', 'name').limit(50);
    const matches = await Match.find()
      .populate('homeTeam awayTeam', 'name')
      .limit(20)
      .sort({ matchDate: -1 });

    const teamsInfo = teams
      .map((t) => `- ${t.name} (${t.city}): ${t.wins}W-${t.losses}L`)
      .join('\n');

    const topPlayers = players
      .sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0))
      .slice(0, 10)
      .map((p) => `- ${p.name} (${p.team?.name || 'Unknown'}): ${p.stats?.points || 0} points`)
      .join('\n');

    const recentMatches = matches
      .map(
        (m) =>
          `- ${m.homeTeam?.name} vs ${m.awayTeam?.name}: ${m.homeScore}-${m.awayScore} (${m.status})`
      )
      .join('\n');

    return `
Basketball League Data:

TEAMS:
${teamsInfo}

TOP PLAYERS BY POINTS:
${topPlayers}

RECENT MATCHES:
${recentMatches}
    `.trim();
  } catch (error) {
    console.error('Error fetching basketball context:', error);
    return 'Basketball league data available.';
  }
}

// Chat endpoint
router.post('/chat', verifyToken, async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        error: 'GROQ_API_KEY is not configured',
        message: 'Please set GROQ_API_KEY in backend/.env before using the AI assistant.',
      });
    }

    const { message } = req.body;
    const userId = req.user.userId;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Get or create chat session
    let chatSession = await Chat.findOne({ userId, context: 'General Basketball Info' });
    if (!chatSession) {
      chatSession = new Chat({ userId, messages: [], context: 'General Basketball Info' });
    }

    // Add user message to history
    chatSession.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get basketball context
    const context = await getBasketballContext();

    // Prepare messages for Groq
    const systemPrompt = `You are a helpful basketball assistant for a Vietnamese basketball league management system. 
You have access to current team, player, and match data. 
Answer questions about teams, players, statistics, and matches.
Always respond in Vietnamese unless asked otherwise.
Be concise and informative.

Current Basketball Data:
${context}`;

    // Build conversation history for Groq
    const conversationHistory = chatSession.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Groq API
    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...conversationHistory,
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantMessage = groqResponse.choices[0].message.content;

    // Add assistant response to chat history
    chatSession.messages.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date(),
    });

    // Keep only last 20 messages to avoid exceeding limits
    if (chatSession.messages.length > 20) {
      chatSession.messages = chatSession.messages.slice(-20);
    }

    // Save chat session
    await chatSession.save();

    res.json({
      message: assistantMessage,
      sessionId: chatSession._id,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
});

// Get chat history
router.get('/chat/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const chatSession = await Chat.findOne({ userId, context: 'General Basketball Info' }).sort({
      createdAt: -1,
    });

    if (!chatSession) {
      return res.json({ messages: [] });
    }

    res.json({
      messages: chatSession.messages,
      sessionId: chatSession._id,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Clear chat history
router.delete('/chat/clear', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await Chat.deleteOne({ userId, context: 'General Basketball Info' });

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

module.exports = router;
