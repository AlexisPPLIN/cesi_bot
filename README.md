# cesi_bot
Un bot discord pour gérér les présences des RIL au CESI du Mans

## Dependencies
* Node.js >= 12
* npm
* redis
* A database (mysql, ...)

## Install
1. `git clone https://github.com/DevEkode/cesi_bot.git`
2. `cd cesi_bot`
3. `npm install`
4. `cp config.json.example config.json`
5. open `config.json` and add your bot token into `"token":`
6. `cp config\config.json.example config\config.json`
7. open `config\config.json` and add your database credentials.
8. Run `npm run db:init_prod` to create your database.

## Start the bot
`npm run start`