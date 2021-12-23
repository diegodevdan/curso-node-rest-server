const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const {Promise} = require("mongoose");


const usersGet = async(req, res = response) => {
    // const { q,nombre = 'no name',apikey, page = 1, limit } = req.query;
    const query = {estado: true};

    const { limit = 2, desde = 0} = req.query;
        // if(typeof desde !== Number) throw new Error ('el desde tiene que ser numero')


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ])



    res.status(403).json({
        msg: "get API - controlador",
        // q,
        // nombre,
        // apikey,
        // page,
        // limit


        // total,
        // usuarios,

        total,
        usuarios
    });
};

const usersPost = async (req, res) => {

    const {nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});



    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);


    //Guardar en DB
    // console.log(usuario);
    await usuario.save();


    res.status(201).json({
        msg: "post API - controlador",
        usuario
    });
};

const usersPut = async (req, res) => {
    const id = req.params.id;
    const {_id, password, google, correo,  ...resto } = req.body;

    //TODO validar contra base de datos
    if(password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.status(500).json(usuario);
};


const usersPatch = (req, res) => {
    res.status(403).json({
        msg: "patch API - controlador"
    });
};

const usersDelete = async(req, res) => {
    const { id } = req.params;
    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    //ya se utiliza de esta manera
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.status(201).json({
        usuario
    });
};

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}


