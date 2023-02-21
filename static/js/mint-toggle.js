document.querySelector('#mint-info-toggle').addEventListener('click', () => {
    if (document.querySelector('.mint-info-bottom').getAttribute('hidden')) {
        document.querySelector('.mint-info-bottom').removeAttribute("hidden")
        document.querySelector('#mint-info-toggle').src = "/images/chevron-down.svg"
    }
    else {
        document.querySelector('.mint-info-bottom').setAttribute("hidden", true)
        document.querySelector('#mint-info-toggle').src = "/images/chevron-up.svg"

    }
})