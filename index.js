const express = require('express')
const mysql = require('promise-mysql')


const app = express()
const port = 3000

const getDb = async () => {
    return mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'e-commerce'
    })
}

app.get('/', async (req, res) => {
    const connection = await getDb()
    const items = await connection.query('SELECT * FROM `products`',
        )

    res.json(items)
})

app.listen(port)

