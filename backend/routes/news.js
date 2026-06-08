const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

// Get basketball news from external API
router.get('/', async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(503).json({
        error: 'NEWS_API_KEY is not configured',
        message: 'Please set NEWS_API_KEY in backend/.env before fetching news.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;

    const response = await axios.get(`${NEWS_API_URL}/everything`, {
      params: {
        q: 'basketball',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize,
        page,
        apiKey: NEWS_API_KEY
      }
    });

    res.json({
      success: true,
      data: response.data.articles,
      pagination: {
        page,
        pageSize,
        totalResults: response.data.totalResults,
        totalPages: Math.ceil(response.data.totalResults / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch news',
      message: error.message
    });
  }
});

// Get basketball news by search query
router.get('/search/:query', async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(503).json({
        error: 'NEWS_API_KEY is not configured',
        message: 'Please set NEWS_API_KEY in backend/.env before searching news.'
      });
    }

    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;

    const response = await axios.get(`${NEWS_API_URL}/everything`, {
      params: {
        q: `basketball ${query}`,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize,
        page,
        apiKey: NEWS_API_KEY
      }
    });

    res.json({
      success: true,
      data: response.data.articles,
      pagination: {
        page,
        pageSize,
        totalResults: response.data.totalResults,
        totalPages: Math.ceil(response.data.totalResults / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch news',
      message: error.message
    });
  }
});

// Get top headlines for basketball
router.get('/headlines', async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(503).json({
        error: 'NEWS_API_KEY is not configured',
        message: 'Please set NEWS_API_KEY in backend/.env before fetching headlines.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;

    const response = await axios.get(`${NEWS_API_URL}/top-headlines`, {
      params: {
        q: 'basketball',
        language: 'en',
        pageSize,
        page,
        apiKey: NEWS_API_KEY
      }
    });

    res.json({
      success: true,
      data: response.data.articles,
      pagination: {
        page,
        pageSize,
        totalResults: response.data.totalResults,
        totalPages: Math.ceil(response.data.totalResults / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch headlines',
      message: error.message
    });
  }
});

module.exports = router;
