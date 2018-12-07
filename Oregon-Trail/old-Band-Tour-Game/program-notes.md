### Journey

### Event

## FILES

### Config
Holds static properties that act as default global constants used by the game.
    Properties:
        - WEIGHT_PER_OX
        - WEIGHT_PER_PERSON
        - FOOD_WEIGHT
        - FIREPOWER_WEIGHT
        - GAME_SPEED
        - DAY_PER_STEP
        - FOOD_PER_PERSON
        - FULL_SPEED
        - SLOW_SPEED
        - FINAL_DISTANCE
        - EVENT_PROBABILITY
        - ENEMY_FIREPOWER_AVG
        - ENEMY_GOLD_AVG
     
### eventData (array of objects, not a Class)
Stores all of the game events. Game events like being attacked by bandits, finding a shop, and anything else that might occur on the trip.

eventData is an array of objects that describe the events. Instead this array is turned into Objects defined by the EventType Class below. This is like raw data for the event objects used by the game.

###Product
A product that can be bought from a shop. 

### EventType
Takes an object frmo the Event array which describes the event.

### Event Manager
this Object manages events.
It takes in a game object
and for every object in the Eventdata array,
push it into the formerly empty list of eventTypes that belongs to the EventManager.
Functions:
    - generateEvent
        - picks a random eventType
        Check if event data type is a:
            - stat update
            - shop
            - attack
    - stateChangeEvent takes event from generate event func.
        - if event data val + game caravan's event data stat >= 0
            - do some calculation and ui notification here.. not too sure.
    - shopEvent takes in eventData
    - attackEvent

### Caravan
Takes in a game and sets initial caravan properties: day 0, distance 0, crew: 30, food: 80, oxen 2, money 300, firepower 2
Functions:
    - Update weight, capacity
        - updates weight and capacity by:
            - setting droppedFood, droppedGuns + 0 then capacity = to oxen * WEIGHT_PER_OX + crew * Config.WEIGHT_PER_PERSON
        - drops things behind if it's too much
        weight. and ui notify user. 
    -updateDistance
        - updates covered distance.
        - closer to the capacity, the slower.
    - consumeFood
        - food consumption.

### UI
Takes in a game, finds shopDiv and prodsDiv
Functions:
     - notify
        - shows noticaiton in the msg area
        - takes in msg and update type.
    - refreshStats
        - grabs errryhting and modifies the dom with em.
        - updates caravan position.
    - showAttack(firepower, gold)
        - grab atack id, remove 
    - fight
        - firepower, gold set
        damage created n calculated.
        - checks for survivors.
        

#CONCEPTS TO PRACTICE IN JAVASCRIPT

- Practice array manipulation in Javascript
- Practice data structures with JavaScript.
- classList
- 