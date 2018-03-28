import { Renderer2 } from '@angular/core';

export function insertAfter(_render: Renderer2, newEl, targetEl) {
  const parentEl = targetEl.parentNode;

  if (parentEl.lastChild === targetEl) {
    _render.appendChild(parentEl, newEl);
  } else {
    _render.insertBefore(parentEl, newEl, targetEl.nextSibling); // nextSibling 下一個
  }
}
