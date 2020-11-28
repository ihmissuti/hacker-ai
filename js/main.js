var net = new brain.NeuralNetwork();
var longest = 80;
function processX (x) {
  if (x > 1) {
      return 1
  } 
  else if (x == 0.25) {
      return 0
  } 
  else {
      return x
  }
}
function encode(arg) {
  return arg.split('').map(x => (processX(x.charCodeAt(0) / 128)));
}
function getPrediction(title) {
      var result = net.run(encode(adjustSize(title, 80)));
      return result.score*3531
  }

  function relDiff(a, b) {
    return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
   }
  function adjustSize(string) {
      
      while (string.length < longest) {
        string += ' ';
      }
      return string;  
  }
  $('form').submit(async function(){
    $( "#containerA" ).removeClass( "winner" );
    $( "#containerB" ).removeClass( "winner" );
    $( "#result" ).html("");
    $( "#scoreA" ).html("");
    $( "#scoreB" ).html("");
    var titleA = $('#titleA').val()
    var titleB = $('#titleB').val().replace("Show HN: ", "")
    sa_event("prediction");

    net.fromJSON(staticNet);
    net.toFunction();
    var answer = await getPrediction(titleA.replace("Show HN: ", ""))
    var answerB = await getPrediction(titleB.replace("Show HN: ", ""))
          console.log(answer)
          console.log(answerB)

          $(".results").css("display", "block");
          if (answer > answerB) {
            console.log("A wins")
            // $( "#scoreA" ).html( "Points: " + ((num2 - num1) / num1 * 100 + "%"); );
            // $( "#scoreB" ).html( "Points: " + answerB.toFixed(0));
            $( "#scoreA" ).html( (((answer - answerB) / answerB * 100).toFixed(0)  + "% better"));
            // $( "#scoreB" ).html( "Points: " + answerB.toFixed(0));

            $( "#containerA" ).addClass( "winner" );
            $( "#result" ).html( "The winner is title A: " + titleA );
          } else {
            console.log("B wins")
            $( "#scoreB" ).html( (((answerB - answer) / answer * 100).toFixed(0) + "% better"));
            $( "#containerB" ).addClass( "winner" );
            $( "#result" ).html( "The winner is title B: " + titleB);
          }
  })