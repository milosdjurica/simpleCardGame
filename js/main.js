// Get a deck
let deckId
// remember number of cards if WAR
let numOfCards = 0
let totalNumFirst = 0
let totalNumSecond = 0
document.querySelector('button').addEventListener('click', play)

// saving deck in local storage so we can use same deck every time
// if deck isnt saved we are saving it 
if (!localStorage.getItem("deckId")) {
  fetch("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      deckId = data.deck_id
      localStorage.setItem("deckId", deckId)
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
  // if deck is saved we just shuffle it
} else {
  deckId = localStorage.getItem("deckId")
  fetch(`http://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
}


function play() {
  // pulls 2 cards
  const url = `http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      pics(data)
      countRounds(data)
      // For easier comparison toNum changes values ACE -> 15, KING ->14, etc..
      let val1 = toNum(data.cards[0].value)
      let val2 = toNum(data.cards[1].value)
      compare(val1, val2)
      checkWinner()
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}


// puts pictures in DOM
function pics(data) {
  document.querySelector("#player1").src = data.cards[0].image
  document.querySelector("#player2").src = data.cards[1].image
}


// count rounds left
function countRounds(data) {
  if (data.remaining != 0) {
    document.querySelector("h4").innerText = `Remaining number of rounds : ${data.remaining / 2}`
  } else {
    alert("LAST ROUND")
  }
}


// converts into numbers for easier comparing
function toNum(val) {
  if (val === 'ACE') {
    return 15
  } else if (val === 'KING') {
    return 14
  } else if (val === 'QUEEN') {
    return 13
  } else if (val === 'JACK') {
    return 12
  } else {
    return Number(val)
  }
}


// comparing card values
function compare(val1, val2) {
  if (val1 > val2) {
    document.querySelector(".mid h3").innerText = "Winner of round is player 1"
    putInWinner(1)
    numOfCards = 0
  } else if (val1 < val2) {
    document.querySelector(".mid h3").innerText = "Winner of round is player 2"
    putInWinner(2)
    numOfCards = 0
  } else {
    // if goes into  that means it is TIE, so winner of next round takes cards from this round and next one 
    document.querySelector(".mid h3").innerText = "WAR"
    numOfCards += 2
  }
}


// count total number of won cards by player, and puts it into their h3 tag
function putInWinner(player) {
  if (player === 1) {
    totalNumFirst += numOfCards + 2
    document.querySelector(`.one h3`).innerText = `Player one total number of cards is : ${totalNumFirst}`
  } else {
    totalNumSecond += numOfCards + 2
    document.querySelector(`.two h3`).innerText = `Player two total number of cards is : ${totalNumSecond}`
  }
}


function checkWinner(){
  if(totalNumFirst>26){
    alert("WINNER IS PLAYER 1")
  }else if(totalNumSecond>26){
    alert("WINNER IS PLAYER 2")
  }
}