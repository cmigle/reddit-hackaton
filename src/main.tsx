import { Devvit, useState, useForm } from '@devvit/public-api';
import './style.css';

Devvit.addCustomPostType({
  name: 'Word Ladder Game',
  render: (context) => {
    // Word list for the game
    const words = ["cat", "bat", "rat", "mat", "pat", "sat", "fat", "hat", "dog", "fog", "log"];

    // State for start and end words
    const [startWord, setStartWord] = useState<string>(() => words[Math.floor(Math.random() * words.length)]);
    const [endWord, setEndWord] = useState<string>(() => {
      let randomWord: string;
      do {
        randomWord = words[Math.floor(Math.random() * words.length)];
      } while (randomWord === startWord);
      return randomWord;
    });
    
    const [currentWord, setCurrentWord] = useState<string>(startWord); // Track current word
    const [message, setMessage] = useState<string>(''); // Message display
    const [incorrectWords, setIncorrectWords] = useState<string[]>([]); // Track incorrect attempts
    const [completed, setCompleted] = useState<boolean>(false); // Game completion flag

    /**
     * Checks if two words differ by exactly one letter
     * @param word1 - First word
     * @param word2 - Second word
     * @returns true if words differ by one letter, false otherwise
     */
    const isOneLetterApart = (word1: string, word2: string): boolean => {
      if (word1.length !== word2.length) return false;
      let diffCount = 0;
      for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) diffCount++;
        if (diffCount > 1) return false;
      }
      return diffCount === 1;
    };

    // Reload start and end words
    const reloadWords = () => {
      const newStartWord = words[Math.floor(Math.random() * words.length)];
      let newEndWord: string;
      do {
        newEndWord = words[Math.floor(Math.random() * words.length)];
      } while (newEndWord === newStartWord);

      setStartWord(newStartWord);
      setEndWord(newEndWord);
      setCurrentWord(newStartWord);
      setMessage('');
      setIncorrectWords([]);
      setCompleted(false);
    };

    // Form to input words
    const wordForm = useForm(
      {
        title: 'Word Ladder Entry',
        description: `Start Word: "${startWord}" | End Word: "${endWord}"`,
        fields: [
          { type: 'string', name: 'inputWord1', label: 'First Word' },
          { type: 'string', name: 'inputWord2', label: 'Second Word' },
        ],
      },
      (values) => {
        const word1 = values.inputWord1?.trim().toLowerCase();
        const word2 = values.inputWord2?.trim().toLowerCase();

        // Validation for valid words and one-letter rules
        if (!word1 || !word2 || !words.includes(word1) || !words.includes(word2)) {
          setMessage('Both words must be valid and exist in the word list.');
          return;
        }

        if (!isOneLetterApart(currentWord, word1)) {
          setMessage('First word must differ by one letter from the current word.');
          setIncorrectWords((prev) => [...prev, word1]);
          return;
        }

        if (!isOneLetterApart(word1, word2)) {
          setMessage('Second word must differ by one letter from the first word.');
          setIncorrectWords((prev) => [...prev, word2]);
          return;
        }

        // Check if the end word is reached
        if (word2 === endWord) {
          setMessage('🎉 Congratulations! You completed the Word Ladder!');
          setCurrentWord(word2);
          setCompleted(true);
        } else {
          setMessage(`✅ Good job! Current word updated to "${word2}".`);
          setCurrentWord(word2);
        }
      }
    );

    return (
      <vstack alignment="center middle" height="100%" gap="large">
        {/* Game Title */}
        <text size="xlarge" weight="bold" color="blue">Word Ladder Game</text>

        {/* Display Start, End, and Current Words */}
        <hstack alignment="center middle" gap="medium">
          <text weight="bold">Start Word: {startWord}</text>
          <text weight="bold">End Word: {endWord}</text>
        </hstack>
        <text weight="bold" size="large">Current Word: {currentWord}</text>

        {/* Display Game Message */}
        {message && <text color={completed ? 'green' : 'red'}>{message}</text>}

        {/* Button to Open Form */}
        {!completed && (
          <button
            appearance="primary"
            onPress={() => {
              context.ui.showForm(wordForm);
            }}
          >
            Enter Words
          </button>
        )}

        {/* Reload Words Button */}
        <button
          appearance="secondary"
          onPress={reloadWords}
        >
          Reload Words
        </button>

        {/* List Incorrect Words */}
        {incorrectWords.length > 0 && (
          <vstack alignment="center middle" gap="small">
            <text weight="bold" color="orange">Incorrect Words:</text>
            {incorrectWords.map((word, index) => (
              <text key={index}>{word}</text>
            ))}
          </vstack>
        )}

        {/* Completion Message */}
        {completed && <text size="large" weight="bold" color="green">🎉 You completed the game!</text>}
      </vstack>
    );
  },
});

export default Devvit;
