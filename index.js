const Commando = require('./commando discord.js-v12/src/index.js')
const { CommandoClient, SQLiteProvider } = require('./commando discord.js-v12/src/index.js');
const path = require('path');
const sqlite = require('sqlite');



//inicializa o banco de dados (firebase) e exporta
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore();
module.exports.db = db;

//guarda os dados localmente
let usersOn = db.collection('usuarios');


function user(id, money) {
	this.id = id;
	this.money = money;
};

let usersOff = new Map();
usersOn.get().then(snap => {
	snap.forEach(doc => {
		usersOff.set(doc.id, doc.data());
	  });
});
usersOff.set('380512056413257729', {money: 128});

usersOn.update(usersOff);


module.exports.usersOff = usersOff;


//cria um client do Comando
const donos = new Set()
  donos.add('380512056413257729');
  donos.add('348664615175192577');
  donos.add('597037623281975326');
const client = new CommandoClient({
	commandPrefix: 'h',
	owner: donos,
	unknownCommandResponse: false,
});


//registra os comandos no client do Commando
client.registry
	.registerDefaultTypes()
	.registerGroups([
		['utilidades', 'Utilidades'],
		['basicos', 'Base'],
		['adm', 'Administrativos'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'Comandos'))


//mensagem de inicialização e "watching" dinânimico
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.guilds.find((a) => a.id === '698560208309452810').channels.find((a) => a.id === '732710544330457161').send(`PRONTO\n${usersOff.get('348664615175192577').money}`);
	setInterval(async () => {
    let users = 0;
    for (let g of client.guilds.array()) users += (g.members.size - 1);

    await client.user.setActivity(`${users} usuário${users !== 1 ? 's' : ''} online`, {type: 'WATCHING'})
    .catch(err => console.error());
  }, 15000);
});


//erros e login
client.on('error', console.error);
client.login(process.env.AUTH_TOKEN);