const {Producto, Categoria} = require("../models");


const obtenerProductos = async (req,res) => {
    const { desde=1, limit=10 } = req.query;

    const total = await new Promise((resolve, reject) => {
            resolve(
                Producto.find()
                    .skip(Number(desde))
                    .limit(Number(limit))
                    .populate('usuario', 'nombre')
            );
            reject(new Error('NO se pudo obtener la petición'))
    });

    res.status(200).json({
        total
    });

}


const obtenerProductoPorId = async (req,res) => {
    const { id } = req.params;

    const producto = await Producto.findById(id);

    if(!producto) {
        return res.status(400).json({
            msg: 'No se encontro el producto'
        })
    }

    res.status(200).json({
        producto
    });

}

const crearProducto = async (req,res) => {

    const {  estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({nombre: body.nombre.toUpperCase()});

    if(productoDB){
        return res.status(401).json({
            msg: 'Ya existe un producto con el mismo nombre'
        })
    }


    const data = {
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    await producto.save();


    res.status(200).json({
        msg: 'Producto creado con exito',
        producto
    });

}

const actualizarProducto = async (req,res) => {

    const { id } = req.params;
    //se saca el estado por que es el que sirve para eliminar, el usuario tampoco lo necesitamos ya que
    //lo volvemos a obtener.
    const { estado, usuario, ...body } = req.body;
    body.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, body, { new: true })

    res.status(200).json({
        msg: 'producto actualizado',
        producto
    });

}

const eliminarProducto = async (req,res) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.status(200).json({
        producto
    });

}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
}