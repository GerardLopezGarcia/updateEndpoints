const nodemailer = require('nodemailer');

async function sendEmail(changes) {
    let transporter = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    let title = "🚀 Actualización semanal de endpoints 🐳";
    let description = "Buenos días a todos! como cada lunes os traigo los cambios en los endpoints que se han producido durante la semana pasada:";
    let ending = "🔨 Sigamos construyendo y mejorando este software increíble juntos. ¡Hasta la próxima equipo! 📚📈"
    let mailOptions = {
        from: process.env.EMAIL,
        to: 'gerard.lopez.garcia@gmail.com, amigosBuenosAmigos@outlook.es',
        subject: 'Actualización de endpoints',
        html: `
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    p { color: #666; }
                    ul { color: #999; }
                    pre {
                        background-color: #f5f5f5;
                        border: 1px solid #ddd;
                        padding: 10px;
                        overflow: auto;
                        max-height: 200px; 
                        font-size: 14px;
                        line-height: 1.4;
                      }
                </style>
                <body>
                    <h1>${title}</h1>
                    <p>${description}</p>
                    ${changes}
                    <p>${ending}</p>
                </body>`
    }

    let info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
}

module.exports = sendEmail;