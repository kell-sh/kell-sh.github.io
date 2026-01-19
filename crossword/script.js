// Crossword puzzle data structure
const crosswordData = {
    gridSize: { rows: 13, cols: 6 },
    
    // Black cells are represented as null
    // Numbers indicate the starting position of a word
    layout: [
        [null, null, 3, null, null, null],
        [null, null, 'L', null, null, null],
        [null, null, 'L', 4, null, 6],
        [null, 2, 'L', 'L', null, 'L'],
        [null, 'L', 'L', 'L', null, 'L'],
        [null, 'L', 'L', 'L', null, 'L'],
        [null, 'L', 'L', 'L', null, 'L'],
        [1, 'L', 'L', 'L', 5, 'L'],
        ['L', 'L', null, null, 'L', null],
        ['L', null, null, null, 'L', null],
        ['L', null, null, null, 'L', null],
        [null, null, null, null, 'L', null],
        [null, null, null, null, 'L', null]
    ],
    
    // Define the correct answers for each word
    answers: {
        '1-across': 'CEYLON',
        '1-down': 'CHAI',
        '2-down': 'INGVER',
        '3-down': 'EARLGREY',
        '4-down': 'KUMMEL',
        '5-down': 'OOLONG',
        '6-down': 'SIDRUN'
    },
    
    clues: {
        across: [],
        down: [
            { number: 1, clue: 'Vürtsine piimatee' },
            { number: 2, clue: 'Tee, mis toetab immuunsüsteemi' },
            { number: 3, clue: 'Must tee bergamoti aroomiga' },
            { number: 4, clue: 'Tee, mis ravib kurku' },
            { number: 5, clue: 'Jake Peralta: Okay, slayer. Prepare to go to jail for ... time.' },
            { number: 6, clue: 'Tsitruseline tee' }
        ]
    },
    
    // YouTube reward video
    rewardLink: 'https://youtu.be/-mJiZqE0UE8'
};

