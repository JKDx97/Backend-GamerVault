const mysql = require('mysql2')

const connetion = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database: 'groupsac'
})

connetion.connect((err)=>{
    if(err){
        console.error('Error al conectarse a la base de datos',err)
        return;
    }
    console.log('Conectado a la base de datos')
})

module.exports = connetion