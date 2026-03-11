import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

interface SendEmailProps {
    email: string;
    subject: string;
    payload: Record<string, unknown>;
    template: string;
    appName?: string
}

const sendEmail = async ({email, subject, payload, template}: SendEmailProps, appName = "Mori") => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    const source = fs.readFileSync(
        path.join(process.cwd(), "utils", "email", "template", template),
        "utf-8"
    );

    const compiledTemplate = handlebars.compile(source);
    const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject,
        html: compiledTemplate({...payload, appName}),
    });

    return {success: true, info};
};

export default sendEmail;