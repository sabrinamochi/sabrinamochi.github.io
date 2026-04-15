let cursor;
let x = 0, y = 0;
let raf;

function initCursor() {
  cursor = document.getElementById('pubCursor');
  if (!cursor) return;

  // GPU move
  window.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;

    if (!raf) {
      raf = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        raf = null;
      });
    }
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
}

if (!window.__cursorInit) {
  window.__cursorInit = true;
  initCursor();
}
