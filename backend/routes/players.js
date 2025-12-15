const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET all players - Không cần đăng nhập
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().populate('team', 'name city').sort({ name: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEARCH players
router.get('/search', async (req, res) => {
  try {
    const { name, position, team, nationality } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (position) {
      query.position = position;
    }

    if (team) {
      query.team = team;
    }

    if (nationality) {
      query.nationality = { $regex: nationality, $options: 'i' };
    }

    const players = await Player.find(query)
      .populate('team', 'name city')
      .sort({ name: 1 });
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET players by team
router.get('/team/:teamId', async (req, res) => {
  try {
    const players = await Player.find({ team: req.params.teamId }).populate('team', 'name city');
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team', 'name city coach');
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new player - Chỉ admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const player = new Player({
    name: req.body.name,
    jerseyNumber: req.body.jerseyNumber,
    position: req.body.position,
    team: req.body.team,
    height: req.body.height,
    weight: req.body.weight,
    dateOfBirth: req.body.dateOfBirth,
    nationality: req.body.nationality || 'Vietnam',
    photo: req.body.photo || '',
    stats: req.body.stats || {}
  });

  try {
    const newPlayer = await player.save();
    const populatedPlayer = await Player.findById(newPlayer._id).populate('team', 'name city');
    res.status(201).json(populatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE player - Chỉ admin
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'stats' && typeof req.body[key] === 'object') {
          player.stats = { ...player.stats.toObject(), ...req.body[key] };
        } else {
          player[key] = req.body[key];
        }
      }
    });

    const updatedPlayer = await player.save();
    const populatedPlayer = await Player.findById(updatedPlayer._id).populate('team', 'name city');
    res.json(populatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE player - Chỉ admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    await player.deleteOne();
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE player stats - Chỉ admin
router.patch('/:id/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.stats = { ...player.stats.toObject(), ...req.body };
    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
