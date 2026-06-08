const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Team = require('../models/Team');
const Player = require('../models/Player');
const Match = require('../models/Match');
const { verifyToken } = require('../middleware/auth');

// Helper to embed TrueType font from common Windows, macOS, and Linux locations.
function setupFont(doc) {
  try {
    const fontPairs = [
      {
        regular: 'C:\\Windows\\Fonts\\arial.ttf',
        bold: 'C:\\Windows\\Fonts\\arialbd.ttf'
      },
      {
        regular: '/System/Library/Fonts/Supplemental/Arial.ttf',
        bold: '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
      },
      {
        regular: '/Library/Fonts/Arial.ttf',
        bold: '/Library/Fonts/Arial Bold.ttf'
      },
      {
        regular: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        bold: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
      }
    ];

    const fontPair = fontPairs.find(pair =>
      fs.existsSync(pair.regular) && fs.existsSync(pair.bold)
    );

    if (fontPair) {
      doc.registerFont('VietFont', fontPair.regular);
      doc.registerFont('VietFontBold', fontPair.bold);
      return { regular: 'VietFont', bold: 'VietFontBold' };
    }
  } catch (err) {
    console.log('Could not register TrueType font, using Helvetica fallback');
  }
  return { regular: 'Helvetica', bold: 'Helvetica-Bold' };
}

