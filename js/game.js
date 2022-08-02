// required objects: player, cell, board, display
// player factory
const Player = () => {
    const genName = () => {
        return [
            "Flavio",
            "Florence",
            "Fabian",
            "Felicity",
            "Finley",
            "Finlay",
            "Finn",
            "Felix",
            "Freya",
            "Faith",
            "Francisco",
            "Frank",
            "Fiona",
            "Fernando",
            "Finnegan",
            "Fatima",
            "Frances",
            "Francis",
            "Franklin",
            "Frank",
            "Forrest",
            "Ford",
        ][Math.floor(Math.random() * 22)]
    }
    let name = genName()
    let score = 0
    const getName = () => {
        return name
    }
    const setName = (newName) => {
        name = newName
    }
    const getScore = () => {
        return score
    }
    const bumpScore = () => {
        score++
    }

    return {
        getName,
        setName,
        getScore,
        bumpScore,
    }
}

// board module
// (0,2) (1,2) (2,2)
// (0,1) (1,1) (2,1)
// (0,0) (1,0) (2,0)
const boardController = (() => {
    const genBoard = () => {
        return Array(9).fill(null)
    }
    let board = genBoard()
    const mark = (x, y, marker) => {
        // TODO test for whether it is possible
        board[x + y] = marker
        // TODO test for win/draw and return true if game over
        return false
    }
    const getMarker = (x, y) => {
        return board[x + y]
    }
    const resetBoard = () => {
        board = genBoard()
    }
    return {
        mark,
        getMarker,
    }
})()

// display module
const display = (() => {
    const printBoard = (board) => {}
    return {
    }
})()

// game module
const gameController = (() => {
    const player1 = Player()
    const player2 = Player()

    const start = () => {
        const player1Form = document.getElementById("player_1_form")
        const player2Form = document.getElementById("player_2_form")

        player1Form.addEventListener("submit", (e) => {
            e.preventDefault()
            const formData = new FormData(player1Form)
            alert(formData.get("player_1_name"))
        })

        player2Form.addEventListener("submit", (e) => {
            e.preventDefault()
            const formData = new FormData(player2Form)
            alert(formData.get("player_2_name"))
        })
    }
    return {
        start,
    }
})()

gameController.start()
