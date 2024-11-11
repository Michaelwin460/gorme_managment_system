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
        SELECT DISTINCT manager_email, manager_name
        FROM equipment_category 
        JOIN equipment
        ON equipment_category.id = equipment.item_category
        WHERE equipment.status = 'leaving'
        AND manager_email IS NOT NULL;
    `;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
        // console.log('Database results:', results);
        return results;
    } catch (error) {
        console.error('Error fetching managers:', error);
        return [];
    }
};


const sendEmailsToManagers = async () => {
    const managers = await getUniqueManagers();
    // console.log(managers);
    

    // managers.forEach(manager => {
    //     const emailContent = `
    //         <p>Dear ${manager.manager_name},</p>
    //         <p>This is a reminder that you have users in your category who need to return their equipment.</p>
    //         <p>Please <a href="http://localhost:5173/">click here</a> to review the users and update their equipment return status.</p>
    //         <p>Thank you!</p>
    //     `;
    //     sendManagerEmail(manager.manager_email, 'Reminder: Users Equipment Return Check', emailContent);
    //
    //     sendManagerEmail('mwtr2559@gmail.com', 'Reminder: Users Equipment Return Check', emailContent);
    // });
};


// Schedule the task to run every Monday at 9 AM: '0 9 * * 1'
cron.schedule('1 * * * *', () => {
    console.log('Sending reminder emails to managers...');
    sendEmailsToManagers();
}, {
    timezone: 'Asia/Jerusalem' });

export default sendEmailsToManagers;


