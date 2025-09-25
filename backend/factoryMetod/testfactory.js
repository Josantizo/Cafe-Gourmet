const CoffeeFactory = require("./coffeefactory");

const factory = new CoffeeFactory();

try {
  const coffee1 = factory.createCoffee("Arabico", "Antigua", 120);
  console.log(coffee1.getDescription());

  const coffee2 = factory.createCoffee("Bourbon", "Acatenango", 340);
  console.log(coffee2.getDescription());

  const coffee3 = factory.createCoffee("Catuai", "Amatitlán", 460);
  console.log(coffee3.getDescription());
} catch (error) {
  console.error("Error:", error.message);
}

