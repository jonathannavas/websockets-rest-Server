const { response } = require("express");

const esAdminRole = (req, res = response, next) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se desea verificar el role sin validar el token'
        });
    }

    const { rol, nombre } = req.usuario;
    if(rol!=='ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no tiene el rol de Administrador`
        })
    }

    next();
}

const tieneRole = ( ...roles ) => {
    
    return (req, res = response, next) => {
        
        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se desea verificar el role sin validar el token'
            });
        }

        if( !roles.includes( req.usuario.rol ) ){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        
        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}