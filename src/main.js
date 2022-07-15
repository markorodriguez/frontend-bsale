const burgerButton = document.getElementById("burger-btn");
const dropdown = document.getElementById("dropdown-menu");
const dropOptions = document.getElementById("dropdown-options");
const gridProducts = document.getElementById("grid-products");
const categoryList = document.getElementById("category-list");
const productSearch = document.getElementById("product-search");
const spinnerContainer = document.getElementById("spinner");
const paginationContainer = document.getElementById("pagination")

const products = []; //Será empleado en caso de que el usuario ingrese un valor sin respuesta en el input de búsqueda
const categories = [];
let pagination;

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

const showAlert = (text) => {
  Toastify({
    text: `${text}`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#F59E0B",
    },
    offset: {
      y: 75,
    },
  }).showToast();
};

const fetchProducts = async (page) => {
  const pageApi = page == null || undefined ? 1 : page;

  const resProd = await fetch(`http://localhost:5001/products?page=${pageApi}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "GET, POST, OPTIONS",
    },
  })

  const prodData = await resProd.json()
  pagination = prodData.results.numberPages
  products.push(prodData.results)
  //console.log(prodData.results.results)
  const productGrid = renderProductsGrid(prodData.results.results)
  gridProducts.innerHTML = productGrid.join(' ')
  const paginationGrid = renderPagination(prodData.results.numberPages)
  paginationContainer.innerHTML = paginationGrid.join(' ')

};

const fetchCategories = async () => {

  const resCat = await fetch("http://localhost:5001/categories", {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    }
  });

  const catData = await resCat.json();
  categories.push(catData)
  //Insertar las categorías en el menú lateral
  const categoriesItems = renderSideBar(catData);
  categoryList.innerHTML = categoriesItems.join(" ");

  //Insertar las categorías en el menú desplegable
  const dropdownItems = renderDropdown(catData);
  dropOptions.innerHTML = dropdownItems.join(" ");
}

//Renderiza cada elemento del sidebar basado en las categorías obtenidas
const renderSideBar = (params) => {
  const items = params.map(
    (element) =>
      ` <li onclick="filterDataProducts(${element.id},1)"  class="my-[3px] cursor-pointer hover:text-orange-400">${element.name.charAt(0).toUpperCase() + "" + element.name.slice(1)
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

const renderProductsGrid = (value) => {

  const products = value.map(

    (item) => `
    <div class="bg-white overflow-hidden rounded-xl shadow-md border-2 h-auto flex flex-col">
    <div class="h-full">
        <img class="h-full bg-white w-full" src="${item.url_image == "" || item.url_image == null
        ? "https://www.medcons24.com/Content/Images/no-search-result.svg"
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
                <span class="font-semibold">CLP ${item.price - (item.price * item.discount / 100)}</span>`
      }
            </div>
                <div>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Comprar</button>
                </div>
        </div>
    </div>
</div>
    `
  )

  return products

}

const renderPagination = (value, category_id) => {

  const paginationArea = []
//primero sacar la paginacion por categoria BORRAR LUEGO 
  for (let i = 0; i < value; i++) {
    const paginationItem = `<button class="mx-2 px-2 py-1 hover:bg-orange-100 border-2 rounded-full" onclick='filterDataProducts(${category_id},${i + 1});'>${i + 1}</sp>`
    paginationArea.push(paginationItem)
  }

  return paginationArea

}

const firstLoad = async () => {

  try {
    await fetchProducts(1)
    await fetchCategories()
    setTimeout(() => {
      spinnerContainer.classList.add("hidden-loading");
    }, 1500)
    setTimeout(() => {
      spinnerContainer.classList.add("hidden");
    }, 2500)
  } catch (err) {
    console.log(err)
    showAlert('Ha ocurrido un error')
  }

}

const filterDataProducts = async (params, page) => {

    const filteredProducts = await fetch(`http://localhost:5001/actions/filter-product?page=${page}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_id: params
      })
    })

    const data = await filteredProducts.json();
    tmpArray = data;

    gridProducts.innerHTML = renderProductsGrid(data.results.results).join(" ")
    paginationContainer.innerHTML = renderPagination(data.results.numberPages, data.results.results[0].category).join(" ")
  }

productSearch.addEventListener("submit", async (e) => {
  e.preventDefault();

  const foundProducts = await fetch(`http://localhost:5001/actions/find-product?page=${1}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_name: document.getElementById("product_find").value,
    }),
  });

  const data = await foundProducts.json();
  gridProducts.innerHTML = renderProductsGrid(data.results.results).join(" ")
  paginationContainer.innerHTML = renderPagination(data.results.numberPages).join(" ")

})

;
