class Filtro {
    constructor(material){
        this.material = material;
    }
    getDescription(){
        return 'Filtro de ${this.material}';
    }
}

module.exports = Filtro;