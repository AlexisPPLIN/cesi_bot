# cesi_bot

## Dependencies
* Node.js >= 12
* npm

## Install
1. `git clone https://github.com/DevEkode/cesi_bot.git`
2. `cd cesi_bot`
3. `npm install`
4. `cp config.json.example config.json`
5. open `config.json` and add your bot token into `"token":`
6. open `config\config.json` and add your database credentials.
7. Run `makemigration` to create your database.

## Start the bot
`node ./index.js`