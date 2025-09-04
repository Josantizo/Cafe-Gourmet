//Aqui deben poner sus rutas de CREATE, DELETE Y READ, le pueden pedir a cursor que les
// ayude a crearlas.

const express = require('express');
const router = express.Router();

const { actualizarGrano } = require('../controllers/coffeeController');

// PUT /api/coffee/granos/:id
router.put('/granos/:id', actualizarGrano);

module.exports = router;