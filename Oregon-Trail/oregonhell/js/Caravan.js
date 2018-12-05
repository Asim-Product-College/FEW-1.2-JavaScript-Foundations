class Caravan {
  constructor(game) {
    this.day = 0;
    this.distance = 0;
    this.crew = 30;
    this.food = 80;
    this.oxen = 2;
    this.money = 300;
    this.firepower = 2;
  }
  
  //update weight and capacity
  updateWeight() {
    let droppedFood = 0;
    let droppedGuns = 0;

    //how much can the caravan carry
    this.capacity = this.oxen * Config.WEIGHT_PER_OX + this.crew * Config.WEIGHT_PER_PERSON;

    //how much weight do we currently have
    this.weight = this.food * Config.FOOD_WEIGHT + this.firepower * Config.FIREPOWER_WEIGHT;

    //drop things behind if it's too much weight
    //assume guns get dropped before food
    while(this.firepower && this.capacity <= this.weight) {
      this.firepower--;
      this.weight -= Config.FIREPOWER_WEIGHT;
      droppedGuns++;
    }

    if(droppedGuns) {
      this.ui.notify('Left '+droppedGuns+' guns behind', 'negative');
    }

    while(this.food && this.capacity <= this.weight) {
      this.food--;
      this.weight -= Config.FOOD_WEIGHT;
      droppedFood++;
    }

    if(droppedFood) {
      this.ui.notify('Left '+droppedFood+' food provisions behind', 'negative');
    }
  } // end updateWeight function

  //update covered distance
  updateDistance() {
  //the closer to capacity, the slower
  const diff = this.capacity - this.weight;
  const speed = Config.SLOW_SPEED + diff/this.capacity * Config.FULL_SPEED;
  this.distance += speed;
  }

  //food consumption
  consumeFood() {
    this.food -= this.crew * Config.FOOD_PER_PERSON;

    if(this.food < 0) {
      this.food = 0;
    }
  }

} // end of Caravan Class.