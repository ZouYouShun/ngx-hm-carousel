export function setStyle(_renderer, elm, style: any) {
  Object.keys(style).forEach((key) => {
    const value = style[key];
    _renderer.setStyle(elm, key, value);
  });
}
