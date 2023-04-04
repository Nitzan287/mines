const row_num=10;
const col_num=8;
const totalMinesNumber=10;
var numOfReveals=0;
var minesLeftToGuess=0;
var moves=0;
var board=[];

StartNewGame();

function StartNewGame(){
    numOfReveals=0;
    minesLeftToGuess=0;
    moves=0;
    board=[];

    createBoard();
    console.log(board);
    setMinesGlobalLimit();
    showBoard();
    showMinesLeft();
    document.getElementById("WIN").style.display="none";
    document.getElementById("LOST").style.display="none";
    secPassed=0;
    showTime();
}
function gameFinishedWithWIN(){
    document.getElementById("WIN").style.display="block";
    showBoard(true);
    stopTiming();
    addScroe(secPassed);
}
function gameFinishedWithLost(){
    document.getElementById("LOST").style.display="block";
    showBoard(true,true);
    stopTiming();
    if(AmIGoodEnough(secPassed)){
        document.getElementById("getName").style.display="block";
    }
}
function showBoard(isGameFinished=false,showMines=false){
    console.log(`showBoard: isGameFinished=${isGameFinished}`);
    var str="";
    str += "<table>";
    for(let row=0;row<row_num;row++){
        str += "<tr>";
        for(let col=0;col<col_num;col++){
            let cls="";
            if(showMines){
                if(board[row][col].mine){
                    cls="class='mine'";
                }
            }
            if(board[row][col].isSuspected){
                cls="class='suspected'";
            }
            str += `<td`;
            str += ` id='d_${row}_${col}' `;
            str += ` ${cls}`;
            if(!isGameFinished){
                str += ` onclick=pressCell(${row},${col})`;
                str += ` oncontextmenu='return suspectCell(${row},${col});'`;
                // str += ` oncontextmenu='suspectCell(${row},${col});return false;'`;
            }
            str += `>`;
            if(board[row][col].pressed){
                str+= board[row][col].nbr;//calcNbr(row,col);
            }
            str += "</td>";
        }
        str += "</tr>";
    }
    str += "</table>";
    if(isGameFinished){
        str+="<button onclick='StartNewGame()'>start new game</button>";
    }
    document.getElementById("mainBoard").innerHTML=str;     
}
function addMove(){
    moves++;
    showMovesCount();
}
function showMovesCount(){
    document.getElementById("currMoves").innerHTML = "Moves: "+moves;     
}
function aMineWasGuessed(){
    minesLeftToGuess--;
    showMinesLeft();
}
function aMineWasUnGuessed(){
    minesLeftToGuess++;
    showMinesLeft();
}
function showMinesLeft(){
    document.getElementById("MinesLeft").innerHTML = "Left: "+minesLeftToGuess;     
}
/*
קליק ימני מסמן דגל בתא המוקלק
*/
 function suspectCell(r,c){
    if(!board[r][c].pressed){
        addMove();
        // board[r][c].isSuspected=!board[r][c].isSuspected;
        if(!board[r][c].isSuspected){
            board[r][c].isSuspected=true;
            aMineWasGuessed();
        } else {
            board[r][c].isSuspected=false;
            aMineWasUnGuessed();
        }
    }
    showBoard();
    return false;
 }
function didIwon(){
    // let tot=12;
    let tot=row_num*col_num;
    if(numOfReveals + totalMinesNumber == tot){
        return true;
    }
    return false;
}
 /*
 הצג את כמות המוקשים מסביב לתא רק אחרי שלחצת על התא
 */
 function pressCell(r,c,CountMove=true){
    if(board[r][c].mine){
        gameFinishedWithLost();
    } else {
        board[r][c].nbr=calcNbr(r,c);
        board[r][c].pressed=true;
        board[r][c].isSuspected=false;
        if(board[r][c].nbr == 0){
            revealNeighbors(r,c);
        }
        numOfReveals++;
        if(CountMove){
            addMove();
        }
        if(didIwon()){
            gameFinishedWithWIN();
        } else {
            showBoard();
        }
    }
    if(numOfReveals==1){
        startTimimg();
    }
 }
function revealNeighbors(r,c){
    var min_r=Math.max(0,r-1);          //(r==0)?0:r-1;
    var max_r=Math.min(r+1,row_num-1);  // (r==row_num-1)?row_num-1:r+1;
    var min_c=Math.max(0,c-1);          //(c==0)?0:c-1;
    var max_c=Math.min(c+1,col_num-1);  // (c==col_num-1)?col_num-1:c+1;

    for(let rr=min_r;rr<=max_r;rr++){
        for(let cc=min_c;cc<=max_c;cc++){
            if(!board[rr][cc].pressed){
                pressCell(rr,cc,false);
            }
        }
    }
}
function calcNbr(r,c){
console.log("calcNbr");
    var cnt=0;
    var min_r=Math.max(0,r-1);          //(r==0)?0:r-1;
    var max_r=Math.min(r+1,row_num-1);  // (r==row_num-1)?row_num-1:r+1;
    var min_c=Math.max(0,c-1);          //(c==0)?0:c-1;
    var max_c=Math.min(c+1,col_num-1);  // (c==col_num-1)?col_num-1:c+1;

    for(let rr=min_r;rr<=max_r;rr++){
        for(let cc=min_c;cc<=max_c;cc++){
            if(board[rr][cc].mine){
                cnt++;
            }
        }
    }
    if(board[r][c].mine){
        cnt--;
    }
    return cnt;
}
function createBoard(){
    for(let row=0;row<row_num;row++){
        board[row]=[];
        for(let col=0;col<col_num;col++){
            board[row][col]={  "mine":false,
                                "p ressed":false,
                                "nbr":0,
                                "isSuspected":false};
        }
    }
}
function setMinesGlobalLimit(){
    var row,col;
    for(let k=0;k<totalMinesNumber;k++){
        do{
            row=Math.floor(Math.random() * row_num);
            col=Math.floor(Math.random() * col_num);
        }while(board[row][col].mine);
        board[row][col].mine=true;
        minesLeftToGuess++;
    }
}
function setMines(){
    for(let row=0;row<row_num;row++){
        for(let col=0;col<col_num;col++){
           let isMine = false;
           if(Math.floor(Math.random() * 100) < 10){
                isMine=true;
           }
           if(isMine){
                document.getElementById(`d_${row}_${col}`).classList.add("mine");
           }
        }
    }
}
//--- time handling
var timingID;
function startTimimg(){
    timingID=setInterval(incTime,1000);
}
function stopTiming(){
    clearInterval(timingID);
}
var secPassed=0;
function incTime(){
    secPassed++;
    showTime();
}
function showTime(){
    let scPassed=secPassed%60;
    if(scPassed < 10){ 
        scPassed="0"+scPassed;
    }
    let minPassed=Math.floor(secPassed/60)%60;
    if(minPassed < 10){ 
        minPassed="0"+minPassed;
    }
    let hrPassed=Math.floor(secPassed/3600);
    document.getElementById("passedTime").innerHTML=`${hrPassed}:${minPassed}:${scPassed}`;
}
showTime();
