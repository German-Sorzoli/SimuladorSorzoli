// Definicion de variable globales, constantes y arrays

let datosUsuario = [];
const listaProductos = [
    {id:1, nombre:"Nintendo Switch 2", precio:350},
    {id:2, nombre:"Play Station 5", precio:460}, 
    {id:3, nombre:"XBox Series X", precio:400},
    {id:4, nombre:"PC", precio:600},
    {id:5, nombre:"Play Station 4", precio:300},
    {id:6, nombre:"XBox One", precio:250},
    {id:7, nombre:"Nintendo Switch Lite", precio:200},
    {id:8, nombre:"Nintendo Switch OLED", precio:300},
    {id:9, nombre:"XBox 360", precio:100},
    ];
const precioDolar = 1400;

let carritoUsuario = [] || JSON.parse(localStorage.getItem("CarritoTG")); // Si existe un carrito en el localStorage, lo cargo, sino inicializo un array vacio
let totalCompra;
let listadoCompra;

// Definicion de funciones

// Vuelco productos en HTML

let productos = document.querySelector('.listaProductos');
// Recorro el array de productos
 listaProductos.forEach((producto) =>{
    let article = document.createElement("article");
    article.innerHTML = `
    <h4>${producto.nombre}</h4>
    <p>USD ${producto.precio}.-</p>
    <button class='agregarAlCarro operacionAgregar' data-id=${producto.id}>Agregar al carrito</button>
    `;
    // Agrego el article al section de productos
    productos.appendChild(article);
});


// Agrego funcionalidad a los botones de agregar al carrito.

let botonesAgregar = document.querySelectorAll('.operacionAgregar');
botonesAgregar.forEach((boton) => {
    // Detecto evento click en cada boton
    boton.addEventListener('click', (e) => {
        // Dentro de productoSeleccionado guardare la informacion del producto clickeado
        // Comparo el id del producto con el id del boton clickeado
        let productoSeleccionado = listaProductos.find((producto) => producto.id == e.target.dataset.id); 
        // Verifico si el producto ya se encuentra en el carrito
        if (carritoUsuario.find((producto) => producto.id == productoSeleccionado.id)){
            // Si ya existe, aumento la cantidad de productos en el carrito
            agregarProducto(productoSeleccionado);}
            else {
            // Si no existe, lo agrego al carrito con cantidad 1
            iniciarProducto(productoSeleccionado);
            }
    });
});

// Funcion para renderizar un listado del carrito

function mostrarCarrito (){
    let productosEnCarrito = document.querySelector('.listaCarrito');
    // Armo estructura HTML para mostrar los productos en el carrito
    productosEnCarrito.innerHTML = 
            `<ul class="productoEnCarrito">
            <li>CÓDIGO</li>
            <li>PRODUCTO</li>
            <li>PRECIO</li>
            <li>CANTIDAD</li>
            <li>SUBTOTAL</li>
        </ul>` 
        // Limpio el HTML para evitar duplicados

// Recorro el array de productos en el carrito
    carritoUsuario.forEach((producto) =>{
        let article = document.createElement("article");
        // Armo estructura HTML para mostrar los productos en el carrito
        article.innerHTML = `
        <p>00${producto.id}</p>
        <p><b>${producto.nombre}</b></p>
        <p>USD ${producto.precio}.-</p>
        <div><p class="cantidad-id-${producto.id}">${producto.cantidad}</p>
        <button class='agregarUnProducto' data-id=${producto.id}>+</button>
        <button class='sacarUnProducto' data-id=${producto.id}>-</button></div>
        <p>USD ${producto.subtotal}.-</p>
        `;
        // Agrego estilos al articulo
        article.classList.add("productoEnCarrito");
        // Agrego el articulo a la seccion de productos
        productosEnCarrito.appendChild(article);
    });
retomarCarrito();
calcularTotal();
}

// Alternar entre vista carrito y productos
let carritoYProductos = document.querySelector('.verCarrito');
let articulosProductos = document.querySelector('.listaProductos');
let productosEnCarrito = document.querySelector('.listaCarrito');
let infoSeccion = document.querySelector('h3');

carritoYProductos.addEventListener('click', () => {
    // Agrego clase con estilo del boton
    if (carritoYProductos.innerText == "Ver carrito"){
        // Si se encuentra en modo productos, muestra el carrito
        carritoYProductos.innerText = "Volver a Productos";
        carritoYProductos.classList.add('volverHome');
        // Oculto productos y muestro carrito
        articulosProductos.classList.add('hidden');
        productosEnCarrito.classList.remove('hidden');
        infoSeccion.innerText = "Estos son los productos en tu carrito:";
        mostrarCarrito();
    }
    // Si se encuentra en modo carrito, vuelve a modo productos
    else if(carritoYProductos.innerText == "Volver a Productos"){
        carritoYProductos.innerText = "Ver carrito";
        carritoYProductos.classList.remove('volverHome');
        // Oculto carrito y muestro productos
        articulosProductos.classList.remove('hidden');
        productosEnCarrito.classList.add('hidden');
        infoSeccion.innerText = "Elige entre nuestros productos";
    }
})


