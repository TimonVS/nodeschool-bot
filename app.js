const irc = require('irc')
const fetch = require('node-fetch')

const client = new irc.Client('bofh.nl.smurfnet.ch', 'Nodeschool', {
    channels: ['#parrot', '#compare', '#gifs']
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

client.addListener('message#gifs', (from, message) => {
  const c = client.say.bind(client, '#gifs')

  if (!message.startsWith('gif')) return

  const [_, keywords] = message.split(' ')

  if (!keywords) {
    fetch('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC')
      .then(res => res.json())
      .then(({ data }) => {
        c(data.image_url)
      })
  } else {
    console.log('els')
    fetch(`http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(keywords)}&api_key=dc6zaTOxFJmzC`)
      .then(res => res.json())
      .then(({ data }) => {
        c(data[0].images.fixed_height.url)
      })
      .catch(err => console.log(err))
  }
})
