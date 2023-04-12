import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/email.js";

const usuarios = (req, res) => {
    res.json({ msg: "Desde API/Usuarios" });
};

const crearUsuario = async(req, res) => {

    const { email } = req.body;
    // validar si correo existe
    const existeUsuario = await Usuario.findOne({ email: email })
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');

        return res.status(400).json({ msg: error.message });
    }
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        // const usuarioAlmacenado = await usuario.save();
        await usuario.save();

        // Enviar email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({ msg: 'Usuario Creado Correctamente, revisa tu email para confirmar cuenta.' });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async(req, res) => {

        const { email, password } = req.body;

        // Comprobar si el usuario existe
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            const error = new Error("El usuario no existe");
            return res.status(404).json({ msg: error.message })
        }


        // Comprobar si el usuario esta confirmado
        if (!usuario.confirmado) {
            const error = new Error("Tu cuenta no ha sido confirmada");
            return res.status(403).json({ msg: error.message })
        }

        // Comprobar su password

        if (await usuario.comprobarPassword(password)) {
            res.json({
                _id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                token: generarJWT(usuario.id),
            });
        } else {
            console.log('Es incorrecto')
            return res.status(403).json({ msg: error.message })
        }

    }
    // Evaluar si token existe, en caso que si, se ejecuta
    // la peticion para cambiar el "atributo" confirmado a true 
    // y "token" a vacio ya que es de un solo uso, esto se hace
    // para que nadie mas pueda volver a confirmar el token creado por default.
const confirmar = async(req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";

        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario confirmado correctamente' });

    } catch (error) {
        console.log(error)
    }

}

const olvidePassword = async(req, res) => {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            const error = new Error('El usuario no existe');
            return res.status(403).json({ msg: error.message });
        }

        try {
            usuario.token = generarId();
            await usuario.save();

            // Enviar el email
            emailOlvidePassword({
                email: usuario.email,
                nombre: usuario.nombre,
                token: usuario.token
            })

            res.json({ msg: "Hemos enviado un email con las instrucciones para recuperar clave" });

        } catch (error) {
            console.log(error);
        }
    }
    // req.params = extraer datos que vienen por link
    // req.body = extraer datos de un formulario
const comprobarToken = async(req, res) => {
    const { token } = req.params;
    const validarToken = await Usuario.findOne({ token });

    if (validarToken) {
        res.json({ msg: "Token valido y el Usuario existe" });
    } else {
        const error = new Error('Token no valido');
        return res.status(403).json({ msg: error.message });
    }
}

const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const validarToken = await Usuario.findOne({ token });

    if (validarToken) {
        validarToken.password = password;
        validarToken.token = '';
        try {
            await validarToken.save();
            res.json({ msg: "Password modificado correctamente" });
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error('Token no valido');
        return res.status(403).json({ msg: error.message });
    }

}

const perfil = async(req, res) => {
    const { usuario } = req;
    res.json(usuario);
}

export {
    usuarios,
    crearUsuario,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}