const irc = require('irc')
const axios = require('axios')

const client = new irc.Client('bofh.nl.smurfnet.ch', 'Nodeschool', {
    channels: ['#parrot', '#compare', '#weather']
})

client.addListener('message', (from, to, message) => {
  console.log(from + ' => ' + to + ': ' + message)
})

client.addListener('message#parrot', (from, message) => {
  console.log(from, message)

  client.say('#parrot', message)
})

client.addListener('message#compare', (from, message) => {
  const c = client.say.bind(client, '#compare')

  if (message === '(╯°□°)╯︵ ┻━┻') {
    client.say('#compare', '┬─┬ ノ( ゜-゜ノ)')
  } else if ([':(', ':\'('].includes(message)) {
    client.say('#compare', ':)')
  } else if (message === 'bind') {
    c('yay!')
  }
})

client.addListener('message#weather', (from, message) => {
  if (!message.startsWith('weather')) return

  const [_, city] = message.split(' ')
  console.log(city)
})
