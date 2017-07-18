
function generateWinningNumber(){
    min=Math.ceil(1);
    max=Math.floor(101)
    return Math.floor(Math.random()*(max-min))+min
}

function shuffle(arr){
  var m =arr.length;
  var t;
  var i;
  
  //While there remain elements to shuffle
  while(m){
    i=Math.floor(Math.random()*m--)
    
  //And swap it with the current element.
  t = arr[m];
  arr[m]=arr[i];
  arr[i]=t;
  }
  return arr 
}

function Game(){
    this.playersGuess=null,
    this.pastGuesses=[],
    this.winningNumber = generateWinningNumber()
}
Game.prototype.difference=function(){
    return Math.abs(this.playersGuess-this.winningNumber)
}
Game.prototype.isLower=function(){
   return this.playersGuess<this.winningNumber?  true: false;
}

Game.prototype.playersGuessSubmission=function(num){
    if(num<1||num>100||isNaN(num)){
        $('#tittle').text ("That is an invalid guess.");
        $('#subtittle').text("Guess Again");
    }else{
    this.playersGuess=num
    return this.checkGuess(this.playersGuess)///be careful with this line...look t this first if there are problems down the road
    }
}

Game.prototype.checkGuess=function(guess){
    var notGuessed= (guess!==this.winningNumber)&&(this.pastGuesses.indexOf(guess)==-1)
    var difference = this.difference()   //Game.prototype.difference.call(this)
    var guessboxPush =
    $(`.guessboxes>li:nth-child(${this.pastGuesses.length+1})`).text(guess);

    
    console.log("Guess: ",guess)
    console.log("winning Number",this.winningNumber)

    if(guess==this.winningNumber){
        $('#hint, #submit').prop("disabled",true);
        $('#subtittle').text("Press Reset to play again.")
        return "You Win!"
    }
    if(this.pastGuesses.indexOf(guess)>-1){
        console.log(this.pastGuesses)
        return "You have already guessed that number."
    }else{
        
        this.pastGuesses.push(guess) //??why do I have to compensate for the array length here??shouldnt it be 1??
        console.log(this.pastGuesses)
        guessboxPush
        this.isLower()? $('#subtittle').text("Guess Higher"):  $('#subtittle').text("Guess Lower")
    }

    if(this.pastGuesses.length>=5){
        $('#hint, #submit').prop("disabled",true);
        $('#subtittle').text(`The number was ${this.winningNumber}`);
        $('#subtittle').after("<h3>Press Reset to play again</h3>");
        return `You Lose.`
    }
     if(difference<10){
         
        return "You're burning up!"
    }
     if(difference<25){
         
        return "You're lukewarm."
    }
    if(difference<50){
       
        return "You're a bit chilly."
    }
    if(difference<100){
       
        return "You're ice cold!"
    }
    
    return "string"
}

function newGame(){
    return new Game()
}

Game.prototype.provideHint= function(){
    var arr=[]
    arr.push(this.winningNumber)
    arr.push(generateWinningNumber())
    arr.push(generateWinningNumber())
    return shuffle(arr)
}
//----------JQUERY UTILITY FUNCTION
function makeAGuess(game){
    var guess =$('#player-input').val();
    $('#player-input').val("") // THis line clears the input box. 
                                    //We have already saved the input into a variable so its all good. 
    var output = game.playersGuessSubmission(guess)
    $('#tittle').text(output)

}
////JQUERY FUNCTIONALITY STARTS HERE 
$(document).ready(function(){
    console.log("everything is ready and connected!")

    var game = new Game();


    $('#submit').on('click',function(){
        makeAGuess(game);
    });
    ///this allows use to use the enter key instead of the submit button
    $('#player-input').keyup(function(event){
        if(event.which ==13){
            makeAGuess(game)
        }
    });

    $('#hint').click(function() {
    var hints = game.provideHint();
    $('#tittle').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);

    });

    $('#reset').click(function(){
        game= new Game()
        console.log("reset has been clicked")
        $('#tittle').text('Play the Guessing Game!');
        $('#subtittle').text('Guess a number between 1-100!')
        $('.guessboxes li').text('-');
        $('#hint, #submit').prop("disabled",false);
        $('#subtittle').next().remove();
    });

})

// function shuffle1(arr){
//     var shuffled =[];
//     var n = arr.length
//     var i;
//   //While there remain elements to shuffle....
//   while(n){
//     //Pick a remaining element
//     i = Math.floor(Math.random()*n--)
    
//    //And move it to the new Array
//    shuffled.push(arr.splice(i,1)[0])
//   }
//    return shuffled
// }