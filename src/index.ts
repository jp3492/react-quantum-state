const quantumState = require('./quantum_state')
const quantumReducer = require('./quantum_reducer')


export default {
  ...quantumState,
  ...quantumReducer
}