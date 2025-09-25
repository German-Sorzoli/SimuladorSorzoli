// Definicion de variable globales, constantes y arrays

let datosUsuario = [];
let listaProductos = [
    {id:1, nombre:"Nintendo Switch 2", precio:350},
    {id:2, nombre:"Play Station 5", precio:460}, 
    {id:3, nombre:"XBox Series X", precio:400},
    {id:4, nombre:"PC", precio:600},];
const precioDolar = 1400;
let carritoUsuario = ([]);
let totalCompra = 0;
let listadoCompra;

// Definicion de funciones

function bienvenido (){
    alert("¡Bienvenido a nuestra plataforma de compras online!");
}

function ingresoDatoUsuario(indice,dato_usuario){
    do {
        if (datosUsuario[indice] = prompt("Por favor, ingrese su " + dato_usuario))
            return datosUsuario[indice];
        else 
            window.alert("Debe ingresar un " + dato_usuario + " para continuar");
    } while (datosUsuario[indice]=true);
}

function saludarUsuario (nombre, apellido){
    alert(`¡Bienvenido ${nombre} ${apellido}!`);
    console.log(`Datos del usuario actual: ${datosUsuario[0]} ${datosUsuario[1]}`);
}

// Ciclo de compras
// Funcion agregar producto al carrito

function carritoDeCompras (){
    let eleccion = 0;
    let indice = 0;
    while (eleccion !=5){
        eleccion = prompt(`Selecciona el producto que deseas comprar:\n\n1. ${listaProductos[0].nombre} \n2. ${listaProductos[1].nombre} \n3. ${listaProductos[2].nombre} \n4. ${listaProductos[3].nombre} \n5. Salir\n`);
        eleccion = parseInt(eleccion); // Realizo Parse del input del usuario
            if (eleccion >=1 && eleccion <=4){
                carritoUsuario.push(listaProductos[eleccion -1]);
                console.log("Producto agregado al carrito: " + carritoUsuario[indice].nombre);    
                alert(`El producto ${listaProductos[eleccion -1].nombre} ha sido agregado a su carrito de compras`);
                indice++;
            }
            else if (eleccion === 5){
                alert("No se agregarán mas productos a tu carrito");
                console.log("Operación finalizada");
                break;
            }
             else{
                 alert("Por favor, ingresa una opción válida.");
                 console.error(eleccion + " no es valido.");
            }
    }
}

// Creo un string para mostrar al usuario los productos en su carrito con el precio formateado
function listadoCompraString (lista){
    let listaString="";
        for (let i = 0; i < lista.length; i++) {
        listaString = listaString + (i + 1) + ") " + lista[i].nombre + " - USD " + lista[i].precio.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) + "\n";
    }
    return listaString;
}

// Funcion para revisar el carrito y eliminar productos en caso que el usuario lo desee
function revisarCarrito (carrito_usuario){
    if (confirm("¿Desea eliminar algun producto de su carrito de compras?")){
        // variables de Scope local
        let eleccion_carrito;
        let lista_carrito = listadoCompraString(carrito_usuario);
        // Consulto al usuario que producto desea eliminar
        do {
            eleccion_carrito = prompt(`Seleccione que producto desea eliminar del carrito:\n\n${lista_carrito} \n 0) Salir\n`);
            eleccion_carrito = parseInt(eleccion_carrito); // Realizo Parse del input del usuario
            if (eleccion_carrito === 0) {
                alert("Carrito finalizado, se procederá a calcular el total de la compra");
                console.log("Carrito finalizado");
                break;
            }
             else if (eleccion_carrito > 0 && eleccion_carrito <= carrito_usuario.length){
                alert(`El producto ${carrito_usuario[eleccion_carrito - 1].nombre} ha sido eliminado de su carrito de compras`);
                console.log("Producto eliminado del carrito: " + carrito_usuario[eleccion_carrito - 1].nombre);
                carrito_usuario.splice(eleccion_carrito - 1, 1);
            }
              else{
                 alert("Por favor, ingresa una opción válida.");
                 console.error(eleccion_carrito + " no es valido.");
            }
            lista_carrito = listadoCompraString(carrito_usuario);
        } while (eleccion_carrito != 0);

        // Actualizo lista_carrito antes de retornar para reflejar el estado final
        lista_carrito = listadoCompraString(carrito_usuario);
        return lista_carrito;
    }  
}

// Funcion para calcular el total de la compra una vez revisado el carrito
function calcularTotal (carrito_usuario,total_compra){
        total_compra = 0;
            for (let index = 0; index < carrito_usuario.length; index++) {
                total_compra = total_compra + carrito_usuario[index].precio;
            }
            precioFormateadoDolar = total_compra.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
            precioFormateadoPesos = (total_compra * precioDolar).toLocaleString('es-AR', {style: 'currency', currency: 'ARS'});
                if (total_compra>0) {
                    alert("Muchas gracias por haber comprado nuestros productos! \n\n " + listadoCompra + "\n\nTotal en pesos: " + precioFormateadoPesos + "\nTotal en dólares: USD " + precioFormateadoDolar);
                    console.log("Total de la compra: USD " + precioFormateadoDolar + " - " + precioFormateadoPesos);
                } 
                else {
                    alert("¡Esperamos pronto su próxima visita!");
                    console.log("El usuario no realizo ninguna compra");
                }
            return total_compra;
}

// Simulador

// Ingreso de datos del usuario
bienvenido();
ingresoDatoUsuario(0,"nombre");
ingresoDatoUsuario(1,"apellido");
saludarUsuario(datosUsuario[0], datosUsuario[1]);
// Seleccion de productos por el usuario
carritoDeCompras();
// Revision del carrito de compras
listadoCompra = revisarCarrito(carritoUsuario);
// Resultado final de la compra.
calcularTotal(carritoUsuario,totalCompra);