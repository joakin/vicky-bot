vicky: the wikipedia chat bot
=============================

Vicky is a bot to interact with wikipedia via chat.

Currently it only supports Hangouts.

To interact with the deployed version, add `vickypediabot@gmail.com` to
hangouts, and start chatting with her!

## Usage

Depends on node >= 6

```
npm install
HANGOUTSPASSWORD=password node index.js
```

For testing locally without having to connect to hangouts:

```
node cli.js
```

For running the tests:

```
npm test # Run tests once
npm run test:watch # Run test watcher
```
