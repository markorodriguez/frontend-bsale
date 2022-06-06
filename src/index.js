const burgerButton = document.getElementById("burger-btn");
const dropdown = document.getElementById("dropdown-menu");
const dropOptions = document.getElementById("dropdown-options");
const gridProducts = document.getElementById("grid-products");
const categoryList = document.getElementById("category-list");

const products = [];
const categories = [];

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
  const resProd = await fetch("http://localhost:5000/products");
  const dataProd = await resProd.json();
  dataProd.map((product) => products.push(product));

  const resCat = await fetch("http://localhost:5000/categories");
  const dataCat = await resCat.json();
  dataCat.map((category) => categories.push(category));

  const productsItems = renderProducts(dataProd)
  gridProducts.innerHTML = productsItems.join("");
};


const filterData = (params) => {
  const filteredCat = categories.filter((category) => category.name == params);
  const filteredProducts = products.filter(
    (product) => product.category == filteredCat[0].id
  );
  const filteredItems = renderProducts(filteredProducts);
  gridProducts.innerHTML = filteredItems.join("");
};



const renderProducts = (params) => {
  const items = params.map(
    (element) => `
    <div class="bg-white overflow-hidden rounded-xl shadow-md border-2 h-auto flex flex-col">
    <div class="h-full">
        <img class="h-full bg-white w-full" src="${element.url_image == "" || element.url_image == null
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNXhjagJgGqhsSMn1cUPkiaMU5RXD_lg9oUkYwhE6Ko_snuPYOsD18DTF8A0hYDQUbN4&usqp=CAU"
        : element.url_image
      }" />
    </div>
    <div class="py-4">
        <span class="font-semibold">${element.name.toUpperCase()}</span>
        <div class="flex w-full mt-4 flex-row items-center justify-around">
            <div class="flex flex-col">
            ${element.discount == 0
        ? `<span class="font-semibold">CLP ${element.price - element.discount
        }</span>`
        : `<span class="font-semibold line-through text-gray-500">CLP ${element.price
        }</span>
                <span class="font-semibold">CLP ${element.price - element.discount
        }</span>`
      }
            </div>
                <div>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Comprar</button>
                </div>
        </div>
    </div>
</div>
    `
  );

  return items

}
