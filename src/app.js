import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
app.use(express.urlencoded({ extended: true }))

const ProductMngr = new ProductManager('src/products.json')
const getProducts = ProductMngr.getProducts()

app.get("/products", async (req, res) => {
    let limit = parseInt(req.query.limit)
    if(!limit) { return res.send(await getProducts) }

    let allProducts = await getProducts
    let productLimit = allProducts.slice(0, limit)
    res.send(productLimit)
})

app.get("/products/:pid", async (req, res) => {
    let pid = parseInt(req.params.pid)

    try {
        let product = await ProductMngr.getProductById(pid)
        res.send(product)
    } catch (error) {
        res.status(404).send({ error: 'Producto no encontrado' })
    }
})

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Server running in port ${server.address().port}`)
})
server.on("error", error => console.error(`Server error: ${error}`))