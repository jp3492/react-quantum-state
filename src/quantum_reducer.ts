import { useState, useEffect } from 'react'

class Reducer {
  state: any = {}
  reducer: Function
  actions: any
  setters: Array<any> = []
  mappers: object = {}
  options: object = {}
  constructor(props: any) {
    this.reducer = props.reducer
    this.state = props.initialState
    this.actions = {}
    this.options = props.options

    Object.keys(props.actions).forEach(action => {
      this.actions = {
        ...this.actions,
        [action]: (options: any) =>
          props.actions[action](options)(this.dispatch)
      }
    })
  }
  dispatch = (action: any) => {
    const oldState = this.state

    this.state = this.reducer(this.state, action, this.options)

    this.setters.forEach((setter: any, index: number) => {
      try {
        const newOldState = this.mappers[index] ? this.mappers[index](oldState) : oldState
        const newState = this.mappers[index] ? this.mappers[index](this.state) : this.state

        if (JSON.stringify(newOldState) !== JSON.stringify(newState)) {
          setter(newState)
        }
      } catch (error) {
        throw Error(error)
      }

    })
  }
  unsubscribe = setter => {
    this.setters = this.setters.filter(s => s !== setter)
  }
  addSetter = (setter: any) => {
    this.setters = [...this.setters, setter]
  }
}

interface IReducer {
  [key: string]: Reducer
}

const reducers: IReducer = {}

interface iAction {
  api: string,
  method: string,
  url: string,
  body: any
}

exports.dispatchToReducer = (props: iAction, {
  id,
  action
}) => {
  try {
    return reducers[id].dispatch({
      ...action
    })
  } catch (error) {
    throw Error(error)
  }
}

interface iQRInput {
  id: string,
  connect?: Function | boolean
}

interface iQROutput {
  state?: object,
  dispatch: Function,
  actions: object
}

exports.quantumReducer = (props: iQRInput,
  {
    id,
    connect = true
  }): iQROutput => {

  const [_, set] = useState({})

  if (!reducers.hasOwnProperty(id)) {
    throw new Error(`Store with id: ${id} has not been initialized`)
  }

  if (!reducers[id].setters.includes(set) && connect !== false) {
    reducers[id].addSetter(set)
    if (connect) {
      reducers[id].mappers[reducers[id].setters.length - 1] = connect
    }
  }

  const {
    state,
    dispatch,
    actions,
    unsubscribe
  } = reducers[id]

  useEffect(() => () => unsubscribe(set), [])

  if (connect === false) {
    return {
      dispatch,
      actions
    }
  }

  return {
    state,
    dispatch,
    actions
  }
}

interface iInit {
  id: string,
  reducer: Function,
  initialState: object,
  actions: object,
  options: object
}

exports.initializeReducers = (inits: iInit[]) => {
  try {
    return inits.map((i: iInit) => {
      const {
        id,
        reducer,
        initialState,
        actions,
        options
      } = i
      reducers[id] = new Reducer({
        reducer,
        initialState,
        actions,
        options
      })
    })
  } catch (error) {
    console.log("Errro while initializing reducers")
    throw Error(error)
  }
}