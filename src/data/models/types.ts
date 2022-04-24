/** Component */
interface IComponentParams<StateType> {
  node: Element
  initalState: StateType | null
  preventRenderStateKey?: string[]
}

/** App Component */
interface IAppState {
  text: string
  onClick(): void
}

export type { IComponentParams, IAppState }
