const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'Falta el token en la peticion!'
        });
    }

    try {

        const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById( uid );

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en BD'
            });
        }

        //verificar estado de la persona que ejecuta la eliminacion 
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario false'
            });
        }
        
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }
   

}

module.exports = {
    validarJWT
}


