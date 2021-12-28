const validarJWT =  require('./validar-campos');
const validarCampos =  require('./validar-jwt');
const validaRoles = require('./validar-roles');
const validarArchivoSubir = require('./validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivoSubir
}
