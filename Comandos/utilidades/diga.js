const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'diga',
			aliases: ['say', 'echo'],
			group: 'utilidades',
			memberName: 'diga',
			description: 'Responde com a mensagem designada e apaga a mensagem original.',
			args: [
				{
					key: 'mensagem',
					prompt: 'O que você quer que o bot diga?',
					type: 'string',
				},
			],
		});
	}

	async run(message, { mensagem }) {
		await message.delete(5);
		message.say (mensagem);
	}
};