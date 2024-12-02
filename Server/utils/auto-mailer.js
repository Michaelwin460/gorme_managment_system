import db from './db.js'; 
import sendManagerEmail from './mailer.js'; 
import cron from 'node-cron';


// const getUniqueManagers = async () => {
//     const query = `
//         SELECT DISTINCT manager_email, manager_name
//         FROM equipment_category 
//         JOIN equipment
//         ON equipment_category.id = equipment.item_category
//         WHERE equipment.status = 'leaving'
//         AND manager_email IS NOT NULL;
//     `;

//     try {
//         const results = await db.query(query);
//         console.log('Database results:', results);
//         return results;
//     } catch (error) {
//         console.error('Error fetching managers:', error);
//         return [];
//     }
// };


const getUniqueManagers = async () => {
    const query = `
        SELECT DISTINCT manager_email, manager_name, date_alarm, time_alarm
        FROM equipment_category 
        JOIN equipment
        ON equipment_category.id = equipment.item_category
        WHERE equipment.status = 'leaving'
        AND manager_email IS NOT NULL;
    `;
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
        return results;
    } catch (error) {
        console.error('Error fetching managers:', error);
        return [];
    }
};

const scheduleEmails = async () => {
    const managers = await getUniqueManagers();
    managers.forEach(manager => {
        const { manager_email, manager_name, date_alarm, time_alarm } = manager;

        // Validate `time_alarm` and use a default if it's missing
        const validTimes = ['10:00:00', '12:00:00', '14:00:00'];
        const alarmTime = validTimes.includes(time_alarm) ? time_alarm : '10:00:00';

        // Determine cron expression based on `date_alarm` and `time_alarm`
        let cronExpression;
        switch (date_alarm) {
            case 'daily':
                cronExpression = `0 0 ${alarmTime.split(':')[0]} * * *`; // Every day
                break;
            case 'weekly':
                cronExpression = `0 0 ${alarmTime.split(':')[0]} * * 1`; // Every Monday
                break;
            case 'monthly':
                cronExpression = `0 0 ${alarmTime.split(':')[0]} 1 * *`; // 1st of the month
                break;
            default:
                return; // Skip if no valid schedule
        }

        // Schedule the email
        cron.schedule(cronExpression, () => {
            console.log(`Sending email to ${manager_email} at ${alarmTime}...`);
            const emailContent = `
                <p>Dear ${manager_name},</p>
                <p>This is a reminder that you have users in your category who need to return their equipment.</p>
                <p>Please <a href="http://localhost:5173/">click here</a> to review the users and update their equipment return status.</p>
                <p>Thank you!</p>
            `;
            // sendManagerEmail(manager_email, 'Reminder: Users Equipment Return Check', emailContent);
            sendManagerEmail('mwtr2559@gmail.com', 'Reminder: Users Equipment Return Check', emailContent);
        }, {
            timezone: 'Asia/Jerusalem'
        });
    });
};

export default scheduleEmails; // Call this function to set up the schedules




// const sendEmailsToManagers = async () => {
//     const managers = await getUniqueManagers();
//     // console.log(managers);
    
//     if(managers)
//     managers.forEach(manager => {
//         const emailContent = `
//             <p>Dear ${manager.manager_name},</p>
//             <p>This is a reminder that you have users in your category who need to return their equipment.</p>
//             <p>Please <a href="http://localhost:5173/">click here</a> to review the users and update their equipment return status.</p>
//             <p>Thank you!</p>
//         `;
//         // sendManagerEmail(manager.manager_email, 'Reminder: Users Equipment Return Check', emailContent);
    
//         sendManagerEmail('mwtr2559@gmail.com', 'Reminder: Users Equipment Return Check', emailContent);
//     });
// };


// // Schedule the task to run every Monday at 9 AM: '0 9 * * 1'
// cron.schedule('1 * * * *', () => {
//     console.log('Sending reminder emails to managers...');
//     sendEmailsToManagers();
// }, {
//     timezone: 'Asia/Jerusalem' });

// export default sendEmailsToManagers;


