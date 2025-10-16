// *************************** VARIABLES ********************************* //

// Creo un array de objetos para los productos de la web
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

// Defino un array de objetos que contendrá los productos agregados al carrito.
// Si ya hay informacion en el navegador, tomara esos datos, sino se iniciará vacío.
let carritoUsuario = [] || JSON.parse(localStorage.getItem("CarritoTG"));
// Variable global que almacena el total del carrito
let totalCompra;

// *************************** FUNCIONES ********************************* //

// Funciones para agregar o sacar un producto al carrito, reciben un objeto con los datos del producto.
// Esto agregará una nueva propiedad de cantidad de productos y subtotal por cada producto.

// Si el producto no existia previamente en el carrito, lo agrega.
function iniciarProducto(producto){
    producto.existe=true;
    producto.cantidad = 1;
    producto.subtotal = producto.precio * producto.cantidad;
    carritoUsuario.push(producto); 
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));  
}

// Si el producto ya existe en el carrito, incrementa la cantidad y recalcula subtotal
function agregarProducto(producto){
    producto.cantidad++;
    producto.subtotal = producto.precio * producto.cantidad;
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));  
}

// Eliminar el producto, siempre y cuando no sea menor a 0
function restarProducto(producto){
    if(producto.cantidad>1 && producto.existe)
        {producto.cantidad--;
        producto.subtotal = producto.precio * producto.cantidad;
        }
    else {
        producto.cantidad=0;
        producto.existe=false;
        let indexToDelete = carritoUsuario.findIndex(p => p.id == producto.id);
        console.log(indexToDelete);
        carritoUsuario.splice(indexToDelete,1);
        mostrarCarrito();
        // delete carritoUsuario[producto.id];
        // let indexToRemove = carritoUsuario.findIndex(producto.id);
        // carritoUsuario.splice(indexToRemove, 1);
    }
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
}

// Funcion que elimina todos los productos del carrito
function vaciarCarrito(){
    // Reinicia variables globales.
    carritoUsuario = [];
    totalCompra = 0;
    carritoVacio();
}

// Funcion que muestra un mensaje si el carrito esta vacio
function carritoVacio(){
let mensajeVacio = document.querySelector('.listaCarrito');
    mensajeVacio.innerHTML = `<h4>No tenés productos en tu carrito...</h4>
    <p><br>Volvé a nuestra sección de productos y conocé nuestras ofertas</P>`;
    localStorage.removeItem("CarritoTG");
}

// Funcion para renderizar un listado del carrito
function mostrarCarrito (){
    if (!carritoUsuario.length ==0 ){
    // Almaceno el elemento de la clase listaCarrito.
    let productosEnCarrito = document.querySelector('.listaCarrito');
    // Armo estructura de columnas en mi HTML para mostrar los productos en el carrito
    productosEnCarrito.innerHTML = 
            `<ul class="productoEnCarrito">
            <li>CÓDIGO</li>
            <li>PRODUCTO</li>
            <li>PRECIO</li>
            <li>CANTIDAD</li>
            <li>SUBTOTAL</li>
        </ul>` 
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
        // Agrego el articulo a la seccion de productos en carrito
        productosEnCarrito.appendChild(article);
    });
retomarCarrito();
calcularTotal();}
else {
    carritoVacio();
}
}

// Funcion que la de operatividad a los nuevos botones "+" y "-" dentro de la vista de carrito
function retomarCarrito (){
    // Tomo los elementos "+" y "-" del HTML creado al estar en modo vista carrito.
    let botonesCarritoAgregar = document.querySelectorAll('.agregarUnProducto');
    let botonesCarritoRestar = document.querySelectorAll('.sacarUnProducto'); 

    botonesCarritoAgregar.forEach((boton) => {
    // Detecto evento click en cada botón.
    boton.addEventListener('click', (e) => {
        // Comparo el id del producto con el id del boton clickeado
        let idProducto = parseInt(e.target.dataset.id);
        // Dentro de productoSeleccionado guardare la informacion del producto clickeado
        let productoSeleccionado = carritoUsuario.find((producto) => producto.id === idProducto);
            // Aumento la cantidad de productos en el carrito
            agregarProducto(productoSeleccionado);
            // Actualizo el HTML
            let cantidadElemento = document.querySelector(`.cantidad-id-${idProducto}`);
            cantidadElemento.textContent = productoSeleccionado.cantidad;
            let subtotalElemento = cantidadElemento.parentElement.nextElementSibling;
            subtotalElemento.textContent = `USD ${productoSeleccionado.subtotal}.-`;
            reCalcularTotal();
            })});

    botonesCarritoRestar.forEach((boton) => {
    // Detecto evento click en cada boton
    boton.addEventListener('click', (e) => {
        // Dentro de productoSeleccionado guardare la informacion del producto clickeado
        // Comparo el id del producto con el id del boton clickeado
        let idProducto = parseInt(e.target.dataset.id);        
        let productoSeleccionado = carritoUsuario.find((producto) => producto.id == idProducto);
            // Resto la cantidad de productos en el carrito
            restarProducto(productoSeleccionado);
            // Actualizo el HTML
            let cantidadElemento = document.querySelector(`.cantidad-id-${idProducto}`);
            cantidadElemento.textContent = productoSeleccionado.cantidad;
            let subtotalElemento = cantidadElemento.parentElement.nextElementSibling;
            subtotalElemento.textContent = `USD ${productoSeleccionado.subtotal}.-`;
            reCalcularTotal();
        })})
};

