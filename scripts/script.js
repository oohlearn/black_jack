// 程式碼寫在這裡!

// ready 初始化
$(document).ready(function () {
  initCards();
  initBtn();
});

let playerDeck = [];
let dealerDeck = [];
let playerPoint = 0;
let dealerPoint = 0;
let inGame = false;
let desk = [];
let winner = 1; //0:未定 1:玩家 2:莊家 3.平手
let playerFinished = false;

function initCards() {
  //   let allCards = document.querySelectorAll(".card div");
  //   allCards.forEach((card) => {
  //     card.innerHTML = "㊖";
  //   }); 可用jquery 改寫為下面那行
  $(".card div").html("㊖");
}

function initBtn() {
  $("#action-new-game").click(function (evt) {
    newGame();
  });

  $("#action-hit").click((evt) => {
    evt.preventDefault();
    playerDeck.push(deal());
    renderGameTable();
  });

  $("#action-stand").click((evt) => {
    evt.preventDefault();
    dealerRound();
  });
}

function newGame() {
  resetGame();
  initCards();

  playerDeck.push(deal());
  dealerDeck.push(deal());
  playerDeck.push(deal());
  inGame = true;

  renderGameTable();
}

function deal() {
  // 將牌組的第一個元素(最上面的牌)發出去
  return desk.shift();
}

// 建立牌組&洗牌
function buildDeck() {
  for (let suit = 1; suit <= 4; suit++) {
    for (let number = 1; number <= 13; number++) {
      let c = new Card(suit, number);
      desk.push(c);
    }
  }
  desk = shuffle(desk);
  return desk;
}

class Card {
  constructor(suit, number) {
    (this.suit = suit), (this.number = number);
  }

  cardNumber() {
    switch (this.number) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return this.number;
    }
  }

  cardPoint() {
    switch (this.number) {
      case 1:
        return 11;
      case 11:
      case 12:
      case 13:
        return 10;
      default:
        return this.number;
    }
  }

  cardSuit() {
    switch (this.suit) {
      case 1:
        return "♠";
      case 2:
        return "♥";
      case 3:
        return "♦";
      case 4:
        return "♣";
    }
  }
}

// 洗牌
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function renderGameTable() {
  // 牌
  playerDeck.forEach((card, i) => {
    let theCard = $(`#yourCard${i + 1}`);
    theCard.html(card.cardNumber());
    theCard.prev().html(card.cardSuit()); //prev可以抓到前一個元素(就可以抓到span)
    if (card.suit == 2 || card.suit == 3) {
      theCard.parent().addClass("red");
    }
  });

  dealerDeck.forEach((card, i) => {
    let theCard = $(`#dealerCard${i + 1}`);
    theCard.html(card.cardNumber());
    theCard.prev().html(card.cardSuit()); //prev可以抓到前一個元素(就可以抓到span)
    if (card.suit == 2 || card.suit == 3) {
      theCard.parent().addClass("red");
    }
  });
  // 點
  playerPoint = calcPoint(playerDeck);
  dealerPoint = calcPoint(dealerDeck);

  $(".your-cards h1").html(`你：${playerPoint}點`);
  $(".dealer-cards h1").html(`莊家：${dealerPoint}點`);

  //按鈕
  //   if (inGame) {
  //     $("#action-hit").attr("disabled", false);
  //     $("#action-stand").attr("disabled", false);
  //   } else {
  //     $("#action-hit").attr("disabled", true);
  //     $("#action-stand").attr("disabled", true);
  //   }
  // 改變狀態，也可用下面的簡寫
  $("#action-hit").attr("disabled", !inGame);
  $("#action-stand").attr("disabled", !inGame);
  checkWinner();

  if (winner != 0) {
    showWinStamp();
  }
}

function checkWinner() {
  if (playerPoint == 21) {
    winner = 1;
  } else if (playerPoint > 21) {
    winner = 2;
  } else if (dealerPoint > 21) {
    winner = 1;
  } else if (dealerPoint > playerPoint && playerFinished == true) {
    winner = 2;
  } else if (dealerPoint == playerPoint) {
    winner = 3;
  } else {
    winner = 0;
  }
  console.log(winner);
}

function showWinStamp() {
  switch (winner) {
    case 1:
      $(".your-cards").addClass("win");
      break;
    case 2:
      $(".dealer-cards").addClass("win");
      break;
    case 3:
      $(".your-cards").addClass("peace");
      break;
    default:
      break;
  }
}

function calcPoint(desk) {
  let point = 0;
  desk.forEach((card) => {
    point += card.cardPoint();
  });

  if (point > 21) {
    desk.forEach((card) => {
      if (card.cardNumber() === "A") {
        point -= 10; //讓A從11點變1點
      }
    });
  }
  return point;
}

function resetGame() {
  deck = [];
  playerDeck = [];
  dealerDeck = [];
  playerPoint = 0;
  dealerPoint = 0;
  buildDeck();
  winner = 0;
  playerFinished = false;
  $(".win").removeClass("win");
  $(".peace").removeClass("peace");
  $(".red").removeClass("red");
  $("span").html("");
}

function dealerRound() {
  // 只決定莊家要不要繼續發牌，不判斷輸贏
  playerFinished = true;
  while (inGame) {
    calcPoint(dealerDeck);
    if (dealerPoint < playerPoint) {
      dealerDeck.push(deal());
    } else {
      break;
    }
    renderGameTable();
  }
  inGame = false;
}
