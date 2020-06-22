const Discord = require('discord.js');
const config = require('./config.json');
const Sequelize = require('sequelize');
const client = new Discord.Client();

// Initialize database ORM
const sequelize = new Sequelize(
	config.db_name,
	config.db_user,
	config.db_pass,
	{
		host: config.db_host,
		dialect: config.db_type
	}
)

sequelize.authenticate()
	.then(() => {
		console.log('Database connected !');

		client.once('ready', () => {
			console.log('Ready!');
		});

		client.login(config.token);
	})
	.catch(err => {
		throw new Error('Unable to connect to database : '+err);
	})