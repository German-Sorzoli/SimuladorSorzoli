// Definicion de variable globales, constantes y arrays

let datosUsuario = [];
let listaProductos = [
    {id:1, nombre:"Nintendo Switch 2", precio:350},
    {id:2, nombre:"Play Station 4", precio:460}, 
    {id:3, nombre:"XBox Series X", precio:400},
    {id:4, nombre:"PC", precio:600},];
const precioDolar = 1400;
let carritoUsuario = {};
let totalCompra = 0;

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

function carritoCompras (){
    let eleccion = 0;
    while (eleccion !=5 || eleccion <listaProductos.lenght){

        eleccion = prompt(`Selecciona el producto que deseas comprar:\n\n1. ${listaProductos[0].nombre} \n2. ${listaProductos[1].nombre} \n3. ${listaProductos[2].nombre}. \n4. ${listaProductos[3].nombre} \n5. Salir\n`);
        eleccion = parseInt(eleccion); // Realizo Parse del input del usuario
            if (eleccion >=1 && eleccion <=4){
                carritoUsuario.push(listaProductos[eleccion -1]);
                console.log("El carrito del usuario tiene los siguientes productos" + carritoUsuario);
                alert(`El producto ${listaProductos[eleccion -1].nombre} ha sido agregado a su carrito de compras`);
                break;
            }
            else if (eleccion === 5){

                break;
            }
             else
                console.log("El numero que ingresaste no es valido.");
}

    //confirm let continuar ("Desea seguir comprando?")

}




function calcularTotal (comprasUsuario){
            console.log("Muchas gracias por haber comprado nuestros productos, tu total es de: $" + total);



}


// Simulador

// Ingreso de datos del usuario
bienvenido();
ingresoDatoUsuario(0,"nombre");
ingresoDatoUsuario(1,"apellido");
saludarUsuario(datosUsuario[0], datosUsuario[1]);
// Seleccion de productos por el usuario
carritoCompras();
// Calculo total de la compra
calcularTotal(carritoUsuario);






// Resultado final de la compra.