const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')


const validarJWT = async(request, response, next) => {

    const token = request.header('x-token');

    if(!token) {
        return response.status(401).json({
            msg: 'No hay token en la petición',
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        //lerr el usuario que corresponde al uid.
        const usuario = await Usuario.findById(uid);
        if(!usuario){
            return response.status(401).json({
                msg: 'Usuario no existente en DB'
            })
        }

        //Verificar si el uid tiene estado en true
        if(!usuario.estado){
            return response.status(401).json({
                msg: 'Token no válido usuario con estado false'
            })
        }

        request.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        response.status(401).json({
            msg: 'Token no válido'
        });
    }


}


module.exports = {
    validarJWT
}