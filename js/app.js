// *************************** CLASES ********************************* //

// Creo la Clase Producto Carrito que deriva de la informacion del listado de productos.
// Esto agregará una nueva propiedad de "cantidad" de productos y "subtotal" por cada elemento.

class ProductoCarrito{

    // Constructor
    constructor(id,nombre,consola,precio){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.consola = consola;
        this.cantidad = 1;
        // Calculo de subtotal con 2 decimales.
        this.actualizarSubtotal();
    }

    // Subtotal
    actualizarSubtotal(){
        this.subtotal = parseFloat((this.precio * this.cantidad).toFixed(2));
    }

    // Cantidades
    guardarCarrito(accion){
        if(accion ==='agregar'){
            this.cantidad++;
        }
        else if(accion ==='restar'){
            if(this.cantidad>1){
                this.cantidad--;
                }
                //Si la cantidad llega a 0, elimino la entrada en el carrito
            else {
                this.cantidad=0;
                // Lo elimino del HTML
                let indexToDelete = carritoUsuario.findIndex(p => p.id === this.id);
                carritoUsuario.splice(indexToDelete,1);
                mostrarCarrito();
            }
        }
        // Calculo de subtotal
        this.actualizarSubtotal();
        // Guardo en Local Storage           
        guardarLocal();
        // Actualizo pantalla
    }
}

// *************************** VARIABLES ********************************* //

// Guardo la infomacion de productos del JSON original
let listaProductos=[];
// Una vez utilizado, guardo la informacion en un nuevo array de objetos para su manipulacion
let listaOrdenada=[];

// Defino un array de objetos que contendrá los productos agregados al carrito.
let carritoUsuario = (JSON.parse(localStorage.getItem("CarritoTG")) || []).map(p => Object.assign(new ProductoCarrito(p.id, p.nombre, p.consola, p.precio), p));
// Si ya hay informacion en el navegador, tomara esos datos, sino se iniciará vacío.
// Necesito resetear los objetos planos que recupero de LocalStore y re-convertirlos a elementos de la clase ProductoCarrito para mantener su funcionalidad.

// Variable global que almacena el total del carrito
let totalCompra = 0;

// Variable que almacena el texto del boton, ya sea "Ver Carrito" o "Volver a Productos".
let carritoYProductos = document.querySelector('.verCarrito');
// Variable que almacena listado de productos en HTML.
let articulosProductos = document.querySelector('.listaProductos');
// Variable que almacena listado del carrito en HTML.
let productosEnCarrito = document.querySelector('.listaCarrito');
// Variable para texto contextual de la sección.
let infoSeccion = document.querySelector('h3');
// Variable para el carousel
let carouselVisible = document.querySelector('#carousel-news');
// Variable para los filtros de busqueda
let filtrosDeBusqueda = document.querySelector('.filtrosDeBusqueda');
// Variable para los botones de continuar y vaciar carrito
let botonesCarrito = document.querySelector('.espacioBotones');

// *************************** FUNCIONES ********************************* //

// Local Storage
function guardarLocal(){
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
}

// Total
function totalCarrito(){
    return carritoUsuario
    .reduce((acc, p) => acc + p.subtotal, 0)
    .toFixed(2);
}

// Vaciar Carrito
function vaciarCarrito(){
    // Reinicia variables globales.
    carritoUsuario = [];
    totalCompra = 0;
    localStorage.removeItem("CarritoTG");
    // Al vaciar el carrito genero notificacion
        Toastify({
        text: "El carrito esta vacío",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #999999ff, #414141ff)",
            borderRadius: "30px",
        },
        onClick: function(){} 
        }).showToast();
    carritoVacio();
}

// Recolectar productos del archivo products.json
const buscarListaProductosJSON = async () => { // Implementacion de asincronía.
    try{
        const response = await fetch('./json/products.json');
        const data = await response.json();
        listaProductos = listaOrdenada = data;
        mostrarProductosHTML(listaProductos);
    } catch (error){
        // En caso de no poder contactar al servidor, saldra un alerta informandolo
        // SweetAlert2
        Swal.fire({
        title: "Error de conexión",
        text: "No se pudo contactar al servidor. Intentelo mas tarde.",
        icon: "error",
        customClass: {
            popup: 'vaciarPopup',
            title: 'vaciarTitulo',
            confirmButton: 'vaciarConfirm',
            cancelButton: 'vaciarConfirm',
        },
        confirmButtonColor: "rgba(80, 80, 80, 1)",
        confirmButtonText: "Ok",
        });
    }
}

