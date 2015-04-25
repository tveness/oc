var timer;
var activeList=[];
var solvedRows=[];
var row=0;
var lives=3;
var clueListClean=[];
var clueListActual=[];
var nums=[];
var timeLeft=151;
var timer;
var points=0;

var xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","data/walls.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;
walls=xmlDoc.getElementsByTagName("wall");

var gameList=document.getElementById("gameList");

for(var k=0;k<walls.length;k++){
	var wallnum=walls[k].getAttribute("wallNo");
	var gameType=walls[k].getAttribute("type");
	var cBy=walls[k].getAttribute("createdBy");
	var title="";
	if(gameType=="playalong"){
		title=cBy;
	}
	else{
		title=cBy+" "+wallnum;
	}
	gameList.innerHTML+="<option id='"+wallnum+"'>"+title+"</option>";
}





function freezeBox(){
}

function win(){
		points==10;
		clearInterval(timer);
}
function blank(){
	console.log("Pausing");
}



function solveRow(rowtoSolve){
	activeList=[];
	var ntoAdd=".t"+parseInt(rowtoSolve)+parseInt(0);
	var toAdd = document.querySelectorAll(ntoAdd)[0];
	var curId=toAdd.id;
	if(rowtoSolve<3 ){
		for(var l=1;l<5;l++){
			var newName=curId.charAt(0)+parseInt(l);
			console.log("Adding "+newName);
			tileClicked(document.getElementById(newName));
		}
	}
	var aname="l"+curId.charAt(0);
	var aBox=document.getElementById("l"+curId.charAt(0));
	aBox.contentEditable=false;
	aBox.removeEventListener("click",wipe);
	aBox.innerHTML=data["ideal"][aname];

}






function solveRemainder(){
	var finalPoints=points;
	for(var k=0;k<4;k++){
		console.log("Solving row "+k);
		solveRow(k);
		}
	points=finalPoints;
	updatePoints();
		clearInterval(timer);
	var gu=document.getElementById("giveup");
	gu.removeEventListener("click",solveRemainder);
}





function checkme(){
	var nm=this.id;
	var names=data["links"][nm].split(",");
	for(var k=0;k<names.length;k++){
		names[k]="*"+names[k]+"*";
		names[k]=names[k].toUpperCase();
		if(names[k].indexOf("*"+this.innerHTML.toUpperCase()+"*")   >-1){
		this.contentEditable=false;
		this.innerHTML+="&#10003;";
			points++;
			if(points==8){
				win();
			}
			updatePoints();

		}
	}
}


function wipe(){
	this.removeEventListener("click",wipe);
	this.innerHTML="";
}



function updateTime(){

	var ti=document.getElementById("time");
	timeLeft--;
	var secs="";
	secs=parseInt(timeLeft%60).toString();
	if(secs.length<2){
		secs="0"+secs;
	}

	var timeInWords=parseInt(timeLeft/60)+":"+secs;

	var frac=parseInt(255*(1-timeLeft/150));
	var bar='<div style="background-color:rgba('+frac+',0,0,0.8);text-align:center">'+timeInWords+'</div>';
	ti.innerHTML=bar;

	if(timeLeft==0){
		clearInterval(timer);
		endGame();
	}
	if(timeLeft<90){

	var gu=document.getElementById("giveup");
	gu.style.visibility="visible";
	}

}

function updatePoints(){
	var ti=document.getElementById("points");
	ti.innerHTML="Points: "+parseInt(points);
}



function updateLives(number){
	var li=document.getElementById("lives");
	var lifeString="";
	for(var k=0;k<number;++k){
		lifeString+="&hearts;";
	}
	li.innerHTML=lifeString;
}

function getCo(a){
	for(var x=0;x<5;x++){
		for(var y=0;y<5;y++){
			var cName="t"+parseInt(x)+parseInt(y);
			if(a.className.split(' ').indexOf(cName)>=0){
				return cName;
			}
		}
	}
}





function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



function sortCorrect(){
	for(var k=0;k<activeList.length;k++){
//		document.getElementById(activeList[k]).innerHTML="SOLVED";
		document.getElementById(activeList[k]).classList.remove("redden");
		var blueName="bluen"+parseInt(row);
		document.getElementById(activeList[k]).classList.add(blueName);
		//Now must swap two
		
		var f = document.getElementById(activeList[k]);
		var curBox=".t"+parseInt(row)+parseInt(k);
		var curBox2="t"+parseInt(row)+parseInt(k);
		var toBox2=getCo(f);
		var toBox="."+toBox2;
		var g = document.querySelectorAll(curBox)[0];
		console.log("Switching: "+toBox2+" and "+curBox2);
	
		f.classList.remove(toBox2);
		f.classList.add(curBox2);

		g.classList.remove(curBox2);
		g.classList.add(toBox2);
		
	

		
//		f.innerHTML="TOSWAP";


//		e.innerHTML="TOSWAP2";
	}

	var ansBox = document.querySelectorAll(".ans-cell")[row];

	var ansStr= "l" + activeList[0].charAt(0);
//	ansBox.innerHTML=(data["links"])[ansStr];
	ansBox.contentEditable=true;
	ansBox.innerHTML="Link";
	ansBox.id=ansStr;
	ansBox.classList.add("ab0");
	ansBox.addEventListener("keyup",checkme);

	activeList=[];
	row+=1;

	if(row==3){
		for(var k=0;k<4;k++){
			var ntoAdd=".t"+parseInt(row)+parseInt(k);
			var toAdd = document.querySelectorAll(ntoAdd)[0];
			activeList.push(toAdd.id);
		}
		sortCorrect();
	}


	points++;
	updatePoints();



}

