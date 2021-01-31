function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function SpecialFood(height, width, size) {
    this.elemento = novoElemento('img', 'specialFood')
    this.elemento.style.left = `${(Math.floor(Math.random()*(width/size)))*size}px`
    this.elemento.style.bottom = `${(Math.floor(Math.random()*(height/size)))*size}px`
    this.elemento.src = 'star.png'

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
}


function Food(height, width, size) {
    this.elemento = novoElemento('div', 'food')
    this.elemento.style.left = `${(Math.floor(Math.random()*(width/size)))*size}px`
    this.elemento.style.bottom = `${(Math.floor(Math.random()*(height/size)))*size}px`
    this.elemento.style.background = GeraCor(cores)

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
}

function Cresce(snake) {
    snake.elemento.push(novoElemento('div', 'snake'))
    if(contador % 40 > 19) snake.elemento[contador].style.background = 'black'

    snake.setX(snake.getX(contador-1), contador)
    snake.setY(snake.getY(contador-1), contador)
    area.appendChild(snake.elemento[contador])
}

function Comer(snake) {

    if(snake.getX(0) == food.getX() && snake.getY(0) == food.getY()) {

        area.removeChild(food.elemento)

        food = new Food(400, 700, 20)
        area.appendChild(food.elemento)

        contador++
        if(contador % 20 == 0) TrocaCor()

        Cresce(snake)
    }
}

function ComerSpecial(snake) {

    if(snake.getX(0) == scomida.getX() && snake.getY(0) == scomida.getY()) {
    
        area.removeChild(scomida.elemento)
        s = false

        for(let i = 0; i < 5; i++) {
            contador++
            Cresce(snake)          
        }

        TrocaCor()

        document.body.style.background = 'gold'
        setTimeout(() => {
            document.body.style.background = contador % 40 > 19 ? 'white' : 'black'
        }, 400);
    }
}

function Snake(height, width, size) {
    
    this.elemento = [novoElemento('div', 'snake')]
    
    this.getX = n => parseInt(this.elemento[n].style.left.split('px')[0])
    this.setX = (x, n) => this.elemento[n].style.left = `${x}px`
    this.getY = n => parseInt(this.elemento[n].style.bottom.split('px')[0])
    this.setY = (y, n) => this.elemento[n].style.bottom = `${y}px`
    
    this.setX((Math.floor(Math.random()*(width/size)))*size, 0)
    this.setY((Math.floor(Math.random()*(height/size)))*size, 0)

    let direction

    window.addEventListener('keydown', e => {
        switch(e.key) {
            case 'w': case 'ArrowUp': if(direction != 'down') direction = 'up'; break
            case 'a': case 'ArrowLeft': if(direction != 'right') direction = 'left'; break
            case 's': case 'ArrowDown': if(direction != 'up') direction = 'down'; break
            case 'd': case 'ArrowRight': if(direction != 'left') direction = 'right'; break
        }
    })
    
    this.animation = (snake, food) => {

        let newY
        let newX

        Comer(snake)

        if(s) ComerSpecial(snake, scomida)

        switch(direction) {
            case 'up': newY = this.getY(0) + size; break
            case 'down': newY = this.getY(0) - size; break
            case 'right': newX = this.getX(0) + size; break
            case 'left': newX = this.getX(0) - size; break
        }

        for(let i = contador; i > 0; i--) {

            this.setX(this.getX(i-1), i)
            this.setY(this.getY(i-1), i)
        }

        if (newY < 0) this.setY(height - size, 0)
        else if (newY > height - size) this.setY(0, 0)
        else this.setY(newY, 0)

        if (newX < 0) this.setX(width - size, 0)
        else if (newX > width - size) this.setX(0, 0)
        else this.setX(newX, 0)
    }
}

function Bateu(cobra, n) {

    let bateu = false
    for(let i = 1; i <= n; i++) {
        if(cobra.getX(i) == cobra.getX(0) && cobra.getY(i) == cobra.getY(0)) bateu = true
    }

    return bateu
}

let cores = ["#FFDAB9", "#0000FF", "#3CB371", "#FFFF00", "#FF0000", "#FF69B4", "#8A2BE2", "#FF8C00", "#00CED1"]

function GeraCor(cores) {
    const cor = Math.floor(Math.random()*cores.length)
    return cores[cor]
}

function TrocaCor() {

    resto = contador % 40 > 19

    const cobra = document.querySelectorAll('.snake')
    const info = document.querySelectorAll('.troca')

    document.body.style.background = resto ? 'white' : 'black'
    cobra.forEach(element => element.style.background = resto ? 'black' : 'white')
    info.forEach(element => element.style.color = resto ? 'black' : 'white')
}



function Start(snake) {
    
    if(!Bateu(snake, contador)) {

        setTimeout(() => {     
            
            snake.animation(snake)    
            
            Points()                

            Start(snake)
            
        }, 80 - contador/3)
    
    }   
    else Restart()
}

function Fruit() {

    fruit = setInterval(() => {

        scomida = new SpecialFood(400, 700, 20)
        area.appendChild(scomida.elemento)
        s = true
        scomida.elemento.style.visibility = 'visible'

        let i = 0
        setTimeout(() => {

            pisca = setInterval(() => {

                scomida.elemento.style.visibility = 'hidden'
                setTimeout(() => {
                    scomida.
                    elemento.style.visibility = 'visible'
                    i++
                }, 500)
                if(i == 3) {
                    if(s) {
                        area.removeChild(scomida.elemento)
                        s = false
                    }
                    clearInterval(pisca)
                }
            }, 1000)
            
        }, 1000)

    }, 10000)
}

function Points() {

    document.querySelector('.points').innerHTML = contador      
    document.querySelector('.highscore').innerHTML = `Recorde: ${highscore}` 

    if (contador > highscore) {
        highscore = contador

        if (first) {
            first = false

            document.body.style.background = 'red'
            document.querySelector('.recorde').style.opacity = 1
            if(contador % 40 > 19) document.querySelector('.recorde').style.color = 'black'

            setTimeout(() => {
                document.body.style.background = contador % 40 > 19 ? 'white' : 'black'
                document.querySelector('.recorde').style.opacity = 0
            }, 2000)

            setTimeout(() => {
                document.querySelector('.recorde').style.opacity = 0
            }, 1500)


        }
    }
}

let fruit, pisca
let s = false
let contador = 0
let highscore = 0
let first = false


let food = new Food(400, 700, 20)
let snake = new Snake(400, 700, 20)
const area = document.querySelector('.game')


function Restart() {

    clearInterval(fruit)

    document.querySelector('.gameOver').style.opacity = '1'

    if(contador > highscore) highscore = contador
    document.querySelector('.num').innerHTML = contador
    document.querySelector('.high').innerHTML = highscore   

    const cobra = document.querySelectorAll('.snake')
    cobra.forEach(element => area.removeChild(element))
    area.removeChild(food.elemento)         

    window.addEventListener('keyup', teste)
}
    
    
const teste =  event => {

    if (event.code === 'Space') {

        document.querySelector('.gameOver').style.opacity = '0'             
        contador = 0
        first = true
        TrocaCor()
        Game()
    }  
}
    
function Game() {   
        
    window.removeEventListener('keyup', teste)     
        
    area.style.opacity = 1
    snake = new Snake(400, 700, 20)
    food = new Food(400, 700, 20)
    area.appendChild(snake.elemento[0])
    area.appendChild(food.elemento)
    Fruit()
    Start(snake)
}

Game()

