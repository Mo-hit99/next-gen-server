import { TeamEmailQuery } from "../template/TeamEmailQuery.js";
import nodemailer from 'nodemailer'
export const TeamEmailSender = (email,query)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODE_MAIL_ID,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });
    
    let mailOptions = {
      from: `<${email}>`,
      to: `${process.env.NODE_MAIL_ID}`,
      subject: "Client Query",
      html: TeamEmailQuery(email,query)
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
}