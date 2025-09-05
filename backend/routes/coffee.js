//Aqui deben poner sus rutas de CREATE, DELETE Y READ, le pueden pedir a cursor que les
// ayude a crearlas.

const express = require('express');
const router = express.Router();

const { actualizarGrano, obtenerGranos } = require('../controllers/coffeeController');

// PUT /api/coffee/granos/:id
router.put('/granos/:id', actualizarGrano);

// RUTA READ
// GET /api/coffee/granos → todos los registros
router.get('/granos', obtenerGranos);

// GET /api/coffee/granos/:id → un registro por id
router.get('/granos/:id', obtenerGranos);

module.exports = router;
