const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async ( req, res = 'response') => {

    const { correo, password } = req.body;

    try {

        //verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });

        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto: email'
            });
        }
        //verificar si el usuario esta activo en la bd
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto: estado - false'
            });
        }
        //verificar la contraseña
        const passwordValido = bcryptjs.compareSync( password, usuario.password );

        if(!passwordValido){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto: password'
            });
        }
        //generar el JWT

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Error, Hable con el administrador'
        });

    }

}

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;
   
    try {

        const { nombre, correo, img } = await googleVerify( id_token );

        //verificar si el correo ya existe
        let usuario = await Usuario.findOne({ correo });
 
        if( !usuario ){
            //crar usuario en el campo de password enviar al menos 1 caracter de tipo string caso contrario salta el error

            const data = {

                nombre,
                correo,
                password: ':p',
                img,
                google: true

            };

            usuario = new Usuario( data ); 

            await usuario.save();
            
        }


        if( !usuario.estado ){

            return res.status(401).json({
                msg: 'Hable con el administrador - usuario bloqueado'
            })

        }

        //generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            msg: 'Token de google no valido'
        });

    }

}

module.exports = {
    login,
    googleSignIn
}