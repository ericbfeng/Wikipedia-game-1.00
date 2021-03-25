
//var start, end = null;

var hr = 0;
 var min = 0;
 var sec = 0;
 var temp = [];
 console.log(temp);
 var hasExist = false;
 var timer = document.querySelector(".timer");
 var startPage = document.querySelector(".startPage");
 var endPage  = document.querySelector(".endPage");


 chrome.storage.sync.get(function(result) {
   var sTemp = result.key;
   if(sTemp){
     hasExist = true;
     startPage.innerHTML = sTemp[0];
     endPage.innerHTML = sTemp[1];
     console.log(sTemp[4]);// temp 4 not getting time.
     console.log(sTemp[3]);
     startTimer(sTemp[4]);
     temp = sTemp;
     // this starts a timer that works from the beggining.
   }



 });



function startTimer(sDate){
  for (var i = 1; i <= 7200; ++i) {
     updateTime(i,sDate);
  }
  //timer.innerHTML = "Game Over, Please try again";
}


function checkGame(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    console.log(tabs[0].url);
    if(tabs[0].url ==  temp[3]){
      alert("Congrats You won!");
    }
  });
}


function parseTime(timeleft){
  //var timer = document.querySelector(".timer");
  hr = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  min = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  sec = Math.floor((timeleft % (1000 * 60)) / 1000);
  if (sec < 10 || sec == 0) {
    sec = '0' + sec;
  }
  if (min < 10 || min == 0) {
    min = '0' + min;
  }
  if (hr < 10 || hr == 0) {
    hr = '0' + hr;
  }

  timer.innerHTML =  hr + ':' + min + ':' + sec;
}


 function updateTime(i,date){
   setTimeout(function(){
     var now = new Date().getTime();
     var timeleft  =  now - date;
     //console.log(timeleft);
     parseTime(timeleft);
   } , i * 1000);
}



function resetGame(){
  chrome.storage.sync.clear(function(){
    console.log("Has been cleared");
    hasExist = false;

  })

}


function openTab(){
   if(temp){
     console.log("gets here");
     chrome.storage.sync.get(function(result) {
       var sTemp = result.key;
       if(sTemp){
          temp = sTemp;
         chrome.tabs.create({url: temp[2]});

     }
     });


   }






}


 function startGame(){
   var r = document.querySelector(".retry");
   var button = document.getElementById('startButton');
   button.disabled = true;
   button.style.cursor = "wait";
   if(!hasExist){a();}
   button.disabled = false;
   button.style.cursor = "default";
   console.log(temp);
   if(temp.length < 4){
     r.innerHTML =  "Error, please try again";
   }
   else if(!hasExist){
   r.innerHTML = "";
   startPage.innerHTML = temp[0];
   endPage.innerHTML = temp[1];
   var sStart = new Date().getTime();
   temp[4] = sStart;
   chrome.storage.sync.set({key : temp}, function() {
          console.log('Value is set to ' + temp);
          startTimer(temp[4]);

   });





    //let p = new Promise((resolve) => {
    //  try{
      //chrome.storage.sync.get("abc", function(value) {
        //  resolve("value recieved = " + value);
      //});
    //}
    //catch(ex){
      //  reject(ex);
    //  }
    //});

  //  p.then((input) => {
    //    console.log("LOOK HERE");
    //    console.log(input);
  //  }).catch((message) =>{
    //  console.log("issue");
  //  })
    // console.log(temp);
    //location.href = "game.html";
  }
 }
















 function a(isRetry){
   var start, end = null;
   var url = "https://en.wikipedia.org/w/api.php";
   var params = {
     action: "query",
     format: "json",
     list: "random",
     rnlimit: "50"
   };
   url = url + "?origin=*";
   Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
   fetch(url)
   .then(function(response){return response.json();})
   .then(function(response) {
     var randoms = response.query.random;
     for (var r in randoms) {
       if(!randoms[r].title.includes(":")){
         if(start != null && end == null){
           end = randoms[r].title;
         }
        if(start == null){
           start = randoms[r].title;
         }
       }

     }
     temp =  [start,end];

 })
   .then(function(response){

     var url = "https://en.wikipedia.org/w/api.php";

     var params = {
       action: "query",
       format: "json",
       titles: temp[0], // issue here, test returns before first fetch look into promises : https://stackoverflow.com/questions/44980247/how-to-finish-all-fetch-before-executing-next-function-in-react
       prop: "info",
       inprop: "url|talkid"
     };

     url = url + "?origin=*";
     Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

     fetch(url)
     .then(function(response){return response.json();})
     .then(function(response) {
       var pages = response.query.pages;
     for (var p in pages) {
         temp[2] =  pages[p].fullurl;
     }



   });


   })
   .then(function(response){

     var url = "https://en.wikipedia.org/w/api.php";

     var params = {
       action: "query",
       format: "json",
       titles: temp[1], // issue here, test returns before first fetch look into promises : https://stackoverflow.com/questions/44980247/how-to-finish-all-fetch-before-executing-next-function-in-react
       prop: "info",
       inprop: "url|talkid"
     };

     url = url + "?origin=*";
     Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

     fetch(url)
     .then(function(response){return response.json();})
     .then(function(response) {
       var pages = response.query.pages;
     for (var p in pages) {
         temp[3] =  pages[p].fullurl;

     }


   });


   })
 .catch(function(error){console.log(error);});
}


    document.addEventListener('DOMContentLoaded', function () {
        var button = document.getElementById('startButton');
        var button2 = document.getElementById('resetButton');
        var button3 = document.getElementById('tabButton');
        var button4 = document.getElementById('checkButton');
        button.addEventListener('click', startGame);
        button2.addEventListener('click', resetGame);
        button3.addEventListener('click', openTab);
        button4.addEventListener('click', checkGame);
    });


    //
    // document.addEventListener('beforeunload', function(){
    //   if()
    //   chrome.storage.sync.set({key : temp}, function() {
    //          console.log('Value is set to ' + temp);
    //
    //
    //   });
    //
    //
    //
    // } )
