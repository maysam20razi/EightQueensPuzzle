/* 
==========================================
All Rights Reserved
All of code are prototype no clean code or for bussiness model
for self-study and fun!!
==========================================
*/

/*
==========================================
    variable
==========================================
*/
var
    POS_Col = ["hpt_525", "hpt_450", "hpt_375", "hpt_300", "hpt_225", "hpt_150", "hpt_75", "hpt_0"],
    POS_Row = ["hpl_0", "hpl_75", "hpl_150", "hpl_225", "hpl_300", "hpl_375", "hpl_450", "hpl_525"],
    N = 8,
    queenActiveInBoard = 0,
    showCommandP = false,
    showPositionP = true;
    q_location = {rowQ: -1, columnQ: -1},
    queens_8 = [q_location, q_location, q_location, q_location, q_location, q_location, q_location, q_location],
    rowQueensIndex = [ -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1],
    epoch = 0,
    fullHomeIndex = [
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false]
    ];
/*
==========================================
    board setting functions
==========================================
*/
function setupBoard() {
    let innerHtmlBoard = "", posRow = "", posCol = "";
    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 4; j++) {
            posCol = POS_Col[i];
            posRow = (i % 2 == 0) ? POS_Row[2 * j + 1] : POS_Row[2 * j];
            innerHtmlBoard = innerHtmlBoard + '<div class="boardPanelW ' + posCol + ' ' + posRow + '"></div>';
       }
    document.getElementById('board').innerHTML = innerHtmlBoard;
}
function reloadPosition() {
    document.location.reload();
}
/*
==========================================
  functions solver
==========================================
*/
const functionList = [genetic,solveRows,funnyRandom,reallyFunnyRandom], functionNames=["genetic", "graph search" ,"funny random","really funny random"];
function solvePuzzle() {
    let chooseIndex = document.getElementById('algorithm').selectedIndex;
    commandLine('let solve puzzle by '+functionNames[chooseIndex]);

    epoch = 0;
    releaseAllQueens();
    if(chooseIndex == 1)
      {
        let first = Math.floor(Math.random() * 8);
        rowQueensIndex[0] = first;
        fillSquare(first,0,0);
      }
    functionList[chooseIndex]();

}
/*
==========================================
  first solver : Graph Search [DFS or BFS]
==========================================
*/
function findIndex(colIndex, minRow) {
    let minInxed = -1;
    for (var i = minRow; i < 8; i++) {
        if (fullHomeIndex[i][colIndex] == false) {
            minInxed = i;
            break;
        }
    }
    return minInxed;
}
function nextGraphSearch() {

    let upperIndex = -1;
    for (let i = 0; i < 8; i++) {
        if (rowQueensIndex[7 - i] != -1) {
            if(rowQueensIndex[7 - i] == 7)
              {
                upperIndex = 7-i-1;
                rowQueensIndex[7 - i - 1] = rowQueensIndex[7 - i - 1] + 1;
                break;
              }
              else {
                upperIndex = 7-i;
                rowQueensIndex[7 - i ] = rowQueensIndex[7 - i] + 1;
                break;
              }
        }
    }
    for (let j = 0; j < 8; j++)
        if (j > upperIndex + 1)
            rowQueensIndex[j] = -1;
    }
