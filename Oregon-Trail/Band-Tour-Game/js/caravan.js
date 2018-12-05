// Caravan.js
// ---------------------------------------------------------
// Caravan 

class Caravan {
    constructor(game) {
      this.game = game;
      // Initialize Caravan with a default Object and proeprties 
      this.init({
        day: 0,
        distance: 0,
        crew: 30,
        food: 80,
        oxen: 2,
        money: 300,
        firepower: 2
      });
    }
  
    // Initializes the caravan
    init({ day, distance, crew, food, oxen, money, firepower }) {
      this.day = day;
      this.distance = distance;
      this.crew = crew;
      this.food = food;
      this.oxen = oxen;
      this.money = money;
      this.firepower = firepower;
    }
    // update covered distance
    updateDistance () {
      // the closer to capacity, the slower
      const diff = this.capacity - this.weight;
      const speed = Config.SLOW_SPEED + diff / this.capacity * Config.FULL_SPEED;
      this.distance += speed;
    }
  
    // food consumption 
    consumeFood () {
      this.food -= this.crew * Config.FOOD_PER_PERSON;
  
      if (this.food < 0) {
        this.food = 0;
      }
    }
  }