const cron = require("node-cron");

let currentJob = null;

function startDailyStandup(client, cronTime = "0 9 * * *") {
  if (currentJob) currentJob.stop();

  currentJob = cron.schedule(
    cronTime,
    () => {
      console.log("📢 Sending daily standup prompt...");
    },
    { timezone: "America/New_York" }
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
