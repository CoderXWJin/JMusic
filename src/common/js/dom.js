export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className) // test() 方法用于检测一个字符串是否匹配某个模式.如果字符串中有匹配的值返回 true ，否则返回 false。
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ') // split() 方法用于把一个字符串分割成字符串数组。
  newClass.push(className) // push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
  el.className = newClass.join(' ') // join() 方法用于把数组中的所有元素放入一个字符串。
}
