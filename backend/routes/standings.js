const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Match = require('../models/Match');
const { verifyToken } = require('../middleware/auth');

// Get standings (dynamic ranking)
router.get('/', verifyToken, async (req, res) => {
  try {
    const season = req.query.season || new Date().getFullYear();
    
    // Get all teams
    const teams = await Team.find().select('name city coach founded wins losses');
    
    // Calculate stats for each team
    const standings = teams.map(team => {
      const totalGames = team.wins + team.losses;
      const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(2) : 0;
      
      return {
        _id: team._id,
        name: team.name,
        city: team.city,
        coach: team.coach,
        wins: team.wins,
        losses: team.losses,
        totalGames,
        winRate: parseFloat(winRate),
        pointsFor: 0,
        pointsAgainst: 0,
        pointDiff: 0
      };
    });

    // Sort by win rate
    standings.sort((a, b) => {
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      return b.wins - a.wins;
    });

    // Add rank
    const rankedStandings = standings.map((team, index) => ({
      ...team,
      rank: index + 1
    }));

    res.json({
      success: true,
      season,
      standings: rankedStandings,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get SOS (Strength of Schedule) for a team
router.get('/sos/:teamId', verifyToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Get all matches for this team
    const matches = await Match.find({
      $or: [
        { homeTeam: teamId },
        { awayTeam: teamId }
      ]
    }).populate('homeTeam awayTeam', 'name wins losses');

    // Calculate opponent strength
    let sosValue = 0;
    let gamesCount = 0;

    matches.forEach(match => {
      const opponent = match.homeTeam._id.toString() === teamId 
        ? match.awayTeam 
        : match.homeTeam;
      
      if (opponent) {
        const totalGames = opponent.wins + opponent.losses;
        if (totalGames > 0) {
          const oppWinRate = opponent.wins / totalGames;
          sosValue += oppWinRate;
          gamesCount++;
        }
      }
    });

    const sos = gamesCount > 0 ? (sosValue / gamesCount * 100).toFixed(2) : 0;

    res.json({
      success: true,
      teamId,
      sos: parseFloat(sos),
      gamesPlayed: gamesCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed standing info for a team
router.get('/team/:teamId', verifyToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findById(teamId).select('name city coach founded wins losses');
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Get all matches
    const allMatches = await Match.find({
      $or: [
        { homeTeam: teamId },
        { awayTeam: teamId }
      ],
      status: 'Finished'
    });

    let pointsFor = 0;
    let pointsAgainst = 0;

    allMatches.forEach(match => {
      if (match.homeTeam.toString() === teamId) {
        pointsFor += match.homeScore;
        pointsAgainst += match.awayScore;
      } else {
        pointsFor += match.awayScore;
        pointsAgainst += match.homeScore;
      }
    });

    const totalGames = team.wins + team.losses;
    const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      team: {
        _id: team._id,
        name: team.name,
        city: team.city,
        coach: team.coach,
        founded: team.founded,
        wins: team.wins,
        losses: team.losses,
        totalGames,
        winRate: parseFloat(winRate),
        pointsFor,
        pointsAgainst,
        pointDiff: pointsFor - pointsAgainst,
        ppg: (pointsFor / totalGames).toFixed(2),
        oppg: (pointsAgainst / totalGames).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
