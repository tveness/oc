
var activeList=[];
var row=0;
var clueListClean=[];
var clueListActual=[];
var nums=[];




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



function solve(){
	for(var k=0;k<activeList.length;k++){
		document.getElementById(activeList[k]).innerHTML="SOLVED";
		document.getElementById(activeList[k]).classList.remove("redden");
		document.getElementById(activeList[k]).classList.add("bluen");
		//Now must swap two
		
		var f = document.getElementById(activeList[k]);
//		f.innerHTML="TOSWAP";
		var allGs = document.querySelectorAll(".grid-cell");
		var e=allGs[k];


//		e.innerHTML="TOSWAP2";
		var dx=parseInt(e.getBoundingClientRect().left) - parseInt(f.style.left);
		var dy=parseInt(e.getBoundingClientRect().top) - parseInt(f.style.top);


		f.style.transform="translate("+dx+"px,"+dy+"px)";
	}

	

	activeList=[];
	row+=1;
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
					solve();

			}
			else{
				for(var k=0;k<activeList.length;k++){
					document.getElementById(activeList[k]).active=0;
					document.getElementById(activeList[k]).classList.add("unredden");
					document.getElementById(activeList[k]).classList.remove("redden");
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
	var count=0;
	for(var k in data.clues){
		c.innerHTML+="<div class='tile' id='"+k+"' onClick='tileClicked(this);'>"+data.clues[k]+"</div>";
		var d =document.getElementById(k);
		d.style.position="absolute";
		var e = allGridCells[nums[count]];
		d.style.left=parseInt(e.getBoundingClientRect().left) + 'px';
		d.style.top=parseInt(e.getBoundingClientRect().top) + 'px';
		count=count+1;

	}

}
