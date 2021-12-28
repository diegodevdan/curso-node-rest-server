const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers')
const {Usuario, Producto} = require("../models");

const cargarArchivo = async (req,res) => {

    if(!req.files.archivo){
        return res.status(400).json({msg: 'No hay archivos que subir'});
    }


    try {
        // const nombre = await subirArchivo(req.files, ['txt','md', 'pdf'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imagenes');

        res.status(201).json({
            nombre
        })
    } catch (err) {
        res.status(401).json({msg: err})
    }
    


}

const actualizarImagen = async (req,res) => {

    if(!req.files.archivo){
        return res.status(400).json({msg: 'No hay archivos que subir'});
    }

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break

        default:
            return res.status(500).json({msg: 'No contemple este endpoint'})
    }

    //Limpiar imagenes previas

    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.status(201).json(modelo);

}


const actualizarImagenCloudinary = async (req,res) => {

    if(!req.files.archivo){
        return res.status(400).json({msg: 'No hay archivos que subir'});
    }

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break

        default:
            return res.status(500).json({msg: 'No contemple este endpoint'})
    }

    //Limpiar imagenes previas

    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.status(201).json(modelo);

}


const mostrarImagen = async (req,res) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break

        default:
            return res.status(500).json({msg: 'No contemple este endpoint'})
    }

    //Limpiar imagenes previas

    if(modelo.img){
        //hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    const pathImage = path.join(__dirname,'../assets', 'no-image.jpg');
    return res.sendFile(pathImage);
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}