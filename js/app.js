const waterInside = document.querySelector("[data-js=water-inside]")
const percentText = document.querySelector("[data-js=water-inside-percent]")
const smallCups = [...document.querySelector("[data-js=small-cups]").children]
let waterPercent = 0
let quantityWithSelected = 0

//just to test
let daysPassed = 0

//Notification system
const startNotification = () => {
/*     if(Notification.permission === "granted") {
        showNotification()
        timerToDrink()
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if(Notification.permission === "granted") {
                showNotification() 
                timerToDrink()
            }
        })
    } */

    if(Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if(Notification.permission === "granted") {
                showNotification() 
                timerToDrink()
            }
        })
} 
}

const showNotification = () => {
    const notification = new Notification('hora de beber água!', {
        body: "Essa notificação serve para a cada 1 hora, um aviso para tomar água seja emitido!",
        //icon:
    })
}

const timerToDrink = () => {
    const hourInMS = 60 * 60 * 1000
    const timerToDrink = setInterval(()=>{
        showNotification()

        if(waterPercent === 100) {
            timerToReset()
            clearInterval(timerToDrink)   
        }
    }, hourInMS)
}

const timerToReset = () => {
    console.log('entrou no reset')
    const dayAfter = (60 * 60 * 1000) * 6

    const timerReset = setInterval(()=>{
        localStorage.setItem('waterPercent', 0)
        localStorage.setItem('quantitySelected', 0)
        startNotification() 
        daysPassed += 1
        localStorage.setItem('daysPassed', daysPassed)
        clearInterval(timerReset)
    }, dayAfter)
}

const updateWithLocalStorage = () => {
    if(localStorage.quantitySelected > 1) {
        for(let index = 0; index < localStorage.quantitySelected; index++) {
            smallCups[index].classList.add('selected') 
        } 
        quantityWithSelected = Number(localStorage.quantitySelected)
    }

    if(localStorage.waterPercent > 0) { 
        waterPercent = Number(localStorage.waterPercent)
        waterInside.style.height = `${localStorage.waterPercent}%`
        percentText.textContent = `${localStorage.waterPercent}%` 
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    updateWithLocalStorage()
    startNotification()
})

const updateWater = event => {
    changeSmallCupStyle(event)
    changeWaterInsideHeight(event)
}

const changeWaterInsideHeight = event => {
    
    if(!event.target.classList.contains('selected')) {
        waterPercent -= 12.5
    } else {
        waterPercent += 12.5
    }

    //atualiza certinho aqui, após o percent ser atualizado pelo if
    localStorage.setItem('waterPercent', waterPercent)

    //here I transform the waterPercent to string, to update the css properly
    let heightUpdate = waterPercent.toString()
    waterInside.style.height = `${heightUpdate}%`
    percentText.textContent = `${heightUpdate}%`
    
}

//small cup class toggle
const changeSmallCupStyle = event => {
    if(event.target.classList.contains('selected')) {
        quantityWithSelected -= 1
        event.target.classList.remove('selected')
    } else {
        quantityWithSelected += 1
        event.target.classList.add('selected')
    }

    localStorage.setItem('quantitySelected', quantityWithSelected)
}

//listeners

smallCups.forEach(cup => {
    cup.addEventListener('click', updateWater)
})

