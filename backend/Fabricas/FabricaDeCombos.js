const CoffeeFactory = require('./CoffeeFactory');
const Taza = require('./Taza');
const Filtro = require('./Filtro');

class FabricaDeCombos {
    crearCafe(){}
    crearTaza(){}
    crearFiltro(){}
}

//Combo Tradicional
class ComboTradicional extends FabricaDeCombos {
    constructor() {
        super();
        this.coffeeFactory = new CoffeeFactory();
    }
    
    crearCafe(){
        return this.coffeeFactory.createCoffee('Arabico', 'Antigua', 120);
    }

    crearTaza(){
        return new Taza('Pequeña');
    }

    crearFiltro(){
        return new Filtro('Papel');
    }
}

//Combo Plus
class ComboPlus extends FabricaDeCombos {
    constructor() {
        super();
        this.coffeeFactory = new CoffeeFactory();
    }
    
    crearCafe(){
        return this.coffeeFactory.createCoffee('Bourbon', 'Acatenango', 340);
    }

    crearTaza(){
        return new Taza('Mediana');
    }

    crearFiltro(){
        return new Filtro('Tela');
    }
}

//Combo Premium
class ComboPremium extends FabricaDeCombos {
    constructor() {
        super();
        this.coffeeFactory = new CoffeeFactory();
    }
    
    crearCafe(){
        return this.coffeeFactory.createCoffee('Catuai', 'Amatitlán', 400);
    }

    crearTaza(){
        return new Taza('Grande');
    }

    crearFiltro(){
        return new Filtro('Metal');
    }
}

module.exports = {
    ComboTradicional,
    ComboPlus,
    ComboPremium
}