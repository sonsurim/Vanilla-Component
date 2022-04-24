import { Component } from '@components'
import type { IButtonState } from './types'

export default class Button extends Component<IButtonState> {
  template(): string {
    const children = this.node.textContent || '버튼'

    return `
      <button>${children}</button>
    `
  }

  setEvent(): void {
    this.node.addEventListener('click', this.state.onClick)
  }

  clearEvent(): void {
    this.node.removeEventListener('click', this.state.onClick)
  }
}
