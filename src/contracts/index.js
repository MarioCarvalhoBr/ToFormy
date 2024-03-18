
const files = require.context('.', false, /\.json$/)

const contracts = {}

files.keys().forEach((key) => {
  var name = key.replace(/(\.\/|\.json)/g, '')

  contracts[ name ] = require('./' + name)
})

export default contracts
