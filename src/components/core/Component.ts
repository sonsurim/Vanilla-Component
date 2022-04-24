import type { IComponentParams } from '@models'
import { convertTemplateAsComponent } from '@utils'

export default class Component<StateType> {
  node: Element
  state: StateType
  preventRenderStateKey: Set<string>
  needRender: boolean
  needUpdate: boolean
  subscribers: Set<any>
  styleTagName: string

  constructor({
    node,
    initalState,
    preventRenderStateKey = []
  }: IComponentParams<StateType>) {
    this.node = node
    this.state = initalState as StateType
    this.preventRenderStateKey = new Set(preventRenderStateKey)
    this.needRender = false
    this.needUpdate = false
    this.subscribers = new Set([])
    this.styleTagName = ''

    this.init()
    this.render()
    this.fetch()
  }

  template(): string {
    return ``
  }

  init(): void {
    return
  }

  fetch(): void {
    return
  }

  render(): void {
    convertTemplateAsComponent.call(this)
    this.setEvent()
    this.attachChildComponent()
  }

  update(): void {
    this.needRender = false
    this.clearEvent()
    this.render()
  }

  updateChildren(): void {
    this.needRender = false
    this.attachChildComponent()
  }

  setEvent(): void {
    return
  }

  clearEvent(): void {
    return
  }

  attachChildComponent(): void {
    return
  }

  subscribe(...subscribers: any[]): void {
    subscribers.forEach(subscriber => {
      this.subscribers.add(subscriber)
    })
  }

  notify(newState: Partial<StateType>): void {
    const subscribers = Array.from(this.subscribers)

    const validSubscribers = subscribers.filter(
      subscriber => subscriber.validationState(newState).length
    )

    validSubscribers?.forEach(subscriber => {
      subscriber.setState(newState)

      if (subscriber.needRender) {
        subscriber.update()
        return
      }

      subscriber.updateChildren()
    })
  }

  validationState(newState: Partial<StateType>): string[] {
    const currentState = { ...this.state } as StateType
    const validState = Object.keys(newState).filter(
      _key => _key in currentState
    )

    this.needUpdate = validState.length > 0
    return validState
  }

  setState(newState: Partial<StateType>): void {
    const validState = this.validationState(newState)

    if (!this.needUpdate) {
      return
    }

    const currentState = { ...this.state } as StateType
    const preventRenderStateKey = Array.from(this.preventRenderStateKey)

    validState?.forEach(key => {
      const stateKey = key as keyof StateType

      if (!preventRenderStateKey.includes(key)) {
        this.needRender = true
      }

      currentState[stateKey] = newState[stateKey] as StateType[keyof StateType]
    })

    this.state = currentState
    this.notify(newState)
  }
}
