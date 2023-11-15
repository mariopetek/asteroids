/**
 * Komponenta koja sadrži opće atribute i metode potrebne u klasama Player i Asteroid.
 */
class Component {
    /**
     * Kontekst crtanja Canvasa na kojem se iscrtava komponenta.
     */
    context

    /**
     * Širina komponente.
     */
    width

    /**
     * Visina komponente.
     */
    height

    /**
     * Boja ispune komponente.
     */
    color

    /**
     * Boja obruba komponente.
     */
    borderColor

    /**
     * X koordinata komponente na Canvasu.
     */
    x

    /**
     * Y koordinata komponente na Canvasu.
     */
    y

    /**
     * Brzina komponente u smjeru x osi.
     */
    speed_x

    /**
     * Brzina komponente u smjeru y osi.
     */
    speed_y

    /**
     * Postavlja svojstva konteksta crtanja te iscrtava komponentu na Canvasu.
     */
    update() {
        // Dohvaćanje konteksta crtanja.
        this.context = gameArea.context

        // Spremanje trenutnog stanja konteksta crtanja (stavljanje na stog).
        this.context.save()

        // Postavljanje boje ispune, boje i debljine obruba te sjene komponente.
        this.context.fillStyle = this.color
        this.context.strokeStyle = this.borderColor
        this.context.lineWidth = 2
        this.context.shadowBlur = 8
        this.context.shadowColor = 'rgba(0, 0, 0, 0.4)'

        // Prijenos konteksta na točku u kojoj se treba iscrtati komponenta (gornji lijevi kut pravokutnika).
        this.context.translate(this.x, this.y)

        // Iscrtavanje komponente s ispunom i obrubom.
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeRect(0, 0, this.width, this.height)

        // Resetiranje konteksta crtanja na zadnje spremljeno stanje (skidanje sa stoga).
        this.context.restore()
    }
}

/**
 * Igrač igre.
 */
class Player extends Component {
    /**
     * Pritisnute tipke na tipkovnici.
     */
    keyboardKeys

    /**
     * Postavlja širinu, visinu, boju ispune, boju obruba, poziciju i brzinu igrača.
     * @param width Širina igrača.
     * @param height Visina igrača.
     */
    constructor(width, height) {
        super()

        // Postavljanje veličine igrača.
        this.width = width
        this.height = height

        // Postavljanje crvene boje ispune i malo tamnije nijanse crvene boje za obrub igrača.
        this.color = 'rgb(255, 0, 0)'
        this.borderColor = 'rgb(150, 0, 0)'

        // Postavljanje pozicije igrača na sredinu Canvasa (pomaknuto za polovicu širine i dužine jer točka (x, y) predstavlja gornji lijevi kut pravokutnika).
        this.x = gameArea.context.canvas.width / 2 - this.width / 2
        this.y = gameArea.context.canvas.height / 2 - this.height / 2

        // Postavljanje brzine igrača u smjeru x i y osi.
        this.speed_x = this.speed_y = 4

        // Postavljanje pritisnutih tipki na prazan objekt.
        this.keyboardKeys = {}
    }

