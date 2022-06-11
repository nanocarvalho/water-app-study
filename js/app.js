const waterInside = document.querySelector('[data-js="water-inside"]')
const percentText = document.querySelector('[data-js="water-inside-percent"]')
const percentActual = document.querySelector('[data-js="percent-Actual"]')
const smallCups = [...document.querySelector('[data-js="small-cups"]').children]
let waterPercent = 0
let quantityWithSelected = 0

//Notification system
const startNotification = () => {
     if(Notification.permission === "granted") {
        showNotification()
        timerToDrink()
        //If the user didn't denied the permission, ask for
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if(Notification.permission === "granted") {
                showNotification() 
                timerToDrink()
            }
        })
    }
}

//Notification body
const showNotification = () => {
    const notification = new Notification('Bora beber água!', {
        body: "Essa notificação serve para que a cada 1 hora, um aviso para tomar água seja emitido!",
        //icon:
    })
}

//Every one hour, call the notification again
const timerToDrink = () => {
    const hourInMS = 60 * 60 * 1000
    const timerDrink = setInterval(()=>{
        showNotification()

        //And stops the notification if the water is filled
        if(waterPercent === 100) {
            timerToReset()
            clearInterval(timerDrink)   
        }
    }, hourInMS)
}

//If it reached 100%, set a timer to 6 hours, and reset the percent after
const timerToReset = () => {
    const dayAfter = (60 * 60 * 1000) * 6

    const timerReset = setInterval(()=>{
        localStorage.setItem('waterPercent', 0)
        localStorage.setItem('quantitySelected', 0)
		startNotification()
        clearInterval(timerReset)
    }, dayAfter)
}

//To handle the local storage system
const updateWithLocalStorage = () => {
    //Loop and add the class based on the selected stored
    if(localStorage.quantitySelected > 1) {
        for(let index = 0; index < localStorage.quantitySelected; index++) {
            smallCups[index].classList.add('selected') 
        } 
        quantityWithSelected = Number(localStorage.quantitySelected)
    }

    //Retrieve the percent, and update the visual
    if(localStorage.waterPercent > 0) { 
        //here I prevent a bug, setting the water percent to the amount of cups selecter * 12.5(percent)
        waterPercent = Number(quantityWithSelected * 12.5)
        waterInside.style.height = `${localStorage.waterPercent}%`
        percentText.textContent = `${localStorage.waterPercent}%` 
    }
}

//Call when loaded
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

    //Stores the percent
    localStorage.setItem('waterPercent', waterPercent)
    
    //here I transform the waterPercent to string, to update the css properly
    //I needed the if, because sometimes the percent doesn't stores properly
    let heightUpdate = waterPercent.toString()
    waterInside.style.height = `${heightUpdate}%`
    percentText.textContent = `${heightUpdate}%`
    percentActual.textContent = `${heightUpdate / 50}L`

    
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

