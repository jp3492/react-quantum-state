import { useState, useEffect } from "react"

interface iQRInit {
  id: string;
  reducer: Function;
  initialState: any;
  actions?: any;
  options?: any;
}

interface iQReducer {
  id: string;
  connect?: boolean | Function;
}

class Store {
  state: any
  reducer: any
  actions: any
  subscriptions: Array<any> = []
  connectors: any = {}
  options: any = {}
  constructor(props: any) {
    this.reducer = props.reducer
    this.state = props.initialState
    this.actions = {}
    this.options = props.options;
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
    //can check if the current state is going to be like the upcoming state,
    //if so -> dont loop over setters to prevent unnessessary rerender
    this.state = this.reducer(this.state, action, this.options)

    this.subscriptions.forEach((setter: any, index: number) => {

      if (this.connectors[index]) {
        const connect = this.connectors[index]
        const mappedOldState = connect(oldState)
        const mappedNewState = connect(this.state)
        if (JSON.stringify(mappedOldState) !== JSON.stringify(mappedNewState)) {
          return setter(mappedNewState)
        } else {
          // dont know if this will work
          return
        }
      }
      //Need to check for state has changed?
      return setter(this.state)
    })
  }
  addConnector = connect => {
    this.connectors = {
      ...this.connectors,
      [this.subscriptions.length - 1]: connect
    }
  }
  unsubscribe = subscription => {
    this.subscriptions = this.subscriptions.filter(s => s !== subscription)
  }
  subscribe = (subscription: any) => {
    this.subscriptions = [...this.subscriptions, subscription]
  }
}
let stores = {};

export const dispatchToStore = async ({
  id,
  action // api, method, url, body
}) => {
  return stores[id].dispatch({
    ...action
  })
}

export const initializeStores = (reducers: iQRInit[]) => {
  return reducers.forEach((r: iQRInit) => {
    const {
      id,
      reducer,
      initialState,
      actions,
      options
    } = r
    if (!stores.hasOwnProperty(id)) {
      stores = {
        ...stores,
        [id]: new Store({
          id,
          reducer,
          initialState,
          actions,
          options
        })
      };
    } else {
      console.error(`Store with id: ${id} has already been initialized`);
    }
  })
}

export const quantumReducer = (props: iQReducer) => {
  const [state, setState] = useState(stores[props.id] ? stores[props.id].state : { error: "Stor is not initialized" })

  const {
    id,
    connect = state => state
  } = props

  useEffect(() => {
    if (!stores[id]) {
      console.error(`Store with id: ${id} has not been initialized.`)
    } else {
      if (!stores[id].subscriptions.includes(setState)) {
        if (connect !== false) {
          stores[id].subscribe(setState)
          stores[id].addConnector(connect)
        }
      } else {
        console.error(`Store: ${id} aready has this components subscription. Weirdly.`)
      }
    }
    return () => stores[id].unsubscribe(setState)
  }, [])


  const {
    actions,
    dispatch
  } = stores[id]

  return {
    state,
    dispatch,
    actions
  }
}
