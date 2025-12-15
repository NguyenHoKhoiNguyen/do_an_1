# Database Seed Update - December 15, 2025

## 📊 Summary

Successfully updated the Basketball Management Website database with extensive test data for better demonstration of statistics features.

## ✅ What Was Updated

### 1. Users (2 → 10)
**Admin users:**
- `admin` / `123456` - Original admin
- `vuthif` / `123456` - New admin (Vũ Thị F)

**Regular users:**
- `user` / `123456` - Original user
- `nguyenvana` / `123456` - Nguyễn Văn A
- `tranthib` / `123456` - Trần Thị B
- `levanc` / `123456` - Lê Văn C
- `phamthid` / `123456` - Phạm Thị D
- `hoangvane` / `123456` - Hoàng Văn E
- `dangvang` / `123456` - Đặng Văn G
- `dothih` / `123456` - Đỗ Thị H

### 2. Matches (10 → 47)
**Distribution by Month:**
- **November 2025**: 7 matches (all Finished)
- **December 2025**: 17 matches (8 Finished, 1 Live on Dec 15, 8 Scheduled)
- **January 2026**: 13 matches (all Scheduled)
- **February 2026**: 10 matches (all Scheduled)

**Distribution by Status:**
- ✅ **Finished**: 15 matches (with realistic scores 72-110 points)
- 🔴 **Live**: 1 match (December 15, 2025, Quarter 3, Heat vs Buffaloes 58-55)
- 📅 **Scheduled**: 31 matches (from Dec 17, 2025 to Feb 28, 2026)

### 3. Match Details
- All matches have specific times (18:00-20:00 evening games)
- Realistic Vietnamese locations (team home arenas)
- Descriptive notes in Vietnamese
- Proper team matchups ensuring all teams play each other multiple times
- Special events noted (Christmas game, New Year, Tet holiday, Valentine's Day)

## 🛠️ Files Modified

1. **backend/seed.js**
   - Updated users array from 2 to 10 users
   - All users use password: `123456` (bcrypt hashed)

2. **backend/add_more_matches.js** (NEW)
   - Standalone script to populate 47 matches
   - Can be run independently after seed.js
   - Deletes old matches and creates new ones

## 📝 How to Use

### Option 1: Quick Reseed Everything
```bash
cd backend
node seed.js
node add_more_matches.js
```

### Option 2: Update Only Matches
```bash
cd backend
node add_more_matches.js
```

## 🎯 Purpose

This extensive test data enables:
1. **Better Statistics Visualization** - Charts show meaningful trends over 4 months
2. **Time-based Filtering** - "Tuần này", "Tháng này" filters work properly
3. **Realistic Data** - Mix of finished/scheduled matches with proper scores
4. **Feature Testing** - Search functionality works across larger dataset

## 🔍 Verification

To verify the data was loaded correctly:

```bash
# Check user count
mongo basketballDB --eval "db.users.count()"
# Should return: 10

# Check match count
mongo basketballDB --eval "db.matches.count()"
# Should return: 47

# Check match status distribution
mongo basketballDB --eval "db.matches.aggregate([{$group:{_id:'$status',count:{$sum:1}}}])"
# Should show: Finished: 15, Live: 1, Scheduled: 31
```

## 📅 Timeline Coverage

```
Nov 2025: ▓▓▓▓▓▓▓ (7 matches - all finished)
Dec 2025: ▓▓▓▓▓▓▓▓░░░░░░░░░ (17 matches - 8 finished, 1 live, 8 scheduled)
Jan 2026: ░░░░░░░░░░░░░ (13 matches - all scheduled)
Feb 2026: ░░░░░░░░░░ (10 matches - all scheduled)
```

## 🎨 Statistics Page Benefits

With this data, the Statistics page (`/statistics`) now shows:
- **Match Status Pie Chart** - Clear distribution of game statuses
- **Top Teams Bar Chart** - Realistic win/loss records
- **Team Performance Line Chart** - Win rate trends
- **Player Position Distribution** - Balanced across PG/SG/SF/PF/C
- **Detailed Rankings** - Teams ranked by wins with medals (🥇🥈🥉)

## 🔄 Future Updates

If you need to add more data later:
1. Edit `add_more_matches.js` to add more matches
2. Edit `seed.js` to add more teams/players/users
3. Run the scripts again (they clear old data first)

## ⚠️ Important Notes

- All passwords are `123456` for easy testing
- Match dates use ISO format with timezone (Asia/Ho_Chi_Minh implied)
- Teams are sorted alphabetically in the add_more_matches.js script
- The "Live" match on Dec 15 represents current day for demonstration

---

**Last Updated**: December 15, 2025  
**Version**: 2.1.0  
**Author**: Basketball Management System Team
