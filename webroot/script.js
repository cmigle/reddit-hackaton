/*
class App {
  constructor() {
    // Select UI elements
    this.output = document.querySelector('#messageOutput');
    this.increaseButton = document.querySelector('#btn-increase');
    this.decreaseButton = document.querySelector('#btn-decrease');
    this.usernameLabel = document.querySelector('#username');
    this.counterLabel = document.querySelector('#counter');
    this.wordInput = document.querySelector('#wordInput'); // Input for next word
    this.submitButton = document.querySelector('#btn-submit'); // Submit button for game
    this.messageElement = document.querySelector('#gameMessage'); // Game feedback

    // Initialize variables
    this.counter = 0;
    this.startWord = '';
    this.endWord = '';
    this.currentWord = '';
    this.steps = 0;

    // Word list for the game
    this.wordData = ['cat', 'bat', 'rat', 'mat', 'pat', 'sat', 'fat', 'hat', 'dog', 'fog', 'log'];

    // Event listeners
    this.initializeListeners();

    // Initialize game
    this.initializeGame();
  }

  initializeListeners() {
    // Devvit messaging listener
    window.addEventListener('message', (ev) => {
      const { type, data } = ev.data;

      if (type === 'devvit-message') {
        const { message } = data;

        this.output.replaceChildren(JSON.stringify(message, undefined, 2));

        if (message.type === 'initialData') {
          const { username, currentCounter } = message.data;
          this.usernameLabel.innerText = username;
          this.counterLabel.innerText = this.counter = currentCounter;
        }

        if (message.type === 'updateCounter') {
          const { currentCounter } = message.data;
          this.counterLabel.innerText = this.counter = currentCounter;
        }
      }
    });

    // Counter buttons
    this.increaseButton.addEventListener('click', () => {
      window.parent?.postMessage(
        { type: 'setCounter', data: { newCounter: Number(this.counter + 1) } },
        '*'
      );
    });

    this.decreaseButton.addEventListener('click', () => {
      window.parent?.postMessage(
        { type: 'setCounter', data: { newCounter: Number(this.counter - 1) } },
        '*'
      );
    });

    // Game submit button
    this.submitButton.addEventListener('click', () => this.handleWordSubmission());
  }

  // Initialize the game with random start and end words
  initializeGame() {
    const [start, end] = this.generateRandomWordPair(this.wordData);
    this.startWord = start;
    this.endWord = end;
    this.currentWord = start;
    this.steps = 0;

    this.messageElement.textContent = Start Word: ${this.startWord} | End Word: ${this.endWord};
  }

  // Generate random start and end words
  generateRandomWordPair(words) {
    const wordList = words.filter(word => word.length === 3);
    const start = wordList[Math.floor(Math.random() * wordList.length)];
    let end;
    do {
      end = wordList[Math.floor(Math.random() * wordList.length)];
    } while (start === end);
    return [start, end];
  }

  // Check if a word is valid
  isValidWord(word) {
    return this.wordData.includes(word);
  }

  // Check if two words are one letter apart
  isOneLetterApart(word1, word2) {
    if (word1.length !== word2.length) return false;
    let diffCount = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) diffCount++;
      if (diffCount > 1) return false;
    }
    return diffCount === 1;
  }

  // Handle word submission
  handleWordSubmission() {
    const inputWord = this.wordInput.value.trim().toLowerCase();

    if (!this.isValidWord(inputWord)) {
      this.messageElement.textContent = 'Invalid word. Try again.';
      this.messageElement.style.color = 'red';
      return;
    }

    if (!this.isOneLetterApart(this.currentWord, inputWord)) {
      this.messageElement.textContent = 'Word must differ by exactly one letter. Try again.';
      this.messageElement.style.color = 'red';
      return;
    }

    this.currentWord = inputWord;
    this.steps++;

    if (this.currentWord === this.endWord) {
      this.messageElement.textContent = Congratulations! You reached the end word in ${this.steps} steps.;
      this.messageElement.style.color = 'green';
      this.submitButton.disabled = true; // End the game
    } else {
      this.messageElement.textContent = Correct! Current word: ${this.currentWord};
      this.messageElement.style.color = 'green';
    }

    this.wordInput.value = '';
  }
}

new App();*/

let currentWord = '';
let steps = 0;
/*
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    fetch('/start-game')
        .then(response => response.json())
        .then(data => {
            document.getElementById('start-word').textContent = Start Word: ${data.startWord};
            document.getElementById('end-word').textContent = End Word: ${data.endWord};
            currentWord = data.startWord;
        });
*/
/////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  // Initialize game
  fetch('/start-game')
      .then((response) => {
          if (!response.ok) {
              throw new Error('Failed to fetch start and end words');
          }
          return response.json();
      })
      .then((data) => {
          if (data.startWord && data.endWord) {
              document.getElementById('start-word').textContent = `Start Word: ${data.startWord}`;
              document.getElementById('end-word').textContent = `End Word: ${data.endWord}`;
              currentWord = data.startWord;
          } else {
              throw new Error('Invalid start-game response');
          }
      })
      .catch((err) => {
          console.error(err);
          document.getElementById('message').textContent = 'Error initializing the game. Try refreshing.';
      });
});
////////////////////
    // Handle submission
    document.getElementById('submit-button').addEventListener('click', () => {
      const inputWord = document.getElementById('word-input').value.trim().toLowerCase();
  
      fetch('/check-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentWord, inputWord }),
      })
          .then((response) => {
              if (!response.ok) {
                  throw new Error('Error checking word');
              }
              return response.json();
          })
          .then((data) => {
              const messageElement = document.getElementById('message');
              if (data.success) {
                  steps++;
                  if (data.completed) {
                      messageElement.textContent = `Congratulations! You completed the game in ${steps} steps.`;
                      messageElement.className = 'success';
                      document.getElementById('submit-button').disabled = true;
                  } else {
                      currentWord = inputWord;
                      messageElement.textContent = `Correct! Current word is now: ${currentWord}`;
                      messageElement.className = 'success';
                  }
              } else {
                  messageElement.textContent = data.message;
                  messageElement.className = 'error';
              }
              document.getElementById('word-input').value = '';
          })
          .catch((err) => {
              console.error(err);
              document.getElementById('message').textContent = 'Error checking word. Try again.';
          });
  });
