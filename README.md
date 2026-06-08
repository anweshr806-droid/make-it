# PRIME XP BUSINESS BOT v2.0

A fully automated economy simulation Discord bot with self-running markets, automated news, and streamlined admin controls.

## 🎯 Philosophy

**Admins only:**
- ✅ Review work submissions
- ✅ Approve/Deny work
- ✅ Moderate server rules
- ✅ Run `/setup`

**Everything else is automated by the bot.**

## ⚙️ Quick Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your bot token and MongoDB URI
4. Run bot: `npm start`
5. Use `/setup` command to configure channels

## 🚀 Core Features

### Admin-Only Commands
- `/setup` - Configure game channels (Admin only)
- `/approve` - Approve work submissions
- `/deny` - Deny work submissions

### Automated Systems
- 🤖 **Market System** - Random market events every 30-90 minutes
- 📢 **World News** - Funny and creative announcements
- 💰 **Gold System** - Automatic rewards and penalties with scaling
- 🏆 **Reputation System** - Auto-managed with tiers and benefits
- 🎁 **Daily System** - Daily rewards with streak bonuses
- 🏢 **Business Events** - Random business opportunities
- 📈 **Investment Events** - Automatic investment opportunities
- 💎 **Rare Item Events** - Dynamic item discoveries
- 🏅 **Achievement System** - Auto-unlock achievements
- 🌍 **Living World** - Server feels alive even when offline

### Player Commands
- `/daily` - Claim daily rewards
- `/profile` - View player profile and stats
- `/work submit` - Submit work for admin approval
- `/business` - Manage business
- `/investments` - View and manage investments
- `/auctions` - Browse and bid on auctions
- `/leaderboard` - View reputation and gold rankings

## 📊 Automated Market Events

**Random Events (Several times daily):**
- 📈 Market Boom
- 📉 Market Crash
- ☕ Coffee Shortage
- 🍵 Lemon Tea Craze
- 👨‍💼 Creator Industry Growth
- 💻 Technology Slump
- 💼 Investment Surge
- 📊 Inflation Alert

## 🏆 Reputation System

**Tiers:**
- 0-99: Beginner
- 100-299: Trusted Worker
- 300-599: Rising Entrepreneur
- 600-999: Business Leader
- 1000+: Prime Tycoon

**Auto-Updated:** Titles change automatically based on reputation.

**Gains:**
- Approved work submissions
- High-quality work
- Business success
- Good trading history
- Achievements
- Consistent participation

**Losses:**
- Repeated work rejections
- Business failures
- Exploit attempts
- Spam behavior
- Long-term inactivity

## 💰 Gold System

**Never:**
- Bankrupts a player
- Creates unfair penalties
- Affects new players negatively

**Always:**
- Explains why gold changed
- Scales rewards/penalties by wealth
- Protects new players
- Requires a reason for changes

## 📰 World News Examples

- 📈 Lemon Tea demand exploded after citizens claimed it increases business luck.
- 📉 Investors accidentally purchased invisible potatoes. Market confidence drops.
- 🐈 A cat has successfully predicted the market for the third time.
- 🦆 Local ducks have cornered the bread industry.
- 🍕 A pizza entrepreneur became a millionaire overnight.
- 🧀 Cheese futures continue rising and economists remain confused.
- 💎 Rumors suggest an Ancient Crown may appear in the next auction.

## 🎁 Daily Bonuses

- 3-day streak: +50 bonus gold
- 7-day streak: +100 bonus gold
- 30-day streak: +500 bonus gold

## 📝 Architecture

- `src/index.js` - Bot entry point
- `src/commands/` - Command handlers
- `src/models/` - MongoDB schemas
- `src/events/` - Discord event handlers
- `src/systems/` - Automated systems (market, economy, news)
- `src/utils/` - Helper functions

## 🔧 Tech Stack

- Discord.js v14
- MongoDB with Mongoose
- Node.js

## 📝 License

MIT
