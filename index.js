const Commando = require('./commando discord.js-v12/src/index.js')
const { CommandoClient, SQLiteProvider } = require('./commando discord.js-v12/src/index.js');
const path = require('path');


//inicializa o lowDB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('usersOffDB.json');
const usersOffDB = low(adapter);

//inicializa o banco de dados (firebase) e exporta o banco Online
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
})

let db = admin.firestore();
module.exports.db = db;

//guarda os dados localmente e exporta o banco Offline
let usersOn = db.collection('usuarios').doc('usuarios');
module.exports.usersOn = usersOn;

usersOn.get().then(snap => {
	var usersOff = new Map(Object.entries(snap.data()));

    usersOff.forEach(user => {
        usersOffDB.set(`${user.id}`, user).write();
    });

    module.exports.usersOffDB = usersOffDB;
});

setInterval(async () => {
	usersOn.update(usersOffDB.getState()).then( () => console.log('Update concluído com suscesso'));
}, 3600000);



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
		['adm', 'Administrativos'],
		['autorespostas', 'AutoRespostas'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'Comandos'))


//Event Handler(Project-A)
//const evtFiles = readdirSync('./Eventos/')
//console.log('log', `Carregando o total de ${evtFiles.length} eventos`)
//evtFiles.forEach(f => {
//  const eventName = f.split('.')[0]
//  const event = require(`./Eventos/${f}`)
//
//  client.on(eventName, event.bind(null, client))
//})


//erros e login
client.on('error', console.error);
client.login(process.env.AUTH_TOKEN);