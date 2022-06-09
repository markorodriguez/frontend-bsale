const burgerButton = document.getElementById("burger-btn");
const dropdown = document.getElementById("dropdown-menu");
const dropOptions = document.getElementById("dropdown-options");
const gridProducts = document.getElementById("grid-products");
const categoryList = document.getElementById("category-list");
const productSearch = document.getElementById("product-search");
const spinnerContainer = document.getElementById("spinner");


const products = []; //Será empleado en caso de que el usuario ingrese un valor sin respuesta en el input de búsqueda
const categories = []; 

//Arreglo temporal para manejar el ordenamiento de productos
let tmpArray = [];

//Función para ocultar el menú desplegable si el width de la pantalla es mayor a 768px
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    dropdown.style.display = "none";
  }
});

//Función para activar u ocultar el menú desplegable 
burgerButton.addEventListener("click", () => {
  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
});

//https://bsale-markorodriguez.herokuapp.com

const fetchData = async () => {
  const resProd = await fetch("https://bsale-markorodriguez.herokuapp.com/products",{
    headers: {'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  }
  });
  const dataProd = await resProd.json(); 

 //Empezar el efecto fade del spinner
  setTimeout( () =>{
    spinnerContainer.classList.add("hidden-loading");
  }, 1500) 
  setTimeout( () =>{
    spinnerContainer.classList.add("hidden");
  }, 2500) 

  
  dataProd.map((product) => products.push(product));
  //Almacenar la información de productos para ser empleada en excepciones
  tmpArray = dataProd;

  const resCat = await fetch("https://bsale-markorodriguez.herokuapp.com/categories", {
    headers: {'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  }
  });

  
  const dataCat = await resCat.json();
  //Almacenar la información de las categorías para ser empleada en sidebar y menú dropdown
  dataCat.map((category) => categories.push(category));

  insertPagination(dataProd);

  //Insertar las categorías en el menú lateral
  const categoriesItems = renderSideBar(dataCat);
  categoryList.innerHTML = categoriesItems.join("");

  //Insertar las categorías en el menú desplegable
  const dropdownItems = renderDropdown(dataCat);
  dropOptions.innerHTML = dropdownItems.join("");
};

const filterDataProducts = async (params) => {
  let isValid = false
  
  //Validar si el parámetro pertenece a una categoría registrada
  categories.map((category) => {
    if (category.id == params) {
      isValid = true;
    }
  })
  
  if(isValid){
    const filteredProducts = await fetch(`https://bsale-markorodriguez.herokuapp.com/filter-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_id: params
      })
    })

    const data = await filteredProducts.json();
    tmpArray = data;

    insertPagination(data);

  }else{
    console.log('No existe la categoría', isValid)
    insertPagination(products); //Mostrar los datos obtenidos en la carga del sitio
  }
}

//Renderiza cada elemento del sidebar basado en las categorías obtenidas
const renderSideBar = (params) => {
  const items = params.map(
    (element) =>
      ` <li onclick="filterDataProducts(${element.id})"  class="my-[3px] cursor-pointer hover:text-orange-400">${element.name.charAt(0).toUpperCase() + "" + element.name.slice(1)
      }</li>`
  );
  return items;
};

//Renderiza cada elemento del dropdown basado en las categorías obtenidas
const renderDropdown = (params) => {
  const items = params.map(
    (element) =>
      ` <div  onclick="filterDataProducts(${element.id})" class="dropdown-element">${element.name.charAt(0).toUpperCase() + "" + element.name.slice(1)
      }</div>`
  );
  return items;
};

//Emplea el arreglo generado al momento de cargar la página
const resetFilter = () => {
  insertPagination(products);
};

//Función para realizar el filtro de productos por nombre
productSearch.addEventListener("submit", async (e) => {
  e.preventDefault();

  const foundProducts = await fetch("https://bsale-markorodriguez.herokuapp.com/find-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_name: document.getElementById("product_find").value,
    }),
  });

  const data = await foundProducts.json();
  tmpArray = data
  insertPagination(data);
});


//Funciones para ordenar los productos de forma ascendente y descendente respecto a su precio
//[...tmpArray] permite emplear el array original sin modificarlo
const sortProductsAsc = () => {

  const sortedProducts = [...tmpArray].sort((a, b) => (a.price - (a.price * a.discount/100)) -( b.price - (b.price * b.discount/100)));
  insertPagination(sortedProducts);
};

const sortProductsDesc = () => {
  const sortedProducts = [...tmpArray].sort((a, b) => ( b.price - (b.price * b.discount/100)) - (a.price - (a.price * a.discount/100)) );
  insertPagination(sortedProducts);
};

//Función para ordenar los productos según sea consumido por defecto desde el backend
const sortByDefault = () => {
  insertPagination(tmpArray);
};

//Función que inserta los productos en la página y agrega la paginación
const insertPagination = (params) => {
  $(function () {
    let container = $("#pagination");
    container.pagination({
      dataSource: params,
      pageSize: 8,
      callback: function (data, pagination) {
        var dataHtml = "";

        //Mapea cada elemento del arreglo que se pasa como parámetro y lo renderizará en el target
        $.each(data, function (index, item) {
          dataHtml += `
                <div class="bg-white overflow-hidden rounded-xl shadow-md border-2 h-auto flex flex-col">
                <div class="h-full">
                    <img class="h-full bg-white w-full" src="${item.url_image == "" || item.url_image == null
              ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNXhjagJgGqhsSMn1cUPkiaMU5RXD_lg9oUkYwhE6Ko_snuPYOsD18DTF8A0hYDQUbN4&usqp=CAU"
              : item.url_image
            }" />
                </div>
                <div class="py-4">
                    <span class="font-semibold">${item.name.toUpperCase()}</span>
                    <div class="flex w-full mt-4 flex-row items-center justify-around">
                        <div class="flex flex-col">
                        ${item.discount == 0
              ? `<span class="font-semibold">CLP ${item.price}</span>`
              : `<span class="font-semibold line-through text-gray-500">CLP ${item.price}</span>
                            <span class="font-semibold">CLP ${item.price - (item.price * item.discount/100)}</span>`
            }
                        </div>
                            <div>
                                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Comprar</button>
                            </div>
                    </div>
                </div>
            </div>
                `;
        });

        dataHtml += "";

        $("#grid-products").html(dataHtml);
      },
    });
  });
};
