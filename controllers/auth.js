const { response } = require('express')
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require("../helpers/generarJWT");



const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si el email existe.
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'usuario/contraseña no son correctos'
            })
        }

        //verificar si el usuario esta activo.
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Estado del usuario en false'
            })
        }

        //verificar la contraseña.
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'El password no coincide.'
            })
        }

        //generar JWT
        const token = await generarJWT(usuario.id);

        res.status(201).json({
            usuario,
            token
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: 'Algo salío mal'
        });
    }

}




module.exports = {
    login
};