//
function reCalcularTotal() {
    let totalElemento=document.querySelector(`#total`);
    totalCompra = 0;
    carritoUsuario.forEach((producto) =>{
        totalCompra = totalCompra + producto.subtotal;
    });
    
    totalElemento.textContent = `USD ${totalCompra}.-`;
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
}

// Funcion para calcular el total de la compra
function calcularTotal (){
    totalCompra = 0;
    let productosEnCarrito = document.querySelector('.listaCarrito');
    
    let total = document.createElement("article");
    carritoUsuario.forEach((producto) =>{
        totalCompra = totalCompra + producto.subtotal;
    });
    total.innerHTML = `<p>TOTAL</p>
    <p id=total>USD ${totalCompra}.-</p>`
    total.classList.add("totalCarrito");
    productosEnCarrito.appendChild(total);

    // Agrego botones de vaciar carrito
    let botonVaciar = document.createElement("button");
    botonVaciar.innerHTML = `VACIAR`;
    botonVaciar.classList.add("botones");
    botonVaciar.classList.add("operacionVaciar");
    botonVaciar.addEventListener('click', () => {
        vaciarCarrito();})
    productosEnCarrito.appendChild(botonVaciar);

    // Agrego boton de finalizar la compra
    let botonFinalizar = document.createElement("button");
    botonFinalizar.innerHTML = `FINALIZAR COMPRA`;
    botonFinalizar.classList.add("botones");
    botonFinalizar.classList.add("operacionFinalizar");
    botonFinalizar.addEventListener('click', () => {
        finalizarCarrito();})
    productosEnCarrito.appendChild(botonFinalizar);
};


// *************************** EVENTOS ********************************* //

// Tomo los productos dentro de listaProductos y los agrego al HTML
let productos = document.querySelector('.listaProductos');
// Recorro el array de productos
 listaProductos.forEach((producto) =>{
    let articleProducto = document.createElement("article");
    articleProducto.innerHTML = `
    <h4>${producto.nombre}</h4>
    <p>USD ${producto.precio}.-</p>
    <button class='agregarAlCarro operacionAgregar' data-id=${producto.id}>Agregar al carrito</button>
    `;
    // Agrego el article al section de listaProductos en el HTML
    productos.appendChild(articleProducto);
});

// Agrego funcionalidad a los botones de agregar al carrito en la pagina principal.
let botonesAgregar = document.querySelectorAll('.operacionAgregar');
botonesAgregar.forEach((boton) => {
    // Detecto evento click en cada boton.
    boton.addEventListener('click', (e) => {
        // Dentro de productoSeleccionado guardaré la informacion del producto clickeado.
        // Comparo el id del producto con el id del boton clickeado.
        const productoSeleccionado = listaProductos.find((producto) => producto.id == e.target.dataset.id); 
        // Verifico si el producto ya se encuentra en el carrito
        if (carritoUsuario.find((producto) => producto.id == productoSeleccionado.id)){
            // Si ya existe, aumento la cantidad de productos en el carrito.
            agregarProducto(productoSeleccionado);}
            else {
            // Si no existe, lo agrego al carrito con cantidad 1.
            iniciarProducto(productoSeleccionado);
            }
    });
});

// Alternar entre vista carrito/productos.

// Variable que almacena el texto del boton, ya sea "Ver Carrito" o "Volver a Productos".
let carritoYProductos = document.querySelector('.verCarrito');
// Variable que almacena listado de productos en HTML.
let articulosProductos = document.querySelector('.listaProductos');
// Variable que almacena listado del carrito en HTML.
let productosEnCarrito = document.querySelector('.listaCarrito');
// Variable para texto contextual de la sección.
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
        // Ejecuto la funcion para mostrar el carrito con los productos.
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