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

        console.log(this.state)
      },
      handleChangeInitalText: (): void => {
        this.setState({
          initalText: `다른 컴포넌트의 렌더링 영향으로 렌더링이 되었습니다! ${Math.random()}`
        })
      },
      handleChangeState: (): void => {
        console.log(this.state)

        this.state = {
          ...this.state,
          initalText: 'Change Text!'
        }

        console.log(this.state)
      },
      onClick: (type: string): void => {
        if (type === 'initalText') {
          this.state.handleChangeInitalText()
          return
        }

        if (type === 'changeState') {
          this.state.handleChangeState()
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
        <HandleChangeStateButton>Change State!</HandleChangeStateButton>
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

    new Button({
      node: selectEl(this.node, 'HandleChangeStateButton'),
      initalState: {
        onClick: (): void => {
          onClick('changeState')
        }
      }
    })

    this.subscribe(exampleText)
  }
}
