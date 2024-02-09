import fs from 'fs'

class ProductManager {
	constructor(path) {
		this.path = path
		this.products = []
	}

	static id = 0

	addProduct = async (productToAdd) => {
		if (fs.existsSync(this.path)) {
			const search = this.products.find((product) => product.code === productToAdd.code)

			if (search) {
				throw new Error("⚠️  No se pudo agregar el producto. El campo 'code' ya existe.")
			} else if (!Object.values(productToAdd).every((field) => field !== null && field !== undefined)) {
				throw new Error("⚠️  No se pudo agregar el producto. Faltan campos.")
			}
		}

		await this.saveProduct({ id: ProductManager.id++, ...productToAdd })
	}

	saveProduct = async (productToSave) => {
		this.products.push(productToSave)
		await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
	}

	getProducts = async () => {
		if (fs.existsSync(this.path)) {
			let response = await fs.promises.readFile(this.path, 'utf-8')
			return JSON.parse(response)
		} else {
			return []
		}
	}

	getProductById = async (id) => {
		let response = await this.getProducts()
		let search = response.find((product) => product.id === id)

		if (search) {
			return search
		} else {
			throw new Error(`⚠️  ID: ${id} Not found`)
		}
	}

	updateProduct = async (id, field) => {
		let oldProduct = await this.getProductById(id)

		await this.deleteProduct(id)

		let newProduct = { ...oldProduct, ...field }

		await this.saveProduct(newProduct)
	}

	deleteProduct = async (id) => {
		let filter = this.products.filter((product) => product.id !== id)

		if (filter.length === this.products.length) {
			throw new Error(`⚠️  ID: ${id} Not found`)
		}

		await fs.promises.writeFile(this.path, JSON.stringify(filter, null, '\t'))

		this.products = await this.getProducts()
	}
}

export default ProductManager

// ---------- TESTS ----------
/* const ProductMngr = new ProductManager('src/products.json')

await ProductMngr.addProduct({
	title: 'Producto de prueba 1',
	description: 'Este es el producto de prueba 1',
	price: 200,
	thumbnail: 'Sin imagen',
	code: 'abc123',
	stock: 24,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 2',
	description: 'Este es el producto de prueba 2',
	price: 300,
	thumbnail: 'Sin imagen',
	code: 'abc124',
	stock: 12,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 3',
	description: 'Este es el producto de prueba 3',
	price: 400,
	thumbnail: 'Sin imagen',
	code: 'abc125',
	stock: 30,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 4',
	description: 'Este es el producto de prueba 4',
	price: 500,
	thumbnail: 'Sin imagen',
	code: 'abc126',
	stock: 29,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 5',
	description: 'Este es el producto de prueba 5',
	price: 600,
	thumbnail: 'Sin imagen',
	code: 'abc127',
	stock: 21,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 6',
	description: 'Este es el producto de prueba 6',
	price: 700,
	thumbnail: 'Sin imagen',
	code: 'abc128',
	stock: 63,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 7',
	description: 'Este es el producto de prueba 7',
	price: 800,
	thumbnail: 'Sin imagen',
	code: 'abc129',
	stock: 20,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 8',
	description: 'Este es el producto de prueba 8',
	price: 900,
	thumbnail: 'Sin imagen',
	code: 'abc130',
	stock: 100,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 9',
	description: 'Este es el producto de prueba 9',
	price: 1000,
	thumbnail: 'Sin imagen',
	code: 'abc131',
	stock: 73,
})

await ProductMngr.addProduct({
	title: 'Producto de prueba 10',
	description: 'Este es el producto de prueba 10',
	price: 1100,
	thumbnail: 'Sin imagen',
	code: 'abc132',
	stock: 111,
})
 */