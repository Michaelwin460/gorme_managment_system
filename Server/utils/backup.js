import { exec } from "child_process";
// import path from "path";
// import fs from "fs";
import cron from "node-cron";

const backupAndPushToGit = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = `backup-${timestamp}.sql`;
  

  // Adjust this to point to your MySQL installation and database details
  const dumpCommand = `mysqldump -u root -p"" g-food > ${backupFile}`;

  // Create a backup
  exec(dumpCommand, (error) => {
    if (error) {
      console.error("Error during database dump:", error.message);
      return;
    }

    console.log(`Database backed up to ${backupFile}`);

    // Add backup to Git
    exec(
      `
      git add ${backupFile} &&
      git commit -m "Backup on ${timestamp}" &&
      git push
    `,
      (gitError, gitStdout, gitStderr) => {
        if (gitError) {
          console.error("Error during Git operation:", gitError.message);
          return;
        }
        console.log("Backup pushed to GitHub:\n", gitStdout);
      }
    );
  });
};

// Schedule the task to run daily at midnight
const scheduledBackup = () => {
    cron.schedule("0 0 * * *", () => {
        console.log("Running scheduled backup...");
        backupAndPushToGit();
      });
}


export default backupAndPushToGit;