// Orden de productos
function ordernarProductosPor(objetos,orden) {
    listaOrdenada = objetos.slice();
    listaOrdenada.sort((a,b)=> { 
        if (a.nombre > b.nombre){return (1 * orden)}
        if (a.nombre < b.nombre){return (-1 * orden)}
        return 0;
    })
};

// Filtrar productos
function filtrarProductos(objetos,consola) {
    listaOrdenada = objetos.slice();
    listaOrdenada = listaOrdenada.filter(prod => prod.consola === consola)
    mostrarProductosHTML(listaOrdenada);
};


// *************************** RENDERIZACION ********************************* //

//  Renderizar productos en el HTML y funcionalidades
function mostrarProductosHTML(listado){
    // Tomo los productos dentro de listaProductos y los agrego al HTML
    let productos = document.querySelector('.listaProductos');
    //Reinicio el espacio donde se renderizaran los productos
    productos.innerHTML='';
    // Recorro el array que ahora contiene a los productos obtenidos del JSON
    listado.forEach((producto) =>{
        // Creo un articulo por cada uno
        let articleProducto = document.createElement("article");
        articleProducto.innerHTML = `
        <img class="imagenProd" src="img/product_00${producto.id}.png" alt="${producto.nombre}">
        <h4>${producto.nombre}</h4>
        <p>USD ${producto.precio}.-</p>
        <button class='agregarAlCarro operacionAgregar' data-id=${producto.id}>Agregar al carrito</button>`;
        // Agrego el article al section de listaProductos en el HTML
        productos.appendChild(articleProducto);
    });
    // *EVENTO*
    // Agrego funcionalidad a los botones de agregar al carrito en la pagina principal.
    let botonesAgregar = document.querySelectorAll('.operacionAgregar');
    botonesAgregar.forEach((boton) => {
        // Detecto evento click en cada boton.
        boton.addEventListener('click', (e) => {
            // Dentro de productoSeleccionado guardaré la informacion del producto clickeado.
            // Comparo el id del producto con el id del boton clickeado.
            const productoSeleccionado = listado.find((producto) => producto.id === Number(e.target.dataset.id)); 
            // Verifico si el producto ya se encuentra en el carrito
            let productoExistente = carritoUsuario.find(p => p.id === productoSeleccionado.id);
            if (productoExistente) {
                // Si ya existe, aumento la cantidad de productos en el carrito.
                productoExistente.guardarCarrito('agregar');
            } else {
                // Si no existe, lo inicializo en el carrito
                const nuevoProducto = new ProductoCarrito(productoSeleccionado.id,productoSeleccionado.nombre,productoSeleccionado.consola,productoSeleccionado.precio);
                carritoUsuario.push(nuevoProducto);
                // Lo guardo ademas en local store
                guardarLocal();
            }
            // Al agregar producto creo notificacion de toastify
            Toastify({
            text: "⬆ Producto agregado",
            duration: 2000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            className: "mi-toast",
            onClick: function(){window.scrollTo({ top: 0, behavior: "smooth" });} 
            }).showToast();
        });
    });
}

