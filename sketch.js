var dog;
var garden, washroom, bedroom, livingroom;
var database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload()
{
  sadDog=loadImage("Images/sadDog.png");
  happyDog=loadImage("Images/happyDog.png");
  garden=loadImage("Images/garden.png");
  washroom=loadImage("Images/washroom.png");
  bedroom=loadImage("Images/bedroom.png");
}

function setup()
{
  database=firebase.database();

  createCanvas(1000, 800);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  dog=createSprite(500,400)
  dog.scale=0.2;
  dog.addImage(sadDog);

  foodStock=database.ref('Food')
  foodStock.on("value",readStock)

  feed = createButton("Feed Coco");
  feed.position(850,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoodS);

  foodObj = new Food();
}

function draw()
{  
  background(46, 139, 87)

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val()
  });

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
  text("Last Feed : "+ lastFed%12 + " PM",350,30);
   }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
     }else{
      text("Last Feed : "+ lastFed + "AM",350,30);
          }
          
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.addImage(happyDog);
    gameState="Full";
  }    else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
   drawSprites();
}

function readStock(data){
foodS=data.val()
foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  gameState="Full"
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}


function addFoodS(){
  foodS++;
  database.ref('/').update({
  Food:foodS
  })
}
 
function update(state){
  database.ref('/').update({
    gameState:state
  })
}