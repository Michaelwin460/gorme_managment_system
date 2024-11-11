import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mwtr2559@gmail.com', 
        pass: 'obigdcguogblwsyl'
    }
});

// Function to send email
const sendManagerEmail = (managerEmail, emailSubject, content) => {
    const mailOptions = {
        from: 'mwtr2559@gmail.com',
        to: managerEmail,
        subject: emailSubject,
        html: content
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error while sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export default sendManagerEmail;
