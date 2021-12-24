const { response, json} = require('express')
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require("../helpers/generarJWT");
const {googleVerify} = require("../helpers/google-verify");



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

const googleSignIn = async(req,res, next) => {

    const { id_token } = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario) {
            //se tiene que crear

            const data = {
                nombre,
                correo,
                password: '1234567',
                rol: 'USER_ROLE',
                img,
                google: true
            }

            usuario = new Usuario(data);
            console.log(usuario);
            await usuario.save();
            console.log('aqui si entre')
        }


        //Si el usuario en DB
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'usuario deshabilitado'
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (e) {
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }



}




module.exports = {
    login,
    googleSignIn
};