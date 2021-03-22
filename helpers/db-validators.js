const { Usuario, Categoria, Role, Producto } = require('../models')

const esRoleValido = async( rol = '') => {
        
    const existeRol = await Role.findOne({ rol });
    
    if(!existeRol){

        throw new Error(`El rol ${rol} no esta registrado en la base de datos`); 

    }
}

const validarCorreoExiste = async  ( correo = '') => {

    const existeCorreo = await Usuario.findOne({ correo });
    
    if(existeCorreo){
        throw new Error(`El correo: ${correo}, ya esta registrado en la base de datos`); 
    }

}


const existeUsuarioPorId = async  ( id ) => {

    const existeUsuario = await Usuario.findById(id);
    
    if( !existeUsuario ){
        throw new Error(`El id del usuario: ${id}, no existe en la base de datos`); 
    }

}

const existeCategoriaPorId = async ( id ) => {

    const existeCategoria = await Categoria.findById( id );

    if( !existeCategoria ){
        throw new Error(`El id de la categoria: ${id}, no existe en la base de datos`);
    }

}

const existeProductoPorId = async ( id ) => {

    const existeProducto = await Producto.findById( id );

    if( !existeProducto ){
        throw new Error(`El id del producto: ${id}, no existe en la base de datos`);
    }

} 

/*
 * Validar colecciones Permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = [])=> {
    
    const incluida = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);
    }

    return true;

}

module.exports = {
    esRoleValido,
    validarCorreoExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}