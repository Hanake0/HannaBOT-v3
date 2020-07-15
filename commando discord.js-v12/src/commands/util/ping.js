const { oneLine } = require('common-tags');
const Command = require('../base');
const Discord = require('discord.js')

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['delay'],
			group: 'util',
			memberName: 'ping',
			description: 'Checa o ping do bot em relação ao servidor',
			throttling: {
				usages: 2,
				duration: 10
			}
		});
	}

	async run(msg) {
		const pingMsg = await msg.say('Calculando.**.**.');
		const embed = new Discord.RichEmbed()
			.setTitle(':ping_pong:  Pong!')
			.addField('Resposta no servidor:', `${pingMsg.createdTimestamp - msg.createdTimestamp}ms`, false)
			.addField('Resposta interna:', `${Math.round(this.client.ping)}ms`);
		
		if(!pingMsg.editable) {
			return msg.say(embed);
		} else {
			return pingMsg.edit(embed);
		}
	}
};
