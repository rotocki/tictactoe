'use strict';

function readGameGridFromDocument() {
    const rows = document.getElementsByClassName('gameRow');

    let gameGrid = [];
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];
        let cells = row.children;
        let gameGridRow = [];
        for (let cellIdx = 0; cellIdx < cells.length; cellIdx++) {
            const cell = cells[cellIdx];
            gameGridRow.push({
                row: row.dataset['rowId'], 
                column: cell.dataset['cellId'], 
                content: cell.textContent
            });
        }
        gameGrid.push(gameGridRow);
    }

    return gameGrid;
}

function getHorizontalAnswers(grid) {
    let horizontalAnswers = [];
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        const row = grid[rowIdx];
        let answer = '';
        let indicesOfFields = [];
        for (let cellIdx = 0; cellIdx < row.length; cellIdx++) {
            const cell = row[cellIdx];
            answer += cell.content;
            indicesOfFields.push([cell.row, cell.column]);
        }
        horizontalAnswers.push({content: answer, indices: indicesOfFields});
    }
    return horizontalAnswers;
}

function getVerticalAnswers(grid) {
    let verticalAnswers = [
        {content: '', indices: []}, 
        {content: '', indices: []}, 
        {content: '', indices: []}
    ];
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        const row = grid[rowIdx];
        for (let cellIdx = 0; cellIdx < row.length; cellIdx++) {
            const cell = row[cellIdx];
            verticalAnswers[cellIdx].content += cell.content;
            verticalAnswers[cellIdx].indices.push([cell.row, cell.column]);
        }
    }
    return verticalAnswers;
}

function getDiagonalAnswers(grid) {
    let diagonalIterationOrder = [[[0, 0], [1, 1], [2, 2]], [[2, 0], [1, 1], [0, 2]]];
    let diagonalAnswers = [];
    for (let iterationOrderIdx = 0; iterationOrderIdx < diagonalIterationOrder.length; iterationOrderIdx++) {
        const iterationOrder = diagonalIterationOrder[iterationOrderIdx];
        let answer = '';
        let indicesOfFields = [];
        for (let cellLocationIdx = 0 ; cellLocationIdx < iterationOrder.length; cellLocationIdx++) {
            const cellLocation = iterationOrder[cellLocationIdx];
            const rowIdx = cellLocation[0];
            const columnIdx = cellLocation[1];
            const cell = grid[rowIdx][columnIdx];
            answer += cell.content;
            indicesOfFields.push([rowIdx, columnIdx]);
        }
        diagonalAnswers.push({content: answer, indices: indicesOfFields});
    }
    return diagonalAnswers;
}

function getAllAnswers(grid) {
    let answers = getHorizontalAnswers(grid);
    answers = answers.concat(getVerticalAnswers(grid));
    answers = answers.concat(getDiagonalAnswers(grid));
    return answers;
}

function highlightWinningCells(answer) {
    const rows = document.getElementsByClassName('gameRow');
    const allIndices = answer.indices;
    for (let indicesIdx = 0; indicesIdx < allIndices.length; indicesIdx++) {
        const indices = allIndices[indicesIdx];
        let x = indices[0];
        let y = indices[1];
        rows[x].children[y].className += ' winning';
    }
}

function checkIfSomeoneWon() {
    const grid = readGameGridFromDocument();
    const answers = getAllAnswers(grid);
    for (let answerIdx = 0; answerIdx < answers.length; answerIdx++) {
        const answer = answers[answerIdx];
        if (answer.content.indexOf('XXX') !== -1) {
            highlightWinningCells(answer);
            alert("X's win");
            return true;
        }
        if (answer.content.indexOf('OOO') !== -1) {
            highlightWinningCells(answer);
            alert("O's win");
            return true;
        }
    }
    return false;
}

function clearGameCells() {
    const gameCells = document.getElementsByClassName('gameCell');
    for (let gameCellIdx = 0; gameCellIdx < gameCells.length; gameCellIdx++) {
        const gameCell = gameCells[gameCellIdx];
        gameCell.innerHTML = '&nbsp;';
        if (gameCell.className === 'gameCell winning') {
            gameCell.className = 'gameCell';
        }
    }
}

function startGame() {
    let fieldsNotSelected = 9;
    let gameFinished = false;
    let characterSign = 'X';

    document.getElementById('tictactoe').addEventListener('click', function (event) {
        //console.log(event.target);
        const targetElement = event.target;

        if (targetElement.type === 'button') {
            if (targetElement.id === 'restartButton') {
                clearGameCells();
                fieldsNotSelected = 9;
                characterSign = 'X';
                gameFinished = false;
                return;
            }
        }

        if (gameFinished) {
            return;
        }

        const currentTextContent = event.target.textContent;
        if ((currentTextContent !== 'X') && (currentTextContent !== 'O')) {
            event.target.textContent = characterSign;
            characterSign = (characterSign === 'X') ? 'O' : 'X';
            fieldsNotSelected--;
            
            if (checkIfSomeoneWon()) {
                gameFinished = true;
                return;
            }
        }

        if (fieldsNotSelected === 0) {
            alert('Draw!');
        }
    }, false);
}

startGame();