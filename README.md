# Euchre App

This project is a JavaScript web application that builds an interactive single player UI to play the card game Euchre with custom designed strategy algorithms to act as your teammate and oppponents.  
The rules to play Euchre are linked [here](https://euchre.com/rules/). This application (correctly) plays the "stick it to the dealer" variation. 
  
**At this time the strategy algorithms (implemented in [ai.js](/src/ai.js)) are still being developed. Updates are soon to come.

## How Euchre App Works

This web application is built using the React JS library. React JS allows for the construction and state management of HTML components in JavaScript files which are then rendered as interactive user interfaces for the web application.  
  
This project defines and uses three React components:  
1. [GameBoard.js](/src/components/GameBoard.js) + [GameBoard.css](/src/styles/GameBoard.css)
    * Main component that encapsulates all features of gameplay and organizes all other components. `GameBoard.js` uses React hooks, onClick fucntions, and async functions to autonomously track and update the gamestate (turn, hands, scores, round, play history, etc.) as the user and bots play their turns. `GameBoard.js` imports various functions from `gameLogic.js`, `sorting.js`, and `ai.js` to abstract complex algorithms related to Euchre rules, logic, deck management, and strategy.

2. [Hand.js](/src/components/Hand.js) + [Hand.css](/src/components/Hand.css)
    * A hand of up to five unique cards that are displayed in `Hand.css` differently depending upon the player. Four hands are rendered in `GameBoard.js`, one for each player.

3. [Card.js](/src/components/Card.js) + [Card.css](/src/components/Card.css)
    * A single, unique card that is either displayed face up as a card from [images](/public/images) or face down as the generic back image. Player1's cards register the onClick function and hover transformation detailed in `Card.css`. The Card component is rendered multiple times in `Hand.js` and `GameBoard.js`.

This project also includes three JavaScript files with helper functions for gameplay:
1. [gameLogic.js](/gameLogic.js)
    * Functions for comparing cards, determining trick winners, incrementing and decrementing turns, and other general algorithms regarding Euchre rules and logic.

2. [sorting.js](/sorting.js)
    * Functions for shuffling, dealing, and sorting hands by suit.

3. [ai.js](/ai.js)
    * Functions for the ai players to find optimal moves and making strategic decisions in each round of the game.

## Skills I Learned

* JavaScript programming
* Web development with React JS
* Game development and state management
* HTML + CSS web design
* Implementing strategy algorithms
* Euchre strategy

## Run Instructions

Requirments to run:
* [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once you have this repository cloned, run the following commands in a terminal at the root of the directory:  

1. Install dependencies
```bash
npm install
```
2. Run React application
```bash
npm start
```

## Demo

Coming soon...
