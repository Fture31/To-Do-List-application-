const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port:'3306',
    database: 'db_basico'
});

conexion.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err.message);
    } else {
        console.log('Connecté à la base de données MySQL');
    }
});

module.exports = conexion;