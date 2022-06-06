const burgerButton = document.getElementById("burger-btn");
const dropdown = document.getElementById("dropdown-menu");
const dropOptions = document.getElementById("dropdown-options");
const gridProducts = document.getElementById("grid-products");

const products = [];

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

  /*
    const resCat = await fetch("http://localhost:5000/categories");
    const dataCat = await resCat.json();
    */

  const productsItems = dataProd.map(
    (product) => `
    <div class="bg-white overflow-hidden rounded-xl shadow-md border-2 h-auto flex flex-col">
    <div class="h-full">
        <img class="h-full bg-white w-full" src="${product.url_image == "" || product.url_image == null ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNXhjagJgGqhsSMn1cUPkiaMU5RXD_lg9oUkYwhE6Ko_snuPYOsD18DTF8A0hYDQUbN4&usqp=CAU" :product.url_image }" />
    </div>
    <div class="py-4">
        <span class="font-semibold">${product.name.toUpperCase()}</span>
        <div class="flex w-full mt-4 flex-row items-center justify-around">
            <div class="flex flex-col">
            ${product.discount == 0 ? 
              `<span class="font-semibold">CLP ${product.price-product.discount}</span>`
             :  `<span class="font-semibold line-through text-gray-500">CLP ${product.price}</span>
                <span class="font-semibold">CLP ${product.price-product.discount}</span>` }
                
            </div>
                <div>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Comprar</button>
                </div>
            
        </div>
    </div>
</div>
       
    `
  );

  console.log(dataProd);

  gridProducts.innerHTML = productsItems.join("");
};
