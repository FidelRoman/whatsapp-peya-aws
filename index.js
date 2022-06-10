const fs = require('fs');
const qrcode = require('qrcode-terminal');

// * Inicia la sesión de whatsapp
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


// * Crea el API Rest
const express = require('express');
const app = express();

const underscore = require('underscore');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Server on!</h1>');
});

app.post('/api/send', (req, res) => {
  const body  = req.body;
  const enviados = [];
  underscore.each(body, (envio,i) => {
    // Enviar Whatsapp
    const chatId = envio.number + "@c.us";
    const message = envio.message;
    client.sendMessage(chatId, message);
    enviados.push({
      "Numero": envio.number,
      "Respuesta": "Enviado"
    })
  });

  res.send(enviados)
});

app.listen(3000)
