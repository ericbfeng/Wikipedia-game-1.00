

  var isRunning = 0;
  var hr = 0;
  var min = 0;
  var sec = 0;
  var start = null;
  var end =  null;
  var timer = document.querySelector(".timer");


  function TimerStart(){
    var button1 = document.getElementById('startButton');
    var startText = document.querySelector(".startSubject");
    var endText = document.querySelector(".endSubject");
    isRunning = 1;
    button1.disabled = true;
    chrome.storage.sync.get( function(result) {
      var temp =  result.key;
      console.log(temp);
      start = temp[0];
      end = temp[1];
      startText.innerHTML =  start;
      endText.innerHTML = end;
      chrome.tabs.create({url: temp[3]});
    });



    Timer();
  }

  function TimerEnd(){
    var button1 = document.getElementById('startButton');
    if(!isRunning){
      hr = 0;
      min = 0;
      sec = 0;
      timer.innerHTML = hr +  '0:' + min + '0:0' + sec;
    }
    button1.disabled = false;
    isRunning = 0;
  }

  function Timer(){
    if(isRunning){
      console.log("Im Working");
      sec = parseInt(sec);
      min = parseInt(min);
      hr = parseInt(hr);

      sec = sec + 1;

      if (sec == 60) {
        min = min + 1;
        sec = 0;
      }
      if (min == 60) {
        hr = hr + 1;
        min = 0;
        sec = 0;
      }
      if (sec < 10 || sec == 0) {
        sec = '0' + sec;
      }
      if (min < 10 || min == 0) {
        min = '0' + min;
      }
      if (hr < 10 || hr == 0) {
        hr = '0' + hr;
      }

      timer.innerHTML = hr + ':' + min + ':' + sec;

      setTimeout(function() {
        Timer()
      }, 1000);
      }

  }

  document.addEventListener('DOMContentLoaded', function () {
      var button1 = document.getElementById('startButton');
      var button2 = document.getElementById('endButton')
      button1.addEventListener('click', TimerStart);
      button2.addEventListener('click', TimerEnd);
  });
