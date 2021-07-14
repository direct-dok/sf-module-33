export default function navDropdown(selector) {
    const elemDropdown = document.querySelector(selector);
    elemDropdown.addEventListener('click', function() {
        console.log(this.querySelector('.row-user-nav'))
        this.nextElementSibling.classList.toggle('display-block');
        this.querySelector('.row-user-nav').classList.toggle('rotateRow');
    })
}