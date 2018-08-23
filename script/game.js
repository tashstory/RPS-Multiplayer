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




  function emptybase() {

    // if (player === "player1") {
    database.ref('/answercheck').set({
      choices: [],
    })
    database.ref('/Player1').set({
      choice: "None",
      name: "None",
      wins: 0,
      losses: 0,
      Player: false,
      Present: 0
    })
    //  }
    // if (player === "player2") {
    database.ref('/Player2').set({
      choice: "None",
      name: "None",
      wins: 0,
      losses: 0,
      Player: false,
      Present: 0
    })
    //  }

  }

  $(window).on('beforeunload', function () {
    // if (player === "player2" ||  player === "player1") {
    emptybase();
    /*}else{
      database.ref('/Player1').set({
        choice: "None",
        name: "None",
        wins: 0,
        losses: 0,
        Player: false,
      })
         
      database.ref('/Player2').set({
        choice: "None",
        name: "None",
        wins: 0,
        losses: 0,
        Player: false,
      })
    }    
    */

    return "Thanks for playing";
  });





  var Play1 = {
    wins: 0,
    losses: 0,
    player: 0,
    choice: 0,
    present: 0
  }
  var Play2 = {
    wins: 0,
    losses: 0,
    player: 0,
    choice: 0,
    present: 0
  }
  database.ref('/Player2').on('value', function (snapshot) {
    var player2 = snapshot.val();
    Play2.wins = player2.wins
    Play2.losses = player2.losses
  })
  database.ref('/Player1').on('value', function (snapshot) {
    var player1 = snapshot.val();
    Play1.wins = player1.wins
    Play1.losses = player1.losses
  })

  $("body").on("click", ".a", function () {

    database.ref('/Player1').once('value', function (snapshot) {
      console.log("count")
      var player1 = snapshot.val();

      if (player1.Player === true) {
        player = "Player2";
        $("#hiddeninput").text(player)
        console.log("player 2")
        database.ref('/Player2').update({
          Player: true,

        })
      }
      if (player1.Player === false) {
        player = "Player1"
        $("#hiddeninput").text(player)

        database.ref('/Player1').update({
          Player: true,

        })
        console.log("player 1")

      }

      $(".player").hide();
      $('#usernameForm').show();

      event.preventDefault()
    })
  })



  $('#usernameForm').submit(function (event) {
    event.preventDefault()
    var player = $("#hiddeninput").text();
    console.log(player)
    var name = $('#input-name').val()
    console.log(name)
    if (player === "Player1") {
      database.ref('/Player1').update({
        choice: "None",
        name: name,
        wins: 0,
        losses: 0,
        Present: 1,
      })

    }
    if (player === "Player2") {
      database.ref('/Player2').update({
        choice: "none",
        name: name,
        wins: 0,
        losses: 0,
        Present: 1,
      })

    }

    $('#usernameForm').hide();
    $('#choiceForm').show();
    console.log(Play2.present)
    console.log(Play1.present)
    Timer()
  })
  database.ref("/Player2").on("value", function (snapshot) {
    var player2 = snapshot.val();
    Play2.present = player2.Present
  })
  database.ref("/Player1").on("value", function (snapshot) {
    var player1 = snapshot.val();
    Play1.present = player1.Present
  })

  function Timer() {
    var i = 1;
    setInterval(function () {
      console.log(i);
      i++;
      if (Play2.present === 1 && Play1.present === 1) {
        display();
        clearInterval();
      }
      if (i > 100) {
        //alert("Looks like no one else is online right now!")
      }
    }, 1000);
  }


  function display() {

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
  function showchoices() {

    database.ref('/Player2').once('value', function (snapshot) {
      var player2 = snapshot.val();
      $("#player2choice").text(player2.choice)
    })
    database.ref('/Player1').once('value', function (snapshot) {
      var player1 = snapshot.val();
      $("#player1choice").text(player1.choice)
    })


  }


  $("#choiceForm").on("click", ".choice", function (event) {
    var bothanswered = [];
    event.preventDefault();
    mychoice = ($(this).attr("value"))
    console.log(player)
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
    database.ref("/Player2").once("value", function (snapshot) {
      var player2 = snapshot.val();
      Play2.player = player2.HaveAnswered;
      Play2.choice = player2.choice
    })
    database.ref("/Player1").once("value", function (snapshot) {
      var player1 = snapshot.val();
      Play1.player = player1.HaveAnswered;
      Play1.choice = player1.choice
    })


    console.log(Play2.player)
    console.log(Play1.player)

    if ((Play2.player === "answered") && (Play1.player === "answered")) {
      console.log("both have chosen a weapon")
      showchoices()

      var player1weapon = Play1.choice
      var player2weapon = Play2.choice


      if (player1weapon === player2weapon) {
        alert("Tie!")
      }
      else if ((player1weapon === "Rock") && (player2weapon === "Scissors")) {
        Play1.wins = Play1.wins + 1;
        Play2.losses = Play2.losses + 1;
      }
      else if ((player1weapon === "Rock") && (player2weapon === "Paper")) {
        Play2.wins = Play2.wins + 1
        Play1.losses = Play1.losses + 1;
      }
      else if ((player1weapon === "Paper") && (player2weapon === "Rock")) {
        Play1.wins = Play1.wins + 1;
        Play2.losses = Play2.losses + 1;
      }
      else if ((player1weapon === "Paper") && (player2weapon === "Scissors")) {
        Play2.wins = Play2.wins + 1
        Play1.losses = Play1.losses + 1;
      }
      else if ((player1weapon === "Scissors") && (player2weapon === "Paper")) {
        Play1.wins = Play1.wins + 1;
        Play2.losses = Play2.losses + 1;
      }
      else if ((player1weapon === "Scissors") && (player2weapon === "Rock")) {
        Play2.wins = Play2.wins + 1
        Play1.losses = Play1.losses + 1;
      }



      database.ref('/Player2').update({
        wins: Play2.wins,
        losses: Play2.losses
      })


      database.ref('/Player1').update({
        wins: Play1.wins,
        losses: Play1.losses
      })

      console.log(Play1.losses)
      console.log(Play2.wins)


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
      $("#player1.wins").append(player2.wins)
      $("#player1.losses").append(player2.losses)
      })
      database.ref("/Player1").on("value", function (snapshot) {
        var player1 = snapshot.val();
      $("#player2.wins").append(player1.wins)
      $("#player2.losses").append(player1.losses)
        
      })
    }
      if (player === "Player1"){
      database.ref("/Player1").on("value", function (snapshot) {
        var player1 = snapshot.val();
        $("#player1.wins").append(player1.wins)
        $("#player1.losses").append(player1.losses)
      })
        database.ref("/Player2").on("value", function (snapshot) {
          var player2 = snapshot.val();
        $("#player2.wins").append(player2.wins)
        $("#player2.losses").append(player2.losses)
      })
    }
  */

})





