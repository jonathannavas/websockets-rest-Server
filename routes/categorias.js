const {Router} = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = new Router();

/**
*   {{url}}/api/categorias 
*/
 
//Obtener todas las categorias - public
router.get('/', obtenerCategorias);

//Obtener una categoria en especifico por id publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoria);

//Crear Categoria - Privado - Cualquier persona con un token valido
router.post('/', [ 
        validarJWT, 
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
], crearCategoria);

//Actualizar categoria - privado - cualquiera con un token valido
router.put('/:id', [

    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos

],actualizarCategoria);

//Borrar una categoria - Admin - Cambiar el Estado de activo a inactivo
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],borrarCategoria);

module.exports = router;