const express = require('express');
const { ComboTradicional, ComboPlus, ComboPremium } = require('./FabricaDeCombos');

const app = express();
const PORT = process.env.PORT || 5000;

//Funcion cliente que convierte el combo en JSON
function crearComboJSON(fabrica){
    const cafe = fabrica.crearCafe();
    const taza = fabrica.crearTaza();
    const filtro = fabrica.crearFiltro();

    return {
        cafe: cafe.getDescription(),
        taza: taza.getDescription(),
        filtro: filtro.getDescription()
    };
}

//Endpoint para combo tradicional
app.get("/combo/tradicional", (req, res) => {
    const combo = new ComboTradicional();
    res.json(combo);
});

//Endpoint para combo Plus
app.get("/combo/plus", (req, res) => {
    const combo = new ComboPlus();
    res.json(combo);
});

//Endpoint para combo Premium
app.get("/combo/premium", (req, res) => {
    const combo = new ComboPremium();
    res.json(combo);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});