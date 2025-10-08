// Получаем кнопку для прокрутки наверх
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

// Handle the error report button animation
document.addEventListener('DOMContentLoaded', () => {
  const errorBtn = document.getElementById('errorReportBtn');
  if (errorBtn) {
    // Check if the animation has already been played in this session
    if (!sessionStorage.getItem('errorBtnAnimationPlayed')) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Use classList instead of direct style manipulation
          errorBtn.classList.add('visible');
          // Mark that the animation has been played
          sessionStorage.setItem('errorBtnAnimationPlayed', 'true');
        }, 1000);
      });
    } else {
      // If animation already played, just show the button without animation
      errorBtn.classList.add('visible');
    }
  }
});