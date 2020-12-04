//Hamburger menu
const menuBtn = document.querySelector(`.menu-btn`)
const navigation = document.querySelector(`.navigation`)
const logo = document.querySelector(`#header-logo`)

menuBtn.addEventListener(`click`, () => {
    menuBtn.classList.toggle(`open`)
    navigation.classList.toggle(`mobile-slide-in`)
    logo.classList.toggle(`white`)
})


//Accordion
const services = Array.from(document.getElementsByClassName(`accordion`))

services.forEach(service => {
    service.addEventListener(`click`, () => {
        service.parentElement.classList.toggle(`active`)
        let accDropdown = service.nextElementSibling
        accDropdown.style.maxHeight ? accDropdown.style.maxHeight = null : accDropdown.style.maxHeight = `${accDropdown.scrollHeight}px`
    })
})



//Slider========================================================================================
const slidesData = []
//Render slider
function getSliderData() {
    fetch('./data/products.json')
        .then(response => response.json())
        .then(productData => productData.map((p, index) => {
            renderSlide(p, index)
            slidesData.push(p)
        }))
}

getSliderData()

const slideList = document.querySelector(`.slides`)
const slideWidth = { desktop: 175, tablet: 116, mobile: 96 }
const slideGap = { desktop: 20, tablet: 14, mobile: 12 }

function renderSlide(p, index) {
    let product = createSlide(p)
    product.style.left = `${getMoveDistance() * index}px`
    window.addEventListener(`resize`, () => {
        product.style.left = `${getMoveDistance() * index}px`
    })
    slideList.appendChild(product)
}

window.addEventListener(`resize`, () => {
    let currentSlides = document.querySelector(`.slides`)
    while (currentSlides.firstChild) {
        currentSlides.lastChild.remove()
    }
    slidesData.map((p, index) => renderSlide(p, index))
})

function createSlide(p) {
    let product = document.createElement("LI")
    product.className = `slide`
    let figure = document.createElement("FIGURE")
    let imageContainer = document.createElement("DIV")
    let image = document.createElement("IMG")
    image.src = p.imagePath
    let label = document.createElement("FIGCAPTION")
    label.innerHTML = p.label
    let price = document.createElement("SPAN")
    price.innerHTML = `€ ${p.price}`
    imageContainer.appendChild(image)
    figure.appendChild(imageContainer)
    figure.appendChild(label)
    figure.appendChild(price)
    product.appendChild(figure)
    return product
}

function getMoveDistance() {
    let moveDistance;
    if (window.outerWidth < 768) {
        moveDistance = slideWidth.mobile + slideGap.mobile
    } else if (window.outerWidth > 768 && window.outerWidth < 1180) {
        moveDistance = slideWidth.tablet + slideGap.tablet
    } else {
        moveDistance = slideWidth.desktop + slideGap.desktop
    }
    return moveDistance
}

const sliderButtons = document.querySelectorAll(`.slider-btn`)

sliderButtons.forEach(button => {
    button.addEventListener(`click`, event => {
        event.target.id === `previous` ? moveSlidesRight() : moveSlidesLeft()
        button.disabled = true
        setTimeout(() => button.disabled = false, 300)
    })
})

function moveSlidesRight() {
    let lastSlide = slidesData[slidesData.length - 1]
    let extraSlide = createSlide(lastSlide)
    slidesData.pop()
    slidesData.unshift(lastSlide)
    extraSlide.style.left = `${-getMoveDistance()}px`
    slideList.insertBefore(extraSlide, slideList.firstChild)
    const slides = Array.from(document.querySelectorAll(`.slide`))
    setTimeout(() => {
        slides.map(p => {
            let currentLeft = Number(p.style.left.slice(0, -2))
            p.style.left = `${currentLeft + getMoveDistance()}px`
        })
    }, 100)
    setTimeout(() => slideList.removeChild(slideList.lastChild), 300)
}

function moveSlidesLeft() {
    let firstSlide = slidesData[0]
    let extraSlide = createSlide(firstSlide)
    slidesData.shift()
    slidesData.push(firstSlide)
    extraSlide.style.left = `${getMoveDistance() * 5}px`
    slideList.appendChild(extraSlide)
    const slides = Array.from(document.querySelectorAll(`.slide`))
    setTimeout(() => {
        slides.map(p => {
            let currentLeft = Number(p.style.left.slice(0, -2))
            p.style.left = `${currentLeft - getMoveDistance()}px`
        })
    }, 100)
    setTimeout(() => slideList.removeChild(slideList.firstChild), 300)
}