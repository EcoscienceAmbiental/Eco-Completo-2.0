const images = ['intr3.jpg', 'eco.jpg'];  
let current = 0;

const image = document.getElementById('mainImage');
const link = document.getElementById('toggleLink');
const heading = document.querySelector('#intr2 h1');
const paragraph = document.querySelector('#intr2 p');

let intervalId;

function updateContent() {
  if (current === 0) {
    heading.textContent = 'Bem-vindo ao Ecoscience.';
    paragraph.textContent = 'Quer descobrir quanto carbono gasta?';
    link.href = 'calculadora.html';
    link.textContent = 'Confira aqui';
  } else {
    heading.textContent = 'Fale com o EcoChat';
    paragraph.textContent = 'Uma solução rápida e segura.';
    link.href = 'ecochat.html';
    link.textContent = 'Clique aqui';
  }
}

function changeImage(direction) {
  const nextImage = new Image();
  nextImage.src = images[current];

  image.style.transition = 'none';
  image.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';

  setTimeout(() => {
    image.src = nextImage.src;
    updateContent();

    setTimeout(() => {
      image.style.transition = 'transform 0.3s ease-in-out';
      image.style.transform = 'translateX(0)';
    }, 50);
  }, 50);
}

function autoChangeImage() {
  current = (current + 1) % images.length;
  changeImage('left');
}

function resetAutoChange() {
  clearInterval(intervalId); 
  intervalId = setInterval(autoChangeImage, 15000);
}


document.getElementById('prevBtn').addEventListener('click', () => {
  current = (current - 1 + images.length) % images.length;
  changeImage('right');
  resetAutoChange();
});


document.getElementById('nextBtn').addEventListener('click', () => {
  current = (current + 1) % images.length;
  changeImage('left');
  resetAutoChange();
});


updateContent();
resetAutoChange();



// Transparência do header
window.addEventListener("scroll", function() {
  const nav = document.getElementById("navheader");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
