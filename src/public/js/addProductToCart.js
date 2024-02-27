function addProductToCart(id) {
    fetch(`/api/carts/65cb09e9b1745ede853296af/product/${id}`, {
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => console.log(data));
    alert("Producto agregado al carrito!");
}
