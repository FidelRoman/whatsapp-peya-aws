const fs = require('fs');
const qrcode = require('qrcode-terminal');


const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.initialize();

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("auth_failure", msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
})

client.on('ready', () => {
  console.log('El cliente esta listo');
});


const express = require('express');
const app = express();

const underscore = require('underscore');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server on!');
});

app.post('/api/send', (req, res) => {
  const numbers  = req.body;
  const enviados = [];
  underscore.each(numbers, (number,i) => {
    
    // Enviar Whatsapp
    const chatId = number.number + "@c.us";
    client.sendMessage(chatId, "SendMessage");
    enviados.push({
      "Numero": number.number ,
      "Respuesta": "Enviado"
    })
  });
  
  res.send(enviados)
});

app.listen(3000)