const Categoria = require('../models/categoria')


const obtenerCategorias = async(req,res) => {

    const { page = 1, limit = 2 } = req.query;
    const total = await new Promise((resolve,reject) => {
        resolve(
            Categoria.find()
                .skip(Number(page))
                .limit(Number(limit))
                .populate('usuario', 'nombre')
        );
        reject(new Error("error"));
    })

    res.status(201).json({
        total
    })
}

const obtenerCategoria = async (req,res) => {
    //populate {}

    const id= req.params.id;


    const categoria = await Categoria.findById(id);

    if(!categoria){
        return res.status(401).json({
            msg:'producto no encontrado'
        })
    }

    res.status(201).json({
        categoria
    })
}

const crearCategoria = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({
        msg: 'categoría creada con exito',
        categoria,
    })
}

const actualizarCategoria = async(req,res) => {

    const id = req.params.id;
    const { estado, usuario, ...data} = req.body

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.status(201).json({
        msg: 'actualizado',
        categoria
    })
}

const borrarCategoria = async (req,res) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id,{estado: false}, {new: true});

    res.status(201).json({
        msg: 'eliminado',
        categoria
    })
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}