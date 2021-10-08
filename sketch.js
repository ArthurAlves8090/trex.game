var ESTADONICIO=1;
var ESTADOFIM=0;
var estadoJogo=ESTADONICIO;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodebstaculos, bstaculo1, bstaculo2, bstaculo3, bstaculo4, bstaculo5, bstaculo6;

var pontuacao=0;

var caboojogo, cabonao;
var restartaojogo, restartonao;

var pulo;
var morte;
var checanopoint;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  bstaculo1 = loadImage("obstacle1.png");
  bstaculo2 = loadImage("obstacle2.png");
  bstaculo3 = loadImage("obstacle3.png");
  bstaculo4 = loadImage("obstacle4.png");
  bstaculo5 = loadImage("obstacle5.png");
  bstaculo6 = loadImage("obstacle6.png");
  
  cabonao = loadImage("gameOver.png");
  restartonao = loadImage("restart.png");
  
  pulo = loadSound("jump.mp3");
  morte = loadSound("die.mp3");
  checanopoint = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);  
  
  trex = createSprite(50,height-100,20,50);
  trex.addAnimation("correno", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  
  solo = createSprite(width+300,height-100,2000,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = width/2;
  solo.velocityX = -4;
  
  soloinvisivel = createSprite(200,height-90,400,10);
  soloinvisivel.visible = false;
  
  grupodebstaculos= createGroup();
  grupodenuvens= createGroup();
  trex.setCollider("circle",0,0,35);
  trex.debug=false;
  
  pontuacao = 0;
  
  caboojogo=createSprite(width/2,height/2-60);
  caboojogo.addImage("cabo",cabonao);
  
  
  restartaojogo=createSprite(width/2,height/2);
  restartaojogo.addImage("restarto",restartonao);
  
  
}

function draw() {
  background("white");
  textSize(50);
  text("Pontuação: "+ pontuacao, width/2+500,height/2-350);
  
    
  if (estadoJogo===ESTADONICIO){
    solo.velocityX=-(4+pontuacao/500);
    pontuacao = pontuacao + Math.round(getFrameRate()/30);
    
    if (pontuacao>0 && pontuacao%100===0){
        checanopoint.play();
      
    }
    
    if(keyDown("space")|| touches.length>0 && trex.y >= 160) {
      trex.velocityY = -12;
      pulo.play();
      touches=[];
    }
    
    
    
    trex.velocityY = trex.velocityY + 0.8;
    
    if (solo.x < width /6){
      solo.x = solo.width/2;
    }
    
    caboojogo.visible=false;
    restartaojogo.visible=false;
    
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo 
    gerarBstaculos();
    
    if (grupodebstaculos.isTouching(trex)){
      
      trex.velocityY=-10;
      pulo.play();
      estadoJogo=ESTADOFIM;
      morte.play();
    } 
  }
  else if (estadoJogo===ESTADOFIM){
      trex.velocityX=0;
      trex.velocityY=0;
    
      solo.velocityX=0;
      trex.changeAnimation("collided",trex_colidiu);
      
    grupodebstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
      
    grupodenuvens.setVelocityXEach(0);
    
      grupodebstaculos.setVelocityXEach(0);
    
    caboojogo.visible=true;
    restartaojogo.visible=true;
    
    if (mousePressedOver(restartaojogo) || touches.length>0){
      reseta();
      touches=[];
    }
  }
  
  trex.collide(soloinvisivel);
  
  console.log(solo.x);

  drawSprites();
}

function gerarBstaculos(){
 if (frameCount % 60 === 0){
   var bstaculo = createSprite(width+5,height-110,10,40);
  bstaculo.velocityX = -(20+pontuacao/500);
   
  
   
    // //gerar bstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: bstaculo.addImage(bstaculo1);
              break;
      case 2: bstaculo.addImage(bstaculo2);
              break;
      case 3: bstaculo.addImage(bstaculo3);
              break;
      case 4: bstaculo.addImage(bstaculo4);
              break;
      case 5: bstaculo.addImage(bstaculo5);
              break;
      case 6: bstaculo.addImage(bstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    
    bstaculo.lifetime = 500;
    grupodebstaculos.add(bstaculo);
 }
}


function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width+5,height-110,40,10);
    nuvem.y = Math.round(random(100,600));
    nuvem.scale=2;
    nuvem.addImage(imagemdanuvem);
    nuvem.velocityX = -(3+pontuacao/500);
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 600;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    grupodenuvens.add(nuvem);
    
    
  }  
}

function reseta(){
  estadoJogo=ESTADONICIO;
  caboojogo.visible=false;
  restartaojogo.visible=false;
  grupodebstaculos.destroyEach();
  grupodenuvens.destroyEach();
  trex.changeAnimation("correno",trex_correndo);
  pontuacao=0;
}
