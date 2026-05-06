// Nav becomes opaque on scroll
const nav = document.getElementById('nav');
function updateNav() {
  nav.classList.toggle('nav--solid', window.scrollY > 20);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();
