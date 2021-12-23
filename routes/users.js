

const { Router } = require('express');
const {usersGet, usersPut, usersDelete, usersPost, usersPatch} = require("../controllers/usuarios");
const { validarCampos } = require('../middlewares/validar-campos');
const {check} = require("express-validator");
const {esRolValido, emailExiste, existeUsuarioPorId} = require("../helpers/db-validators");
const router = Router();

router.get('/', usersGet);



router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('correo', 'El correo no es valido').isEmail(),
    check('correo', 'tipo no válido').custom(emailExiste).isEmail(),
    check('password', 'El password es obligatorio y mas de 6 letras')
        .isLength({min: 6}),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROL']),
    // check('rol').custom(rol => esRolValido(rol)),
    check('rol').custom(esRolValido),


    validarCampos
] , usersPost);




router.put('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),

    validarCampos
] ,usersPut);



router.patch('/', usersPatch);





router.delete('/:id', [
    check('id', 'el id es invalido').isMongoId(),
    check('id').custom(existeUsuarioPorId),

    validarCampos
], usersDelete );


module.exports = router;


