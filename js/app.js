// *************************** CLASES ********************************* //

// Creo la Clase Producto Carrito que deriva de la informacion del listado de productos.
// Esto agregará una nueva propiedad de si existe, cantidad de productos y subtotal por cada elemento.

class ProductoCarrito{

    // Genero una entrade de producto al carrito
    constructor(id,nombre,precio){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.existe = true;
        this.cantidad = 1;
        this.subtotal = this.precio * this.cantidad; 
    }

    // Creo funcionalidad de agregar un producto existente al carrito
    agregarProducto(){
    this.cantidad++;
    this.subtotal = this.precio * this.cantidad;
    // Guardo en Local Storage
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));  
    }

    // Creo funcionalidad de restar un producto existente al carrito
    restarProducto(){
        if(this.cantidad>1 && this.existe)
            {this.cantidad--;
            this.subtotal = this.precio * this.cantidad;
            }
            //Si la cantidad llega a 0, elimino la entrada en el carrito
        else {
            this.cantidad=0;
            this.existe=false;
            // Lo elimino del HTML
            let indexToDelete = carritoUsuario.findIndex(p => p.id === this.id);
            carritoUsuario.splice(indexToDelete,1);
            // Actualizo pantalla
            mostrarCarrito();
        }
        // Guardo en Local Storage
        localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
    }
}

// *************************** VARIABLES ********************************* //

// Creo un array de objetos para los productos de la web
const listaProductos = [
    {id:1, nombre:"Nintendo Switch 2", precio:350},
    {id:2, nombre:"Play Station 5", precio:460}, 
    {id:3, nombre:"XBox Series X", precio:400},
    {id:4, nombre:"PC", precio:600},
    {id:5, nombre:"Play Station 4", precio:300},
    {id:6, nombre:"XBox One", precio:300},
    {id:7, nombre:"Nintendo Switch OLED", precio:300},
    {id:8, nombre:"Play Station 3", precio:200},
    {id:9, nombre:"XBox 360", precio:200},
    ];

// Defino un array de objetos que contendrá los productos agregados al carrito.
let carritoUsuario = (JSON.parse(localStorage.getItem("CarritoTG")) || []).map(p => Object.assign(new ProductoCarrito(p.id, p.nombre, p.precio), p));
// Si ya hay informacion en el navegador, tomara esos datos, sino se iniciará vacío.
// Necesito resetear los objetos planos que recupero de LocalStore y re-convertirlos a elementos de la clase ProductoCarrito para mantener su funcionalidad.

// Variable global que almacena el total del carrito
let totalCompra = 0;


// *************************** FUNCIONES ********************************* //

// Funcion principal para renderizar el listado del carrito.
function mostrarCarrito (){
    // Siempre que el carrito tenga productos, lo muestro.
    if (carritoUsuario.length !== 0){
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
        // Si el carrito esta vacio, lo informo.
        carritoVacio();
    }
}

// Funcion secundaria que opera una vez mostrado el listado del carrito.
function retomarCarrito (){
    // Tomo los elementos "+" y "-" del HTML creado al estar en modo vista carrito.
    let botonesCarritoAgregar = document.querySelectorAll('.agregarUnProducto');
    let botonesCarritoRestar = document.querySelectorAll('.sacarUnProducto'); 
    // Le doy funcionalidad a los nuevos botones "+" y "-" dentro de la vista de carrito.
    // Agregar
    botonesCarritoAgregar.forEach((boton) => {
    // Detecto evento click en cada botón.
    boton.addEventListener('click', (e) => {
        // Comparo el id del producto con el id del boton clickeado
        let idProducto = parseInt(e.target.dataset.id);
        // Dentro de productoSeleccionado guardare la informacion del producto clickeado
        let productoSeleccionado = carritoUsuario.find((producto) => producto.id === idProducto);
            // Aumento la cantidad de productos en el carrito
            productoSeleccionado.agregarProducto();
            // Actualizo el HTML
            let cantidadElemento = document.querySelector(`.cantidad-id-${idProducto}`);
            cantidadElemento.textContent = productoSeleccionado.cantidad;
            let subtotalElemento = cantidadElemento.parentElement.nextElementSibling;
            subtotalElemento.textContent = `USD ${productoSeleccionado.subtotal}.-`;
            //Recalculo total
            recalcularTotal();
            })});
    // Quitar
    botonesCarritoRestar.forEach((boton) => {
    // Detecto evento click en cada boton
    boton.addEventListener('click', (e) => {
        // Dentro de productoSeleccionado guardare la informacion del producto clickeado
        // Comparo el id del producto con el id del boton clickeado
        let idProducto = parseInt(e.target.dataset.id);        
        let productoSeleccionado = carritoUsuario.find((producto) => producto.id === idProducto);
            // Resto la cantidad de productos en el carrito
            productoSeleccionado.restarProducto();
            // Si al restar cantidad aun quedan productos, actualizo el HTML
            if(productoSeleccionado.cantidad>0) {
            let cantidadElemento = document.querySelector(`.cantidad-id-${idProducto}`);
            cantidadElemento.textContent = productoSeleccionado.cantidad;
            let subtotalElemento = cantidadElemento.parentElement.nextElementSibling;
            subtotalElemento.textContent = `USD ${productoSeleccionado.subtotal}.-`;
            }
            //Recalculo total
            recalcularTotal();
        })})
};