// Renderizar carrito y sus funciones
function mostrarCarrito (){
    totalCompra=0;
    // Siempre que el carrito tenga productos, lo muestro.
    if (carritoUsuario.length !== 0){
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
            <button class='miniBoton agregarUnProducto' data-id=${producto.id}>+</button>
            <button class='miniBoton sacarUnProducto' data-id=${producto.id}>-</button></div>
            <p>USD ${producto.subtotal}.-</p>
            `;
            // Agrego estilos al articulo
            article.classList.add("productoEnCarrito");
            // Agrego el articulo a la seccion de productos en carrito
            productosEnCarrito.appendChild(article);
            // Por cada producto del carrito sumo el total de la compra
            totalCompra = parseFloat((totalCompra + producto.subtotal).toFixed(2));
        });
        // Muestro el total de la compra
        let total = document.createElement("article");
        total.innerHTML = `<p>TOTAL</p>
        <p id=total>USD ${totalCompra}.-</p>`
        total.classList.add("totalCarrito");
        productosEnCarrito.appendChild(total);
        // Creo un contenedor en HTML para luego alojar los botones de "Vaciar" y "Continuar compra"
        let espacioBotones = document.createElement("article");
        espacioBotones.classList.add("espacioBotones")
        // Agrego botones de vaciar carrito
        let botonVaciar = document.createElement("button");
        botonVaciar.innerHTML = `VACIAR`;
        botonVaciar.classList.add("botones", "operacionVaciar");
        espacioBotones.appendChild(botonVaciar);
        // Agrego boton para continuar con la compra
        let botonContinuar = document.createElement("button");
        botonContinuar.innerHTML = `CONTINUAR COMPRA`;
        botonContinuar.classList.add("botones", "operacionContinuar");
        espacioBotones.appendChild(botonContinuar);
        // Agrego toda la seccion
        productosEnCarrito.appendChild(espacioBotones);
        }
    else {
        // Si el carrito esta vacio, lo informo.
        carritoVacio();
    }
};

// Renderizar formulario de la compra y funcionalidad
function completarFormularioCompra(){
        // Almaceno el elemento de la clase listaCarrito pero oculto los botones para modificar las cantidades
        let ocultarMiniBotones = document.querySelectorAll('.miniBoton');
        ocultarMiniBotones.forEach((boton)=>{
                boton.classList.add('oculto');
        })
        // agrego el codigo para el formulario de compra
        let listadoDefinitivo = document.querySelector('.listaCarrito');
        let formularioCompra = document.createElement("article");
        formularioCompra.innerHTML = `
        <h3>Por favor completa con tus datos: <br><br></h3>
        <form id="miForm">
            <div class="form-row formularioCompra">
                <div class="form-group">
                <label for="inputName">Nombre</label>
                <input type="text" class="form-control" id="inputName" name="nombre" value="Germán Luis">
                </div>
                
                <div class="form-group">
                <label for="inputSurame">Apellido</label>
                <input type="text" class="form-control" id="inputSurame" name="apellido" value="Sorzoli">
                </div>

                <div class="form-group">
                <label for="inputAddress">Domicilio</label>
                <input type="text" class="form-control" id="inputAddress" name="domicilio" value="Calle Falsa 123">
                </div>

                <div class="form-group">
                <label for="inputCountry">Pais</label>
                <select id="inputCountry" class="form-control" name="pais">
                    <option>Elegi Pais...</option>
                    <option selected value="AR">Argentina</option>
                </select>
                </div>

                <div class="form-group">
                <label for="inputState">Provincia</label>
                <select id="inputState" class="form-control" name="provincia">
                    <option>Elegi Provincia...</option>
                    <option selected value="CA">Ciudad Autónoma de Buenos Aires</option>
                    <option value="BA">Buenos Aires</option>
                    <option value="CT">Catamarca</option>
                    <option value="CH">Chaco</option>
                    <option value="CHU">Chubut</option>
                    <option value="CC">Corrientes</option>
                    <option value="CB">Córdoba</option>
                    <option value="ER">Entre Ríos</option>
                    <option value="FO">Formosa</option>
                    <option value="JU">Jujuy</option>
                    <option value="LP">La Pampa</option>
                    <option value="LR">La Rioja</option>
                    <option value="MZ">Mendoza</option>
                    <option value="MI">Misiones</option>
                    <option value="NE">Neuquén</option>
                    <option value="RN">Río Negro</option>
                    <option value="SA">Salta</option>
                    <option value="SJ">San Juan</option>
                    <option value="SL">San Luis</option>
                    <option value="SR">Santa Cruz</option>
                    <option value="SF">Santa Fe</option>
                    <option value="SD">Santiago del Estero</option>
                    <option value="TF">Tierra del Fuego</option>  
                </select>
                </div>

                <div class="form-group">
                <label for="inputCity">Ciudad</label>
                <input type="text" class="form-control" id="inputCity" name="ciudad" value="CABA">
                </div>

                <div class="form-group">
                <label for="inputZip">Código Postal</label>
                <input type="text" class="form-control" id="inputZip" name="codigoPostal" value="1234">
                </div>
                <div></div>
                <div class="form-group">
                <label for="inputCard">Número de tarjeta</label>
                <input type="text" class="form-control" id="inputCard" name="numeroTarjeta" value="1234 5678 9101 1121">
                </div>
                
                <div class="form-group">
                <label for="inputDate">Fecha de vencimiento</label>
                <input type="date" class="form-control" id="inputDate" name="fechaVencimiento" value="2032-01-01">
                </div>

                <div class="form-group">
                <label for="inputCode">Codigo de Verificación</label>
                <input type="password" class="form-control" id="inputCode" name="codigoTarjeta" value="123">
                </div>

                <div class="form-group">
                <label for="inputMail">E-mail</label>
                <input type="text" class="form-control" id="inputMail" name="email" value="glsorzoli@gmail.com">
                </div>

                <div class="form-group">
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="gridCheck" name="notificaciones" checked>
                    <label class="form-check-label" for="gridCheck">
                        Enviar notificaciones sobre mi pedido.
                    </label>
                    </div>
                </div>
            </div>
        </form>
        </div>
        <article class="botonesFinalizarCompra">
            <button type="cancelButton" class="botonAtras">ATRAS</button>
            <button type="submit" class="operacionFinalizar">COMPRAR</button>
        </article>`
        // Lo agrego al HTML
        listadoDefinitivo.appendChild(formularioCompra);
}

// Funcion que muestra un mensaje si el carrito esta vacio
function carritoVacio(){
let mensajeVacio = document.querySelector('.listaCarrito');
    mensajeVacio.innerHTML = `<h4>No tenés productos en tu carrito...</h4>
    <p><br>Volvé a nuestra sección de productos y conocé nuestras ofertas</P>`;
}

// Al finalizar la compra se muestra un mensaje en pantalla
function finalizarCarrito() {
    Swal.fire({
        title: "¡Tu compra se concretó con éxito!",
        icon: "success",
        customClass: {
            popup: 'vaciarPopup',
            title: 'vaciarTitulo',
            confirmButton: 'vaciarConfirm',
        },
        confirmButtonColor: "rgb(107, 194, 21)",
        confirmButtonText: "OK",
        });
    let mensajeFin = document.querySelector('.listaCarrito');
    mensajeFin.innerHTML = `<h4>¡Tu compra se concretó con éxito!</h4>
    <p><br>Muchas gracias por comprar en nuestra tienda, tus productos llegarán a la brevedad</P>`;
    mensajeFin.classList.add("compraFinalizada");
    carritoUsuario = [];
    localStorage.removeItem("CarritoTG");
}

// *************************** EVENTOS ********************************* //

// Ejecuto la funcion para completar el listado de productos.
buscarListaProductosJSON();

// Alternar entre vista carrito/productos.
carritoYProductos.addEventListener('click', () => {
    // Agrego clase con estilo del boton
    if (carritoYProductos.innerText == "Ver carrito"){
        // Si se encuentra en modo productos, muestra el carrito
        carritoYProductos.innerText = "Volver a Productos";
        carritoYProductos.classList.add('volverHome');
        carritoYProductos.classList.remove('verCarrito');
        // Oculto productos y muestro carrito;
        articulosProductos.classList.add('oculto');
        carouselVisible.classList.add('oculto');
        productosEnCarrito.classList.remove('oculto');
        filtrosDeBusqueda.classList.add('oculto');
        infoSeccion.innerText = "Estos son los productos en tu carrito:";
        // Ejecuto la funcion para mostrar el carrito con los productos.
        mostrarCarrito();
    }
    // Si se encuentra en modo carrito, vuelve a modo productos
    else if(carritoYProductos.innerText == "Volver a Productos"){
        carritoYProductos.innerText = "Ver carrito";
        carritoYProductos.classList.remove('volverHome');
        carritoYProductos.classList.add('verCarrito');
        // Oculto carrito y muestro productos
        articulosProductos.classList.remove('oculto');
        productosEnCarrito.classList.add('oculto');
        productosEnCarrito.classList.remove('compraFinalizada');
        carouselVisible.classList.remove('oculto');
        filtrosDeBusqueda.classList.remove('oculto');
        infoSeccion.innerText = "Elige entre nuestros productos";
    }
});

// Evento para modificar cantidades desde vista carrito
// Tomo los elementos "+" y "-" del HTML creado al estar en modo vista carrito.
productosEnCarrito.addEventListener("click",(e) =>{
    // Comparo el id del producto con el id del boton clickeado
    let idSeleccionado = Number(e.target.dataset.id);
    // Dentro de productoSeleccionado guardare la informacion del producto clickeado
    let productoSeleccionado = carritoUsuario.find(p => p.id === idSeleccionado);
    if (e.target.classList.contains("agregarUnProducto")) {
        productoSeleccionado.guardarCarrito('agregar');
        mostrarCarrito();
    }
    if (e.target.classList.contains("sacarUnProducto")) {
        productoSeleccionado.guardarCarrito('restar');
        mostrarCarrito();
    }
    if(e.target.classList.contains("operacionVaciar")){
        // Confirmo al usuario si quiere vaciar su carrito
        Swal.fire({ // Librería de SweetAlert2
        title: "¿Deseas vaciar el carrito?",
        text: "Eliminaras todos tus productos.",
        icon: "question",
        customClass: {
            popup: 'vaciarPopup',
            title: 'vaciarTitulo',
            confirmButton: 'vaciarConfirm',
            cancelButton: 'vaciarConfirm',
        },
        showCancelButton: true,
        confirmButtonColor: "rgb(107, 194, 21)",
        cancelButtonColor: "rgba(122, 122, 122, 1)",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) { // Si confirma, se vacia el carrito
                Swal.fire({
                title: "Carrito vacío.",
                text: "Ya no tenes productos en tu carrito.",
                icon: "warning",
                customClass:{
                    popup: 'vaciarPopup',
                    title: 'vaciarTitulo',
                    confirmButton:'vaciarConfirm',
                },
                confirmButtonColor: "rgb(107, 194, 21)",
                });
                vaciarCarrito();
            };
        });
    }
    if (e.target.classList.contains("operacionContinuar")){
        // Oculto los botones
        e.target.classList.add('oculto');
        document.querySelector('.operacionVaciar').classList.add('oculto');
        // Muestro formulario de compra
        completarFormularioCompra();
    }
    if (e.target.classList.contains("operacionFinalizar")){
        // Envio Formulario con carrito listo para finalizar para historial de compras
        e.preventDefault();
        const formulario = document.querySelector('#miForm');
        const datos = new FormData(formulario);
        const datosCompletos = Object.fromEntries(datos.entries());
        const datosFinales = {
            cliente: datosCompletos,
            carrito: carritoUsuario,
            }
        // Librería de SweetAlert2
        // Confirmo al usuario si quiere concretar la compra
        Swal.fire({
        title: "¿Finalizar compra?",
        icon: "question",
        customClass: {
            popup: 'vaciarPopup',
            title: 'vaciarTitulo',
            confirmButton: 'vaciarConfirm',
            cancelButton: 'vaciarConfirm',
        },
        showCancelButton: true,
        confirmButtonColor: "rgb(107, 194, 21)",
        cancelButtonColor: "rgba(122, 122, 122, 1)",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) { // Si confirma:
                // Guardo el formulario con la informacion de la compra y el formulario
                let historialCompras = JSON.parse(localStorage.getItem("historialCompras")) || [];
                historialCompras.push(datosFinales);
                localStorage.setItem("historialCompras", JSON.stringify(historialCompras));
                // Muestro mensaje de finalizado
                finalizarCarrito(); 
            }
        });
    ;}
    if (e.target.classList.contains("botonAtras")){
        mostrarCarrito();
    }
});

// Eventos para modos de ordenar

// Orden ascendente y descendente
// el valor de "orden" sera de 1 para ascendente y -1 para descendente.
const seleccionarOrden = document.getElementById("SeleccionOrden");
seleccionarOrden.addEventListener('change', (e) => {
    // Toma los valores de las opciones y evalua segun el caso
    const valorSeleccionado = e.target.value;
    if (valorSeleccionado === "asc") {
        ordernarProductosPor(listaOrdenada,1);
    } 
    else if (valorSeleccionado === "desc") {
       ordernarProductosPor(listaOrdenada,-1);
    }
    // Independientemente del caso, muestro los productos ordenados.
    mostrarProductosHTML(listaOrdenada);
});

// Filtrar por consola
const seleccionarConsola = document.getElementById("SeleccionConsola");
seleccionarConsola.addEventListener('change', (e) => {
    const valorSeleccionado = e.target.value;
    switch (valorSeleccionado){
        case "PS5": filtrarProductos(listaProductos,"PlayStation 5");break;
        case "XBS": filtrarProductos(listaProductos,"Xbox Series");break;
        case "NS2": filtrarProductos(listaProductos,"Nintendo Switch 2");break;
        case "ALL": listaOrdenada = listaProductos;mostrarProductosHTML(listaOrdenada);break;
    }
});