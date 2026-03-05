import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailUser = (process.env.EMAIL_USER || "").trim();
const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

if (!emailUser || !emailPass) {
  console.error("EMAIL_USER or EMAIL_PASS is missing in environment variables");
}

const mailService = (process.env.MAIL_SERVICE || "gmail").trim();
const smtpHost = (process.env.EMAIL_HOST || "").trim();
const smtpPort = Number(process.env.EMAIL_PORT || 587);
const smtpSecure =
  String(process.env.EMAIL_SECURE || "false").toLowerCase() === "true";

const transporterOptions = smtpHost
  ? {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      requireTLS: !smtpSecure,
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    }
  : {
      service: mailService,
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };

const transporter = nodemailer.createTransport(transporterOptions);

export { emailUser, emailPass, mailService, smtpHost, smtpPort, smtpSecure };
export default transporter;
