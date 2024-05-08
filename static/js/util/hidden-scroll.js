/**
 * 
 * @param {HTMLElement} element 
 */
function HiddenScroll(element) {
    element.addEventListener('wheel', e => {
        element.scroll({
            top: element.scrollTop + e.deltaY,
            behavior: 'smooth'
        })
        
        e.preventDefault()
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hidden-scroll').forEach(e => {
        HiddenScroll(e)
    })
})