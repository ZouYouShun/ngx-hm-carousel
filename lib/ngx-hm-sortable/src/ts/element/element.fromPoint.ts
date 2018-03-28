export function elementsFromPoint(thisDocument: Document, x: number, y: number,
  cb: (elm: HTMLElement) => boolean, cancel?: (elm: HTMLElement) => boolean) {
  return new Promise((resolve, reject) => {
    const checkedElm = [], elmsStyle = [];
    let elm, i, d, getElm;

    // get all elements via elementFromPoint, and remove them from hit-testing in order
    while ((elm = thisDocument.elementFromPoint(x, y))
      && checkedElm.indexOf(elm) === -1 && elm != null) {

      if (cancel && cancel(elm)) {
        reject('ddd');
        break;
      }

      // push the element and its current style
      checkedElm.push(elm);
      if (cb(elm)) {
        getElm = elm;
        break;
      }

      // 指定他的pointer-event為 none，讓他能往上繼續找tag
      elmsStyle.push({
        value: elm.style.getPropertyValue('pointer-events'),
        priority: elm.style.getPropertyPriority('pointer-events')
      });

      // 指定他的pointer-event為 none，讓他能往上繼續找tag
      elm.style.setProperty('pointer-events', 'none', 'important');
    }

    // restore the previous pointer-events values
    for (i = elmsStyle.length; d = elmsStyle[--i];) {
      checkedElm[i].style.setProperty('pointer-events', d.value ? d.value : '', d.priority);
    }

    if (getElm) {
      resolve(getElm);
    }
  });
}
