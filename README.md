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
4. `cp config\config.json.example config\config.json`
6. open `config\config.json` and add your database credentials.
7. Run `npx sequelize-cli db:create` to create your database.
7. Run `npx sequelize-cli db:migrate` to create your tables.

## Start the bot
`node ./index.js`