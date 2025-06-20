# 📅 Daily Standup Discord Bot

A Discord bot built with Node.js, Discord.js, and MongoDB for managing daily standups in your server.

---

## ⚙️ Features

- `/reply [message]`: Send your standup reply.
- `/view`: View your current standup response. _(DM only)_
- `/show`: Show the standup prompt. _(DM only)_
- `/am [@user]`: Add a member to the standup group.
- `/rm [@user]`: Remove a member from the standup group.
- `/help`: Show all available commands.
- `/schedule [cron expression]`: Change the standup schedule (e.g., `0 9 * * *` for 9AM daily).

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/EuanSelkirk/daily-standup-scrum.git
cd daily-standup-scrum
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File

```bash
touch .env
```

Add the following environment variables:

```env
DISCORD_TOKEN=your_discord_bot_token
MONGO_URI=mongodb://127.0.0.1:27017/standup-bot
CLIENT_ID=your_discord_application_client_id
```

### 4. Register Slash Commands

```bash
node deploy-commands.js
```

---

## 🗃️ Required MongoDB Setup

Before using the bot, manually insert the server configuration into MongoDB:

1. Connect to MongoDB:

```bash
mongosh mongodb://127.0.0.1:27017/standup-bot
```

2. Insert your server and channel ID into the `standups` collection:

```javascript
db.standups.insertOne({
  guildId: "YOUR_SERVER_ID",
  channelId: "YOUR_CHANNEL_ID",
  members: [],
  responses: {},
});
```

Replace `YOUR_SERVER_ID` and `YOUR_CHANNEL_ID` with your actual Discord server and channel IDs.

---

## ☁️ Deployment with PM2

### 1. Start the bot

```bash
node index.js
```

Or use PM2 for process management:

```bash
pm2 start index.js --name standup-bot
pm2 save
```

### 2. Auto-start on server reboot

```bash
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

---

## 🧠 Notes

- MongoDB must be running locally.
- Bot must have message and application command permissions.
- `/show` and `/view` only work in DMs.
- Use valid cron syntax for scheduling.