    /**
     * Ažurira poziciju igrača ovisno o pritisnutoj tipki na tipovnici.
     */
    newPos() {
        // U slučaju pritiska gornje strelice smanjuje se y koordinata igrača za brzinu u smjeru y osi i ne dozvoljava se da igrač izađe iz Canvasa kroz gornji rub.
        if (this.keyboardKeys['ArrowUp']) {
            if (this.y - this.speed_y < 0) {
                this.y = 0
            } else {
                this.y -= this.speed_y
            }
        }
        // U slučaju pritiska donje strelice povećava se y koordinata igrača za brzinu u smjeru y osi i ne dozvoljava se da igrač izađe iz Canvasa kroz donji rub.
        if (this.keyboardKeys['ArrowDown']) {
            if (
                this.y + this.height + this.speed_y >
                gameArea.context.canvas.height
            ) {
                this.y = gameArea.context.canvas.height - this.height
            } else {
                this.y += this.speed_y
            }
        }
        // U slučaju pritiska lijeve strelice smanjuje se x koordinata igrača za brzinu u smjeru x osi i ne dozvoljava se da igrač izađe iz Canvasa kroz lijevi rub.
        if (this.keyboardKeys['ArrowLeft']) {
            if (this.x - this.speed_x < 0) {
                this.x = 0
            } else {
                this.x -= this.speed_x
            }
        }
        // U slučaju pritiska desne strelice povećava se x koordinata igrača za brzinu u smjeru x osi i ne dozvoljava se da igrač izađe iz Canvasa kroz desni rub.
        if (this.keyboardKeys['ArrowRight']) {
            if (
                this.x + this.width + this.speed_x >
                gameArea.context.canvas.width
            ) {
                this.x = gameArea.context.canvas.width - this.width
            } else {
                this.x += this.speed_x
            }
        }
    }
}

/**
 * Asteroid kojeg igrač nastoji izbjeći.
 */
class Asteroid extends Component {
    /**
     * Postavlja širinu, visinu, poziciju, boju ispune, boju obruba i brzinu/smjer gibanja asteroida.
     */
    constructor() {
        super()

        // Postavljanje nasumične vrijednosti širine i visine asteroida iz intervala cijelih brojeva [30, 100].
        this.width = this.height =
            Math.floor(Math.random() * (100 + 1 - 30)) + 30

        // Odabir nasumičnog broja iz intervala cijelih brojeva [0, 3] koji predstavlja stranu na kojoj će se iscrtati asteroid.
        const randomSide = Math.floor(Math.random() * 4)
        switch (randomSide) {
            // 0 predstavlja gornju stranu Canvasa (postavljanje pozicije na način da se asteroid iscrta iznad gornjeg ruba Canvasa s nasumičnom x koordinatom).
            case 0: {
                this.x = Math.random() * gameArea.context.canvas.width
                this.y = -this.height - 200
                break
            }
            // 1 predstavlja donju stranu Canvasa (postavljanje pozicije na način da se asteroid iscrta ispod donjeg ruba Canvasa s nasumičnom x koordinatom).
            case 1: {
                this.x = Math.random() * gameArea.context.canvas.width
                this.y = gameArea.context.canvas.height + 200
                break
            }
            // 2 predstavlja lijevu stranu Canvasa (postavljanje pozicije na način da se asteroid iscrta ispred lijevog ruba Canvasa s nasumičnom y koordinatom).
            case 2: {
                this.x = -this.width - 200
                this.y = Math.random() * gameArea.context.canvas.height
                break
            }
            // 3 predstavlja desnu stranu Canvasa (postavljanje pozicije na način da se asteroid iscrta nakon desnog ruba Canvasa s nasumičnom y koordinatom).
            case 3: {
                this.x = gameArea.context.canvas.width + 200
                this.y = Math.random() * gameArea.context.canvas.height
                break
            }
        }

        // Odabir nasumične RGB vrijednosti iz intervala cijelih brojeva [80, 230] (postavljanje dobivene vrijednosti za R, G i B vrijednost daje nijansu sive boje) i postavljanje boje ispune te boje obruba asteroida.
        const randGreyRgbValue = Math.floor(Math.random() * (230 + 1 - 80)) + 80
        this.color = `rgb(${randGreyRgbValue}, ${randGreyRgbValue}, ${randGreyRgbValue})`
        this.borderColor = 'rgb(50, 50, 50)'

        // Odabir nasumične brzine asteroida u smjeru x i y osi iz intervala cijelih brojeva [1, 5].
        this.speed_x = Math.floor(Math.random() * (5 + 1 - 1)) + 1
        this.speed_y = Math.floor(Math.random() * (5 + 1 - 1)) + 1

        // Nasumičan odabir smjera gibanja asteroida (50% za lijevo/desno i 50% za gore/dolje).
        this.speed_x = Math.random() > 0.5 ? this.speed_x : -this.speed_x
        this.speed_y = Math.random() > 0.5 ? this.speed_y : -this.speed_y
    }

