
const { Router } = require('express');
const {login, googleSignIn} = require("../controllers/auth");
const {check} = require("express-validator");
const {validarCampos} = require("../middlewares/validar-campos");
const router = Router();




router.post('/login',[
    check('correo', 'El correo es necesario').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),

    validarCampos
],login);

router.post('/google',[
    check('id_token', 'Id token es necesario').not().isEmpty(),

    validarCampos
],googleSignIn);



module.exports = router;
