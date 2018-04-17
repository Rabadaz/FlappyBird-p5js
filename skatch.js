let dead = false;


let playerx = 100;
let mrg = 100;
let starth = 500;
let score = 0;



const height = 1000;
const width = 1000;
const barscount = 5;




class Bariere{



    constructor(v,inactive ){
      //Der obere abstand bis zur Lücke
       this.pad_top = random(300,700);
       //Hat der Player die bariere schon durchschritten?
       this.parsed = false;
      //Breite der Bariere
       this.w = 20;
      //Die horizontale Koordinate
       this.v = v;
      //Muss die Bariere gezeichnet werden ? 
        this.inactive = inactive;
    }

     isColliding(x,y){

      //Wenn die bariere nicht angezeigt wird kann man auch nicht dagegen fliegen
       if(this.inactive)
           return false;
      
          //Überprüft ob die x,y Positio, die übergeben  wird in der bariere ist... d.h. damit colidiert
           return ((x >= this.v  && x <= this.v+this.w) && !(y >= this.pad_top && y <= this.pad_top + mrg));
    }

      isParsing( x,  y){
        //Wenn die bariere nicht angezeigt wird kann man auch nicht hindurch fliegen
       if(this.inactive)
         return false;
        //Überprüft ob die x,y Positio, die übergeben  wird in der lücke der bariere ist... d.h. parsed .... also hindurch fliegt
      if((x >= this.v && x <= this.v+ this.w)&& (y >= this.pad_top && y <= this.pad_top+mrg)&&!this.parsed){
        this.parsed = true;
        return true;
      }

      return false;
    }

    //Reseted die bariere, damit sie wieder von rechts kommen kann
     reset(){
       this.v = width+1;
       this.parsed = false;
       this.inactive= false;

   }
   //Wird jeden Frame gecalled ... beingaltet die bewegung usw für die jeweilige Bariere
    update(){
      //Wenn die barirere nicht  mehr sichbar ist wird sie zurückgesetzt
       if(this.v < 0-this.w){
         this.reset();
       }
      
       this.drawObj();
       //die bareire bewegt sich jedes Frame um ein Pixel .... dadurch eintseht die ilusion des hindurchfliegens
       this.v--;
     }
     //Wenn das objekt nicht "inactive" ist wird es mit den p5.js Funktionen gezeichnet
      drawObj(){
       if(this.inactive)
         return;
        rect(this.v,0,this.w,this.pad_top);
        rect(this.v, this.pad_top+mrg, this.w, height-(this.pad_top+mrg));
    }

      setInactive(state){
       this.inactive = state;
     }

}


class Bird{

    constructor(){
      //Sprung Multiplikator ..  damit das springen "smoother" wird
       this.jumpM = 1;
       //Fall Multiplikator ..  damit das fallen beschleunigt  wird
       this.fallM = 1;
       //Die vertikale Coordinate.... damit die höhe in der man fliegt
       this.h = starth;
   }
     getHeight(){
     return this.h;
   }

 reset(){
    //zürücksetzen des spileres
     this.h = starth;
   }
 update(){



     if(this.jumpM > 1){
       this.jumpM-= .1;
     }

     this.fallM += .05;

     //das fallen des Vogels um 1.5 px/frame ..... multiplizirt mit der beschläunigung
     this.h += 1.5*this.fallM;
     this.drawBird();
   }


    drawBird(){
      //Einen Kreis als Player zeichnen
      ellipse(playerx,this.h, 10,10);
   }

  jump(){
    //springen ... den vogel um 25 px hochsetzen multiplizirt mit dem JumpM
    this.h = this.h - 25 * this.jumpM;
    //Pro sprung den jumpM erhöhen
    this.jumpM += .2;
    //bei einem sprung setzt sich die Beschläunigung des Fallen zurück
    this.fallM = 1;
  }
 }




//Player und Brieren
var player = new Bird();
var bars = [5];



//Wird am anfang 1 mal aufgerufen
function setup() {
  //hitergrundFarbe
    background(0);
    //größe des Spielbereiches
    createCanvas(height,width);

    let v = 0;
  //initailiseren der barieren
    for(var i = 0; i < barscount; i++){
        bars[i] = new Bariere(v,true);
        //das  width/barscount sorgt für einen immer gleichen abstand zwischen den barieren
         v += width/barscount;
    }
}

//Wird jeden Frame aufgerufen
function draw() {

  //Den Bildschirm löschen
    clear();
    
    background(0);
    //Den Player updaten
    player.update();


    //jede Barere  updaten
    for(var i = 0; i < bars.length; i++){

      bars[i].update();
    }


    //Überprüfen ob der Player eh nicht kollidiert
    if(PlayerColliding())
      gameOver();


    //Überprüfen ob der player eh nicht aus dem Fenster fällt oder Fligt
     if(player.getHeight() < 0 || player.getHeight() >= height)
       gameOver();

    //Wenn der Player durch eine Briere fligt seinen score erhöhen
    if(PlayerParsing())
      score++;

    //Ausgabe vom score
    textSize(32);
    fill(255);
    text(score + "" , 100,100);
    

}



function PlayerColliding(){
  //alle barieren fragen ob der Player mit ihnen kollidiert
  for(var b of bars ){
    if(b.isColliding(playerx,(player.getHeight()))) {
      return true;
    }
  }
  return false;
}


function PlayerParsing(){
//Alle Bareren fragen ob der Player durch sie durchfliegt
  for(var b of bars){
    if(b.isParsing(playerx,player.getHeight()))
      return true;
  }
  return false;
}

//Wird bei jedem "KeyPress" envent aufgerufen
function keyPressed(){
  //Wenn W,SPACEBAR gepresst ... Player springt
  if(key == 'W'){
     player.jump();
    }else if(key == ' '){
      player.jump();
    }
    //Wenn der player tot ist und 'R' gepresst ist ... spiel neustarten
  else if(key  == 'R' && dead){
    restartGame();
  }
  
  
}




function restartGame(){

  //für den start alle Barireren wieder inactive setzen
  for(let b of bars){
    b.setInactive(true);
  }
  //den Player zurücksetzen
  player.reset();
  score = 0;
  
  background(0);
  dead = false;

  //den GameLoop wieder starten
  loop();
}

function gameOver(){

  
  dead = true;

  clear();

  //den Roten Hintergrund setzen
  background(255, 16, 0);
  //den GameLoop stopen
  noLoop();
  //Game Over anzeigen
  text("Game over", width/2, height/2);
}



