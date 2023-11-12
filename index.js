class Component {
    context
    width
    height
    color
    borderColor
    x
    y
    speed_x
    speed_y
    update() {
        this.context = gameArea.context
        this.context.save()
        this.context.fillStyle = this.color
        this.context.strokeStyle = this.borderColor
        this.context.lineWidth = 2
        this.context.shadowBlur = 8
        this.context.shadowColor = 'rgba(0, 0, 0, 0.4)'
        this.context.translate(this.x, this.y)
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeRect(0, 0, this.width, this.height)
        this.context.restore()
    }
}

class Player extends Component {
    constructor(width, height) {
        super()
        this.width = width
        this.height = height
        this.color = 'rgb(255, 0, 0)'
        this.borderColor = 'rgb(150, 0, 0)'
        this.x = gameArea.context.canvas.width / 2 - this.width / 2
        this.y = gameArea.context.canvas.height / 2 - this.height / 2
        this.speed_x = this.speed_y = 10
    }
    newPos(key) {
        switch (key) {
            case 'ArrowUp': {
                if (this.y - this.speed_y < 0) {
                    this.y = 0
                } else {
                    this.y -= this.speed_y
                }
                break
            }
            case 'ArrowDown': {
                if (
                    this.y + this.height + this.speed_y >
                    gameArea.context.canvas.height
                ) {
                    this.y = gameArea.context.canvas.height - this.height
                } else {
                    this.y += this.speed_y
                }
                break
            }
            case 'ArrowLeft': {
                if (this.x - this.speed_x < 0) {
                    this.x = 0
                } else {
                    this.x -= this.speed_x
                }
                break
            }
            case 'ArrowRight': {
                if (
                    this.x + this.width + this.speed_x >
                    gameArea.context.canvas.width
                ) {
                    this.x = gameArea.context.canvas.width - this.width
                } else {
                    this.x += this.speed_x
                }
                break
            }
        }
    }
}

class Asteroid extends Component {
    constructor() {
        super()
        this.width = this.height =
            Math.floor(Math.random() * (100 + 1 - 30)) + 30
        const randomSide = Math.floor(Math.random() * 4)
        switch (randomSide) {
            // Top
            case 0: {
                this.x = Math.random() * gameArea.context.canvas.width
                this.y = -this.height - 200
                break
            }
            // Bottom
            case 1: {
                this.x = Math.random() * gameArea.context.canvas.width
                this.y = gameArea.context.canvas.height + 200
                break
            }
            // Left
            case 2: {
                this.x = -this.width - 200
                this.y = Math.random() * gameArea.context.canvas.height
                break
            }
            // Right
            case 3: {
                this.x = gameArea.context.canvas.width + 200
                this.y = Math.random() * gameArea.context.canvas.height
                break
            }
        }
        const randGreyRgbValue = Math.floor(Math.random() * (230 + 1 - 80)) + 80
        this.color = `rgb(${randGreyRgbValue}, ${randGreyRgbValue}, ${randGreyRgbValue})`
        this.borderColor = 'rgb(50, 50, 50)'
        this.speed_x = Math.floor(Math.random() * (5 + 1 - 1)) + 1
        this.speed_y = Math.floor(Math.random() * (5 + 1 - 1)) + 1
        this.speed_x = Math.random() > 0.5 ? this.speed_x : -this.speed_x
        this.speed_y = Math.random() > 0.5 ? this.speed_y : -this.speed_y
    }
    newPos() {
        if (this.x < -300) {
            this.speed_x = Math.abs(this.speed_x)
        } else if (this.x + this.width > gameArea.context.canvas.width + 300) {
            this.speed_x = this.speed_x > 0 ? -this.speed_x : this.speed_x
        }
        if (this.y < -300) {
            this.speed_y = Math.abs(this.speed_y)
        } else if (
            this.y + this.height >
            gameArea.context.canvas.height + 300
        ) {
            this.speed_y = this.speed_y > 0 ? -this.speed_y : this.speed_y
        }
        this.x += this.speed_x
        this.y += this.speed_y
    }
}

class GameArea {
    canvas
    context
    gameInterval
    timerInterval
    constructor() {
        this.canvas = document.createElement('canvas')
    }
    start() {
        this.canvas.classList.add('gameCanvas')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        document.body.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')
        this.gameInterval = setInterval(updateGameArea, 20)
        this.timerInterval = setInterval(updateTimer, 10)
    }
    stop() {
        clearInterval(this.gameInterval)
        clearInterval(this.timerInterval)
        const localStorageTime = localStorage.getItem('best')
        const currentTime = `${String(timer.min).padStart(2, '0')}:${String(
            timer.sec
        ).padStart(2, '0')}.${String(timer.milli).padStart(3, '0')}`
        if (localStorageTime) {
            const localStorageTimeMillis =
                Number(localStorageTime.split(':')[0]) * 60 * 1000 +
                Number(localStorageTime.split(':')[1].split('.')[0]) * 1000 +
                Number(localStorageTime.split(':')[1].split('.')[1])
            const currentTimeMillis =
                Number(currentTime.split(':')[0]) * 60 * 1000 +
                Number(currentTime.split(':')[1].split('.')[0]) * 1000 +
                Number(currentTime.split(':')[1].split('.')[1])
            if (currentTimeMillis > localStorageTimeMillis) {
                localStorage.setItem('best', currentTime)
            }
        } else {
            localStorage.setItem('best', currentTime)
        }
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

const gameArea = new GameArea()

const INITIAL_ASTEROIDS = 5
const MAX_ASTEROIDS = 20
const GENERATE_TIME = 2000 // milliseconds

let player
const asteroids = []

const timer = {
    min: 0,
    sec: 0,
    milli: 0
}

function startGame() {
    gameArea.start()
    player = new Player(50, 50)
    for (let i = 0; i < INITIAL_ASTEROIDS; i++) {
        asteroids.push(new Asteroid())
    }
    document.addEventListener('keydown', event => {
        player.newPos(event.key)
    })
    const asteroidsInterval = setInterval(() => {
        asteroids.push(new Asteroid())
        if (asteroids.length === MAX_ASTEROIDS) {
            clearInterval(asteroidsInterval)
        }
    }, GENERATE_TIME)
}

function updateGameArea() {
    gameArea.clear()
    player.update()
    asteroids.forEach(asteroid => {
        asteroid.newPos()
        asteroid.update()
        if (
            player.x <= asteroid.x + asteroid.width &&
            player.x + player.width >= asteroid.x &&
            player.y <= asteroid.y + asteroid.height &&
            player.y + player.height >= asteroid.y
        ) {
            gameArea.stop()
        }
    })
    gameArea.context.textAlign = 'end'
    gameArea.context.font = '25px Arial'
    const bestTime = localStorage.getItem('best') || '-'
    gameArea.context.fillText(
        `Najbolje vrijeme: ${bestTime}`,
        gameArea.context.canvas.width - 50,
        50
    )
    const currentTime = `${String(timer.min).padStart(2, '0')}:${String(
        timer.sec
    ).padStart(2, '0')}.${String(timer.milli).padStart(3, '0')}`
    gameArea.context.fillText(
        `Vrijeme: ${currentTime}`,
        gameArea.context.canvas.width - 50,
        80
    )
}

function updateTimer() {
    timer.milli += 10
    if (timer.milli === 1000) {
        timer.milli = 0
        timer.sec++
        if (timer.sec === 60) {
            timer.sec = 0
            timer.min++
        }
    }
}

startGame()
