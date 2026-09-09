let url = "https://fakestoreapi.com/products";// رابط الـAPI

async function getProducts() {
    let response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    let data = await response.json();

    return data;
}

