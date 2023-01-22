

/* 
    
 ██████╗  █████╗ ███╗   ███╗███████╗
██╔════╝ ██╔══██╗████╗ ████║██╔════╝
██║  ███╗███████║██╔████╔██║█████╗  
██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  
╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
 ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
                                    

*/


// ===> VARIABLES

const newGame = document.getElementById('game-newgame');
const gameMessage = document.getElementById('game-message');
const timeResult = document.getElementById('game-time');
let timeStart = null;
let result = null;
let gameIsOn = false;
const baseUrl = './assets/img/game/';
const game = document.querySelector('#game');
const urls = [
    `${baseUrl}c1.jpg`,
    `${baseUrl}c2.jpg`,
     `${baseUrl}c3.jpg`,
     `${baseUrl}c4.jpg`,
     `${baseUrl}c5.jpg`,
     `${baseUrl}c6.jpg`,
     `${baseUrl}c7.jpg`,
     `${baseUrl}c8.jpg`,
]
const images = [...urls, ...urls];
let selectedCards = [];
let cards = [];
let cardsMatched = [];



// ===> FUNCTIONS

const shuffleImages = () => {
    for (let i = 0; i < images.length; i++) {
        const random = Math.floor(Math.random() * images.length);
        [images[i], images[random]] = [images[random], images[i]]
    }
}

const clearBoard = () => {
    if(document.querySelector('#game .game-cards')) document.querySelector('#game .game-cards').remove();
    gameIsOn = false;
    cards = [];
    cardsMatched = [];
    selectedCards = [];
    gameMessage.style.display = 'none';
}

const populateCards = () => {
    const board = document.createElement('div');
    board.classList.add('game-cards');
    images.forEach((item, index) => {
        const cardWrapper = document.createElement('div');
        const card = document.createElement('img');
        cardWrapper.classList.add('game-card');
        card.dataset.index = index;
        card.src = baseUrl + 'pattern.jpg';
        card.addEventListener('click', handleClick);
        cards.push(card);
        cardWrapper.appendChild(card);
        board.appendChild(cardWrapper);
    })
    game.appendChild(board);
}

const revealCard = (card) => {
    const cardIndex = +card.dataset.index;
    const cardImage = images[cardIndex];
    card.src = cardImage
    selectedCards.push({
        cardIndex, 
        cardImage
    });

}

const isAlreadySelected = cardToCheck => {
    return selectedCards.some( card => card.cardIndex === +cardToCheck.dataset.index);
}

const match = () => {
    selectedCards.forEach(card => {
        cardsMatched.push(card.cardIndex);
        cards[card.cardIndex].style.border = '2px solid lime';
        cards[card.cardIndex].removeEventListener('click', handleClick);
    })
    selectedCards = [];
}

const pauseHide = () => {
    cards.forEach(card => card.removeEventListener('click', handleClick))
    setTimeout(()=>{
        selectedCards.forEach( item => {
            cards[item.cardIndex].src = baseUrl + 'pattern.jpg';
        })
        selectedCards = [];
        cards.forEach(card => {
            if(!cardsMatched.some( el => el === card.cardIndex)){
                card.addEventListener('click', handleClick);
            }
        })
   }, 1000)
}

const formatTimeResult = () => {
    let str = '';
    result = new Date().getTime() - timeStart;

    // result = new Date().getTime() - new Date(2023, 0, 22, 13, 5).getTime();

    
    const minutes = Math.floor(result / 60000);
    const seconds = Math.floor((result - minutes * 60000) / 1000);

    
    
    
    if(minutes >= 1) str += `${minutes} minute`;
    if(minutes > 1) str += `s`;
    
    str += ` ${seconds} second`;
    
    if(seconds > 1) str += `s`;
    
    return str;

}

const win = () => {
    gameIsOn = false;
    timeResult.innerHTML = formatTimeResult();
    gameMessage.style.display = 'inline';
} 

const startClock = () => {
    gameIsOn = true;
    timeStart = new Date().getTime();
}

const handleClick = (e) => { 

    gameIsOn ? null : startClock();

    const card = e.target;

    if(selectedCards.length <= 1 && !isAlreadySelected(card)){
        revealCard(card);
    }  
    
    if (selectedCards.length === 2 && selectedCards[0].cardImage === selectedCards[1].cardImage){
        match();
       
    }  

    if (selectedCards.length === 2 && selectedCards[0].cardImage !== selectedCards[1].cardImage){
        pauseHide();
    }  

    if(cardsMatched.length === cards.length){
        win();
    }
    
}


const startNewGame = () => {
    clearBoard();
    shuffleImages();
    populateCards();
}




newGame.addEventListener('click', startNewGame);

startNewGame();