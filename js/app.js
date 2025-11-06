// *************************** CLASES ********************************* //

// Creo la Clase Producto Carrito que deriva de la informacion del listado de productos.
// Esto agregará una nueva propiedad de si "existe", "cantidad" de productos y "subtotal" por cada elemento.

class ProductoCarrito{

    // Genero una entrade de producto al carrito
    constructor(id,nombre,consola,precio){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.existe = true;
        this.cantidad = 1;
        // Calculo de subtotal con 2 decimales.
        this.subtotal = parseFloat((this.precio * this.cantidad).toFixed(2));;
    }

    // Creo funcionalidad de agregar un producto existente al carrito
    agregarProducto(){
    this.cantidad++;
    // Calculo de subtotal con 2 decimales.
    this.subtotal = parseFloat((this.precio * this.cantidad).toFixed(2));;
    // Guardo en Local Storage
    localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
    }

    // Creo funcionalidad de restar un producto existente al carrito
    restarProducto(){
        if(this.cantidad>1 && this.existe)
            {this.cantidad--;
            this.subtotal = parseFloat((this.precio * this.cantidad).toFixed(2));;
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

// Guardo la infomacion de productos del JSON original
let listaProductos=[];
// Una vez utilizado, guardo la informacion en un nuevo array de objetos para su manipulacion
let listaOrdenada=[];

// Defino un array de objetos que contendrá los productos agregados al carrito.
let carritoUsuario = (JSON.parse(localStorage.getItem("CarritoTG")) || []).map(p => Object.assign(new ProductoCarrito(p.id, p.nombre, p.precio), p));
// Si ya hay informacion en el navegador, tomara esos datos, sino se iniciará vacío.
// Necesito resetear los objetos planos que recupero de LocalStore y re-convertirlos a elementos de la clase ProductoCarrito para mantener su funcionalidad.

// Variable global que almacena el total del carrito
let totalCompra = 0;

// *************************** FUNCIONES ********************************* //

// Funcion que trae los datos de los productos dentro del archivo products.json
// Implementacion de asincronía.

const buscarListaProductosJSON = async () => {
    try{
        const response = await fetch('./json/products.json');
        const data = await response.json();
        listaProductos = listaOrdenada = data;
        mostrarProductosHTML(listaProductos);
    } catch (error){
        console.log(error);
    }
}

// Ejecuto la funcion
buscarListaProductosJSON();

// Funcion para mostrar los productos en el HTML
function mostrarProductosHTML(listado){
    // Tomo los productos dentro de listaProductos y los agrego al HTML
    let productos = document.querySelector('.listaProductos');
    //Reinicio el espacio donde se renderizaran los productos
    productos.innerHTML='';
    // Recorro el array que ahora contiene a los productos obtenidos del JSON
    listado.forEach((producto) =>{
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
            const productoExistente = carritoUsuario.find(p => p.id === productoSeleccionado.id);
            if (productoExistente) {
                // Si ya existe, aumento la cantidad de productos en el carrito.
                productoExistente.agregarProducto();
            } else {
                // Si no existe, lo inicializo en el carrito
                const nuevoProducto = new ProductoCarrito(productoSeleccionado.id,productoSeleccionado.nombre,productoSeleccionado.consola,productoSeleccionado.precio);
                carritoUsuario.push(nuevoProducto);
                localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));
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
            <button class='miniBoton agregarUnProducto' data-id=${producto.id}>+</button>
            <button class='miniBoton sacarUnProducto' data-id=${producto.id}>-</button></div>
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
        })
    })
};

// Funcion para calcular el total de la compra, mostrarla en el HTML y modificar el DOM.
function calcularTotal (){
    totalCompra = 0;
    let productosEnCarrito = document.querySelector('.listaCarrito');
    let total = document.createElement("article");
    // Por cada producto del carrito sumo el total
    carritoUsuario.forEach((producto) =>{
        totalCompra = parseFloat((totalCompra + producto.subtotal).toFixed(2));
        
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
        // Librería de SweetAlert2
        // Confirmo al usuario si quiere vaciar su carrito
        Swal.fire({
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
                vaciarCarrito()
            }
        });
    ;})
    espacioBotones.appendChild(botonVaciar);

    // Agrego boton de "siguiente" para continuar con la compra
    let botonContinuar = document.createElement("button");
    botonContinuar.innerHTML = `CONTINUAR COMPRA`;
    botonContinuar.classList.add("botones");
    botonContinuar.classList.add("operacionContinuar");
    botonContinuar.addEventListener('click', () => {
        botonContinuar.classList.add('oculto');
        botonVaciar.classList.add('oculto');
        completarFormularioCompra();})
        espacioBotones.appendChild(botonContinuar);
};