// Generate the crossword grid
function generateGrid() {
    const grid = document.getElementById('crossword-grid');
    const { rows, cols } = crosswordData.gridSize;
    const { layout } = crosswordData;
    
    grid.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 40px)`;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const cellValue = layout[row][col];
            
            if (cellValue === null) {
                cell.classList.add('black');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = row;
                input.dataset.col = col;
                
                // Highlight Ceylon row (row 7)
                if (row === 7) {
                    cell.classList.add('ceylon-cell');
                }
                
                // Add event listeners
                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleKeydown);
                
                // Add number if cell starts a word
                if (typeof cellValue === 'number') {
                    const number = document.createElement('div');
                    number.className = 'cell-number';
                    number.textContent = cellValue;
                    cell.appendChild(number);
                }
                
                cell.appendChild(input);
            }
            
            grid.appendChild(cell);
        }
    }
}

// Generate clue lists
function generateClues() {
    const acrossClues = document.getElementById('across-clues');
    const downClues = document.getElementById('down-clues');
    
    // Hide across section if no across clues
    if (crosswordData.clues.across.length === 0) {
        acrossClues.parentElement.style.display = 'none';
    } else {
        crosswordData.clues.across.forEach(clue => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="clue-number">${clue.number}.</span>${clue.clue}`;
            acrossClues.appendChild(li);
        });
    }
    
    crosswordData.clues.down.forEach(clue => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="clue-number">${clue.number}.</span>${clue.clue}`;
        downClues.appendChild(li);
    });
}

// Handle input in cells
function handleInput(e) {
    const input = e.target;
    if (input.value) {
        input.value = input.value.toUpperCase();
        checkCompletion();
    }
}

// Handle keyboard navigation
function handleKeydown(e) {
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    
    let nextRow = row;
    let nextCol = col;
    let shouldMove = true;
    
    switch(e.key) {
        case 'ArrowRight':
            e.preventDefault();
            nextCol++;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            nextCol--;
            break;
        case 'ArrowDown':
            e.preventDefault();
            nextRow++;
            break;
        case 'ArrowUp':
            e.preventDefault();
            nextRow--;
            break;
        case 'Backspace':
            if (input.value) {
                // Clear current cell content
                input.value = '';
                checkCompletion();
                shouldMove = false;
            } else {
                // Move to previous cell (up) if current is empty
                nextRow--;
            }
            e.preventDefault();
            break;
        case 'Delete':
            // Clear current cell without moving
            input.value = '';
            checkCompletion();
            shouldMove = false;
            e.preventDefault();
            break;
        default:
            // After typing a letter, move to next cell (down)
            if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                // Let the input event handle the value, then move down
                setTimeout(() => {
                    focusCell(row + 1, col);
                }, 0);
            }
            return;
    }
    
    if (shouldMove) {
        focusCell(nextRow, nextCol);
    }
}

// Focus on a specific cell
function focusCell(row, col) {
    const { rows, cols } = crosswordData.gridSize;
    
    // If we're going past the bottom, move to top of next column
    if (row >= rows) {
        if (col + 1 < cols) {
            focusCell(0, col + 1);
            return;
        } else {
            // At bottom of last column, stay at last valid cell
            return;
        }
    }
    
    // If we're going past the top, move to bottom of previous column
    if (row < 0) {
        if (col - 1 >= 0) {
            focusCell(rows - 1, col - 1);
            return;
        } else {
            // At top of first column, stay at first valid cell
            return;
        }
    }
    
    // Stay in bounds for columns
    if (col < 0 || col >= cols) {
        return;
    }
    
    const targetInput = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
    if (targetInput) {
        targetInput.focus();
    } else {
        // If it's a black cell, try to skip to the next one going down
        if (row + 1 < rows) {
            focusCell(row + 1, col);
        } else if (col + 1 < cols) {
            // End of column, move to top of next column
            focusCell(0, col + 1);
        }
    }
}

// Check if puzzle is completed correctly
function checkCompletion() {
    const inputs = document.querySelectorAll('.cell input');
    let allFilled = true;
    
    // First check if all cells are filled
    for (let input of inputs) {
        if (!input.value) {
            allFilled = false;
            break;
        }
    }
    
    if (!allFilled) {
        return;
    }
    
    // Now validate the answers
    const userAnswers = {};
    
    // Get 1-across (CEYLON) - row 7, cols 0-5
    userAnswers['1-across'] = '';
    for (let col = 0; col < 6; col++) {
        const input = document.querySelector(`input[data-row="7"][data-col="${col}"]`);
        userAnswers['1-across'] += input.value;
    }
    
    // Get 1-down (CHAI) - col 0, rows 7-10
    userAnswers['1-down'] = '';
    for (let row = 7; row <= 10; row++) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="0"]`);
        userAnswers['1-down'] += input.value;
    }
    
    // Get 2-down (INGVER) - col 1, rows 3-8
    userAnswers['2-down'] = '';
    for (let row = 3; row <= 8; row++) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="1"]`);
        userAnswers['2-down'] += input.value;
    }
    
    // Get 3-down (EARLGREY) - col 2, rows 0-7
    userAnswers['3-down'] = '';
    for (let row = 0; row <= 7; row++) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="2"]`);
        userAnswers['3-down'] += input.value;
    }
    
    // Get 4-down (KUMMEL) - col 3, rows 2-7
    userAnswers['4-down'] = '';
    for (let row = 2; row <= 7; row++) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="3"]`);
        userAnswers['4-down'] += input.value;
    }
    
    // Get 5-down (OOLONG) - col 4, rows 7-12
    userAnswers['5-down'] = '';
    for (let row = 7; row <= 12; row++) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="4"]`);
        userAnswers['5-down'] += input.value;
    }
    
    // Get 6-down (SIDRUN) - col 5, rows 2-7
    userAnswers['6-down'] = '';
    for (let row = 2; row <= 7; row++) {
        const input = document.querySelector(`input[data-row="${row}"][data-col="5"]`);
        userAnswers['6-down'] += input.value;
    }
    
    // Check if all answers are correct
    let allCorrect = true;
    for (let key in crosswordData.answers) {
        if (userAnswers[key] !== crosswordData.answers[key]) {
            allCorrect = false;
            break;
        }
    }
    
    if (allCorrect) {
        showCompletionMessage();
    }
}

// Show completion message with reward link
function showCompletionMessage() {
    const message = document.getElementById('completion-message');
    const link = document.getElementById('reward-link');
    
    link.href = crosswordData.rewardLink;
    message.classList.remove('hidden');
    
    // Scroll to the message
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize the crossword on page load
document.addEventListener('DOMContentLoaded', () => {
    generateGrid();
    generateClues();
});
