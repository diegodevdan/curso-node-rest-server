const validarJWT =  require('./validar-campos');
const validarCampos =  require('./validar-jwt');
const validaRoles = require('./validar-roles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}