function check(inList){
	var result=0;
	for(var l =0;l<inList.length;l++){
		if(inList[l].charAt(0) == inList[0].charAt(0) ){
			result++;
		}
	}
	return result;
}
		


function tileClicked(a){
	if(!a.solved){

		if(!a.active){
			a.active=1;
			a.classList.add("redden");
			a.classList.remove("unredden");
			activeList.push(a.id);
		}
		else{
			a.active=0;
			a.classList.add("unredden");
			a.classList.remove("redden");
			var index=activeList.indexOf(a.id)
				if(index>-1){
					activeList.splice(index,1);
				}
		}

		if(activeList.length>3){
			if(check(activeList)==activeList.length){
					sortCorrect();

			}
			else{
				for(var k=0;k<activeList.length;k++){
					document.getElementById(activeList[k]).active=0;
					document.getElementById(activeList[k]).classList.add("unredden");
					document.getElementById(activeList[k]).classList.remove("redden");
				}
				if(row>1){
					lives--;
					updateLives(lives);
				}
				if(lives==0){
					endGame();
				}

				activeList=[]
			}
			

		}

	}
}

function getGridSize(){
	var allGridCells=document.querySelectorAll(".grid-cell");
	return allGridCells.length;
}

var data= JSON.parse('{ "clues":{"a1": 	"a1e", "a2":   "a2e", "a3":   "a3", "a4":   "a4", "b1": 	"b1", "b2": 	"b2", "b3": 	"b3", "b4": 	"b4", "c1": 	"c1", "c2": 	"c2", "c3": 	"c3", "c4": 	"c4", "d1": 	"d1", "d2": 	"d2", "d3": 	"d3", "d4": 	"d4"}, "links":{ "l1":   "l1", "l2":   "l2", "l3":   "l3", "l4":   "l4"} }' );


var data= JSON.parse('{ "clues":{"a1": 	"swan", "a2":   "rose", "a3":   "national", "a4":   "globe", "b1": 	"theft", "b2": 	"total", "b3": 	"piano", "b4": 	"master", "c1": 	"blackwood", "c2": 	"trump", "c3": 	"kibitzer", "c4": 	"slam", "d1": 	"carp", "d2": 	"bull", "d3": 	"bid", "d4": 	"tick"}, "links":{ "la":   "Theatres", "lb":   "Grand", "lc":   "Bridge", "ld":   "___et"} }' );
var data= JSON.parse('{ "clues":{	"a1": 	"bilbo", "a2":   "foil", "a3":   "rapier", "a4":   "epee", "b1": 	"buck", "b2": 	"saw",	"b3": 	"sweet", "b4": 	"sabre", "c1": 	"washington", "c2": 	"hamilton", "c3": 	"jackson", "c4": 	"franklin", "d1": 	"bill", "d2": 	"shadowfax", "d3": 	"shelob", "d4": 	"watcher"}, "links":{	"la":   "SWORDS,blades", "lb":   "tooth", "lc":   "US notes", "ld":   "LOTR,animals,lord of the rings"}, "ideal": {"la": "Types of sword", "lb": "_____ tooth", "lc": "People featured on US bank notes", "ld": "Animals from Lord of the Rings" }}' );
var data= JSON.parse('{ "clues":{	"a1": 	"eye", "a2":   "drain", "a3":   "perfect", "a4":   "teacups", "b1": 	"redder", "b2": 	"sexes",	"b3": 	"naan", "b4": 	"level", "c1": 	"ciabatta", "c2": 	"crumpet", "c3": 	"matzo", "c4": 	"vienna", "d1": 	"paris", "d2": 	"versailles", "d3": 	"lisbon", "d4": 	"rome"}, "links":{	"la":   "storm", "lb":   "palindromes,palindromic", "lc":   "bread,dough", "ld":   "treaty,treaties"}, "ideal": {"la": "Relating to storms", "lb": "Palindromic words", "lc": "Types of bread", "ld": "Treaty of _____" }}' );



function update(){
	nums=shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
	for(var k in data.clues){
		clueListClean.push(k);
	}

	for(var i=0;i<clueListClean.length;i++){
		clueListActual.push(clueListClean[ nums[i] ]);
	}

	var c=document.getElementById("container");
	var allGridCells=document.querySelectorAll(".grid-cell");
	c.innerHTML="";
	var count=0;
	for(var k in data.clues){
		c.innerHTML+="<div class='tile' id='"+k+"' onClick='tileClicked(this);'>"+data.clues[k]+"</div>";
		var d =document.getElementById(k);
		d.style.position="absolute";
		//var e = allGridCells[nums[count]];
		var e = allGridCells[0];
		d.style.left=e.getBoundingClientRect().left;
		d.style.top=e.getBoundingClientRect().top;
		var toadd="t"+parseInt(nums[count]/4) + parseInt(nums[count]%4);
		console.log(toadd);
		d.classList.add(toadd);
		count=count+1;

	}
	c.onclick=null;

	var li=document.getElementById("lives");

	updateLives(lives);
	timer = setInterval(function(){ updateTime() }, 1000);
	updateTime();
	updatePoints();

	var ansCells=document.querySelectorAll(".ans-cell");
	for(var k=0;k<ansCells.length;k++){
		ansCells[k].addEventListener("click",wipe);
	}
	var gu=document.getElementById("giveup");
	gu.style.visibility="hidden";
	gu.innerHTML="Give up";
	gu.classList.add("giveup");
	gu.addEventListener("click",solveRemainder);

}
var cont=document.getElementById("container");
cont.innerHTML="Click to begin";
