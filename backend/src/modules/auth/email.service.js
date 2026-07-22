import transporter from "../../config/mail.js";

const sendVerificationEmail = async (email, name, otp) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM || `"SkillSphere" <no-reply@skillsphere.io>`,
        to: email,
        subject: "Verify Your Email",

        html: `
            <div style="font-family: Arial; max-width:600px; margin:auto;">
                <h2>Hello ${name},</h2>

                <p>
                    Thank you for registering on SkillSphere.
                </p>

                <p>
                    Please verify your email using the OTP below.
                </p>

                <h1
                    style="
                        letter-spacing:8px;
                        color:#2563eb;
                        text-align:center;
                    "
                >
                    ${otp}
                </h1>

                <p>
                    This OTP will expire in
                    ${process.env.OTP_EXPIRES_IN} minutes.
                </p>

                <p>
                    If you did not create this account,
                    you can safely ignore this email.
                </p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};

const sendForgotPasswordEmail = async (email, name, otp) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM || `"SkillSphere" <no-reply@skillsphere.io>`,
        to: email,
        subject: "Reset Your Password",

        html: `
            <div style="font-family: Arial; max-width:600px; margin:auto;">
                <h2>Hello ${name},</h2>

                <p>
                    Use the OTP below to reset your password.
                </p>

                <h1
                    style="
                        letter-spacing:8px;
                        color:#dc2626;
                        text-align:center;
                    "
                >
                    ${otp}
                </h1>

                <p>
                    This OTP expires in
                    ${process.env.OTP_EXPIRES_IN} minutes.
                </p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};

const emailService = {
    sendVerificationEmail,
    sendForgotPasswordEmail,
};

export default emailService;