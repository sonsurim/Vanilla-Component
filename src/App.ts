import { Component, Button, ExampleText } from '@components'
import type { IAppState, IComponentParams } from '@models'
import { selectEl } from '@utils'

export default class App extends Component<IAppState> {
  constructor({ node }: IComponentParams<IAppState>) {
    const initalState = {
      text: `initalState`,
      onClick: (): void => {
        this.setState({
          text: `Changed State: ${Math.random()}`
        })
      }
    }

    super({ node, initalState })
  }

  template(): string {
    return `
    <main id="App">
      <ExampleText></ExampleText>
      <Button>Change State!</Button>
    </main>
  `
  }

  attachChildComponent(): void {
    const { text, onClick } = this.state

    const exampleText = new ExampleText({
      node: selectEl(this.node, 'ExampleText'),
      initalState: {
        text
      }
    })

    new Button({
      node: selectEl(this.node, 'Button'),
      initalState: {
        onClick
      }
    })

    this.subscribe(exampleText)
  }
}
