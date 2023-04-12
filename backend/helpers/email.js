import nodemailer from "nodemailer";

export const emailRegistro = async(datos) => {

    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // informacion del email

    const info = await transport.sendMail({
        from: '"Uptask- Administrador de Proyectos" <a98fd150e3-ef35a7@inbox.mailtrap.io>',
        to: email,
        subject: "Uptask - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en Uptask",
        html: `
            <p>Hola : ${nombre} Comprueba tu cuenta en UpTask</p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
            <br>
            <p>${process.env.FRONTEND_URL}/confirmar/${token}</p>
            <br>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensjae</p>
        `,
    })
}

export const emailOlvidePassword = async(datos) => {

    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // informacion del email

    const info = await transport.sendMail({
        from: '"Uptask- Administrador de Proyectos" <a98fd150e3-ef35a7@inbox.mailtrap.io>',
        to: email,
        subject: "Uptask - Restablece tu Password",
        text: "Restablece tu Password en Uptask",
        html: `
            <p>Hola : ${nombre} has solicitado restablecer tu password en UpTask</p>
            <p>Tu password ya esta casi lista, solo debes restablecerla en el siguiente enlace::</p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Comprobar cuenta</a>
            <br>
            <p>${process.env.FRONTEND_URL}/olvide-password/${token}</p>
            <br>
            <p>Si tu no solicitaste este email, puedes ignorar el mensjae</p>
        `,
    })
}