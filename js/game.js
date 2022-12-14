// required objects: player, cell, board, display
// player factory
let nameList = [
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
]

const Player = (playerNumber, playerMarker) => {
    const number = playerNumber
    const num = () => {
        return number
    }
    const marker = playerMarker
    const mark = () => {
        return marker
    }
    const genName = () => {
        const nameSelect = nameList[Math.floor(Math.random() * nameList.length)]
        nameList = nameList.filter((name) => {
            return name != nameSelect
        })
        return nameSelect
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
    const bumpScoreWin = () => {
        score += 3
        const scoreCounter = document.getElementById(`player_${number}_score`)
        scoreCounter.textContent = `[${score}]`
    }
    const bumpScoreDraw = () => {
        score += 1
        const scoreCounter = document.getElementById(`player_${number}_score`)
        scoreCounter.textContent = `[${score}]`
    }

    return {
        num,
        mark,
        getName,
        setName,
        getScore,
        bumpScoreWin,
        bumpScoreDraw,
    }
}

// board coords (like a cartesian graph)
// (0,2) (1,2) (2,2)
// (0,1) (1,1) (2,1)
// (0,0) (1,0) (2,0)
const board = (() => {
    const genBoard = () => {
        return new Array(9).fill(null)
    }
    const boardArray = genBoard()
    const resetBoard = () => {
        boardArray.fill(null)
    }
    const winningPositions = [
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 0],
    ]
    const testGameWon = (player) => {
        const testBoardArray = boardArray.map((value) => {
            if (value == player.mark()) return 1
            else return null
        })
        return winningPositions.some((arr) => {
            // has to have three in common for it to match
            let numCorrect = 0
            arr.forEach((value, index) => {
                if (value == testBoardArray[index]) numCorrect++
            })
            if (numCorrect == 3) return true
        })
    }

    const testGameDraw = () => {
        return boardArray.every((value) => {
            return value != null
        })
    }
    const mark = (index, player) => {
        index = parseInt(index)
        boardArray[index] = player.mark()

        if (testGameWon(player)) return "win"
        if (testGameDraw()) return "draw"

        return null
    }
    return {
        resetBoard,
        mark,
    }
})()

// game module
const gameController = (() => {
    const player1 = Player(1, "X")
    const player2 = Player(2, "O")
    let gameCount = 0

    // links the player name forms to the player variables for use in
    // dialogue to make it personalised etc...
    const handlePlayerNaming = (player) => {
        const form = document.getElementById(`player_${player.num()}_form`)
        const input = document.getElementById(`player_${player.num()}_name`)
        input.setAttribute("value", player.getName())

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            player.setName(
                new FormData(form).get(`player_${player.num()}_name`)
            )
            input.setAttribute("value", player.getName())
        })
    }

    const handleReset = (abort) => {
        const resetButton = document.getElementById("reset")
        resetButton.addEventListener(
            "click",
            () => {
                abort.abort()
                board.resetBoard()
                beginRound()
            },
            { once: true }
        )
    }

    const setupBoard = (abort) => {
        const boardNode = document.getElementById("board")
        boardNode.childNodes.forEach((cell) => {
            cell.textContent = ""
        })
        boardNode.childNodes.forEach((cell) => {
            cell.addEventListener("click", handleSelection(abort), {
                once: true,
                signal: abort.signal,
            })
        })
    }

    const message = (text) => {
        const messageDiv = document.getElementById("message")
        messageDiv.textContent = text
        messageDiv.classList.remove("invisible")
        messageDiv.classList.add("message-animate")

        const abort = new AbortController()
        messageDiv.addEventListener(
            "animationend",
            () => {
                messageDiv.classList.add("invisible")
                messageDiv.classList.remove("message-animate")
            },
            { once: true, signal: abort.signal }
        )
        messageDiv.addEventListener(
            "click",
            () => {
                messageDiv.classList.add("invisible")
                messageDiv.classList.remove("message-animate")
                abort.abort()
            },
            { once: true }
        )
    }

    let currentPlayer = player1

    // closure around a handleEvent function to allow out of scope
    // dependencies such as the abort signaller to enable deletion of
    // eventHandlers when round is deemed to be over
    const handleSelection = (abort) => {
        return (event) => {
            event.target.textContent = currentPlayer.mark()
            const index = event.target.getAttribute("id")

            // "win", "draw" or null
            const status = board.mark(index, currentPlayer)
            if (!status) {
                currentPlayer = currentPlayer === player1 ? player2 : player1
                return
            }

            if (status == "win") {
                message(`${currentPlayer.getName()} wins!`)
                currentPlayer.bumpScoreWin()
            }

            if (status == "draw") {
                message("Draw!")
                player1.bumpScoreDraw()
                player2.bumpScoreDraw()
            }

            gameCount++
            document.getElementById(
                "game-count"
            ).textContent = `(${gameCount} games played)`
            abort.abort()
        }
    }

    const beginRound = () => {
        const abort = new AbortController()
        setupBoard(abort)
        handleReset(abort)
    }

    const start = () => {
        handlePlayerNaming(player1)
        handlePlayerNaming(player2)

        beginRound()
    }
    return {
        start,
    }
})()

gameController.start()
