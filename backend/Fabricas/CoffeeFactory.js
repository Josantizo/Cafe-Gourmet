const Coffee = require("./Coffee");

class CoffeeFactory {
  createCoffee(type, region, size) {
    const validTypes = ["Arabico", "Bourbon", "Catuai" ];
    const validRegions = ["Antigua", "Acatenango", "Amatitlán"];
    const validSizes = [120, 340, 400];

    if (!validTypes.includes(type)) {
      throw new Error(`Tipo de café inválido: ${type}`);
    }
    if (!validRegions.includes(region)) {
      throw new Error(`Región inválida: ${region}`);
    }
    if (!validSizes.includes(size)) {
      throw new Error(`Tamaño inválido: ${size}`);
    }

    return new Coffee(type, region, size);
  }
}

module.exports = CoffeeFactory;

