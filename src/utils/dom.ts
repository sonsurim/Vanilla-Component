function createEl(tagName: string): Element {
  return document.createElement(tagName)
}

function selectEl(context: any, selector: string): Element {
  return context.querySelector(selector)
}

function convertTemplateAsComponent(this: any): void {
  const oldNode = this.node
  const componentChildren = Array.from(
    new DOMParser().parseFromString(this.template(), 'text/html').body.children
  )
  const component = new DocumentFragment()
  component.append(...componentChildren)

  oldNode.after(component)
  this.node = oldNode.nextSibling

  // CSS 상속
  const oldCSS = oldNode.classList.value.trim()
  const newCSS = this.node.classList.value.trim()
  const isChangedCSS = oldCSS !== newCSS
  const cssValue = isChangedCSS ? newCSS || oldCSS : oldCSS
  this.node.className = cssValue

  oldNode.remove()
}

export { createEl, selectEl, convertTemplateAsComponent }
