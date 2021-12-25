const {Router} = require('express');
const {check} = require("express-validator");


const {validarJWT, validarCampos, tieneRol} = require("../middlewares");
const {crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria} = require("../controllers/categorias");
const {existeCategoriaPorId} = require("../helpers/db-validators");
const router = Router();


//obtener todas las categorias - publico
router.get('/', obtenerCategorias);




//obtener una categoria por id - publico
router.get('/:id', [

    check('id', 'No es un id válido de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),

    validarCampos
    ], obtenerCategoria);




//Crear categoría - cualquier persona con un token válido
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es requerido por favor').not().isEmpty(),
        validarCampos
    ]
    , crearCategoria);




//Actualizar por id -privado- cualquier persona con un token válido
router.put('/:id', [
        validarJWT,
        check('id', 'No es un id válido de mongo').isMongoId(),
        check('nombre', 'El nombre es requerido').notEmpty(),
        check('nombre', 'Mínimo 3 cáracteres').isLength({min: 3}),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],actualizarCategoria);




//Borrar una categoría - admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id válido de mongo').isMongoId(),
    tieneRol('ADMIN_ROLE'),
    check('id').custom(existeCategoriaPorId),

    validarCampos
    ], borrarCategoria);

module.exports = router;
