const cursor = document.getElementById('pubCursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('[data-publication]').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.textContent = el.dataset.publication;
    cursor.classList.add('is-visible');
  });

  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
  });
});
