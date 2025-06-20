const cron = require("node-cron");

let currentJob = null;

function startDailyStandup(client, cronTime = "0 9 * * *") {
  if (currentJob) currentJob.stop();

  currentJob = cron.schedule(
    cronTime,
    () => {
      // Broadcast the standup prompt to members here
      console.log("📢 Sending daily standup prompt...");
    },
    { timezone: "America/New_York" } // or adjust based on your needs
  );

  console.log(`📅 Standup scheduled for ${cronTime}`);
}

function updateScheduler(newCronTime, client) {
  startDailyStandup(client, newCronTime);
}

module.exports = {
  startDailyStandup,
  updateScheduler,
};
