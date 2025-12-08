const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET all teams - Không cần đăng nhập
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single team by ID - Không cần đăng nhập
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new team - Chỉ admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const team = new Team({
    name: req.body.name,
    coach: req.body.coach,
    founded: req.body.founded,
    city: req.body.city,
    wins: req.body.wins || 0,
    losses: req.body.losses || 0,
    logo: req.body.logo || '',
    description: req.body.description || ''
  });

  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE team - Chỉ admin
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        team[key] = req.body[key];
      }
    });

    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE team - Chỉ admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    await team.deleteOne();
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET team statistics - Không cần đăng nhập
router.get('/:id/stats', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    const totalGames = team.wins + team.losses;
    const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(2) : 0;
    
    res.json({
      team: team.name,
      wins: team.wins,
      losses: team.losses,
      totalGames: totalGames,
      winRate: `${winRate}%`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
