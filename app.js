const irc = require('irc')
const fetch = require('node-fetch')

const client = new irc.Client('bofh.nl.smurfnet.ch', 'Nodeschool', {
  channels: ['#parrot', '#compare', '#gifs']
})

// Listens to ALL channels provided above, the `to` paramater contains the channel the
// message was sent to
client.addListener('message', (from, to, message) => {
  console.log(from + ' => ' + to + ': ' + message)
})

// Listens to the #parrot channel, doesn't contain a `to` parameter because it's already
// known that the message was sent to the #parrot channel
client.addListener('message#parrot', (from, message) => {
  client.notice('#parrot', message)
})

client.addListener('message#compare', (from, message) => {
  // Creates a new function that already has the channel parameter
  // `c('this is a message')` equals client.say('#compare', 'this is a message')
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

  const [_, ...keywords] = message.split(' ')

  // Send a random gif if there are no keywords
  if (keywords.length === 0) {
    fetch('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC')
      .then(res => res.json())
      .then(({ data }) => {
        c(data.image_url)
      })
  } else {
    fetch(`http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(keywords.join(' '))}&api_key=dc6zaTOxFJmzC`)
      .then(res => res.json())
      .then(({ data }) => {
        c(data[0].images.fixed_height.url)
      })
      .catch(err => console.log(err))
  }
})
