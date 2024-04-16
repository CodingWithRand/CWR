let isDragging = false;
let startX = 0;
let startY = 0;
let startScrollLeft = 0;
let startScrollTop = 0;

window.onload = () => {
  const scrollContainer = document.querySelector('.effect-backdrop');
  scrollContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startScrollLeft = scrollContainer.scrollLeft;
    startScrollTop = scrollContainer.scrollTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    scrollContainer.scrollLeft = startScrollLeft - deltaX;
    scrollContainer.scrollTop = startScrollTop - deltaY;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events for touch-enabled devices
  scrollContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startScrollLeft = scrollContainer.scrollLeft;
    startScrollTop = scrollContainer.scrollTop;
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    scrollContainer.scrollLeft = startScrollLeft - deltaX;
    scrollContainer.scrollTop = startScrollTop - deltaY;
    e.preventDefault(); // Prevent page scroll on touchmove
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });
}
