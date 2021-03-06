const express = require('express')
const mysql = require('promise-mysql')

const app = express()
const port = 3000

app.use(express.json())


const getDb = async () => {
    return mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'e-commerce'
    })
}

function responseFormat (status, message, data) {

    return {
        StatusCode : status,
        ErrorMessage : message,
        DataArray : data
    }

}


// - Start out by creating an endpoint/route should be `/products` and this should return JSON containing every product the database.
// - This route should return the following fields for every product:
//- ID - image - title - price
// app.get('/products', async (req, res) => {
//     const connection = await getDb()
//     const basic_items = await connection.query('SELECT `id`, `image`, `title`, `price` FROM `products`')
//     res.json(basic_items)
// })

//- The next one should be an endpoint/route for `products/id`
//     - This route should return only a single product (based on it's ID)
//      - Should return every field from the DB table
app.get('/products/:id', async (req, res) => {
    const connection = await getDb()

    const id = req.params.id

    const items = await connection.query('SELECT * FROM `products` WHERE `id` = ?', [id])
    res.json({items})
})

// - Create a POST route for adding a new product
app.post('/products/add', async (req, res) => {
    const connection = await getDb()
    const items = await connection.query('INSERT INTO `products` (`title`, `price`, `image`, `category_id`, `category`, `character_id`, `character`, `description`, `image2`, `image3`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.body.title, req.body.price, req.body.image, req.body.category_id, req.body.category, req.body.character_id, req.body.character, req.body.description, req.body.image2, req.body.image3])

    res.json(responseFormat('200', 'Upload complete', items))
})

// - Create a PUT route for updating an existing product
app.put('/products/update/:id', async (req, res) => {
    const connection = await getDb()
    const items = await connection.query('UPDATE `products` SET `title` =?,`price` =?, `image` =?, `category_id` =?, `category` =?, `character_id` =?, `character` =?, `description` =?, `image2` =?, `image3` =? WHERE `id` =?',[req.body.title, req.body.price, req.body.image, req.body.category_id, req.body.category, req.body.character_id, req.body.character, req.body.description, req.body.image2, req.body.image3, req.params.id])

    res.json(responseFormat('200', req.body.title + ' has been updated', items))
})

// - Create a DELETE route for removing an existing product
app.put('/products/delete/:id', async (req, res) => {
    const connection = await getDb()
    const items = await connection.query('UPDATE `products` SET `deleted` = 1 WHERE `id` =?',[ req.params.id])

    res.json(responseFormat('200', req.body.title + ' has been deleted', items))
})

// app.get('/products/:category', async (req, res) => {
//     const connection = await getDb()
//     // const category =
//     const items = await connection.query('SELECT * FROM `products` WHERE `category` = ?', [req.params.category])
//     res.json(responseFormat('200', req.params.category + ' are displayed', items))
// })

app.get('/products', async (req, res) => {
    const connection = await getDb()
    let where_stmt = ''
    let bound_params = []

    if (req.query.category || req.query.character) {
        where_stmt += ' WHERE'
    }

    if (req.query.category) {
        where_stmt += ' `category` = ?'
        bound_params.push(req.query.category)
    }

    if (req.query.character && req.query.category) {
        where_stmt += ' AND'

    }

    if (req.query.character) {
        where_stmt += ' `character` = ?'
        bound_params.push(req.query.character)
    }

    let result = await connection.query('SELECT `title`, `price`, `image`, `category_id`, `category`, `character_id`, `character`, `description`, `image2`, `image3` FROM `products`' + where_stmt, bound_params)

    res.json(responseFormat('200', 'filtered selection displayed', result))
})


app.listen(port)








//[Exercise] RESTful e-commerce store API
//
// PLEASE BEAR THE REST RULES IN MIND
//
// - Use the provided database (link in curric and snippets channel)
// - Start out by creating an endpoint/route should be `/products` and this should return JSON containing every product the database.
// - This route should return the following fields for every product:
//     - ID
//     - image
//     - title
//     - price
//     - The next one should be an endpoint/route for `products/id`
//     - This route should return only a single product (based on it's ID)
//      - Should return every field from the DB table
//
// Stretch goals:
//
// - Create a POST route for adding a new product
// - Create a PUT route for updating an existing product
// - Create a DELETE route for removing an existing product
//
// Stretch goals v2:
//
// - Add the ability to filter `/products` by category and by character
// - Both filters should work at the same time
// - You should use GET params to do the filtering