    /**
     * Ažurira poziciju asteroida i u slučaju da asteroid dosegne određenu granicu izvan Canvasa ažurira se smjer gibanja (odbijanje od nevidljive granice izvan Canvasa daje dojam da cijelo vrijeme pristižu novi asteroidi dok se zapravo vraća isti odbijeni asteroid).
     */
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
/**
 * Područje igre u kojem se icrtavaju komponente.
 * Sadrži odgovarajuće atribute i metode za početak te završetak igre.
 */
class GameArea {
    /**
     * Canvas na kojem se icrtavaju komponente.
     */
    canvas

    /**
     * Kontekst crtanja Canvasa na kojem se icrtavaju komponente.
     */
    context

    /**
     * Interval u kojem se poziva funkcija za ažuriranje iscrtavanja.
     */
    gameInterval

    /**
     * Kreira Canvas element.
     */
    constructor() {
        this.canvas = document.createElement('canvas')
    }

    /**
     * Postavlja parametre canvas elementa i dodaje ga u DOM te započinje interval ažuriranja iscrtavanja te interval ažuriranja brojača.
     */
    start() {
        // Dodavanje 'gameCanvas' vrijednosti u listu vrijednosti class atributa canvas elementa.
        this.canvas.classList.add('gameCanvas')

        // Postavljanje veličine canvas elementa na veličinu prozora.
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        // Dodavanje canvas elementa u DOM.
        document.body.insertBefore(this.canvas, document.body.childNodes[0])

        // Postavljanje konteksta crtanja Canvasa.
        this.context = this.canvas.getContext('2d')

        // Ažuriranje iscrtavanja svakih 20 milisekundi (poziv predane callback funkcije svakih 20 milisekundi).
        // Varijabla u koju se sprema rezultat funkcije setInterval služi kako bi preko nje mogli zaustaviti interval.
        this.gameInterval = setInterval(updateGameArea, 20)

        // Početak brojača.
        requestAnimationFrame(updateTimer)
    }

