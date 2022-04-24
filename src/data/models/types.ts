/** Component */
interface IComponentParams<StateType> {
  node: Element
  initalState: StateType | null
  preventRenderStateKey?: string[]
}

/** App Component */
interface IAppState {
  initalText: string
  text: string
  onClick(type: string): void
  handleChangeText(): void
  handleChangeInitalText(): void
}

export type { IComponentParams, IAppState }
