class Coffee {
    constructor(type, region, size) {
      this.type = type;     // Arábico, Bourbon, Catuai
      this.region = region; // Antigua, Acatenango, Amatitlán
      this.size = size;     // 120, 340, 400, 460 g
    }
  
    getDescription() {
      return `${this.size}g de café ${this.type} de la región ${this.region}`;
    }
  }
  
  module.exports = Coffee;