function solveRows() {

    releaseAllQueens();
    epoch = epoch + 1;
    document.getElementById('epoch-count').innerText = epoch.toString();
    let intCalc
    for (var i = 0; i < 8; i++) {
        rowQueensIndex[i] = findIndex(i, Math.max(rowQueensIndex[i], 0));
        if (rowQueensIndex[i] > -1)
            {
              fillSquare(rowQueensIndex[i], i);
            }
        else
            {
              break;
            }
    }
    if (queenActiveInBoard !== 8)
    {
      graphSearchTrace(rowQueensIndex[0] + ' , '+rowQueensIndex[1] + ' , '+rowQueensIndex[2] + ' , '+rowQueensIndex[3] + ' , '+rowQueensIndex[4] + ' , '+rowQueensIndex[5] + ' , '+rowQueensIndex[6] + ' , '+rowQueensIndex[7]);
      nextGraphSearch();
      const calcTimeout = setTimeout(solveRows, 10);
    }
    else {
      graphSearchTrace(rowQueensIndex[0] + ' , '+rowQueensIndex[1] + ' , '+rowQueensIndex[2] + ' , '+rowQueensIndex[3] + ' , '+rowQueensIndex[4] + ' , '+rowQueensIndex[5] + ' , '+rowQueensIndex[6] + ' , '+rowQueensIndex[7]);
      clearTimeout(calcTimeout);
    }

}
/*
==========================================
  second solver : hillClimbing
==========================================
*/
function hillClimbing(){

}
function test(){
funnyRandom();
}
/*
==========================================
  third solver : Genetic algorithm
==========================================
*/
const population = 10 , typeSelection = {'Deterministic':0,'Tournament':1,'Uniform':2,'Rank':3,'RouletteWheel':4};
var loopSearch = 0;
function genetic(){
// begin state
loopSearch = 0;
releaseAllQueens();
let firstPopParents=[];
for (let i =0; i< population; i++){
  firstPopParents[i] = randomGenerateParent();
  }
  checkEndSearch(firstPopParents);
}
function againSearch(populationGenerate){
  let child = selectParent(populationGenerate, typeSelection.Deterministic).slice();
  checkEndSearch(child);
}
function selectParent(populationGenerate,typeSelection ){//default elitism !!
  let child = [], ranks =findBestToWrose(populationGenerate);
  switch (typeSelection) {
    case 0 :
      let countArry = populationGenerate.length;
	  let random = Math.floor(Math.random() * 2);
    child[0]= Mutation(crossover(populationGenerate[ranks[0]],populationGenerate[ranks[1]])[0].slice());
    child[1]= Mutation(crossover(populationGenerate[ranks[0]],populationGenerate[ranks[1]])[1].slice());
	  child[2]= Mutation(crossover(populationGenerate[ranks[0]],populationGenerate[ranks[2]])[0].slice());
	  child[3]= Mutation(crossover(populationGenerate[ranks[0]],populationGenerate[ranks[2]])[1].slice());
	  child[4]= Mutation(crossover(populationGenerate[ranks[1]],populationGenerate[ranks[2]])[0].slice());
	  child[5]= Mutation(crossover(populationGenerate[ranks[1]],populationGenerate[ranks[2]])[1].slice());
	  child[6]= Mutation(crossover(populationGenerate[ranks[2]],populationGenerate[ranks[3]])[0].slice());
	  child[7]= Mutation(crossover(populationGenerate[ranks[2]],populationGenerate[ranks[3]])[1].slice());
	  child[8]= Mutation(crossover(populationGenerate[ranks[1]],populationGenerate[ranks[3]])[0].slice());
	  child[9]= populationGenerate[ranks[0]].slice();

    break;
    case typeSelection.Tournament :

    break;
    case typeSelection.Uniform :

    break;
    case typeSelection.Rank :

    break;
    case typeSelection.RouletteWheel :

    break;
  }
  return child.slice();
}
function findBestToWrose(populationParent){
  let grades =[],temp=[];
    for(let i =0 ; i<populationParent.length ;i++)
	{grades[i] = fitness(populationParent[i]) + 0.05*(i+1); temp[i] =grades[i];}

  temp.sort(function(a, b){return a - b});
  let ranks = [];
    for(let i = 0;i<populationParent.length ;i++)
	{ranks[i] = grades.indexOf(temp[i]);}//commandLine("rank "+i+ " g= "+grades[i] +" index="+ grades.indexOf(temp[i])); }

  return ranks;
}
function crossover(parentOne,parentTwo){//l , p be careful
  //commandLine("parant 0 = "+ parentOne + " parant 1 = "+ parentTwo);
  let
  child = [],temp = [], randomStartOnePart = Math.floor(Math.random() * 4);
  child[0] = parentOne ;child[1] =parentTwo;

  for(let i =0;i<4;i++){
	 temp[i]= child[0][i+randomStartOnePart];
	 child[0][i+randomStartOnePart] = parentTwo[i+randomStartOnePart];
	 child[1][i+randomStartOnePart] = temp[i];
  }
  //commandLine("child 0 = "+ child[0] + " child 1 = "+ child[1] + " random change index = "+randomStartOnePart);
  return child;
}
function Mutation(oneParent){
  let selectIndexToMutate = Math.floor(Math.random() * 8),child = oneParent;
  child[selectIndexToMutate] = Math.floor(Math.random() * 8) ;

  return child;
}
function fitness(state){
  /* count clash queens*/
  let countClash = 0 ;
  for (let i = 0 ; i<8 ;i++)
    for(let j = 1 ; j<8 ;j++){
      if((state[i] == state[j] && i<j))
        countClash ++;
      if(state[i]+j == state[i+j]  || state[i] - j ==  state[i+j])
        countClash ++;
  }
  //commandLine("state = "+state+ " fitness ="+ countClash);
  return countClash ;
}
function randomGenerateParent() {
  let a=[];
  for (var i = 0; i < 8; i++)
    a[i] = Math.floor(Math.random() * 8);
  return a;
}
function checkEndSearch(currentPopulation){
let fit = 0;
let findPos = false ;
for(let i = 0;i<population ;i++)
  if(fitness(currentPopulation[i]) == 0 || loopSearch > 1000)
    {fillAllSquare(currentPopulation[i]) ; findPos =true;commandLine("Find " + currentPopulation[i] + ' Loop = '+loopSearch  );break;}
  if(!findPos)
    {loopSearch++;againSearch(currentPopulation);document.getElementById("epoch-count").innerText =loopSearch;}
}
function fillAllSquare(state){
  for(let i =0;i<8;i++){
    showFillHomes(state[i],i);
    rowQueensIndex[i] = state[i];
  }
}

