const burgerButton = document.getElementById("burger-btn");
const dropdown = document.getElementById("dropdown-menu");
const dropOptions = document.getElementById("dropdown-options")
const products = []

window.addEventListener('resize', ()=> {
    if(window.innerWidth >= 769) {
        dropdown.style.display = "none";
    } 
})

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
    dataProd.map(product => products.push(product));

    const resCat = await fetch("http://localhost:5000/categories");
    const dataCat = await resCat.json();
    console.log(dataCat)
};


