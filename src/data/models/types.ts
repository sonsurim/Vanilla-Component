/** Component */
interface IComponentParams<StateType> {
  node: Element
  initalState: StateType | null
  preventRenderStateKey?: string[]
}

export type { IComponentParams }