    /**
     * Zaustavlja iscrtavanje i brojač, ažurira local storage po potrebi te prikazuje dialog.
     */
    stop() {
        // Zaustavljanje intervala koji poziva funkciju za ažuriranje iscrtavanja.
        this.gameInterval = clearInterval(this.gameInterval)

        // Dohvaćanje vrijednosti iz local storagea te ako ona postoji uspoređujemo tu vrijednost s novodobivenim vremenom.
        // Ako je novodobiveno vrijeme veće, ažurira se vrijednost u local storageu.
        // Ako ne postoji vrijednost u local storageu, postavlja se vrijednost novodobivenog vremena.
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

        // Prikaz dialog elementa po završetku igre s ispisom trenutnog i najboljeg vremena te opcijom za ponovni početak igre.
        /*
        const gameFinishedDialog = document.querySelector('.gameFinishedDialog')
        document.querySelector(
            '.bestTime'
        ).innerHTML = `Najbolje vrijeme: ${localStorage.getItem('best')}`
        document.querySelector(
            '.currentTime'
        ).innerHTML = `Vrijeme: ${currentTime}`
        gameFinishedDialog.showModal()
        const playAgainButton = document.querySelector('.playAgainButton')
        playAgainButton.addEventListener('click', () => {
            gameFinishedDialog.close()
            location.reload()
        })
        */
    }
    /**
     * Čisti cijeli kontekst crtanja Canvasa.
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

// Instanciranje područja igre.
const gameArea = new GameArea()

// Početni broj asteroida koji će biti generiran pri početku igre.
const INITIAL_ASTEROIDS = 5

// Maksimalan broj asteroida koji je moguće generirati.
const MAX_ASTEROIDS = 25

// Vrijeme do ponovnog generiranja novog asteroida (u milisekundama).
const GENERATE_TIME = 2000

// Deklaracija igrača.
let player

// Inicijalizacija polja asteroida u koje će biti pohranjeni generirani asteroidi.
const asteroids = []

// Inicijalizacija brojača.
const timer = {
    min: 0,
    sec: 0,
    milli: 0,
    last: 0
}

/**
 * Započinje igru stvaranjem Canvasa, igrača i asteroida.
 */
function startGame() {
    // Postavljanje parametara Canvasa i umetanje u DOM.
    gameArea.start()

    // Stvaranje novog igrača.
    player = new Player(50, 50)

    // Stvaranje početnog broja asteroida.
    for (let i = 0; i < INITIAL_ASTEROIDS; i++) {
        asteroids.push(new Asteroid())
    }

    // Dodavanje listenera koji po pritisku tipke na tipkovnici uključuje pritisnutu tipku u atributu keyboardKeys objekta player.
    document.addEventListener('keydown', event => {
        player.keyboardKeys[event.key] = true
    })

    // Dodavanje listenera koji po prestanku pritiska tipke na tipkovnici isključuje tu tipku u atributu keyboardKeys objekta player.
    document.addEventListener('keyup', event => {
        player.keyboardKeys[event.key] = false
    })

    // Postavljanje intervala koji nakon zadanog vremena stvara novi asteroid do maksimalnog broja asteroida.
    const asteroidsInterval = setInterval(() => {
        asteroids.push(new Asteroid())
        if (asteroids.length === MAX_ASTEROIDS) {
            clearInterval(asteroidsInterval)
        }
    }, GENERATE_TIME)
}

/**
 * Ažurira iscrtavanje komponenti na Canvasu te također provjerava kolizije između igrača i bilo kojeg asteroida.
 * Poziva se kao callback svakih 20 milisekundi.
 */
function updateGameArea() {
    // Čišćenje konteksta crtanja Canvasa.
    gameArea.clear()

    // Ažuriranje pozicije igrača i iscrtavanje na Canvasu.
    player.newPos()
    player.update()

    // Ažuriranje pozicije i iscrtavanje svakog asteroida na Canvasu te zaustavljanje igre u slučaju kolizije nekog asteroida s igračem.
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

    // Postavljanje stila teksta.
    gameArea.context.textAlign = 'end'
    gameArea.context.font = '20px monospace'

    // Iscrtavanje teksta za najbolje vrijeme na Canvasu.
    const bestTime = localStorage.getItem('best') || '-'
    gameArea.context.fillText(
        `Najbolje vrijeme: ${bestTime}`,
        gameArea.context.canvas.width - 50,
        50
    )

    // Iscrtavanje teksta za trenutno vrijeme na Canvasu.
    const currentTime = `${String(timer.min).padStart(2, '0')}:${String(
        timer.sec
    ).padStart(2, '0')}.${String(timer.milli).padStart(3, '0')}`
    gameArea.context.fillText(
        `Vrijeme: ${currentTime}`,
        gameArea.context.canvas.width - 50,
        80
    )
}

/**
 * Ažurira atribute objekta timer (milisekunde, sekunde i minute).
 * Poziva se kao callback s jednim predefinitanim argumentom (timestamp) unutar requestAnimationFrame funkcije.
 */
function updateTimer(timestamp) {
    // Računanje vremena proteklog od zadnjeg prikaza okvira.
    const elapsed = timestamp - timer.last

    // Ažuriranje milisekundi, sekundi i minuti po potrebi.
    timer.milli = Math.floor(timer.milli + elapsed)
    if (timer.milli >= 1000) {
        timer.milli -= 1000
        timer.sec++
        if (timer.sec === 60) {
            timer.sec = 0
            timer.min++
        }
    }

    // Zahtjev za sljedećim okvirom ako igra još traje.
    if (gameArea.gameInterval) requestAnimationFrame(updateTimer)

    // Postavljanje vremena zadnjeg prikaza okvira.
    timer.last = timestamp
}

// Početak igre.
startGame()
