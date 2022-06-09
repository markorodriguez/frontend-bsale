
# Desafío bsale - Frontend

## Explicación del ejercicio

Se desarrolló una tienda virtual bajo una arquitectura cliente-servidor. Debido a esto, las funciones para cada capa quedan claramente establecidas.

Por un lado, en el lado del cliente se desplegarán los productos y se podrán realizar operaciones como búsqueda, ordenar de forma ascendente o decreciente según el precio del producto.

Por otro lado, en la capa de servidor se realizan tareas tales como la conexión a la base de datos y la ejecución de consultas. 

Las tecnologías empleadas para el desarrollo del ejercicio son Vanilla JavaScript HTML, Tailwind CSS y JQuery para el apartado del frontend. El backend del mismo proyecto se desarrolló en TypeScript usando Express.js como framework para el servidor bajo Node.JS.

Repositorio Frontend: https://github.com/markorodriguez/frontend-bsale  
Repositorio Backend: https://github.com/markorodriguez/backend-bsale

## Instalación

El primer paso es clonar el repositorio y seguir las siguientes indicaciones:

Se debe tener instalado Node.JS en el equipo.

```bash
  git clone https://github.com/markorodriguez/frontend-bsale.git
  cd frontend-bsale
  npm install
```

## Uso de la tienda

####  Vista Principal
La primera vista al cargar la página es un listado de todos los productos que fueron consumidos desde la base de datos. Como se puede apreciar, la página cuenta con 3 funciones principales para el usuario: buscar, filtrar y ordenar productos.

![Vista Principal](https://i.postimg.cc/L6FRy7JB/Screenshot-2022-06-09-at-01-58-34-Desaf-o-Bsale.png) 

#### Filtro por categorías 

Los usuarios podrán filtrar los productos según la categoría que estén buscando, esta acción se realiza en la capa del servidor. Cabe mencionar que estas categorías son generadas automáticamente empleando los datos recibidos desde el backend.

![Lista Categorías](https://i.postimg.cc/52trpqSS/Screenshot-2022-06-09-at-01-59-45-Desaf-o-Bsale.png)

![Productos Categoría](https://i.postimg.cc/Sx8SQhHP/Screenshot-2022-06-09-at-01-54-03-Desaf-o-Bsale.png)
        
#### Búsqueda de productos

Los usuarios también podrán hacer uso de una barra de búsqueda para poder encontrar con mayor rapidez y de forma más sencilla los productos que estén buscando.

![Búsqueda Productos](https://i.postimg.cc/141qXH5h/Screenshot-2022-06-09-at-02-05-25-Desaf-o-Bsale.png)

#### Ordenamiento de los productos

Esta función se da mediante los precios ya afectados por los descuentos. Esto se da a nivel de capa del cliente, pues la data ya ha sido obtenida y solo se reutiliza para este procedimiento.

Orden descendente
![Orden Descendente](https://i.postimg.cc/QMxZ3R5L/Screenshot-2022-06-09-at-02-24-27-Desaf-o-Bsale.png)

Orden ascendente
![Orden Ascendente](https://i.postimg.cc/5tbgkCGp/Screenshot-2022-06-09-at-02-31-55-Desaf-o-Bsale.png)