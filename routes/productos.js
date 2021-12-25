const {Router} = require('express');
const {check} = require('express-validator');
const {crearProducto, actualizarProducto, eliminarProducto, obtenerProductos, obtenerProductoPorId} = require("../controllers/productos");
const {validarJWT, validarCampos, esAdminRol} = require("../middlewares");
const {existeCategoriaPorId, existeProductoPorId} = require("../helpers/db-validators");
const router = Router();


router.get('/', obtenerProductos);


router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    validarCampos
], obtenerProductoPorId );


router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es requerido').notEmpty(),
        check('categoria', 'La categoria es requerida').notEmpty(),
        check('categoria', 'Id categoría no válido').isMongoId(),
        check('categoria').custom(existeCategoriaPorId),
        check('nombre', 'El nombre es requerido').notEmpty(),

        validarCampos
    ], crearProducto
);


router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es requerido').notEmpty(),
    check('precio', 'El precio es requerido').notEmpty(),
    check('precio', 'El precio debe ser un número').isNumeric(),
    check('id').custom(existeProductoPorId),
    check('id', 'El id no es válido').isMongoId(),
    check('categoria', 'Id categoría no válido').isMongoId(),

    validarCampos
], actualizarProducto);


router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(existeProductoPorId),

    validarCampos
],eliminarProducto);


module.exports = router;