/*
==========================================
  forth solver : Funny random 
==========================================
*/
function funnyRandom(doesReallyFunnyRandomActive = false){
  loopSearch=0;
  releaseAllQueens();
  endLoopFind(doesReallyFunnyRandomActive);
}
function reallyFunnyRandom(){
 funnyRandom(true);
}
function fullRandom(){
	
	 let a =[];
  for(let i=0;i<8;i++)
  a[i] = Math.floor(Math.random() * 8);
	
  return a;
}
function randomNotRepeatition(){
  let random = [0,1,2,3,4,5,6,7],
  a =[],b=0;
  for(let i=0;i<8;i++){
    b = Math.floor(Math.random() * random.length);
    a[i] =random[b];
    random.splice(b,1);
  }
return a;
}
function endLoopFind(doesReallyFunnyRandomActive){
	
  let state = (doesReallyFunnyRandomActive)? fullRandom():randomNotRepeatition(),
  fit = fitness(state) ;

  if(fit != 0 && loopSearch <5000)
  {
    loopSearch++;
    document.getElementById("epoch-count").innerText =loopSearch;
    endLoopFind(doesReallyFunnyRandomActive);
  }
  else {
    fillAllSquare(state);
    if(fit == 0) {
      commandLine('success! and loop = ' + loopSearch);

    }
    else {
      commandLine('can not find and loop search = ' + loopSearch);
    }
  }
}
/*
==========================================
  fill and release home function
==========================================
*/
function fillSquare(indexRow, IndexCol) {

    queens_8[IndexCol].rowQ = indexRow;
    queens_8[IndexCol].columnQ = IndexCol;
    queenActiveInBoard = queenActiveInBoard + 1;
    for (var i = 0; i < 8; i++) {
        fullHomeIndex[indexRow][i] = true;
        fullHomeIndex[i][IndexCol] = true;
        if (indexRow - i > -1 && IndexCol - i > -1)
            fullHomeIndex[indexRow - i][IndexCol - i] = true;
        if (indexRow + i < 8 && IndexCol + i < 8)
            fullHomeIndex[indexRow + i][IndexCol + i] = true;
        if (indexRow - i > -1 && IndexCol + i < 8)
            fullHomeIndex[indexRow - i][IndexCol + i] = true;
        if (indexRow + i < 8 && IndexCol - i > -1)
            fullHomeIndex[indexRow + i][IndexCol - i] = true;
    }
    showFillHomes(indexRow, IndexCol);
    document.getElementById('activeQueenCount').innerText = queenActiveInBoard.toString();
}
function release(indexQueen) {
    document.getElementById('image-queen').innerHTML = "";
    document.getElementById('point').innerHTML = "";
    queenActiveInBoard = 0;
    queens_8[indexQueen].rowQ = -1;
    queens_8[indexQueen].columnQ = -1;

    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++)
            fullHomeIndex[i][j] = false;

    for (var k = 0; k < 8; k++)
        if (queens_8[k].rowQ != -1) {
            queenActiveInBoard = queenActiveInBoard + 1;
            fillSquare(queens_8[k].rowQ, queens_8[k].columnQ);
        }
}
function releaseAllQueens() {
    for (i = 0; i < 8; i++)
        release(i);
}
function showFillHomes(indexRow, IndexCol) {

    let posCol = POS_Col[indexRow];
    let posRow = POS_Row[IndexCol];
    let htmlImg = document.getElementById('image-queen').innerHTML + '<img src="img/Whith_chess_queen_clip_art_20443.png" class="imgQueen ' + posCol + ' ' + posRow + '">';
    document.getElementById('image-queen').innerHTML = htmlImg;
    if (document.getElementById('red-pointer').checked == true) {

        let htmlPoint = "", posR = "", posC = "";
        for (var i = 0; i < 8; i++)
            for (var j = 0; j < 8; j++) {
                posR = POS_Row[j];
                posC = POS_Col[i];
                if (fullHomeIndex[i][j])
                    htmlPoint = htmlPoint + '<a class="fullHome ' + posR + ' ' + posC + '"></a>';
            }
        document.getElementById('point').innerHTML = htmlPoint;
    }
}

