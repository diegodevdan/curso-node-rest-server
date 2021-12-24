
const esAdminRol = (req, res, next) => {

    if(!req.usuario){
        return res.status(500).json({
           msg: 'se quiere verificar el rol sin validar el token primero'
        });
    }

    const {rol, nombre} = req.usuario;
    console.log(rol,nombre)

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `el ${nombre} no es administrador, no tiene privilegios`
        })
    }


    next();
}

const tieneRol = (...roles) => {

    return (req,res,next) => {
        console.log(roles, req.usuario.rol);

        if(!req.usuario){
            return res.status(500).json({
                msg: 'se quiere verificar el rol sin validar el token primero'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(500).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }

}

module.exports = {
    esAdminRol,
    tieneRol
}