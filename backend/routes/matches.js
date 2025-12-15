const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET all matches - Không cần đăng nhập
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('homeTeam', 'name city logo')
      .populate('awayTeam', 'name city logo')
      .sort({ matchDate: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET upcoming matches
router.get('/upcoming', async (req, res) => {
  try {
    const matches = await Match.find({ 
      matchDate: { $gte: new Date() },
      status: { $in: ['Scheduled', 'Live'] }
    })
      .populate('homeTeam', 'name city logo')
      .populate('awayTeam', 'name city logo')
      .sort({ matchDate: 1 })
      .limit(10);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET past matches
router.get('/past', async (req, res) => {
  try {
    const matches = await Match.find({ 
      status: 'Finished'
    })
      .populate('homeTeam', 'name city logo')
      .populate('awayTeam', 'name city logo')
      .sort({ matchDate: -1 })
      .limit(20);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET match statistics by period (day/week/month)
router.get('/stats', async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        matchDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else if (period) {
      const now = new Date();
      const start = new Date();
      
      switch (period) {
        case 'day':
          start.setHours(0, 0, 0, 0);
          break;
        case 'week':
          start.setDate(now.getDate() - now.getDay());
          start.setHours(0, 0, 0, 0);
          break;
        case 'month':
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          break;
        default:
          start.setDate(now.getDate() - 7);
      }
      
      dateFilter = {
        matchDate: {
          $gte: start,
          $lte: now
        }
      };
    }

    const matches = await Match.find(dateFilter)
      .populate('homeTeam', 'name city logo')
      .populate('awayTeam', 'name city logo')
      .sort({ matchDate: -1 });

    const stats = {
      totalMatches: matches.length,
      scheduled: matches.filter(m => m.status === 'Scheduled').length,
      live: matches.filter(m => m.status === 'Live').length,
      finished: matches.filter(m => m.status === 'Finished').length,
      cancelled: matches.filter(m => m.status === 'Cancelled').length,
      matches: matches
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEARCH matches
router.get('/search', async (req, res) => {
  try {
    const { team, location, status, fromDate, toDate } = req.query;
    let query = {};

    if (team) {
      const teams = await Team.find({ 
        name: { $regex: team, $options: 'i' } 
      });
      const teamIds = teams.map(t => t._id);
      query.$or = [
        { homeTeam: { $in: teamIds } },
        { awayTeam: { $in: teamIds } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    if (fromDate || toDate) {
      query.matchDate = {};
      if (fromDate) query.matchDate.$gte = new Date(fromDate);
      if (toDate) query.matchDate.$lte = new Date(toDate);
    }

    const matches = await Match.find(query)
      .populate('homeTeam', 'name city logo')
      .populate('awayTeam', 'name city logo')
      .sort({ matchDate: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeam', 'name city coach logo')
      .populate('awayTeam', 'name city coach logo');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new match - Chỉ admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const match = new Match({
    homeTeam: req.body.homeTeam,
    awayTeam: req.body.awayTeam,
    homeScore: req.body.homeScore || 0,
    awayScore: req.body.awayScore || 0,
    matchDate: req.body.matchDate,
    location: req.body.location,
    status: req.body.status || 'Scheduled',
    quarter: req.body.quarter || 1,
    notes: req.body.notes || ''
  });

  try {
    const newMatch = await match.save();
    const populatedMatch = await Match.findById(newMatch._id)
      .populate('homeTeam', 'name city logo')
      .populate('awayTeam', 'name city logo');
    res.status(201).json(populatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE match - Chỉ admin
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        match[key] = req.body[key];
      }
    });

    const updatedMatch = await match.save();
    const populatedMatch = await Match.findById(updatedMatch._id)
      .populate('homeTeam', 'name city logo')
      .populate('awayTeam', 'name city logo');
    res.json(populatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE match score - Chỉ admin
router.patch('/:id/score', verifyToken, isAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (req.body.homeScore !== undefined) match.homeScore = req.body.homeScore;
    if (req.body.awayScore !== undefined) match.awayScore = req.body.awayScore;
    if (req.body.quarter !== undefined) match.quarter = req.body.quarter;
    if (req.body.status !== undefined) match.status = req.body.status;

    // Update team records if match is finished
    if (req.body.status === 'Finished' && match.status !== 'Finished') {
      const homeTeam = await Team.findById(match.homeTeam);
      const awayTeam = await Team.findById(match.awayTeam);

      if (match.homeScore > match.awayScore) {
        homeTeam.wins += 1;
        awayTeam.losses += 1;
      } else if (match.awayScore > match.homeScore) {
        awayTeam.wins += 1;
        homeTeam.losses += 1;
      }

      await homeTeam.save();
      await awayTeam.save();
    }

    const updatedMatch = await match.save();
    const populatedMatch = await Match.findById(updatedMatch._id)
      .populate('homeTeam', 'name city logo wins losses')
      .populate('awayTeam', 'name city logo wins losses');
    res.json(populatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE match - Chỉ admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    await match.deleteOne();
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
