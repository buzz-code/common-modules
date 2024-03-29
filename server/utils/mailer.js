import sgMail from '@sendgrid/mail';

export async function sendEmail(toAddress, fromAddress, subject, text, html, replyTo = 'hadasa.schechter@gmail.com', attachments = undefined) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: toAddress,
        from: fromAddress,
        replyTo: replyTo,
        subject: subject,
        text: text,
        html: html,
        attachments,
    }
    try {
        await sgMail.send(msg);
        console.log('Email sent', msg);
    } catch (error) {
        console.error(JSON.stringify(error), msg);
    }
}
