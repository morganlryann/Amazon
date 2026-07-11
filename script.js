/* ===========================================================
   Around The House Essentials
   script.js
   PART 1
=========================================================== */

const products = [

    {
        id:1,
    
        featured:true,
    
        badge:"Best Seller",
    
        category:"Cleaning",
    
        name:"Scrub Daddy Sponge",
    
        rating:4.9,
    
        reviews:"315k",
    
        price:"$3.99",
    
        image:"images/scrub-daddy.webp",
    
        description:
        "The only sponge I consistently buy. It cleans everything without scratching.",
    
        why:[
            "Hard in cold water",
            "Soft in warm water",
            "Lasts for weeks"
        ],
    
        amazon:"https://YOURAFFILIATELINK.com",
    
        video:"https://amazon.com/live"
    
    },
    
    {
        id:2,
    
        featured:true,
    
        badge:"My Favorite",
    
        category:"Kitchen",
    
        name:"Electric Kettle",
    
        rating:4.8,
    
        reviews:"52k",
    
        price:"$39.99",
    
        image:"images/kettle.webp",
    
        description:
        "Boils water incredibly fast for coffee, tea and cooking.",
    
        why:[
            "Fast boiling",
            "Auto shutoff",
            "Looks beautiful"
        ],
    
        amazon:"https://YOURAFFILIATELINK.com",
    
        video:""
    
    },
    
    {
        id:3,
    
        featured:false,
    
        badge:"Amazon Choice",
    
        category:"Bathroom",
    
        name:"Luxury Shower Head",
    
        rating:4.7,
    
        reviews:"18k",
    
        price:"$49.99",
    
        image:"images/shower.webp",
    
        description:
        "Easy installation and significantly improves water pressure.",
    
        why:[
            "High pressure",
            "Easy install",
            "Modern look"
        ],
    
        amazon:"https://YOURAFFILIATELINK.com",
    
        video:""
    
    },
    
    {
        id:4,
    
        featured:true,
    
        badge:"Must Have",
    
        category:"Office",
    
        name:"Standing Desk",
    
        rating:4.9,
    
        reviews:"44k",
    
        price:"$299",
    
        image:"images/desk.webp",
    
        description:
        "One of the best upgrades for working from home.",
    
        why:[
            "Quiet motor",
            "Memory presets",
            "Solid construction"
        ],
    
        amazon:"https://YOURAFFILIATELINK.com",
    
        video:""
    
    }
    
    ];
    
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
        loading="lazy"
        alt="${product.name}"
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

    <div class="product-rating">

        ★★★★★

        <span>

            ${product.rating} (${product.reviews})

        </span>

    </div>

    <p class="product-description">

        ${product.description}

    </p>

    <ul class="product-benefits">

        ${product.why
            .map(item => `<li>${item}</li>`)
            .join("")}

    </ul>

    <div class="product-footer">

        <div class="product-price">

            <strong>

                ${product.price}

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

            ${
                product.video
                ?

                `<a
                    class="btn-outline"
                    href="${product.video}"
                    target="_blank"
                    rel="noopener noreferrer">

                    Watch Review

                </a>`

                :

                ""

            }

        </div>

    </div>

</div>

`;

        productGrid.appendChild(card);

    });

}
    
    /* ===========================================================
       Initial Render
    =========================================================== */
    
    renderProducts(products);

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

            product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;

    });

    filtered.sort((a,b)=>{

        if(a.featured && !b.featured) return -1;
        if(!a.featured && b.featured) return 1;

        return b.rating-a.rating;

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

            const product =

                document.querySelectorAll(".product-card")[index];

            const id = products[index]?.id;

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

filterProducts();