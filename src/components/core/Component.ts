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

  /** Component Data & Template */
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

  /** Component Life Cycle */
  init(): void {
    return
  }

  fetch(): void {
    return
  }

  render(): void {
    convertTemplateAsComponent.call(this)
    this.setEvent()
    this.renderChildComponent()
  }

  // 컴포넌트 상태 변경 시, 발생하는 업데이트 라이프 사이클
  update(): void {
    if (!this.needRender) {
      this.renderChildComponent()
      return
    }

    this.clearEvent()
    this.render()
  }

  renderChildComponent(): void {
    return
  }

  setEvent(): void {
    return
  }

  clearEvent(): void {
    return
  }

  /** Subscriber Method */
  subscribe(...subscribers: any[]): void {
    subscribers.forEach(subscriber => {
      this.subscribers.add(subscriber)
    })
  }

  // 하위 컴포넌트 상태 변경 및 렌더링
  notify(newState: Partial<StateType>): void {
    const subscribers = Array.from(this.subscribers)

    subscribers?.forEach(subscriber => {
      subscriber.setState(newState)
      subscriber.update()
      subscriber.needRender = false
    })
  }

  /** SetState */
  // 컴포넌트의 상태 변경 로직
  setState(newState: Partial<StateType>): void {
    this.checkNeedUpdate(newState)

    if (!this.needUpdate) {
      return
    }

    this.reflectNeedRender(newState)
    this.reflectState(newState)
    this.notify(newState)
  }

  // 컴포넌트 상태 유효성 검사
  checkNeedUpdate(newState: Partial<StateType>): void {
    const prevState = JSON.stringify({ ...this.#originState })
    const currentState = JSON.stringify({ ...this.#originState, ...newState })

    this.needUpdate = prevState !== currentState
  }

  // 컴포넌트 렌더링 필요 여부 반영
  reflectNeedRender(newState: Partial<StateType>): void {
    const updatedStateKeys = Object.keys(newState)
    const preventRenderStateKey = Array.from(this.preventRenderStateKey)

    const preventRenderState = updatedStateKeys.filter(key =>
      preventRenderStateKey.includes(key)
    )

    this.needRender = preventRenderState.length === 0
  }

  // 컴포넌트 변경된 상태 반영
  reflectState(newState: Partial<StateType>): void {
    const updatedStateKeys = Object.keys(newState)

    updatedStateKeys?.forEach(key => {
      const stateKey = key as keyof StateType

      this.#originState[stateKey] = newState[
        stateKey
      ] as StateType[keyof StateType]
    })
  }
}
