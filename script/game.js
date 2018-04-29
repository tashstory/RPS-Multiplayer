// Initialize Firebase

$(document).ready(function () {



  var config = {
    apiKey: "AIzaSyDCHkX0eOJ7GSTGFVLocJWnD0tJxIdNz4U",
    authDomain: "week-7-b6b29.firebaseapp.com",
    databaseURL: "https://week-7-b6b29.firebaseio.com",
    projectId: "week-7-b6b29",
    storageBucket: "week-7-b6b29.appspot.com",
    messagingSenderId: "1074843985372"
  };

  firebase.initializeApp(config);



  var database = firebase.database()


  function emptybase(){

  //  if (player === "player1") {
    database.ref('/answercheck').set({
      choices: [],
    })
    database.ref('/Player2').set({
      choice: "None",
      name: "None",
      wins: 0,
      losses: 0,
    })
  //   }
   //   if (player === "player2") {
    database.ref('/Player1').set({
      choice: "None",
      name: "None",
      wins: 0,
      losses: 0,
    })
  //    }

  }

  emptybase()


  $("body").on("click", ".a", function () {
    player = $(this).text();
    $(".player").hide();
    $('#usernameForm').show();
    $("hiddeninput").val(player)
    event.preventDefault()
  })
  var player1wins = 0;
  var player2wins = 0;
  var player1losses = 0;
  var player2losses = 0;
  var player = $("hiddeninput").val();

  $('#usernameForm').submit(function (event) {
    event.preventDefault()
    var name = $('#input-name').val()
    if (player === "Player1") {
      database.ref('/Player1').set({
        choice: "None",
        name: name,
        wins: 0,
        losses: 0,
      })
    }
    if (player === "Player2") {
      database.ref('/Player2').set({
        choice: "none",
        name: name,
        wins: 0,
        losses: 0,
      })
    }
    display()
    $('#usernameForm').hide();
    $('#choiceForm').show();
    $("#username1").text(name)
  })



  function display() {

    if (player === "Player1") {
      database.ref('/Player2').on('value', function (snapshot) {
        var player2 = snapshot.val();
        
        $("#username2").text(player2.name)
        $("#player2wins").text(player2.wins)
        $("#player2losses").text(player2.losses)
      })
      database.ref('/Player1').on('value', function (snapshot) {
        var player1 = snapshot.val();
       
        $("#username1").text(player1.name)
        $("#player1wins").text(player1.wins)
        $("#player1losses").text(player1.losses)
      })
    }

    if (player === "Player2") {
      database.ref('/Player1').on('value', function (snapshot) {
        var player1 = snapshot.val();
        
        $("#username2").text(player1.name)
        $("#player2wins").text(player1.wins)
        $("#player2losses").text(player1.losses)
      })
      database.ref('/Player2').on('value', function (snapshot) {
        var player2 = snapshot.val();
        
        $("#username1").text(player2.name)
        $("#player1wins").text(player2.wins)
        $("#player1losses").text(player2.losses)
      })
    }
  }
  function showchoices(){
    if (player === "Player1") {
      database.ref('/Player2').on('value', function (snapshot) {
        var player2 = snapshot.val();
        $("#player2choice").text(player2.choice)
      })
      database.ref('/Player1').on('value', function (snapshot) {
        var player1 = snapshot.val();
        $("#player1choice").text(player1.choice)
      })
    }

    if (player === "Player2") {
      database.ref('/Player1').on('value', function (snapshot) {
        var player1 = snapshot.val();
        $("#player2choice").text(player1.choice)
        
      })
      database.ref('/Player2').on('value', function (snapshot) {
        var player2 = snapshot.val();
        $("#player1choice").text(player2.choice)
      })
    }


  }

  var Play1 = {
    player: 0,
    choice: 0,
  }
  var Play2 = {
    player: 0,
    choice: 0,
  }

  $("#choiceForm").on("click", ".choice", function (event) {
    var bothanswered = [];
    event.preventDefault();
    mychoice = ($(this).attr("value"))

    if (player === "Player1") {
      database.ref('/Player1').update({
        choice: mychoice,
        HaveAnswered: "answered",
      })
    }
    if (player === "Player2") {
      database.ref('/Player2').update({
        choice: mychoice,
        HaveAnswered: "answered",
      })
      
    }
    database.ref("/Player2").on("value", function (snapshot) {
      var player2 = snapshot.val();
      Play2.player = player2.HaveAnswered;
      Play2.choice = player2.choice
    })
    database.ref("/Player1").on("value", function (snapshot) {
      var player1 = snapshot.val();
      Play1.player = player1.HaveAnswered;
      Play1.choice = player1.choice
    })
    
    
    console.log(Play2.player)
    console.log(Play1.player)
    if((Play2.player === "answered")&&(Play1.player === "answered")){
      console.log("both have chosen a weapon")
      showchoices()

      var player1weapon = Play1.choice
      var player2weapon = Play2.choice
      

    if(player1weapon === player2weapon){
      alert("Tie!")
    }
    else if((player1weapon === "Rock") && (player2weapon === "Scissors")){
      player1wins = player1wins  + 1;
      player2losses = player2losses + 1;
    }
    else if((player1weapon === "Rock") && (player2weapon === "Paper")){
      player2wins = player2wins + 1
      player1losses= player1losses + 1;
    }
    else if((player1weapon === "Paper") && (player2weapon === "Rock")){
      player1wins = player1wins  + 1;
      player2losses = player2losses + 1;
    }
    else if((player1weapon === "Paper") && (player2weapon === "Scissors")){
      player2wins = player2wins + 5
      player1losses= player1losses + 5;
    }
    else if((player1weapon === "Scissors") && (player2weapon === "Paper")){
      player1wins = player1wins + 1;
      player2losses = player2losses + 1;
    }
    else if((player1weapon === "Scissors") && (player2weapon === "Rock")){
      player2wins = player2wins + 1
      player1losses= player1losses + 1;
    }
    

    
    database.ref('/Player2').update({
      wins: player2wins,
      losses: player2losses
    })
    database.ref('/Player1').update({
      wins: player1wins,
      losses: player1losses
    })
    console.log(player1losses)
    console.log(player1wins)


    display();
    
    database.ref('/Player1').update({
      HaveAnswered: 0,
      choice: 0,
    })
    database.ref('/Player2').update({
      HaveAnswered: 0,
      choice: 0,
    })
    Play2.player = 0;
    Play1.player = 0;
    Play2.choice = 0;
    Play1.choice = 0;

    }
    
  
    
  })
/*
  if (player === "Player2"){
    database.ref("/Player2").on("value", function (snapshot) {
    var player2 = snapshot.val();
    $("#player1wins").append(player2.wins)
    $("#player1losses").append(player2.losses)
    })
    database.ref("/Player1").on("value", function (snapshot) {
      var player1 = snapshot.val();
    $("#player2wins").append(player1.wins)
    $("#player2losses").append(player1.losses)
      
    })
  }
    if (player === "Player1"){
    database.ref("/Player1").on("value", function (snapshot) {
      var player1 = snapshot.val();
      $("#player1wins").append(player1.wins)
      $("#player1losses").append(player1.losses)
    })
      database.ref("/Player2").on("value", function (snapshot) {
        var player2 = snapshot.val();
      $("#player2wins").append(player2.wins)
      $("#player2losses").append(player2.losses)
    })
  }
*/

})





