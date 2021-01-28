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

function Snake(height, width, size) {

    let direction
    this.elemento = [novoElemento('div', 'snake')]

    this.getX = n => parseInt(this.elemento[n].style.left.split('px')[0])
    this.setX = (x, n) => this.elemento[n].style.left = `${x}px`
    this.getY = n => parseInt(this.elemento[n].style.bottom.split('px')[0])
    this.setY = (y, n) => this.elemento[n].style.bottom = `${y}px`

    window.addEventListener('keydown', e => {
        switch(e.key) {
            case 'w': case 'ArrowUp': if(direction != 'down') direction = 'up'; break
            case 'a': case 'ArrowLeft': if(direction != 'right') direction = 'left'; break
            case 's': case 'ArrowDown': if(direction != 'up') direction = 'down'; break
            case 'd': case 'ArrowRight': if(direction != 'left') direction = 'right'; break
        }
    })

    this.animation = () => {
        let newY
        let newX

        if(this.getX(0) == comida.getX() && this.getY(0) == comida.getY()) {

            area.removeChild(comida.elemento)
            comida = new Food(400, 700, 20)
            area.appendChild(comida.elemento)

            contador++
            
            this.elemento.push(novoElemento('div', 'snake'))
            area.appendChild(this.elemento[contador])
            this.setX(this.getX(contador-1), contador)
            this.setY(this.getY(contador-1), contador)
        }

        if(s) {

            if(this.getX(0) == scomida.getX() && this.getY(0) == scomida.getY()) {
    
                area.removeChild(scomida.elemento)
                s = false
    
                for(let i = 0; i < 5; i++) {
                    contador++
                    this.elemento.push(novoElemento('div', 'snake'))
                    area.appendChild(this.elemento[contador])
                    this.setX(this.getX(contador-1), contador)
                    this.setY(this.getY(contador-1), contador)            
                }
            }

        }

        switch(direction) {
            case 'up': newY = this.getY(0) + size; break
            case 'down': newY = this.getY(0) - size; break
            case 'right': newX = this.getX(0) + size; break
            case 'left': newX = this.getX(0) - size; break
        }

        const maxHeight = height - size
        const maxWidht = width - size

        for(let i = contador; i > 0; i--) {

            this.setX(this.getX(i-1), i)
            this.setY(this.getY(i-1), i)
        }

        if (newY < 0) this.setY(height - size, 0)
        else if (newY > maxHeight) this.setY(0, 0)
        else this.setY(newY, 0)

        if (newX < 0) this.setX(width - size, 0)
        else if (newX > maxWidht) this.setX(0, 0)
        else this.setX(newX, 0)

        document.querySelector('.points').innerHTML = contador
    }

    this.setX((Math.floor(Math.random()*(width/size)))*size, 0)
    this.setY((Math.floor(Math.random()*(height/size)))*size, 0)

}

function bateu(cobra, n) {

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

function TrocaCor(num) {
    let cor1, cor2

    if(num == 1) {
        cor1 = 'black'
        cor2 = 'white'
    } else {
        cor1 = 'white'
        cor2 = 'black'
    } 

    const cobra = document.querySelectorAll('.snake')
    cobra.forEach(element => element.style.background = cor1)

    document.body.style.background = cor2

    const info = document.querySelectorAll('.troca')
    info.forEach(element => element.style.color = cor1)
}

let s = false
let contador = 0

let comida = new Food(400, 700, 20)
const snake = new Snake(400, 700, 20)
const area = document.querySelector('.game')
area.appendChild(snake.elemento[0])
area.appendChild(comida.elemento)


function Start() {

    const temporizador = setTimeout(() => {
        snake.animation()

        if(contador%20 < 10) TrocaCor(0)
        else TrocaCor(1)
            

        if(!bateu(snake, contador)) Start()
        else {
            document.querySelector('.gameOver').style.visibility = 'visible'
            document.querySelector('.num').innerHTML = contador

            window.addEventListener('keypress', e => {
                if(e.key = 'space') document.location.reload()
            })
        }

    }, 80 - contador/3)

}

function Fruit() {
    
    const fruit = setInterval(() => {  

        if(bateu(snake, contador)) clearInterval(fruit)

        scomida = new SpecialFood(400, 700, 20)
        area.appendChild(scomida.elemento)   
        s = true

        setInterval(() => {
            scomida.elemento.style.visibility = 'visible'
            setTimeout(() => scomida.elemento.style.visibility = 'hidden', 500)

        }, 1000)
        
        setTimeout(() => {
            if(s) {
                area.removeChild(scomida.elemento)
                s = false
            }
        }, 5000)
                
        
    }, 10000)
    
}



// function Fruit() {
    
//     const aparece = setTimeout(() => {      
//         scomida = new SpecialFood(400, 700, 20)
//         area.appendChild(scomida.elemento)   
    
//     }, 5000)
    
//     const desaparece = setTimeout(() => {
//         if(snake.special) {
//             area.removeChild(scomida.elemento)
//             snake.special = false
//         }
//         Fruit()
//     }, 10000)
// }


Fruit()
Start()

