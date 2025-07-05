document.addEventListener('DOMContentLoaded', () => {
  const scrollWrappers = document.querySelectorAll('.scroll-wrapper');

  scrollWrappers.forEach(wrapper => {
    const container = wrapper.querySelector('.scroll-container');
    const prevBtn = wrapper.querySelector('.scroll-btn.prev');
    const nextBtn = wrapper.querySelector('.scroll-btn.next');

    if (!container || !prevBtn || !nextBtn) {
      return;
    }

    const updateButtonsState = () => {
      // 1. Check for overall scrollability
      const hasOverflow = container.scrollWidth > container.clientWidth + 2;

      if (hasOverflow) {
        wrapper.classList.add('is-scrollable');
        container.classList.add('is-scrollable');
      } else {
        wrapper.classList.remove('is-scrollable');
        container.classList.remove('is-scrollable');
        return; // No need to check individual buttons if not scrollable
      }

      // 2. Check position to enable/disable individual buttons
      // A small buffer is used for precision
      const atStart = container.scrollLeft < 10;
      const atEnd = container.scrollWidth - container.scrollLeft - container.clientWidth < 10;

      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
    };

    const getScrollAmount = () => {
      const firstCard = container.querySelector('[class*="col-"]');
      if (firstCard) {
        return firstCard.offsetWidth;
      }
      return 300;
    };

    nextBtn.addEventListener('click', () => {
      const scrollDistance = getScrollAmount() + parseFloat(getComputedStyle(container).gap);
      container.scrollLeft += scrollDistance;
    });

    prevBtn.addEventListener('click', () => {
        const scrollDistance = getScrollAmount() + parseFloat(getComputedStyle(container).gap);
      container.scrollLeft -= scrollDistance;
    });

    // Add scroll event listener to update buttons on any scroll
    container.addEventListener('scroll', updateButtonsState);
    // Add resize event listener
    window.addEventListener('resize', updateButtonsState);
    // Initial check
    updateButtonsState();
  });
});