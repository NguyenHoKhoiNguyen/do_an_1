const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Team = require('./models/Team');
const Player = require('./models/Player');
const Match = require('./models/Match');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Match.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu cũ');

    // Tạo users mặc định
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@basketball.com',
        password: hashedPassword,
        fullName: 'Quản trị viên',
        role: 'admin'
      },
      {
        username: 'user',
        email: 'user@basketball.com',
        password: hashedPassword,
        fullName: 'Người dùng',
        role: 'user'
      }
    ]);
    console.log('✅ Đã tạo 2 users (admin/user, password: 123456)');

    // Tạo các đội bóng
    const teams = await Team.insertMany([
      {
        name: 'Saigon Heat',
        coach: 'Nguyễn Văn An',
        founded: 2011,
        city: 'TP. Hồ Chí Minh',
        wins: 15,
        losses: 8,
        description: 'Đội bóng chuyên nghiệp đầu tiên của Việt Nam tham gia giải ABL'
      },
      {
        name: 'Hanoi Buffaloes',
        coach: 'Trần Minh Tuấn',
        founded: 2018,
        city: 'Hà Nội',
        wins: 12,
        losses: 11,
        description: 'Đội bóng rổ mạnh nhất miền Bắc'
      },
      {
        name: 'Danang Dragons',
        coach: 'Lê Hoàng Nam',
        founded: 2020,
        city: 'Đà Nẵng',
        wins: 10,
        losses: 13,
        description: 'Đội bóng trẻ đầy triển vọng từ miền Trung'
      },
      {
        name: 'Cantho Catfish',
        coach: 'Võ Văn Phúc',
        founded: 2019,
        city: 'Cần Thơ',
        wins: 8,
        losses: 15,
        description: 'Đại diện cho vùng đồng bằng sông Cửu Long'
      }
    ]);
    console.log('✅ Đã tạo 4 đội bóng');

    // Tạo cầu thủ cho Saigon Heat
    const saigonPlayers = await Player.insertMany([
      {
        name: 'Nguyễn Hoàng Minh',
        jerseyNumber: 7,
        position: 'Point Guard',
        team: teams[0]._id,
        height: 185,
        weight: 78,
        dateOfBirth: new Date('1998-03-15'),
        nationality: 'Vietnam',
        stats: { points: 18.5, rebounds: 4.2, assists: 7.8, steals: 2.1, blocks: 0.5, gamesPlayed: 23 }
      },
      {
        name: 'Trần Đức Anh',
        jerseyNumber: 23,
        position: 'Shooting Guard',
        team: teams[0]._id,
        height: 190,
        weight: 85,
        dateOfBirth: new Date('1997-08-22'),
        nationality: 'Vietnam',
        stats: { points: 22.3, rebounds: 5.1, assists: 3.4, steals: 1.8, blocks: 0.7, gamesPlayed: 23 }
      },
      {
        name: 'Lê Văn Thành',
        jerseyNumber: 11,
        position: 'Small Forward',
        team: teams[0]._id,
        height: 195,
        weight: 90,
        dateOfBirth: new Date('1996-12-10'),
        nationality: 'Vietnam',
        stats: { points: 15.7, rebounds: 6.8, assists: 2.9, steals: 1.5, blocks: 1.2, gamesPlayed: 23 }
      },
      {
        name: 'Michael Johnson',
        jerseyNumber: 15,
        position: 'Power Forward',
        team: teams[0]._id,
        height: 203,
        weight: 102,
        dateOfBirth: new Date('1995-05-18'),
        nationality: 'USA',
        stats: { points: 19.8, rebounds: 11.2, assists: 2.1, steals: 1.0, blocks: 2.5, gamesPlayed: 23 }
      },
      {
        name: 'Phạm Minh Quân',
        jerseyNumber: 33,
        position: 'Center',
        team: teams[0]._id,
        height: 208,
        weight: 110,
        dateOfBirth: new Date('1994-01-25'),
        nationality: 'Vietnam',
        stats: { points: 14.2, rebounds: 9.5, assists: 1.8, steals: 0.8, blocks: 3.2, gamesPlayed: 23 }
      }
    ]);

    // Tạo cầu thủ cho Hanoi Buffaloes
    const hanoiPlayers = await Player.insertMany([
      {
        name: 'Đặng Quốc Việt',
        jerseyNumber: 10,
        position: 'Point Guard',
        team: teams[1]._id,
        height: 183,
        weight: 76,
        dateOfBirth: new Date('1999-06-08'),
        nationality: 'Vietnam',
        stats: { points: 16.4, rebounds: 3.8, assists: 8.5, steals: 2.3, blocks: 0.3, gamesPlayed: 23 }
      },
      {
        name: 'Hoàng Văn Hùng',
        jerseyNumber: 8,
        position: 'Shooting Guard',
        team: teams[1]._id,
        height: 188,
        weight: 82,
        dateOfBirth: new Date('1998-11-30'),
        nationality: 'Vietnam',
        stats: { points: 20.1, rebounds: 4.5, assists: 3.2, steals: 1.9, blocks: 0.6, gamesPlayed: 23 }
      },
      {
        name: 'Vũ Đức Thắng',
        jerseyNumber: 21,
        position: 'Small Forward',
        team: teams[1]._id,
        height: 193,
        weight: 88,
        dateOfBirth: new Date('1997-04-12'),
        nationality: 'Vietnam',
        stats: { points: 17.6, rebounds: 6.2, assists: 3.5, steals: 1.6, blocks: 1.0, gamesPlayed: 23 }
      },
      {
        name: 'Nguyễn Thanh Tùng',
        jerseyNumber: 25,
        position: 'Power Forward',
        team: teams[1]._id,
        height: 200,
        weight: 98,
        dateOfBirth: new Date('1996-09-05'),
        nationality: 'Vietnam',
        stats: { points: 13.8, rebounds: 10.1, assists: 2.3, steals: 1.1, blocks: 2.1, gamesPlayed: 23 }
      },
      {
        name: 'James Williams',
        jerseyNumber: 50,
        position: 'Center',
        team: teams[1]._id,
        height: 211,
        weight: 115,
        dateOfBirth: new Date('1993-07-20'),
        nationality: 'USA',
        stats: { points: 16.5, rebounds: 12.3, assists: 1.5, steals: 0.9, blocks: 3.8, gamesPlayed: 23 }
      }
    ]);

    // Tạo cầu thủ cho Danang Dragons
    const danangPlayers = await Player.insertMany([
      {
        name: 'Phan Văn Nam',
        jerseyNumber: 3,
        position: 'Point Guard',
        team: teams[2]._id,
        height: 180,
        weight: 74,
        dateOfBirth: new Date('2000-02-14'),
        nationality: 'Vietnam',
        stats: { points: 14.2, rebounds: 3.5, assists: 7.2, steals: 2.0, blocks: 0.2, gamesPlayed: 23 }
      },
      {
        name: 'Lê Thanh Phong',
        jerseyNumber: 12,
        position: 'Shooting Guard',
        team: teams[2]._id,
        height: 186,
        weight: 80,
        dateOfBirth: new Date('1999-10-28'),
        nationality: 'Vietnam',
        stats: { points: 18.7, rebounds: 4.1, assists: 2.8, steals: 1.7, blocks: 0.5, gamesPlayed: 23 }
      },
      {
        name: 'Trần Minh Đức',
        jerseyNumber: 20,
        position: 'Small Forward',
        team: teams[2]._id,
        height: 192,
        weight: 86,
        dateOfBirth: new Date('1998-05-17'),
        nationality: 'Vietnam',
        stats: { points: 15.3, rebounds: 5.8, assists: 3.1, steals: 1.4, blocks: 0.9, gamesPlayed: 23 }
      },
      {
        name: 'Ngô Văn Long',
        jerseyNumber: 35,
        position: 'Power Forward',
        team: teams[2]._id,
        height: 198,
        weight: 95,
        dateOfBirth: new Date('1997-08-09'),
        nationality: 'Vietnam',
        stats: { points: 12.5, rebounds: 8.7, assists: 2.0, steals: 1.0, blocks: 1.8, gamesPlayed: 23 }
      },
      {
        name: 'Đinh Văn Phúc',
        jerseyNumber: 44,
        position: 'Center',
        team: teams[2]._id,
        height: 205,
        weight: 108,
        dateOfBirth: new Date('1996-03-22'),
        nationality: 'Vietnam',
        stats: { points: 11.8, rebounds: 9.2, assists: 1.3, steals: 0.7, blocks: 2.8, gamesPlayed: 23 }
      }
    ]);

    // Tạo cầu thủ cho Cantho Catfish
    const canthoPlayers = await Player.insertMany([
      {
        name: 'Võ Minh Tuấn',
        jerseyNumber: 5,
        position: 'Point Guard',
        team: teams[3]._id,
        height: 178,
        weight: 72,
        dateOfBirth: new Date('2001-01-30'),
        nationality: 'Vietnam',
        stats: { points: 13.5, rebounds: 3.2, assists: 6.8, steals: 1.8, blocks: 0.1, gamesPlayed: 23 }
      },
      {
        name: 'Nguyễn Văn Đạt',
        jerseyNumber: 14,
        position: 'Shooting Guard',
        team: teams[3]._id,
        height: 184,
        weight: 78,
        dateOfBirth: new Date('2000-07-16'),
        nationality: 'Vietnam',
        stats: { points: 16.2, rebounds: 3.9, assists: 2.5, steals: 1.5, blocks: 0.4, gamesPlayed: 23 }
      },
      {
        name: 'Lâm Thanh Tâm',
        jerseyNumber: 18,
        position: 'Small Forward',
        team: teams[3]._id,
        height: 190,
        weight: 84,
        dateOfBirth: new Date('1999-12-05'),
        nationality: 'Vietnam',
        stats: { points: 14.1, rebounds: 5.3, assists: 2.7, steals: 1.3, blocks: 0.8, gamesPlayed: 23 }
      },
      {
        name: 'Trần Quốc Anh',
        jerseyNumber: 32,
        position: 'Power Forward',
        team: teams[3]._id,
        height: 196,
        weight: 92,
        dateOfBirth: new Date('1998-09-14'),
        nationality: 'Vietnam',
        stats: { points: 10.9, rebounds: 7.8, assists: 1.8, steals: 0.9, blocks: 1.6, gamesPlayed: 23 }
      },
      {
        name: 'Đỗ Văn Hải',
        jerseyNumber: 40,
        position: 'Center',
        team: teams[3]._id,
        height: 202,
        weight: 105,
        dateOfBirth: new Date('1997-04-28'),
        nationality: 'Vietnam',
        stats: { points: 9.8, rebounds: 8.5, assists: 1.2, steals: 0.6, blocks: 2.5, gamesPlayed: 23 }
      }
    ]);

    console.log('✅ Đã tạo 20 cầu thủ');

    // Tạo các trận đấu
    const matches = await Match.insertMany([
      // Trận đấu đã kết thúc
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[1]._id,
        homeScore: 98,
        awayScore: 92,
        matchDate: new Date('2025-11-15'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Finished',
        quarter: 4,
        notes: 'Trận derby miền Nam - Bắc căng thẳng'
      },
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[3]._id,
        homeScore: 85,
        awayScore: 78,
        matchDate: new Date('2025-11-16'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Finished',
        quarter: 4,
        notes: 'Chiến thắng thuyết phục của Dragons'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[2]._id,
        homeScore: 102,
        awayScore: 95,
        matchDate: new Date('2025-11-18'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Finished',
        quarter: 4,
        notes: 'Trận đấu tỷ số cao, nhiều pha bóng đẹp'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[3]._id,
        homeScore: 110,
        awayScore: 88,
        matchDate: new Date('2025-11-19'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Finished',
        quarter: 4,
        notes: 'Saigon Heat thống trị hoàn toàn'
      },
      // Trận đấu đang diễn ra
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[3]._id,
        homeScore: 56,
        awayScore: 52,
        matchDate: new Date('2025-11-23'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Live',
        quarter: 3,
        notes: 'Trận đấu đang diễn ra sôi nổi'
      },
      // Trận đấu sắp tới
      {
        homeTeam: teams[2]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-11-25'),
        location: 'Nhà thi đấu Tiên Sơn, Đà Nẵng',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận đấu được mong đợi nhất tuần này'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[1]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-11-27'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Catfish quyết tâm giành chiến thắng trên sân nhà'
      },
      {
        homeTeam: teams[0]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-11-30'),
        location: 'Nhà thi đấu Phan Đình Phùng, TP.HCM',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Vòng lượt về hấp dẫn'
      },
      {
        homeTeam: teams[1]._id,
        awayTeam: teams[0]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-02'),
        location: 'Cung thể thao Trịnh Hoài Đức, Hà Nội',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Derby thủ đô - thành phố'
      },
      {
        homeTeam: teams[3]._id,
        awayTeam: teams[2]._id,
        homeScore: 0,
        awayScore: 0,
        matchDate: new Date('2025-12-05'),
        location: 'Nhà thi đấu Cần Thơ',
        status: 'Scheduled',
        quarter: 1,
        notes: 'Trận cầu miền Trung - miền Nam'
      }
    ]);

    console.log('✅ Đã tạo 10 trận đấu');
    console.log('');
    console.log('🎉 HOÀN THÀNH! Dữ liệu mẫu đã được tạo thành công:');
    console.log('   - 2 users (admin: admin/123456, user: user/123456)');
    console.log('   - 4 đội bóng');
    console.log('   - 20 cầu thủ (5 cầu thủ/đội)');
    console.log('   - 10 trận đấu (4 đã kết thúc, 1 đang diễn ra, 5 sắp tới)');
    console.log('');
    console.log('💡 Bạn có thể chạy lại script này bất cứ lúc nào với lệnh: node seed.js');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
    process.exit(1);
  }
};

seedData();
