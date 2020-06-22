const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const Sequelize = require('sequelize');



client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.token);