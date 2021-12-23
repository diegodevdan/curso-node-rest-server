const express = require('express');
const cors = require('cors');
const {dbConnection} = require("../DB/config");


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/users';

        //Conectar a DB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de la aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //cors
        this.app.use(cors());

        //lectura y parse del body
        this.app.use(express.json());

        //Directorio público
        this.app.use(express.static('public'))
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/users'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`servidor corriendo en el puerto ${this.port}`)
        });
    }

}

module.exports = Server;