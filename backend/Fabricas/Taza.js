class Taza {
    constructor(style){
        this.style = style;
    }
    getDescription(){
        return 'Taza estilo ${this.style}';
    }
}

module.exports = Taza;