// Export standings as PDF
router.get('/standings', verifyToken, async (req, res) => {
  try {
    const teams = await Team.find().select('name city coach wins losses');
    
    const standings = teams.map(team => {
      const totalGames = team.wins + team.losses;
      const winRate = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(2) : 0;
      return {
        name: team.name,
        city: team.city,
        coach: team.coach,
        wins: team.wins,
        losses: team.losses,
        winRate: parseFloat(winRate)
      };
    });

    standings.sort((a, b) => b.winRate - a.winRate);

    const doc = new PDFDocument({ margin: 40, bufferPages: true });
    const fonts = setupFont(doc);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="standings.pdf"');
    
    doc.pipe(res);

    // Title
    doc.fontSize(20).font(fonts.bold).text('BÁO CÁO BẢNG XẾP HẠNG ĐỘI BÓNG', 40, 50, { align: 'center' });
    doc.fontSize(11).font(fonts.regular).text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 40, 85, { align: 'center' });
    
    // Table header
    doc.fontSize(10).font(fonts.bold);
    let y = 130;
    const colWidth = { rank: 40, team: 130, city: 110, coach: 110, wl: 70, percent: 70 };
    const startX = 40;
    
    doc.text('Hạng', startX, y);
    doc.text('Đội Bóng', startX + colWidth.rank, y);
    doc.text('Thành Phố', startX + colWidth.rank + colWidth.team, y);
    doc.text('HLV', startX + colWidth.rank + colWidth.team + colWidth.city, y);
    doc.text('T-T', startX + colWidth.rank + colWidth.team + colWidth.city + colWidth.coach, y);
    doc.text('Tỉ Lệ %', startX + colWidth.rank + colWidth.team + colWidth.city + colWidth.coach + colWidth.wl, y);

    // Table divider
    y += 20;
    doc.moveTo(startX, y).lineTo(540, y).stroke();
    
    // Table data
    doc.font(fonts.regular).fontSize(9);
    standings.forEach((team, index) => {
      y += 22;
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      const medal = index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : '';
      
      doc.text(`${medal} ${index + 1}`, startX, y);
      doc.text(team.name, startX + colWidth.rank, y);
      doc.text(team.city, startX + colWidth.rank + colWidth.team, y);
      doc.text(team.coach, startX + colWidth.rank + colWidth.team + colWidth.city, y);
      doc.text(`${team.wins}-${team.losses}`, startX + colWidth.rank + colWidth.team + colWidth.city + colWidth.coach, y);
      doc.text(`${team.winRate}%`, startX + colWidth.rank + colWidth.team + colWidth.city + colWidth.coach + colWidth.wl, y);
    });

    // Summary section
    y += 35;
    doc.fontSize(11).font(fonts.bold).text('TÓM TẮT THÔNG TIN', startX, y);
    
    y += 20;
    doc.fontSize(10).font(fonts.regular);
    doc.text(`Tổng số đội: ${standings.length}`, startX, y);
    y += 15;
    doc.text(`Tổng số trận: ${standings.reduce((sum, t) => sum + t.wins + t.losses, 0)}`, startX, y);
    y += 15;
    
    if (standings.length > 0) {
      doc.font(fonts.bold).text(`Đại diện đầu tiên: ${standings[0].name}`, startX, y);
      doc.font(fonts.regular).text(`Tỉ lệ thắng: ${standings[0].winRate}%`, startX + 20, y + 15);
    }

    doc.end();
  } catch (error) {
    console.error('Standings export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export teams as PDF
router.get('/teams', verifyToken, async (req, res) => {
  try {
    const teams = await Team.find();
    const teamsWithPlayers = await Promise.all(
      teams.map(async (team) => {
        const players = await Player.find({ team: team._id }).limit(5);
        return { ...team.toObject(), players };
      })
    );

    const doc = new PDFDocument({ margin: 40, bufferPages: true });
    const fonts = setupFont(doc);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="teams-report.pdf"');
    
    doc.pipe(res);

    doc.fontSize(20).font(fonts.bold).text('BÁO CÁO DANH SÁCH ĐỘI BÓNG', 40, 50, { align: 'center' });
    doc.fontSize(11).font(fonts.regular).text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 40, 85, { align: 'center' });

    let y = 130;
    
    teamsWithPlayers.forEach((team, index) => {
      if (y > 680) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(13).font(fonts.bold).text(`${index + 1}. ${team.name}`, 40, y);
      y += 20;

      doc.fontSize(10).font(fonts.regular);
      doc.text(`Thành phố: ${team.city}`, 50, y);
      y += 12;
      doc.text(`HLV: ${team.coach}`, 50, y);
      y += 12;
      doc.text(`Năm thành lập: ${team.founded}`, 50, y);
      y += 12;
      doc.text(`Thắng/Thua: ${team.wins}/${team.losses}`, 50, y);
      y += 15;

      if (team.players && team.players.length > 0) {
        doc.fontSize(9).font(fonts.bold).text('Danh sách cầu thủ:', 50, y);
        y += 12;
        
        team.players.forEach(player => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
          doc.fontSize(9).font(fonts.regular);
          const playerText = `- ${player.name} (So ao: #${player.jerseyNumber}, Vi tri: ${player.position})`;
          doc.text(playerText, 60, y);
          y += 10;
        });
      }

      y += 15;
    });

    doc.end();
  } catch (error) {
    console.error('Teams export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export players as PDF
router.get('/players', verifyToken, async (req, res) => {
  try {
    const players = await Player.find().populate('team', 'name');

    const doc = new PDFDocument({ margin: 40, bufferPages: true });
    const fonts = setupFont(doc);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="players-report.pdf"');
    
    doc.pipe(res);

    doc.fontSize(20).font(fonts.bold).text('BÁO CÁO DANH SÁCH CẦU THỦ', 40, 50, { align: 'center' });
    doc.fontSize(11).font(fonts.regular).text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 40, 85, { align: 'center' });

    // Table header
    doc.fontSize(10).font(fonts.bold);
    let y = 130;
    const colWidth = { name: 120, team: 100, pos: 80, jersey: 60, height: 80, points: 70 };
    const startX = 40;
    
    doc.text('Tên', startX, y);
    doc.text('Đội', startX + colWidth.name, y);
    doc.text('Vị trí', startX + colWidth.name + colWidth.team, y);
    doc.text('Số áo', startX + colWidth.name + colWidth.team + colWidth.pos, y);
    doc.text('Cao (cm)', startX + colWidth.name + colWidth.team + colWidth.pos + colWidth.jersey, y);
    doc.text('Điểm', startX + colWidth.name + colWidth.team + colWidth.pos + colWidth.jersey + colWidth.height, y);

    // Table divider
    y += 18;
    doc.moveTo(startX, y).lineTo(540, y).stroke();
    
    // Table data
    doc.font(fonts.regular).fontSize(9);
    players.forEach((player) => {
      y += 18;
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      const playerName = player.name.substring(0, 20);
      const teamName = (player.team?.name || '-').substring(0, 15);
      const position = (player.position || '-').substring(0, 10);
      
      doc.text(playerName, startX, y);
      doc.text(teamName, startX + colWidth.name, y);
      doc.text(position, startX + colWidth.name + colWidth.team, y);
      doc.text(`#${player.jerseyNumber}`, startX + colWidth.name + colWidth.team + colWidth.pos, y);
      doc.text(`${player.height || '-'}`, startX + colWidth.name + colWidth.team + colWidth.pos + colWidth.jersey, y);
      doc.text((player.stats?.points || 0).toFixed(1), startX + colWidth.name + colWidth.team + colWidth.pos + colWidth.jersey + colWidth.height, y);
    });

    doc.end();
  } catch (error) {
    console.error('Players export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export matches as PDF
router.get('/matches', verifyToken, async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('homeTeam awayTeam', 'name')
      .sort({ matchDate: -1 });

    const doc = new PDFDocument({ margin: 30, bufferPages: true, size: [595.276, 841.890], layout: 'landscape' });
    const fonts = setupFont(doc);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="matches-report.pdf"');
    
    doc.pipe(res);

    doc.fontSize(20).font(fonts.bold).text('BÁO CÁO LỊCH THI ĐẤU', 40, 40, { align: 'center' });
    doc.fontSize(11).font(fonts.regular).text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 40, 70, { align: 'center' });

    // Table header
    doc.fontSize(9).font(fonts.bold);
    let y = 110;
    const colWidth = { date: 80, home: 130, score: 70, away: 130, location: 150, status: 90 };
    const startX = 30;
    
    doc.text('Ngày', startX, y);
    doc.text('Đội nhà', startX + colWidth.date, y);
    doc.text('Tỉ số', startX + colWidth.date + colWidth.home, y);
    doc.text('Đội khách', startX + colWidth.date + colWidth.home + colWidth.score, y);
    doc.text('Địa điểm', startX + colWidth.date + colWidth.home + colWidth.score + colWidth.away, y);
    doc.text('Trạng thái', startX + colWidth.date + colWidth.home + colWidth.score + colWidth.away + colWidth.location, y);

    // Table divider
    y += 16;
    doc.moveTo(startX, y).lineTo(760, y).stroke();
    
    // Table data
    doc.font(fonts.regular).fontSize(8);
    matches.forEach((match) => {
      y += 18;
      if (y > 520) {
        doc.addPage();
        y = 40;
      }

      const date = new Date(match.matchDate).toLocaleDateString('vi-VN');
      const score = match.status === 'Finished' ? `${match.homeScore}-${match.awayScore}` : '-';
      const homeTeamName = (match.homeTeam?.name || '-').substring(0, 18);
      const awayTeamName = (match.awayTeam?.name || '-').substring(0, 18);
      const location = (match.location || '-').substring(0, 18);
      const status = match.status === 'Finished' ? 'Hoàn thành' : (match.status === 'Scheduled' ? 'Lên lịch' : match.status);

      doc.text(date, startX, y);
      doc.text(homeTeamName, startX + colWidth.date, y);
      doc.text(score, startX + colWidth.date + colWidth.home, y);
      doc.text(awayTeamName, startX + colWidth.date + colWidth.home + colWidth.score, y);
      doc.text(location, startX + colWidth.date + colWidth.home + colWidth.score + colWidth.away, y);
      doc.text(status, startX + colWidth.date + colWidth.home + colWidth.score + colWidth.away + colWidth.location, y);
    });

    doc.end();
  } catch (error) {
    console.error('Matches export error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
