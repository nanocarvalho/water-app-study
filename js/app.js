const waterInside = document.querySelector("[data-js=water-inside]")
const percentText = document.querySelector("[data-js=water-inside-percent]")
const smallCups = [...document.querySelector("[data-js=small-cups]").children]
let waterPercent = 0
let quantityWithSelected = 0
//const timerToDrink = setInterval(()=>{}, 1000)

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

document.addEventListener('DOMContentLoaded', updateWithLocalStorage)

const updateWater = event => {
    changeSmallCupStyle(event)
    changeWaterInsideHeight(event)
    console.log(quantityWithSelected)
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

