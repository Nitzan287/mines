var top10_scores=[];
const NumOfTopScores=3;

var LatestScore;
function FindQuickest(v,i,a){
    return v.seconds > LatestScore
}

function AmIGoodEnough(score){
    let ret=false;
    if((top10_scores.length < NumOfTopScores)||(goodEnough(score))){
        ret=true;
    }
    return ret;
}
function addScroe(score,name){
    if(top10_scores.length < NumOfTopScores){
        top10_scores.push({"seconds":score,"name":name});
        top10_scores.sort(sortBySec);
    }
    else {
        if(goodEnough(score)){
            addInMiddle(score,name);
        }
    }
    console.log(top10_scores);
    var myJSON = JSON.stringify(top10_scores);
    console.log(myJSON);
    localStorage.TopScores=myJSON;
}
function addInMiddle(score,name){
    LatestScore=score;
    // where is new pos
    let newpos=top10_scores.findIndex(FindQuickest);
    // make room
    for(let k=top10_scores.length-1;k>newpos;k--){
        top10_scores[k]=top10_scores[k-1];
    }
    // insert
    top10_scores[newpos]={"seconds":score,"name":name};
}
function sortBySec(a,b){
    if(Number(a.seconds)>Number(b.seconds)){
        return 1;
    }
    else if(Number(a.seconds)<Number(b.seconds)){
        return -1;
    } else {
        return 0;
    }
}
function goodEnough(score){
    let ret=false;
    if(score < top10_scores.reduce(GetMaxByReduce)){
        ret=true;
    }
    return ret;
}
function GetMaxByReduce(t,v,idx){
    console.log("t=",t," v=",v);
    if(idx==1){
        t=t.seconds;
    }
    if(v.seconds>t){
        return v.seconds;
    } else {
        return t;
    }
}
function SaveName(){
    // get value
    let player_name=document.getElementById("EnteredName").value;

    // add score to list
    addScroe(secPassed,player_name);

    // close screen
    document.getElementById("getName").style.display="none";

}
function ShowTopScores(){
    let scores=JSON.parse(localStorage.TopScores);
    console.log(scores);
    let str="";
    str+="<table>";
    str+="<tr><th>name</th><th>score</th></tr>";
    for( let itm of scores){
        str+=`<tr><td>${itm.name}</td><td>${itm.seconds}</td></tr>`;
    }
    str+="</table>";
    document.getElementById("mainBoard").innerHTML=str;     
}