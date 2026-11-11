/* Infiltración: original standalone 2D game engine, no external dependencies. */
(function(global){'use strict';
const MAP=['###############','#S..#....#...K#','#...#....#....#','#...#.........#','#........#....#','#.###..#####..#','#.....#.......#','#.....#.......#','#E....#....T..#','###############'];
const CONFIG={Fácil:{seconds:180,alarm:4,turn:2.5,download:4,cameras:2},Medio:{seconds:150,alarm:3,turn:1.8,download:5,cameras:3},Difícil:{seconds:120,alarm:2,turn:1.25,download:6,cameras:3}};
const CAMERAS=[{x:7,y:2,phase:0},{x:12,y:6,phase:1},{x:3,y:7,phase:2}];
const DIRS=[[1,0],[0,1],[-1,0],[0,-1]];
class Game{
 constructor(level){if(!CONFIG[level])throw Error('Nivel desconocido');this.level=level;this.cfg=CONFIG[level];this.x=1;this.y=1;this.time=0;this.alert=0;this.key=false;this.data=false;this.download=0;this.downloading=false;this.result='playing';this.message='Encuentra la llave amarilla.';}
 blocked(x,y){return y<0||y>=MAP.length||x<0||x>=MAP[0].length||MAP[y][x]==='#'}
 directions(c){return DIRS[(Math.floor(this.time/this.cfg.turn)+c.phase)%4]}
 sees(c,x=this.x,y=this.y){let [dx,dy]=this.directions(c);for(let i=1;i<=5;i++){let a=c.x+i*dx,b=c.y+i*dy;if(this.blocked(a,b))break;if(x===a&&y===b)return true}return x===c.x&&y===c.y}
 move(dx,dy){if(this.result!=='playing'||Math.abs(dx)+Math.abs(dy)!==1)return false;const x=this.x+dx,y=this.y+dy;if(this.blocked(x,y))return false;this.x=x;this.y=y;if(this.downloading){this.downloading=false;this.download=0;this.message='Descarga interrumpida: vuelve al terminal.'}if(MAP[y][x]==='E'&&this.data){this.result='won';this.message='¡Datos extraídos!';}return true}
 interact(){if(this.result!=='playing')return;if(MAP[this.y][this.x]==='K'&&!this.key){this.key=true;this.message='Llave conseguida. Ve al terminal azul.';return}if(MAP[this.y][this.x]==='T'){if(!this.key){this.message='Necesitas la llave amarilla.';return}if(this.data){this.message='Lleva los datos a extracción.';return}this.downloading=true;this.message='Descargando... No te muevas.';return}if(MAP[this.y][this.x]==='E'&&!this.data){this.message='Necesitas los datos para extraer.';return}this.message='Acércate a la llave o al terminal y pulsa actuar.';}
 step(dt){if(this.result!=='playing'||!Number.isFinite(dt)||dt<=0)return;this.time+=dt;if(this.time>=this.cfg.seconds){this.result='lost';this.message='Se acabó el tiempo.';return}let seen=CAMERAS.slice(0,this.cfg.cameras).some(c=>this.sees(c));this.alert=Math.max(0,Math.min(this.cfg.alarm,this.alert+(seen?dt:-dt*0.4)));if(this.alert>=this.cfg.alarm){this.result='lost';this.message='La alarma te ha detectado.';return}if(this.downloading){this.download+=dt;if(this.download>=this.cfg.download){this.download=this.cfg.download;this.downloading=false;this.data=true;this.message='¡Datos descargados! Ve a la extracción verde.';if(MAP[this.y][this.x]==='E')this.result='won'}}}
}
global.Infiltration={Game,MAP,CONFIG,CAMERAS,DIRS};
})(globalThis);
