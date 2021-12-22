const {response} = require('express');



const usersGet = (req, res = response) => {
    const { q,nombre = 'no name',apikey, page = 1, limit } = req.query;
    res.status(403).json({
        msg: "get API - controlador",
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

const usersPost = (req, res) => {
    const {nombre, edad} = req.body;


    res.status(201).json({
        msg: "post API - controlador",
        nombre,
        edad
    });
};

const usersPut = (req, res) => {
    const id = req.params.id;

    res.status(500).json({
        msg: "put API - controlador",
        id
    });
};


const usersPatch = (req, res) => {
    res.status(403).json({
        msg: "patch API - controlador"
    });
};

const usersDelete = (req, res) => {
    res.status(403).json({
        msg: "delete API - controlador"
    });
};

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}


