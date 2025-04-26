let CHANGE_STORAGE_TRIGGER_NAME = "contextmenu";

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  console.log('is wretched IOS');
  CHANGE_STORAGE_TRIGGER_NAME = "long-press";
}

  window.addStorageField = function(id, selector, name, placeholder, filter = (x) => x, callback = () => {}) {
    const elements = document.querySelectorAll(selector);
    const item = {
      selector: selector,
      placeholder: placeholder,
      filter: filter,
    };
    if (id in fields) {
      fields[id].push(item);
    } else {
      fields[id] = [item];
    }
    const init_value = localStorage.getItem(id) || placeholder;
    for (const element of elements) {
      element.innerHTML = filter(init_value);
      element.addEventListener(CHANGE_STORAGE_TRIGGER_NAME, e => {
        let res = window.prompt("修改" + name + "：", localStorage.getItem(id) || placeholder);
        if (res == "" || res == null) {
          localStorage.removeItem(id);
        } else {
          localStorage.setItem(id, res);
        }
        callback(res || placeholder);
        for (const _item of fields[id]) {
          const _elements = document.querySelectorAll(_item.selector);
          for (const _element of _elements) {
            _element.innerHTML = _item.filter(res || _item.placeholder);
          }
        }
        e.preventDefault();
      });
    }
    callback(init_value);
  }
