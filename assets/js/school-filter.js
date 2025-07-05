document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const schoolCards = document.querySelectorAll('.school-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterTag = button.dataset.tag;

      schoolCards.forEach(card => {
        const cardTags = card.dataset.tags.split(',');

        if (filterTag === 'all' || cardTags.includes(filterTag)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.display = 'block';
          }, 0);
        } else {
          card.classList.add('hidden');
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
});