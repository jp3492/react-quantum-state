import { useState, useEffect } from "react";

class Store {
  value: any = ""
  setters: Array<any> = []
  setValue = (value: any) => {
    this.value = value
    this.setters.forEach((setter: any) => setter(this.value))
  }
  addSetter = (setter: any) => {
    this.setters = [...this.setters, setter]
  }
  unsubscribe = setter => {
    this.setters = this.setters.filter(s => s !== setter)
  }
}

const stores: any = {}

const setQuantumValue = (
  id: string,
  value: any
) => stores[id].setValue(value)

interface iQSInput {
  id: string,
  initialValue?: any,
  returnValue?: boolean
}

function quantumState(props: iQSInput, {
  id,
  initialValue = null,
  returnValue = true
}): [any, Function] {

  const [_, set] = useState("")

  if (!stores.hasOwnProperty(id)) {
    stores[id] = new Store()
    stores[id].setValue(initialValue)
  }

  if (!stores[id].setters.includes(set) && returnValue) {
    stores[id].addSetter(set)
  }

  const {
    value,
    setValue,
    unsubscribe
  } = stores[id]

  useEffect(() => () => unsubscribe(set), [])

  if (!returnValue) {
    return [null, setValue]
  }

  return [value, setValue]
}

export default {
  quantumState,
  setQuantumValue
}