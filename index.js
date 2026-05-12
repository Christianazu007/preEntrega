const BASE_URL = 'https://fakestoreapi.com';


const args = process.argv.slice(2);
const [method, resource, ...rest] = args;



async function getProducts() {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();
    console.log(data);
}

async function getProductById(id) {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    const text = await response.text();
    if (!text) {
        console.log(`Producto con id ${id} no encontrado.`);
        return;
    }
    const data = JSON.parse(text);
    console.log(data);
}

async function createProduct(title, price, category) {
    const nuevoProducto = { title, price: parseFloat(price), category }; 
    const response = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),   
    });
    const data = await response.json();
    console.log(`Producto creado con id: ${data.id}`);
    console.log(data);
}

async function deleteProduct(id) {
    const response = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
    const data = await response.json();
    console.log(`Producto ${id} eliminado:`);
    console.log(data);
}


async function main() {
    try {
        if (!method || !resource) {
            console.log('Uso: npm run start <GET|POST|DELETE> <products[/id]> [título] [precio] [categoría]');
            return;
        }

        const [endpoint, id] = resource.split('/');

        if (method === 'GET' && endpoint === 'products') {
            id ? await getProductById(id) : await getProducts();

        } else if (method === 'POST' && endpoint === 'products') {
            const [title, price, category] = rest;
            if (!title || !price || !category) {
                console.log('Faltan datos: npm run start POST products <título> <precio> <categoría>');
                return;
            }
            await createProduct(title, price, category);

        } else if (method === 'DELETE' && endpoint === 'products') {
            if (!id) {
                console.log('Falta el id: npm run start DELETE products/<id>');
                return;
            }
            await deleteProduct(id);

        } else {
            console.log(`Comando no reconocido: ${method} ${resource}`);
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error.message);
    }
}

main();
