import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const button = document.querySelector('#burger')
const menu = document.querySelector('.heading--nav')

function showMenu() {
  disableBodyScroll(menu)
  button.classList.add('active')
}

function hideMenu() {
  enableBodyScroll(menu)
  button.classList.remove('active')
}

function menuToggle() {
  if (button) {
    button.addEventListener('click', () => {
      if (!button.classList.contains('active')) {
        showMenu()
      } else {
        hideMenu()
      }
    })
  }
}

export default menuToggle
