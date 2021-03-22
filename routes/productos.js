const {Router, response} = require('express');
const { check } = require('express-validator');

const { obtenerProductos, crearProducto, actualizarProducto, obtenerProducto, eliminarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = new Router();


router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un ID valido de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos   
], obtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'El id no corresponde a un ID de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);

router.put('/:id',[

    validarJWT,
    // check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos

],actualizarProducto);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], eliminarProducto);


module.exports = router;