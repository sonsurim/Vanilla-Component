import { Component } from '@components'
import type { IExampleTextState } from './types'

export default class ExampleText extends Component<IExampleTextState> {
  template(): string {
    const { initalText, text } = this.state

    return `
      <div>
        <h1>Example Component</h1>
        <p>${initalText}</p>
        <p>${text}</p>
      </div>
    `
  }
}
