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
let carritoUsuario = [];
let totalCompra = 0;
let listadoCompra;

// Definicion de funciones

// Vuelco productos en HTML

let productos = document.querySelector('.listaProductos');
// Recorro el array de productos
 listaProductos.forEach((producto) =>{
    let article = document.createElement("article");
    article.innerHTML = `
    <h4>${producto.nombre}</h4>
    <span>Código: 00${producto.id}</span>
    <p>USD ${producto.precio}.-</p>
    <button class='agregarAlCarro' data-id=${producto.id}>Agregar al carrito</button>
    `;
    // Agrego el article al section de productos
    productos.appendChild(article);
});

// Agrego funcionalidad a los botones de agregar al carrito

// Recupero carrito del localStorage en caso que exista
carritoUsuario = JSON.parse(localStorage.getItem("CarritoTG")) || [];

let botonesAgregar = document.querySelectorAll('.agregarAlCarro');
botonesAgregar.forEach((boton) => {
    // Detecto evento click en cada boton
    boton.addEventListener('click', (e) => {
        let productoSeleccionado = listaProductos.find((producto) => producto.id == e.target.dataset.id); // Comparo el id del producto con el id del boton clickeado
        // Verifico si el producto ya se encuentra en el carrito
        if (productoSeleccionado == carritoUsuario.find((producto) => producto.id == productoSeleccionado.id)){
            // Si ya existe, aumento la cantidad de productos en el carrito
            productoSeleccionado.cantidad++;
            console.log(carritoUsuario);
            // Guardo el carrito actualizado en el localStorage
            localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));}
            else {
            // Si no existe, lo agrego al carrito con cantidad 1
            productoSeleccionado.cantidad = 1;
            carritoUsuario.push(productoSeleccionado);
            console.log(carritoUsuario);
            // Guardo el carrito actualizado en el localStorage
            localStorage.setItem("CarritoTG", JSON.stringify(carritoUsuario));}
    });
});


// Mostrar carrito y volver a productos
let carritoYProductos = document.querySelector('.verCarrito');
let articulosProductos = document.querySelector('.listaProductos')

carritoYProductos.addEventListener('click', () => {
    // Agrego clase con estilo del boton
    if (carritoYProductos.innerText == "Ver carrito"){
        // Si se encuentra en modo productos, muestra el carrito
        carritoYProductos.innerText = "Volver a productos";
        carritoYProductos.classList.add('volverHome');
        // Oculto productos y muestro carrito
        articulosProductos.classList.add('hidden');
    }
    // Si se encuentra en modo carrito, vuelve a modo productos
    else if(carritoYProductos.innerText == "Volver a productos"){
        carritoYProductos.innerText = "Ver carrito";
        carritoYProductos.classList.remove('volverHome');
        // Oculto carrito y muestro productos
        articulosProductos.classList.remove('hidden');
    }
})



// // Funcion agregar producto al carrito

// function carritoDeCompras (){
//     let eleccion = 0;
//     let indice = 0;
//     while (eleccion !=5){
//         eleccion = prompt(`Selecciona el producto que deseas comprar:\n\n1. ${listaProductos[0].nombre} \n2. ${listaProductos[1].nombre} \n3. ${listaProductos[2].nombre} \n4. ${listaProductos[3].nombre} \n5. Salir\n`);
//         eleccion = parseInt(eleccion); // Realizo Parse del input del usuario
//             if (eleccion >=1 && eleccion <=4){
//                 carritoUsuario.push(listaProductos[eleccion -1]);
//                 console.log("Producto agregado al carrito: " + carritoUsuario[indice].nombre);    
//                 alert(`El producto ${listaProductos[eleccion -1].nombre} ha sido agregado a su carrito de compras`);
//                 indice++;
//             }
//             else if (eleccion === 5){
//                 alert("No se agregarán mas productos a tu carrito");
//                 console.log("Operación finalizada");
//                 break;
//             }
//              else{
//                  alert("Por favor, ingresa una opción válida.");
//                  console.error(eleccion + " no es valido.");
//             }
//     }
// }

// // Creo un string para mostrar al usuario los productos en su carrito con el precio formateado
// function listadoCompraString (lista){
//     let listaString="";
//         for (let i = 0; i < lista.length; i++) {
//         listaString = listaString + (i + 1) + ") " + lista[i].nombre + " - USD " + lista[i].precio.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) + "\n";
//     }
//     return listaString;
// }

// // Funcion para revisar el carrito y eliminar productos en caso que el usuario lo desee
// function revisarCarrito (carrito_usuario){
//     if (confirm("¿Desea eliminar algun producto de su carrito de compras?")){
//         // variables de Scope local
//         let eleccion_carrito;
//         let lista_carrito = listadoCompraString(carrito_usuario);
//         // Consulto al usuario que producto desea eliminar
//         do {
//             eleccion_carrito = prompt(`Seleccione que producto desea eliminar del carrito:\n\n${lista_carrito} \n 0) Salir\n`);
//             eleccion_carrito = parseInt(eleccion_carrito); // Realizo Parse del input del usuario
//             if (eleccion_carrito === 0) {
//                 alert("Carrito finalizado, se procederá a calcular el total de la compra");
//                 console.log("Carrito finalizado");
//                 break;
//             }
//              else if (eleccion_carrito > 0 && eleccion_carrito <= carrito_usuario.length){
//                 alert(`El producto ${carrito_usuario[eleccion_carrito - 1].nombre} ha sido eliminado de su carrito de compras`);
//                 console.log("Producto eliminado del carrito: " + carrito_usuario[eleccion_carrito - 1].nombre);
//                 carrito_usuario.splice(eleccion_carrito - 1, 1);
//             }
//               else{
//                  alert("Por favor, ingresa una opción válida.");
//                  console.error(eleccion_carrito + " no es valido.");
//             }
//             lista_carrito = listadoCompraString(carrito_usuario);
//         } while (eleccion_carrito != 0);

//         // Actualizo lista_carrito antes de retornar para reflejar el estado final
//         lista_carrito = listadoCompraString(carrito_usuario);
//         return lista_carrito;
//     }  
// }

// // Funcion para calcular el total de la compra una vez revisado el carrito
// function calcularTotal (carrito_usuario){
//             for (let index = 0; index < carrito_usuario.length; index++) {
//                 totalCompra = totalCompra + carrito_usuario[index].precio;
//             }
//             precioFormateadoDolar = totalCompra.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
//             precioFormateadoPesos = (totalCompra * precioDolar).toLocaleString('es-AR', {style: 'currency', currency: 'ARS'});
//                 if (totalCompra>0) {
//                     alert("Muchas gracias por haber comprado nuestros productos! \n\n " + listadoCompra + "\n\nTotal en pesos: " + precioFormateadoPesos + "\nTotal en dólares: USD " + precioFormateadoDolar);
//                     console.log("Total de la compra: USD " + precioFormateadoDolar + " - " + precioFormateadoPesos);
//                 } 
//                 else {
//                     alert("¡Esperamos pronto su próxima visita!");
//                     console.log("El usuario no realizo ninguna compra");
//                 }
//             return totalCompra;
// }

// Simulador

// // Ingreso de datos del usuario
// ingresoDatoUsuario(0,"nombre");
// ingresoDatoUsuario(1,"apellido");
// saludarUsuario(datosUsuario[0], datosUsuario[1]);
// // Seleccion de productos por el usuario
// carritoDeCompras();
// // Revision del carrito de compras
// listadoCompra = revisarCarrito(carritoUsuario);
// // Resultado final de la compra.
// calcularTotal(carritoUsuario);