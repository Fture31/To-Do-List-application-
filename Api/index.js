require('./config/conexion');
const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.set('port', port);


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestion des Articles',
      version: '1.0.0',
      description: 'API pour la gestion des articles avec Express, MySQL et Swagger',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./routeTache.js','./auth.js'], 

};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/api', require('./routeTache')); 
app.use('/auth', require('./auth')); 

app.listen(app.get('port'), (error) => {
  if (error) {
    console.log('Erreur lors du démarrage du serveur : ' + error);
  } else {
    console.log('Serveur démarré sur le port : ' + port);
    console.log(`Documentation Swagger dispo sur : http://localhost:${port}/api-docs`);
  }
});
