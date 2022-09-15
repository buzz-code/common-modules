import sgMail from '@sendgrid/mail';

export function sendEmail(toAddress, fromAddress, subject, text, html) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: toAddress,
        from: fromAddress,
        subject: subject,
        text: text,
        html: html,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent', msg);
        })
        .catch((error) => {
            console.error(error, msg);
        })

}