/*
==========================================
  Debug System trace
==========================================
*/
function commandLine(newLine) {
    let textOld = document.getElementById('gs-debug').innerHTML;
    document.getElementById('gs-debug').innerHTML = textOld + "<a>-> " + newLine + "</a><br>";
}
function showCommandPanel() {
    if (showCommandP) {
        commandLine('Hide command');
        document.getElementsByClassName('info-line')[0].style.visibility = 'hidden';
        document.getElementById('b-show').innerText = "Show Command Help";
        showCommandP = false;
    } else {
        commandLine('Show command');
        document.getElementsByClassName('info-line')[0].style.visibility = 'visible';
        document.getElementById('b-show').innerText = "Hide Command Help";
        showCommandP = true;
    }
}
function showIndexQueen() {
    for (var i = 0; i < 8; i++) {
        commandLine('queen index ' + i.toString() + " = " + rowQueensIndex[i]);
    }
}
function showState() {
    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++)
            commandLine('[' + i.toString() + '][' + j.toString() + '] = ' + fullHomeIndex[i][j].toString());
}
function graphSearchTrace(newLine) {
    let textOld = document.getElementById('gs-debug').innerHTML;
    document.getElementById('gs-debug').innerHTML = textOld + "<a>-> " + newLine + "</a><br>";
}
function showPosition() {
  if (showPositionP) {
      commandLine('Hide position');
      document.getElementsByClassName('graphSearch')[0].style.visibility = 'hidden';
      document.getElementById('b-position').innerText = "Show position queens search";
      showPositionP = false;
  } else {
      commandLine('Show position');
      document.getElementsByClassName('graphSearch')[0].style.visibility = 'visible';
      document.getElementById('b-position').innerText = "Hide position queens search";
      showPositionP = true;
  }
}
/*
==========================================
  100*100 Homes solver : Genetic algorithm
==========================================
*/
const populationOH = 50 , typeSelectionOH = {'Deterministic':0,'Tournament':1,'Uniform':2,'Rank':3,'RouletteWheel':4},BoardSize = 100;
var loopSearchOH = 0;
var loopTotal = 0;
var lastPops = [];
function geneticOH(){
// begin state
if(loopTotal == 0)
for (let i =0; i< populationOH; i++){
	
  lastPops[i] = randomGenerateParentOH();
  }
  checkEndSearchOH(lastPops);
}
function againSearchOH(){
   lastPops = selectParentOH(lastPops, typeSelectionOH.Deterministic).slice();
  checkEndSearchOH(lastPops);
}
function selectParentOH(populationGenerateOH,typeSelectionOH ){//default elitism !!

  let childOH = [], ranksOH =findBestToWroseOH(populationGenerateOH);
  switch (typeSelectionOH) {
    case 0 :
		for(let i=0;i<5;i++)
			childOH[i]= populationGenerateOH[ranksOH[i]];//best 0,1,2,3 =>4
		for (let i=5;i<13;i++) {//5,6,7,8,9,10,11,12, 13,14,15,16,17,18,19,20 20-4 = 16
			
			childOH[i]= crossoverOH(populationGenerateOH[ranksOH[i-5]],populationGenerateOH[ranksOH[i-4]],i)[0];
			childOH[i+8]= crossoverOH(populationGenerateOH[ranksOH[i-5]],populationGenerateOH[ranksOH[i-4]],i+8)[1];
		}
		for (let i = 21 ; i<36 ; i++){
		
		
		let c = crossoverOH(populationGenerateOH[ranksOH[i-21]],populationGenerateOH[ranksOH[i-19]],i)[0];
		let d = crossoverOH(populationGenerateOH[ranksOH[i-21]],populationGenerateOH[ranksOH[i-19]],i)[1];
		
		childOH[i]= 	MutationOH(c);
		childOH[i+14]=  MutationOH(d);
		}
		
    break;
    case typeSelectionOH.Tournament :

    break;
    case typeSelectionOH.Uniform :

    break;
    case typeSelectionOH.Rank :

    break;
    case typeSelectionOH.RouletteWheel :

    break;
  }
  return childOH.slice();
}
function findBestToWroseOH(populationParentOH){
  let gradesOH =[],tempOH=[];
    for(let i =0 ; i < populationOH ;i++)
	{gradesOH[i] = fitnessOH(populationParentOH[i]) + 0.005*(i+1); tempOH[i] =gradesOH[i];}

  tempOH.sort(function(a, b){return a - b});
  let ranksOH = [];
    for(let i = 0;i<populationParentOH.length ;i++)
	{ranksOH[i] = gradesOH.indexOf(tempOH[i]);}//commandLine("rank "+i+ " g= "+grades[i] +" index="+ grades.indexOf(temp[i])); }

  return ranksOH;
}
function crossoverOH(parentOneOH,parentTwoOH,indexSend = 0){//3 point lenght =

  let pointChange = [0,17,34],len = 8;
  for(let i=0;i<3;i++)
	pointChange[i] = Math.floor(Math.random() * (17*i+8));

  let childOH = [], cTemp = [];
	childOH[0]=parentOneOH;
	childOH[1]=parentTwoOH;
	for(let i=0;i<BoardSize;i++)
		cTemp[i] = parentOneOH[i];
 
  for(let i = 0 ; i<3 ; i++)
	  for(let j = 0;j<len ; j++){
		
		childOH[0][j+pointChange[i]] = parentTwoOH[j+pointChange[i]];
		childOH[1][j+pointChange[i]] = cTemp[j+pointChange[i]];
	  }
  return childOH;
}
function MutationOH(oneParentOH){ //5 points mutate 
	let selectIndexToMutateOH=0 ,childOH = oneParentOH;
	for(i = 0 ;i<5 ;i++){
		selectIndexToMutateOH = Math.floor(Math.random() * ((i+1)*10-1));
		childOH[selectIndexToMutateOH] = Math.floor(Math.random() * BoardSize) ;
	}
	
  return childOH;
}
function fitnessOH(stateOH){
	
  /* count clash queens*/
  let countClashOH = 0 ;
  for (let i = 0 ; i<BoardSize ;i++)
    for(let j = 1 ; j<BoardSize ;j++){
      if((stateOH[i] == stateOH[j] && i<j))
        countClashOH ++;
      if(stateOH[i]+j == stateOH[i+j]  || stateOH[i] - j ==  stateOH[i+j])
        countClashOH ++;
  }
  
  commandLine(" fitness ="+ countClashOH);
  return countClashOH ;
}
function randomGenerateParentOH() {
  let a=[];
  for (var i = 0; i < BoardSize; i++)
    a[i] = Math.floor(Math.random() * BoardSize);
  return a;
  
}
function checkEndSearchOH(currentPopulationOH){
let fit = 0;
let findPos = false ;
let fitAll = 0;
let fitMin=10000;
for(let i = 0;i<populationOH;i++){
	{fit = fitnessOH(currentPopulationOH[i]);fitAll =fitAll+fit;fitMin = Math.min(fitMin ,fit );  }
  if( fit== 0 )
    { 
		
		commandLine("Find " + currentPopulationOH[i] + ' Loop = '+loopTotal +' fitness = ' +fit);break;			
	}
  
}
		loopTotal++;
		loopSearchOH++;
		document.getElementById('epoch-count').innerText = loopTotal.toString();
		(loopTotal % 150 == 0 )? commandLine(' finess = ' + fitAll + " min fit = "+ fitMin) :function(){};
		setTimeout(againSearchOH,10);
}
