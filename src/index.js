const burgerButton = document.getElementById("burger-btn");
const dropdown = document.getElementById("dropdown-menu");
const dropOptions = document.getElementById("dropdown-options");
const gridProducts = document.getElementById("grid-products");
const categoryList = document.getElementById("category-list");
const productSearch = document.getElementById("product-search");
const spinnerContainer = document.getElementById("spinner");

const products = [];
const categories = [];
let tmpArray = [];

window.addEventListener("resize", () => {
  if (window.innerWidth >= 769) {
    dropdown.style.display = "none";
  }
});



burgerButton.addEventListener("click", () => {
  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
});

const fetchData = async () => {
  const resProd = await fetch("https://bsale-markorodriguez.herokuapp.com/products",{
    headers: {'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  }
  });
  const dataProd = await resProd.json();

  setTimeout( () =>{
    spinnerContainer.classList.add("hidden-loading");
  }, 1500) 
  setTimeout( () =>{
    spinnerContainer.classList.add("hidden");
  }, 2500) 

  dataProd.map((product) => products.push(product));

  tmpArray = dataProd;

  const resCat = await fetch("https://bsale-markorodriguez.herokuapp.com/categories", {
    headers: {'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  }
  });
  const dataCat = await resCat.json();
  dataCat.map((category) => categories.push(category));

  insertPagination(dataProd);

  const categoriesItems = renderSideBar(dataCat);
  categoryList.innerHTML = categoriesItems.join("");

  const dropdownItems = renderDropdown(dataCat);
  dropOptions.innerHTML = dropdownItems.join("");
};

const filterData = (params) => {
  const filteredCat = categories.filter((category) => category.id == params);
  const filteredProducts = products.filter(
    (product) => product.category == filteredCat[0].id
  );
  tmpArray = filteredProducts;
  insertPagination(tmpArray)
};


const renderSideBar = (params) => {
  const items = params.map(
    (element) =>
      ` <li onclick="filterData(${element.id
      })" class="my-[3px] cursor-pointer hover:text-orange-400">${element.name.charAt(0).toUpperCase() + "" + element.name.slice(1)
      }</li>`
  );
  return items;
};

const renderDropdown = (params) => {
  const items = params.map(
    (element) =>
      ` <div onclick="filterData(${element.id})" class="dropdown-element">${element.name.charAt(0).toUpperCase() + "" + element.name.slice(1)
      }</div>`
  );
  return items;
};

const resetFilter = () => {

  insertPagination(products);
};

productSearch.addEventListener("submit", async (e) => {
  e.preventDefault();

  const foundProducts = await fetch("http://localhost:5000/find-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_name: document.getElementById("product_find").value,
    }),
  });

  const data = await foundProducts.json();
  insertPagination(data);
});

const sortProductsAsc = () => {
  const sortedProducts = [...tmpArray].sort((a, b) => (a.price - (a.price * a.discount/100)) -( b.price - (b.price * b.discount/100)));
  insertPagination(sortedProducts);
};

const sortProductsDesc = () => {
  const sortedProducts = [...tmpArray].sort((a, b) => ( b.price - (b.price * b.discount/100)) - (a.price - (a.price * a.discount/100)) );
  insertPagination(sortedProducts);
};

const sortByDefault = () => {
  insertPagination(tmpArray);
};

const insertPagination = (params) => {
  $(function () {
    let container = $("#pagination");
    container.pagination({
      dataSource: params,
      pageSize: 8,
      callback: function (data, pagination) {
        var dataHtml = "";

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
