import type { IComponentParams } from '@models'
import { convertTemplateAsComponent } from '@utils'

export default abstract class Component<StateType> {
  node: Element
  #originState: StateType
  preventRenderStateKey: Set<string>
  needRender: boolean
  needUpdate: boolean
  subscribers: Set<any>

  constructor({
    node,
    initalState,
    preventRenderStateKey = []
  }: IComponentParams<StateType>) {
    this.node = node
    this.#originState = initalState as StateType
    this.preventRenderStateKey = new Set(preventRenderStateKey)
    this.needRender = false
    this.needUpdate = false
    this.subscribers = new Set([])

    this.init()
    this.render()
    this.fetch()
  }

  get state(): StateType {
    return this.#originState
  }

  set state(newState) {
    throw new SyntaxError(
      `state는 setState를 통해서만 변경이 가능합니다!
      ${JSON.stringify(newState)}`
    )
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
    const currentState = { ...this.#originState } as StateType
    const validState = Object.keys(newState).filter(_key => {
      return _key in currentState
    })

    this.needUpdate = validState.length > 0
    return validState
  }

  setState(newState: Partial<StateType>): void {
    const validState = this.validationState(newState)

    if (!this.needUpdate) {
      return
    }

    const preventRenderStateKey = Array.from(this.preventRenderStateKey)

    validState?.forEach(key => {
      const stateKey = key as keyof StateType

      if (!preventRenderStateKey.includes(key)) {
        this.needRender = true
      }

      this.#originState[stateKey] = newState[
        stateKey
      ] as StateType[keyof StateType]
    })

    this.notify(newState)
  }
}