// Funcion para calcular el total de la compra, mostrarla en el HTML y modificar el DOM.
function calcularTotal (){
    totalCompra = 0;
    let productosEnCarrito = document.querySelector('.listaCarrito');
    let total = document.createElement("article");
    // Por cada producto del carrito sumo el total
    carritoUsuario.forEach((producto) =>{
        totalCompra = totalCompra + producto.subtotal;
    });
    // Lo reflejo en HTML
    total.innerHTML = `<p>TOTAL</p>
    <p id=total>USD ${totalCompra}.-</p>`
    total.classList.add("totalCarrito");
    productosEnCarrito.appendChild(total);

    // Creo un contenedor en HTML para luego alojar los botones de "Vaciar carrito" y "Finalizar compra"
    let espacioBotones = document.createElement("article");
    espacioBotones.classList.add("espacioBotones")
    productosEnCarrito.appendChild(espacioBotones);

    // Agrego botones de vaciar carrito
    let botonVaciar = document.createElement("button");
    botonVaciar.innerHTML = `VACIAR`;
    botonVaciar.classList.add("botones");
    botonVaciar.classList.add("operacionVaciar");
    botonVaciar.addEventListener('click', () => {
        vaciarCarrito();})
    espacioBotones.appendChild(botonVaciar);

    // Agrego boton de finalizar la compra
    let botonFinalizar = document.createElement("button");
    botonFinalizar.innerHTML = `FINALIZAR COMPRA`;
    botonFinalizar.classList.add("botones");
    botonFinalizar.classList.add("operacionFinalizar");
    botonFinalizar.addEventListener('click', () => {
        finalizarCarrito();})
        espacioBotones.appendChild(botonFinalizar);
};

// Funcion que elimina todos los productos del carrito
function vaciarCarrito(){
    // Reinicia variables globales.
    carritoUsuario = [];
    totalCompra = 0;
    localStorage.removeItem("CarritoTG");
    carritoVacio();
}

// Actualiza el total del carrito en el HTML.
function recalcularTotal() {
    let totalElemento=document.querySelector(`#total`);
    totalCompra = 0;
    if (carritoUsuario.length !== 0){
    carritoUsuario.forEach((producto) =>{
        totalCompra = totalCompra + producto.subtotal;
    });
    totalElemento.textContent = `USD ${totalCompra}.-`;}
    else {
        carritoVacio();
    }
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
}

// Funcion que muestra un mensaje si el carrito esta vacio
function carritoVacio(){
let mensajeVacio = document.querySelector('.listaCarrito');
    mensajeVacio.innerHTML = `<h4>No tenés productos en tu carrito...</h4>
    <p><br>Volvé a nuestra sección de productos y conocé nuestras ofertas</P>`;
}

// Al finalizar la compra se muestra un mensaje en pantalla
function finalizarCarrito() {
    let mensajeFin = document.querySelector('.listaCarrito');
    mensajeFin.innerHTML = `<h4>¡Tu compra se concretó con éxito!</h4>
    <p><br>Muchas gracias por comprar en nuestra tienda, tus productos llegarán a la brevedad</P>`;
    mensajeFin.classList.add("compraFinalizada");
    carritoUsuario = [];
    localStorage.removeItem("CarritoTG");
}

// *************************** EVENTOS ********************************* //

// Tomo los productos dentro de listaProductos y los agrego al HTML
let productos = document.querySelector('.listaProductos');
// Recorro el array de productos
 listaProductos.forEach((producto) =>{
    let articleProducto = document.createElement("article");
    articleProducto.innerHTML = `
    <img class="imagenProd" src="img/product_00${producto.id}.png" alt="${producto.nombre}">
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
        const productoSeleccionado = listaProductos.find((producto) => producto.id === Number(e.target.dataset.id)); 
        // Verifico si el producto ya se encuentra en el carrito
        const productoExistente = carritoUsuario.find(p => p.id === productoSeleccionado.id);
        if (productoExistente) {
            // Si ya existe, aumento la cantidad de productos en el carrito.
            productoExistente.agregarProducto();
        } else {
            // Si no existe, lo inicializo en el carrito
            const nuevoProducto = new ProductoCarrito(productoSeleccionado.id,productoSeleccionado.nombre,productoSeleccionado.precio);
            carritoUsuario.push(nuevoProducto);
            localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
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
        articulosProductos.classList.add('oculto');
        productosEnCarrito.classList.remove('oculto');
        infoSeccion.innerText = "Estos son los productos en tu carrito:";
        // Ejecuto la funcion para mostrar el carrito con los productos.
        mostrarCarrito();
    }
    // Si se encuentra en modo carrito, vuelve a modo productos
    else if(carritoYProductos.innerText == "Volver a Productos"){
        carritoYProductos.innerText = "Ver carrito";
        carritoYProductos.classList.remove('volverHome');
        // Oculto carrito y muestro productos
        articulosProductos.classList.remove('oculto');
        productosEnCarrito.classList.add('oculto');
        productosEnCarrito.classList.remove('compraFinalizada');
        infoSeccion.innerText = "Elige entre nuestros productos";
    }
});