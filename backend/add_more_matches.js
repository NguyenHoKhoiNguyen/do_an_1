const mongoose = require('mongoose');
require('dotenv').config();
const Team = require('./models/Team');
const Match = require('./models/Match');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const addMoreMatches = async () => {
  try {
    // Lấy các đội đã có
    const teams = await Team.find().sort({ name: 1 });
    console.log(`Tìm thấy ${teams.length} đội bóng`);

    if (teams.length < 4) {
      console.error('❌ Cần có ít nhất 4 đội để tạo trận đấu!');
      process.exit(1);
    }

    // Xóa các trận đấu hiện tại
    await Match.deleteMany({});
    console.log('🗑️  Đã xóa các trận đấu cũ');

    // Tạo 50 trận đấu mới
    const newMatches = await Match.insertMany([
      // ===== THÁNG 11/2025 - Trận đã kết thúc =====
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[1]._id,
        homeScore: 98,
        awayScore: 92,
        matchDate: new Date('2025-11-10T19:00:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Finished',
        quarter: 4,
        notes: 'Trận derby căng thẳng'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[3]._id,
        homeScore: 85,
        awayScore: 78,
        matchDate: new Date('2025-11-12T18:30:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Finished',
        quarter: 4,
        notes: 'Chiến thắng thuyết phục'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[2]._id,
        homeScore: 102,
        awayScore: 95,
        matchDate: new Date('2025-11-15T20:00:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Finished',
        quarter: 4,
        notes: 'Trận đấu tỷ số cao'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[3]._id,
        homeScore: 110,
        awayScore: 88,
        matchDate: new Date('2025-11-18T19:30:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Finished',
        quarter: 4,
        notes: 'Thống trị hoàn toàn'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[0]._id,
        homeScore: 76,
        awayScore: 89,
        matchDate: new Date('2025-11-22T18:00:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Finished',
        quarter: 4,
        notes: 'Catfish gặp khó khăn'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[3]._id,
        homeScore: 94,
        awayScore: 81,
        matchDate: new Date('2025-11-25T19:00:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Finished',
        quarter: 4,
        notes: 'Buffaloes chiếm ưu thế'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[1]._id,
        homeScore: 88,
        awayScore: 91,
        matchDate: new Date('2025-11-28T20:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Finished',
        quarter: 4,
        notes: 'Trận đấu căng thẳng'
      },

      // ===== THÁNG 12/2025 =====
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[2]._id,
        homeScore: 105,
        awayScore: 98,
        matchDate: new Date('2025-12-01T19:00:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Finished',
        quarter: 4,
        notes: 'Chiến thắng sít sao'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[1]._id,
        homeScore: 72,
        awayScore: 86,
        matchDate: new Date('2025-12-03T18:30:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Finished',
        quarter: 4,
        notes: 'Buffaloes tiếp tục mạch thắng'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[0]._id,
        homeScore: 82,
        awayScore: 87,
        matchDate: new Date('2025-12-05T19:30:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Finished',
        quarter: 4,
        notes: 'Heat chiến thắng sát nút'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[0]._id,
        homeScore: 79,
        awayScore: 92,
        matchDate: new Date('2025-12-07T20:00:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Finished',
        quarter: 4,
        notes: 'Heat củng cố ngôi đầu'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[3]._id,
        homeScore: 96,
        awayScore: 74,
        matchDate: new Date('2025-12-09T19:00:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Finished',
        quarter: 4,
        notes: 'Heat thống trị Catfish'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[3]._id,
        homeScore: 91,
        awayScore: 85,
        matchDate: new Date('2025-12-11T18:30:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Finished',
        quarter: 4,
        notes: 'Dragons chiến thắng trên sân nhà'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[2]._id,
        homeScore: 88,
        awayScore: 85,
        matchDate: new Date('2025-12-13T19:30:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Finished',
        quarter: 4,
        notes: 'Buffaloes giữ vững vị trí'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[2]._id,
        homeScore: 77,
        awayScore: 90,
        matchDate: new Date('2025-12-14T18:00:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Finished',
        quarter: 4,
        notes: 'Dragons thắng thuyết phục'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[1]._id,
        homeScore: 58,
        awayScore: 55,
        matchDate: new Date('2025-12-15T19:00:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Live',
        quarter: 3,
        notes: 'Trận đấu đang diễn ra'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-17T20:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Dragons thử thách đội đầu bảng'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-19T19:00:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Catfish tìm lại phong độ'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-21T18:30:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận đấu cuối tuần'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-23T19:00:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận đấu trước Giáng sinh'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-26T20:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Boxing Day Basketball'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-28T19:30:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận derby cuối năm'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-30T18:00:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận đấu đón năm mới'
      },

      // ===== THÁNG 1/2026 =====
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-02T19:00:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Khai xuân 2026'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-04T20:00:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Heat mở màn năm mới'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-06T19:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Dragons quyết tâm phục thù'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-09T18:30:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Derby đồng bằng - miền núi'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-11T19:30:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận chung kết sớm?'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-13T20:00:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Buffaloes tiếp tục mạch thắng'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-16T19:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Giữa mùa giải'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-18T18:30:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Catfish cần điểm số'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-20T19:30:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Quyết định vị trí đầu bảng'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-23T20:00:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Derby lần 3'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-25T19:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận đấu trước Tết'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-27T18:30:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Đặc biệt trước Tết Nguyên Đán'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-01-30T19:30:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận cuối tháng 1'
      },

      // ===== THÁNG 2/2026 =====
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-05T19:00:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Đầu xuân Bính Ngọ'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-07T20:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Mùa xuân mới - hy vọng mới'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-10T19:00:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Catfish sau kỳ nghỉ Tết'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-12T18:30:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Heat vs Dragons đỉnh cao'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-14T19:30:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Valentine Basketball Night'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-17T20:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Dragons bám sát ngôi đầu'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-19T19:00:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Thách thức lớn'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[3]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-21T18:30:00'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Heat củng cố vị trí dẫn đầu'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-24T19:30:00'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Derby quyết định'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-26T20:00:00'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Dragons lật đổ ngôi vương?'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2026-02-28T19:00:00'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Nước rút playoff'
      }
    ]);

    console.log(`✅ Đã tạo ${newMatches.length} trận đấu mới!`);
    console.log('\n📊 Thống kê:');
    const finished = newMatches.filter(m => m.status === 'Finished').length;
    const live = newMatches.filter(m => m.status === 'Live').length;
    const scheduled = newMatches.filter(m => m.status === 'Scheduled').length;
    console.log(`   - Finished: ${finished}`);
    console.log(`   - Live: ${live}`);
    console.log(`   - Scheduled: ${scheduled}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

addMoreMatches();
