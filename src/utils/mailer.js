const nodemailer = require('nodemailer');

async function sendEmail(changes) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
          }
    });
    let title = "🚀 Actualización semanal de endpoints 🐳";
    let description = "Buenos días a todos! Como cada lunes os traigo los cambios en los endpoints que se han producido durante la semana pasada:";
    let ending = "🔨 Sigamos construyendo y mejorando este software increíble juntos. ¡Hasta la próxima equipo! 📚📈"
    let disclaimer = "🧪 * Este email ha sido autogenerado con una aplicación y podría contener fallos, en caso de encontrar algún endpoint de interés en el que se esté trabajando, revisar la documentación original. * 👨‍🔬 Autor: Gerard López García";
    let mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL_RECIPIENTS,
        subject: 'Actualización de endpoints',
        html: `
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    p { color: #666; }
                    ul { color: #999; }
                    pre {
                        background-color: #f5f5f5; /* negro  #000000 gris oscuro #333333 verde suave #59a14f  gris claro fondo  #f5f5f5  color: #32CD32; */
                        border: 1px solid #ddd;
                        padding: 10px;
                        overflow: auto;
                        max-height: 200px; 
                        font-size: 14px;
                        line-height: 1.4;
                        border-radius: 11px;
                        display: block;
                        font-family: monospace;
                        margin: 1em 0px;
                    }
                    h2 {
                        color: #4a86e8; 
                        font-size: 20px; 
                        font-weight: bold; 
                    }
                    
                    .url {
                        color: #59a14f; /*rojo #e06666; */
                        font-style: italic; 
                    }
                    .small-text {
                        font-size: 15px;
                        color: #999999;
                        font-style: italic; 
                    }
                </style>
                <body>
                    <h1 style="color: #333;">${title}</h1>
                    <p style="color: #666;">${description}</p>
                    ${changes}
                    <p style="color: #666;">${ending}</p>
                    <p style="font-size: 15px; color: #999999; font-style: italic;">${disclaimer}</p>
                </body>`
    }
    
    transporter.on('token', token => {
        console.log('A new access token was generated');
        console.log('User: %s', token.user);
        console.log('Access Token: %s', token.accessToken);
        console.log('Expires: %s', new Date(token.expires));
    });

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email enviado! 💌✅");
    } catch (error) {
        if (error.responseCode === 535) { // Si el token ha expirado
            console.log('El token de acceso ha expirado. Un nuevo token de acceso ha sido generado y guardado.');
        }else{
            console.log("Error" + error);
        }
    }
}

module.exports = sendEmail;