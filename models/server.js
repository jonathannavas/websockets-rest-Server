const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor(){
        
        this.app =  express();
        this.port = process.env.PORT;

        //web sockets
        this.server = require('http').createServer( this.app );
        this.io = require('socket.io')(this.server);

        /*
            Direcciones urls del path
        */
        this.paths = {

            auth:       '/api/auth',
            categorias: '/api/categorias',
            usuarios:   '/api/usuarios',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'
        }

        //Conectar a la base de datos
        this.conectarDB();
        
        //Midlewares
        this.middlewares();

        //rutas
        this.routes();

        //sockets

        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        // CORS
        this.app.use( cors() );
        //Lectura y parseo del body
        this.app.use( express.json() );
        // Directorio publico
        this.app.use( express.static('public') );
        //FileUpload o Carga de Archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',

            //ojo con esta configuracion crea el path si no existe
            createParentPath: true
        }));

    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    
    }

    sockets(){
    
        this.io.on('connection', (socket) => socketController(socket, this.io));

    }

    listen(){
        this.server.listen(this.port, ()=> {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }

}

module.exports = Server; 