// Получаем кнопку
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Показываем или скрываем кнопку при прокрутке страницы
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  // Показываем кнопку, если пользователь прокрутил вниз на 200px
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
}

// Плавно прокручиваем страницу наверх при клике на кнопку
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}