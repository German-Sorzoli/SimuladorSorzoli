# Curso de Coder House - JavaScript

## Profesores

* **Matias Aguilera** - *Profesor*
* **Nahuel Presa** - *Tutor*
  
## Alumno

**Germán Luis Sorzoli** - *Diseñador Gráfico - Web*

## Período

Septiembre 2025 - Noviembre 2025

## Herramientas empleadas

* [HTML](https://www.w3schools.com/html/) - Lenguaje de etiquetas - HTML5
* [CSS](https://www.w3schools.com/css/) - Hoja de estilos -Flexbox - Grid
* [Github](https://github.com/) - Plataforma de control de versiones
* [JavaScript](https://www.javascript.com/) - Lenguaje de programacion Front-End


### Links al repositorio:

* [github](https://github.com/German-Sorzoli/SimuladorSorzoli) - Link al Repositorio de Github

## Guia de uso

# Carrito de Compras - JavaScript

Este proyecto implementa un carrito de compras de una tienda de Videojuegos, creado con JavaScript, HTML, CSS, Bootstrap
y librerias SweetAlert2 y Toastify. La idea es permitir que el usuario agregue productos, los vea en una lista, pueda sumar 
o restar cantidades, ver el total y decidir si vacía el carrito o continúa la compra.

# Estructura General

La web recibe la informacion de un archivo JSON donde se almacenan todos los productos, una vez recibidos se colocan
en la pagina principal en forma de listado. Uno puede a su vez modificar el modo de ordenamiento y filtrado segun Consola.

En la pagina principal uno puede agregar productos a su carrito (con notificaciones que al hacer click lo mueven hasta arriba de la pagina)
Ahi se encuentra el boton de ver carrito que alterna entre vistas de carrito y el catálogo de productos.

Los productos que el usuario agrega se guardan dentro de un array llamado carritoUsuario.
Cada producto en ese carrito tiene su id, nombre, precio, cantidad y subtotal.

Si el usuario recarga la pagina, el carrito aun quedara guardado en localStorage, asi como un historial de las compras realizadas.

Cada elemento del carrito se maneja como una instancia de la clase: ProductoCarrito.
Una vez creada se guarda en LocalStore y se actualiza constantemente cada vez que hay cambios.

Dentro del carrito uno puede agregar productos, quitarlos, vaciar el carrito. o de querer continuar la compra, se debera competar un formulario
completarFormularioCompra() (ya pre-completado por mi), para luego dar por finalizada la compra y el circuito del simulador.

# Renderizado del Carrito:

La función mostrarCarrito() se encarga de mostrar y actualizar toda la informacion.
En lugar de asignar eventos botón por botón, se usa delegación evaluando la clase del elemento del evento.
calcularTotal() actualiza el monto de la compra final.