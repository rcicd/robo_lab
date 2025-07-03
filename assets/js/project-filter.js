document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Управление активной кнопкой
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterTag = button.dataset.tag;

      // Фильтрация карточек
      projectCards.forEach(card => {
        const cardTags = card.dataset.tags.split(',');

        if (filterTag === 'all' || cardTags.includes(filterTag)) {
          card.classList.remove('hidden');
          // Небольшая задержка, чтобы CSS-переход успел сработать
          setTimeout(() => {
            card.style.display = 'block';
          }, 0);
        } else {
          card.classList.add('hidden');
          // Прячем элемент после завершения анимации
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // 300ms - время transition в CSS
        }
      });
    });
  });
});