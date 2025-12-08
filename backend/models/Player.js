const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  jerseyNumber: {
    type: Number,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  height: {
    type: Number, // in cm
    required: true
  },
  weight: {
    type: Number, // in kg
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationality: {
    type: String,
    default: 'Vietnam'
  },
  photo: {
    type: String,
    default: ''
  },
  stats: {
    points: { type: Number, default: 0 },
    rebounds: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    steals: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