function completarFormularioCompra(){
        // Almaceno el elemento de la clase listaCarrito.
        let ocultarMiniBotones = document.querySelectorAll('.miniBoton');
        ocultarMiniBotones.forEach((boton)=>{
                boton.classList.add('oculto');
        })
        let listadoDefinitivo = document.querySelector('.listaCarrito');
        let formularioCompra = document.createElement("article");
        formularioCompra.innerHTML = `
        <h3>Por favor completa con tus datos: <br><br></h3>
        <form class="">
            <div class="form-row formularioCompra">
                <div class="form-group">
                <label for="inputName">Nombre</label>
                <input type="text" class="form-control" id="inputName" value="Germán Luis">
                </div>
                
                <div class="form-group">
                <label for="inputSurname">Apellido</label>
                <input type="text" class="form-control" id="inputSurame" value="Sorzoli">
                </div>

                <div class="form-group">
                <label for="inputAddress">Domicilio</label>
                <input type="text" class="form-control" id="inputAddress" value="Calle Falsa 123">
                </div>

                <div class="form-group">
                <label for="inputCountry">Pais</label>
                <select id="inputCountry" class="form-control" >
                    <option>Elegi Pais...</option>
                    <option selected value="AR">Argentina</option>
                </select>
                </div>

                <div class="form-group">
                <label for="inputState">Provincia</label>
                <select id="inputState" class="form-control">
                    <option>Elegi Provincia...</option>
                    <option selected value="CA">Ciudad Autónoma de Buenos Aires</option>
                    <option value="BA">Buenos Aires</option>
                    <option value="CT">Catamarca</option>
                    <option value="CH">Chaco</option>
                    <option value="CHU">Chubut</option>
                    <option value="CC">Corrientes</option>
                    <option value="CC">Córdoba</option>
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
                <input type="text" class="form-control" id="inputCity" value="CABA">
                </div>

                <div class="form-group">
                <label for="inputZip">Código Postal</label>
                <input type="text" class="form-control" id="inputZip" value="1234">
                </div>
                <div></div>
                <div class="form-group">
                <label for="inputCard">Número de tarjeta</label>
                <input type="text" class="form-control" id="inputCard" value="1234 5678 9101 1121">
                </div>
                
                <div class="form-group">
                <label for="inputDate">Fecha de vencimiento</label>
                <input type="date" class="form-control" id="inputDate" value="2032-01-01">
                </div>

                <div class="form-group">
                <label for="inputCode">Codigo de Verificación</label>
                <input type="password" class="form-control" id="inputCode" value="123">
                </div>

                <div class="form-group">
                <label for="inputmail">E-mail</label>
                <input type="text" class="form-control" id="inputmail" value="glsorzoli@gmail.com">
                </div>

                <div class="form-group">
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="gridCheck" checked>
                    <label class="form-check-label" for="gridCheck">
                        Enviar notificaciones sobre mi pedido.
                    </label>
                    </div>
                </div>
            </div>
        </form>
        </div>
        <article class="botonesFinalizarCompra">
            <button type="submit" class="botonAtras">ATRAS</button>
            <button type="submit" class="operacionFinalizar">COMPRAR</button>
        </article>`
        listadoDefinitivo.appendChild(formularioCompra);
        let botonAtras = document.querySelector('.botonAtras')
        botonAtras.addEventListener('click', () => {
            mostrarCarrito();
            });
        let botonComprar = document.querySelector('.operacionFinalizar')
        botonComprar.addEventListener('click', () => {
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
                if (result.isConfirmed) { // Si confirma, se vacia el carrito
                    finalizarCarrito();
                }
            });
        ;})
}


// Funcion que elimina todos los productos del carrito
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

// Actualiza el total del carrito en el HTML.
function recalcularTotal() {
    let totalElemento=document.querySelector(`#total`);
    totalCompra = 0;
    if (carritoUsuario.length !== 0){
    carritoUsuario.forEach((producto) =>{
        totalCompra = parseFloat((totalCompra + producto.subtotal).toFixed(2));
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

// Funciones de ordenamiento  y filtro de productos

function ordernarProductosPor(objetos,orden) {
    listaOrdenada = objetos.slice();
    listaOrdenada.sort((a,b)=> { 
        if (a.nombre > b.nombre){return (1 * orden)}
        if (a.nombre < b.nombre){return (-1 * orden)}
        return 0;
    })
};

function filtrarProductos(objetos,consola) {
    listaOrdenada = objetos.slice();
    listaOrdenada = listaOrdenada.filter(prod => prod.consola === consola)
    mostrarProductosHTML(listaOrdenada);
};

// *************************** EVENTOS ********************************* //

// Alternar entre vista carrito/productos.

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


carritoYProductos.addEventListener('click', () => {
    // Agrego clase con estilo del boton
    if (carritoYProductos.innerText == "Ver carrito"){
        // Si se encuentra en modo productos, muestra el carrito
        carritoYProductos.innerText = "Volver a Productos";
        carritoYProductos.classList.add('volverHome');
        carritoYProductos.classList.remove('verCarrito');
        // Oculto productos y muestro carrito
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