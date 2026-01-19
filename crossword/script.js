// Crossword puzzle data structure
// Replace this with your actual crossword data
const crosswordData = {
    gridSize: { rows: 10, cols: 10 },
    
    // Black cells are represented as null
    // Numbers indicate the starting position of a word
    layout: [
        [1, 'W', 'W', 'W', null, 2, 'W', 'W', 'W', 'W'],
        ['W', null, 'W', null, null, 'W', null, 'W', null, null],
        [3, 'W', 'W', 'W', 'W', 'W', null, 'W', null, null],
        ['W', null, 'W', null, null, 'W', null, 'W', null, null],
        [4, 'W', 'W', 'W', 'W', null, 5, 'W', 'W', 'W'],
        ['W', null, 'W', null, null, null, 'W', null, 'W', null],
        [6, 'W', 'W', 'W', null, 7, 'W', 'W', 'W', 'W'],
        ['W', null, null, null, null, 'W', null, 'W', null, null],
        [8, 'W', 'W', 'W', 'W', 'W', null, 'W', null, null],
        ['W', null, null, null, null, 'W', null, 'W', null, null]
    ],
    
    // Define the correct answers for each word
    answers: {
        '1-across': 'WORD',
        '2-across': 'EXAMPLE',
        '3-across': 'PUZZLE',
        '4-across': 'ANSWER',
        '5-across': 'CLUE',
        '6-across': 'GRID',
        '7-across': 'SOLVE',
        '8-across': 'LETTER',
        '1-down': 'VERTICAL',
        '2-down': 'CROSSWORD'
    },
    
    clues: {
        across: [
            { number: 1, clue: 'Placeholder clue for 1 across (4 letters)' },
            { number: 2, clue: 'Placeholder clue for 2 across (7 letters)' },
            { number: 3, clue: 'Placeholder clue for 3 across (6 letters)' },
            { number: 4, clue: 'Placeholder clue for 4 across (6 letters)' },
            { number: 5, clue: 'Placeholder clue for 5 across (4 letters)' },
            { number: 6, clue: 'Placeholder clue for 6 across (4 letters)' },
            { number: 7, clue: 'Placeholder clue for 7 across (5 letters)' },
            { number: 8, clue: 'Placeholder clue for 8 across (6 letters)' }
        ],
        down: [
            { number: 1, clue: 'Placeholder clue for 1 down (8 letters)' },
            { number: 2, clue: 'Placeholder clue for 2 down (9 letters)' }
        ]
    },
    
    // Replace with your actual YouTube video link
    rewardLink: 'https://www.youtube.com/watch?v=PLACEHOLDER_VIDEO_ID'
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
    
    crosswordData.clues.across.forEach(clue => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="clue-number">${clue.number}.</span>${clue.clue}`;
        acrossClues.appendChild(li);
    });
    
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
    
    switch(e.key) {
        case 'ArrowRight':
            nextCol++;
            break;
        case 'ArrowLeft':
            nextCol--;
            break;
        case 'ArrowDown':
            nextRow++;
            break;
        case 'ArrowUp':
            nextRow--;
            break;
        case 'Backspace':
            if (!input.value) {
                // Move to previous cell if current is empty
                nextCol--;
            }
            break;
        default:
            // After typing a letter, move to next cell
            if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                nextCol++;
            }
            return;
    }
    
    e.preventDefault();
    focusCell(nextRow, nextCol);
}

// Focus on a specific cell
function focusCell(row, col) {
    const { rows, cols } = crosswordData.gridSize;
    
    // Wrap around or stay in bounds
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return;
    }
    
    const targetInput = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
    if (targetInput) {
        targetInput.focus();
    } else {
        // If it's a black cell, try to skip to the next one
        if (col < cols - 1) {
            focusCell(row, col + 1);
        } else if (row < rows - 1) {
            focusCell(row + 1, 0);
        }
    }
}

// Check if puzzle is completed correctly
function checkCompletion() {
    // For this placeholder implementation, just check if all cells are filled
    const inputs = document.querySelectorAll('.cell input');
    let allFilled = true;
    
    for (let input of inputs) {
        if (!input.value) {
            allFilled = false;
            break;
        }
    }
    
    if (allFilled) {
        // In a real implementation, you would check against the correct answers
        // For now, show completion when all cells are filled
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
