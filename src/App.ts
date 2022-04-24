import { Component } from '@components'
import type { IAppState, IComponentParams } from '@models'

export default class App extends Component<IAppState> {
  constructor({ node }: IComponentParams<IAppState>) {
    const initalState = {
      text: `initalState`
    }

    super({ node, initalState })
  }

  template(): string {
    const { text } = this.state

    return `
      <main id="App">
        ${text}
      </main>
    `
  }
}
