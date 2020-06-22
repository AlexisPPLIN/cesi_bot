const Discord = require('discord.js');
const env = require('./config.json');
const client = new Discord.Client();

const db = require('./models/index');

client.once('ready', () => {
	console.log('Ready!');
});

client.login(env.token);