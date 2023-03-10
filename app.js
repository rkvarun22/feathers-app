const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


// creating a services, MessageService
class MessageService {
    constructor() {
        this.messages = [];       // instance property , messages
    }

// defining a find() method
async find() {
    return this.messages;
}

// defining a create() method
async create(data){
    const  message = {
        id: this.messages.length,        // message object id, text
        text: data.text,
    };

    // pushing the messages into array
    this.messages.push(message);
    return message;
}

}
// creating feathers applicationfeathers
const app = express(feathers());
//  const app = feathers();

// creating middleware
app.use(express.json());                                // json body parsing middleware
app.use(express.urlencoded({extended : true}));         // parsing incoming form data
app.use(express.static(__dirname));                     // static serve


app.configure(express.rest());              // enabling services to available over RESTFull APIs
app.configure(socketio());                  // exposing feathers application over socketio

// registering the services
app.use('/messages', new MessageService());         // messages routes

app.use(express.errorHandler());                    // error handler provided by @feathers/express

// set up socket channel
app.on('connection', connection => {
    app.channel('everybody').join(connection);
});

// app.publish register the channel that receive the particular message
app.publish(() => app.channel('everybody'));

const port = 3030;
app.listen(port, () => {
    console.log(`Feathers App running on port ${port}`);
});


app.service('messages').create({
    text: 'Hello world from the server..!!'
});















// // listening the services, MessageService
// app.service('messages').on('created', (message) => {
//     console.log('a new message has been created', message);
// });

// // using the services, creating and retreive the messages
// const main = async () => {
//     await app.service('messages').create({
//         text: 'Hello Feathers'
//     });

//     await app.service('messages').create({
//         text: 'Hello again..!!'
//     });

//     // find the number of messages using find method
//     const messages = await app.service('messages').find();
//     console.log('All Messagges', messages); 
// }

// main();