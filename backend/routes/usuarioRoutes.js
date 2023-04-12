import express from "express";
import {
    usuarios,
    crearUsuario,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
} from "../controllers/usuarioControllers.js";
import checkAuth from "../middleware/checkAuth.js";




const router = express.Router();

router.get("/", usuarios);
router.get('/confirmar/:token', confirmar);
router.get('/recuperar/:token', comprobarToken);
router.get('/perfil', checkAuth, perfil)

router.post("/", crearUsuario);
router.post('/login', autenticar);
router.post('/recuperar', olvidePassword);
router.post('/recuperar/:token', nuevoPassword);



// Esta manera se usa para minimizar lineas de codigo
// funciona muy bien en node
// router.route('/recuperar/:token').get(comprobarToken).post(nuevoPassword);




export default router;