/* ===========================================================
   Around The House Essentials
   script.js
   PART 1
=========================================================== */
let products = [];

async function loadProducts(){

function getFeaturedProducts(){

    return products.filter(product => product.featured);
    
}

    try{

        const response = await fetch("data/products.json");

        products = await response.json();

        console.log("Loaded Products:", products);

        const path = window.location.pathname.toLowerCase();

        const isProductsPage =
            path.endsWith("/products") ||
            path.endsWith("/products.html");

if(isProductsPage){

    filterProducts();

}else{

    renderProducts(getFeaturedProducts());

}

    }

    catch(error){

        console.error(error);

    }

};
    
    /* ===========================================================
       DOM
    =========================================================== */
    
    const productGrid = document.getElementById("productGrid");
    
   /* ===========================================================
   Render Products
=========================================================== */

function renderProducts(productArray){

    productGrid.innerHTML = "";

    productArray.forEach(product=>{

        const card = document.createElement("article");

        card.className = "product-card";

        card.dataset.id = product.id;

        card.dataset.category = product.category;

        card.dataset.rating = product.rating;

        card.dataset.featured = product.featured;

        card.innerHTML = `

<div class="product-image">

    <img
    src="${product.image}"
    alt="${product.name}"
    loading="lazy"
    onerror="this.src='images/placeholder.webp'"
    >

    <div class="product-badge">

        ${product.badge}

    </div>

    <button
        class="favorite-btn"
        aria-label="Save Product">

        ♡

    </button>

</div>

<div class="product-content">

    <div class="product-category">

        ${product.category}

    </div>

    <h3 class="product-title">

        ${product.name}

    </h3>

    <p class="product-description">

        ${product.description}

    </p>

    <div class="product-footer">

        <div class="product-price">

            <strong>

                $${Number(product.price).toFixed(2)}

            </strong>

            <small>

                Amazon Price

            </small>

        </div>

        <div class="product-buttons">

            <a
                class="amazon-btn"
                href="${product.amazon}"
                target="_blank"
                rel="noopener noreferrer">

                Buy on Amazon

            </a>

        </div>

    </div>

</div>

`;

        productGrid.appendChild(card);

    });

}

/* ===========================================================
   PART 2
   Search • Filters • Sorting • Favorites • Dark Mode
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category");
const darkModeToggle = document.getElementById("darkModeToggle");
const scrollTopButton = document.getElementById("scrollTop");

/* ===========================================================
   APP STATE
=========================================================== */

let selectedCategory = "All";
let searchQuery = "";

/* ===========================================================
   FILTER PRODUCTS
=========================================================== */
document
    .getElementById("searchButton")
    .addEventListener("click", () => {

        filterProducts();

    });

function filterProducts(){

    let filtered = products.filter(product=>{

        const matchesCategory =
            selectedCategory==="All" ||
            product.category===selectedCategory;

        const matchesSearch =

            product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())

            ||

            (product.description || "")

    .toLowerCase()

    .includes(searchQuery.toLowerCase())

        return matchesCategory && matchesSearch;

    });

    filtered.sort((a,b)=>{

        if(a.featured && !b.featured) return -1;
    
        if(!a.featured && b.featured) return 1;
    
        return a.name.localeCompare(b.name);
    
    });

    renderProducts(filtered);

    updateProductCount(filtered.length);

    attachFavoriteEvents();

    revealCards();

}

/* ===========================================================
   SEARCH
=========================================================== */

if(searchInput){

    searchInput.addEventListener("input",(event)=>{

        searchQuery = event.target.value;

        filterProducts();

    });

}

/* ===========================================================
   CATEGORY FILTERS
=========================================================== */

categoryButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        categoryButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterProducts();

    });

});

/* ===========================================================
   PRODUCT COUNT
=========================================================== */

function updateProductCount(count){

    let counter = document.querySelector(".product-count");

    if(!counter){

        counter = document.createElement("div");

        counter.className="product-count";

        productGrid.before(counter);

    }

    counter.textContent =
        `Showing ${count} product${count!==1 ? "s" : ""}`;

}

/* ===========================================================
   FAVORITES
=========================================================== */

function getFavorites(){

    return JSON.parse(

        localStorage.getItem("favorites") || "[]"

    );

}

function saveFavorites(favorites){

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );

}

function attachFavoriteEvents(){

    document
        .querySelectorAll(".favorite-btn")
        .forEach((button,index)=>{

                const card = button.closest(".product-card");

                const id = Number(card.dataset.id);

            if(!id) return;

            const favorites = getFavorites();

            if(favorites.includes(id)){

                button.innerHTML="❤️";

            }

            button.onclick=()=>{

                let updated = getFavorites();

                if(updated.includes(id)){

                    updated = updated.filter(f=>f!==id);

                    button.innerHTML="♡";

                }else{

                    updated.push(id);

                    button.innerHTML="❤️";

                }

                saveFavorites(updated);

            };

        });

}

/* ===========================================================
   DARK MODE
=========================================================== */

const savedTheme =
    localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

    darkModeToggle.innerHTML="☀️";

}

darkModeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(

        "theme",

        dark ? "dark" : "light"

    );

    darkModeToggle.innerHTML =
        dark ? "☀️" : "🌙";

});

/* ===========================================================
   SCROLL TO TOP
=========================================================== */

window.addEventListener("scroll",()=>{

    if(window.scrollY>500){

        scrollTopButton.classList.add("show");

    }else{

        scrollTopButton.classList.remove("show");

    }

});

scrollTopButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/* ===========================================================
   CARD REVEAL
=========================================================== */

function revealCards(){

    const cards =

        document.querySelectorAll(".product-card");

    cards.forEach((card,index)=>{

        setTimeout(()=>{

            card.classList.add("visible");

        },index*80);

    });

}

/* ===========================================================
   IMAGE FADE-IN
=========================================================== */

document.addEventListener("load",(event)=>{

    if(event.target.tagName==="IMG"){

        event.target.classList.add("loaded");

    }

},true);

/* ===========================================================
   EMPTY STATE
=========================================================== */

const originalRender = renderProducts;

renderProducts = function(list){

    if(list.length===0){

        productGrid.innerHTML = `

        <div class="empty-state">

            <h3>No products found</h3>

            <p>

                Try searching for something else
                or choose a different category.

            </p>

        </div>

        `;

        return;

    }

    originalRender(list);

};

/* ===========================================================
   INITIALIZE
=========================================================== */

loadProducts();