import { Component, Button, ExampleText } from '@components'
import type { IAppState, IComponentParams } from '@models'
import { selectEl } from '@utils'

export default class App extends Component<IAppState> {
  constructor({ node }: IComponentParams<IAppState>) {
    const initalState = {
      initalText: '이 Text가 변경될 때는 렌더링이 되지 않아요!',
      text: `initalState`,
      handleChangeText: (): void => {
        this.setState({
          text: `Changed State: ${Math.random()}`
        })
      },
      handleChangeInitalText: (): void => {
        this.setState({
          initalText: `Changed State: ${Math.random()}`
        })
      },
      onClick: (type: string): void => {
        if (type === 'initalText') {
          this.state.handleChangeInitalText()
          return
        }

        this.state.handleChangeText()
      }
    }

    super({ node, initalState })
  }

  template(): string {
    return `
    <main id="App">
      <ExampleText></ExampleText>
      <HandleTextButton>Change Text!</HandleTextButton>
      <HandleInitalTextButton>Change InitalText</HandleInitalTextButton>
    </main>
  `
  }

  attachChildComponent(): void {
    const { initalText, text, onClick } = this.state

    const exampleText = new ExampleText({
      node: selectEl(this.node, 'ExampleText'),
      preventRenderStateKey: ['initalText'],
      initalState: {
        initalText,
        text
      }
    })

    new Button({
      node: selectEl(this.node, 'HandleTextButton'),
      initalState: {
        onClick: (): void => {
          onClick('text')
        }
      }
    })

    new Button({
      node: selectEl(this.node, 'HandleInitalTextButton'),
      initalState: {
        onClick: (): void => {
          onClick('initalText')
        }
      }
    })

    this.subscribe(exampleText)
  }
}
