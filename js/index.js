let score = 0;
let color = "blue";
let initialInput = document.querySelector('#name');
let submitButton = document.querySelector('#submit');
// let scorelist1 = document.querySelector('#scorelist1');
let database;

function random(min, max) {
 return Math.round(Math.random() * (max - min) + min);
}

function setround() {
 if (Math.round(Math.random())) {
   return "./img/object.png";
 } else {
   return "./img/bomb.png";
 }
}

function drop() {
 var length = random(100, ($(".game").width() - 100));
 var velocity = random(850, 10000);
 var size = random(50, 150);
 var thisBox = $("<div/>", {
   class: "box",
   style: "width:" + size + "px; height:" + size + "px; left:" + length + "px; transition: transform " + velocity + "ms linear;"
 });

 //set data and bg based on data
 thisBox.data("test", Math.round(Math.random()));
 if (thisBox.data("test")) {
   thisBox.css({ "background": "url('./img/object.png')", "background-size": "contain" });
 } else {
   thisBox.css({ "background": "url('./img/bomb.png')", "background-size": "contain" });
 }

 //insert gift element
 $(".game").append(thisBox);

 //random start for animation
 setTimeout(function () {
   thisBox.addClass("move");
 }, random(0, 5000));

 //remove this object when animation is over
 thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
   function (event) {
     $(this).remove();
   });
}

for (i = 0; i < 10; i++) {
 drop();
}

database = firebase.database();

var ref = database.ref('myscore');
ref.on('value', gotData, errData);


function gotData(data) {

 let scoreLists = document.querySelectorAll('.scoreList');
 for (let i =0; i< scoreLists.length; i++){
   scoreLists[i].remove();
 }

 console.log(data.val());

 const myscore = data.val();
 const keys = Object.keys(myscore);
 const olList = document.getElementById('scorelist1');
 
  for (let i =0; i< keys.length; i++){
      let k = keys[i];
      let name = myscore[k].name;
      let score = myscore[k].score;
     
     var li = document.createElement('li');
     li.classList.add('scoreList');

     $(olList).append(li);
      var scoreArr = $('ol').find('li');
      var count = $("ol").find("li").length;
      li.innerText = name + ': ' + score;

  }
}

function errData(err) {
 console.log('There is an error!!!');
 console.log(err);
}


function submitScore() {
 var data = {
   name: initialInput.value,
   score: score
 }

 ref.push(data);
}

//Event listener for score
$(document).on('click', '.box', function () {

 if ($(this).data("test")) {
   score += 3;
 } else {
   score -= 1;
 }

 $(".score").html(score);
 $(this).remove();
});

//Event listener for submit
$(document).on('click', '#submit', function () {

 submitScore();

});

var runGame = setInterval(function () {
 for (i = 0; i < 10; i++) {
   drop();
 }
}, 5000);

function countdown() {
 var seconds = 20;
 function tick() {
   var counter = document.getElementById("counter");
   seconds--;
   counter.innerHTML = (seconds < 10 ? "0" : "") + String(seconds) + "S";
   if (seconds > 0) {
     setTimeout(tick, 1000);
   } else {
     alert("Game over");
     clearInterval(runGame);
   }
 }
 tick();
}
countdown();