// Funcion para calcular el total de la compra
function calcularTotal (){
    totalCompra = 0;
    let productosEnCarrito = document.querySelector('.listaCarrito');
    
    let total = document.createElement("article");
    carritoUsuario.forEach((producto) =>{
        totalCompra = totalCompra + producto.subtotal;
    });
    total.innerHTML = `<p>TOTAL</p>
    <p id=#total>USD ${totalCompra}.-</p>`
    total.classList.add("totalCarrito");
    productosEnCarrito.appendChild(total);

    // Agrego botones de vaciar carrito
    let botonVaciar = document.createElement("button");
    botonVaciar.innerHTML = `VACIAR`;
    botonVaciar.classList.add("botones");
    botonVaciar.classList.add("operacionVaciar");
    botonVaciar.addEventListener('click', () => {
        console.log('Se vacio el carrito');
        vaciarCarrito();})
    productosEnCarrito.appendChild(botonVaciar);

    // Agrego boton de finalizar la compra
    let botonFinalizar = document.createElement("button");
    botonFinalizar.innerHTML = `FINALIZAR COMPRA`;
    botonFinalizar.classList.add("botones");
    botonFinalizar.classList.add("operacionFinalizar");
    botonFinalizar.addEventListener('click', () => {
        console.log('Se concretó la compra');
        finalizarCarrito();})
    productosEnCarrito.appendChild(botonFinalizar);

};

// funcion agregar producto al carrito. Esto agregara una nueva propiedad de cantidad de productos y subtotal en el carrito por cada objeto.

function agregarProducto(producto){
    producto.cantidad++;
    producto.subtotal = producto.precio * producto.cantidad;
    console.log(producto);
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));  
}

function iniciarProducto(producto){
    producto.cantidad = 1;
    producto.subtotal = producto.precio * producto.cantidad;
    carritoUsuario.push(producto); 
    console.log(producto);
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));  
}

function sacarProducto(producto){
    if(producto.cantidad>0)
        {producto.cantidad--;
        producto.subtotal = producto.precio * producto.cantidad;
        console.log(producto);
        localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));  
        }
    else {
        delete carritoUsuario[producto.id];
        console.log(`El producto ${producto.nombre} fue eliminado`);
        localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
    }
}

function vaciarCarrito(){
    let productosEnCarrito = document.querySelector('.listaCarrito');
    carritoUsuario = [];
    console.log(carritoUsuario);
    productosEnCarrito.innerHTML = `<h4 class="noItems">No tenés productos en tu carrito...</h4>
    <p><br>Volvé a nuestra sección de productos y conocé nuestras ofertas</P>`;
    localStorage.removeItem("CarritoTG");
    totalCompra = 0;
}

function retomarCarrito (){
    let botonesCarritoAgregar = document.querySelectorAll('.agregarUnProducto');
    let botonesCarritoRestar = document.querySelectorAll('.sacarUnProducto');

    botonesCarritoAgregar.forEach((boton) => {
    // Detecto evento click en cada boton
    boton.addEventListener('click', (e) => {
        // Dentro de productoSeleccionado guardare la informacion del producto clickeado
        // Comparo el id del producto con el id del boton clickeado
        let idProducto = parseInt(e.target.dataset.id);
        let productoSeleccionado = carritoUsuario.find((producto) => producto.id === idProducto);
            // Aumento la cantidad de productos en el carrito
            agregarProducto(productoSeleccionado);
            // Actualizo el HTML
            let cantidadElemento = document.querySelector(`.cantidad-id-${idProducto}`);
            cantidadElemento.textContent = productoSeleccionado.cantidad;
            let subtotalElemento = cantidadElemento.parentElement.nextElementSibling;
            subtotalElemento.textContent = `USD ${productoSeleccionado.subtotal}.-`;
            recalcularTotal();
        })
    });

    botonesCarritoRestar.forEach((boton) => {
    // Detecto evento click en cada boton
    boton.addEventListener('click', (e) => {
        // Dentro de productoSeleccionado guardare la informacion del producto clickeado
        // Comparo el id del producto con el id del boton clickeado
        let productoSeleccionado = listaProductos.find((producto) => producto.id == e.target.dataset.id);
            // Resto la cantidad de productos en el carrito
            sacarProducto(productoSeleccionado);
        })})
};

function recalcularTotal() {
    let totalElemento=document.querySelector(`#total`);
    totalCompra = 0;
    carritoUsuario.forEach((producto) =>{
        totalCompra = totalCompra + producto.subtotal;
    });
    total.textContent = `USD ${totalCompra}.-`;
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
}