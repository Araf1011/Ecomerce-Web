// =============================================
// product.js — runs on the product detail page
// =============================================

// STEP 1: Keep track of what the user selected
let selectedSize   = '';
let selectedSleeve = '';
let quantity       = 1;

// Stores the currently displayed product (set in showProductOnPage)
let currentProduct = null;


// =============================================
// STEP 2: Get the product ID from the URL
// =============================================
// When user clicks a product card, the URL becomes:
// product.html?id=3
// We read that "3" here to know which product to show

function getProductIdFromURL() {
    // URLSearchParams reads the ?id=3 part of the URL
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id'); // gets the value of "id"
    return Number(id);         // convert "3" (text) to 3 (number)
}


// =============================================
// STEP 3: Fetch products.json and find the right product
// =============================================

function loadProductDetail() {

    // Get the ID from the URL
    let productId = getProductIdFromURL();

    // Fetch all products from products.json
    fetch('products.json')

        // Convert the response to a JavaScript list
        .then(function(response) {
            return response.json();
        })

        // Find the product that matches our ID
        .then(function(products) {

            // Loop through the list to find the one with matching id
            let product = null;
            for (let i = 0; i < products.length; i++) {
                if (products[i].id === productId) {
                    product = products[i];
                    break; // stop looping once found
                }
            }

            // If no product found, show an error message
            if (product === null) {
                document.getElementById('product-detail').innerHTML =
                    '<p style="text-align:center; padding:60px; color:red;">Product not found!</p>';
                return;
            }

            // If product is found, display it on the page
            showProductOnPage(product);

            // Also load related products (pass the full list and current product)
            loadRelatedProducts(products, product);
        })

        // If fetch fails, show an error
        .catch(function(error) {
            document.getElementById('product-detail').innerHTML =
                '<p style="text-align:center; padding:60px; color:red;">Could not load product. Use Live Server!</p>';
            console.log('Error:', error);
        });
}


// =============================================
// STEP 4: Put the product data into the HTML
// =============================================

function showProductOnPage(product) {

    // IMPORTANT: Save the product data so addToCart() can use it
    currentProduct = product;

    // Set the page title
    document.title = product.name + ' — Jersey Lagbe';

    // Set the product image
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;

    // Set the product name
    document.getElementById('product-name').textContent = product.name;

    // Set the price
    document.getElementById('product-price').textContent = product.price.toFixed(2) + '৳';

    // Set the description
    document.getElementById('product-description').textContent = product.description;

    // Build the features bullet list
    let featureList = document.getElementById('product-features');
    featureList.innerHTML = ''; // clear it first

    for (let i = 0; i < product.features.length; i++) {
        let li = document.createElement('li');
        li.textContent = product.features[i];
        featureList.appendChild(li);
    }

    // Build the SIZE buttons
    let sizeContainer = document.getElementById('size-buttons');
    sizeContainer.innerHTML = '';

    for (let i = 0; i < product.sizes.length; i++) {
        let btn = document.createElement('button');
        btn.textContent = product.sizes[i];
        btn.className = 'option-btn';

        // When user clicks a size button
        btn.onclick = function() {
            // Remove 'selected' from all size buttons
            let allSizeBtns = document.querySelectorAll('#size-buttons .option-btn');
            for (let j = 0; j < allSizeBtns.length; j++) {
                allSizeBtns[j].classList.remove('selected');
            }
            // Add 'selected' to the clicked one
            btn.classList.add('selected');
            selectedSize = product.sizes[i]; // save the choice
        };

        sizeContainer.appendChild(btn);
    }

    // Build the SLEEVE buttons
    let sleeveContainer = document.getElementById('sleeve-buttons');
    sleeveContainer.innerHTML = '';

    for (let i = 0; i < product.sleeves.length; i++) {
        let btn = document.createElement('button');
        btn.textContent = product.sleeves[i];
        btn.className = 'option-btn';

        // When user clicks a sleeve button
        btn.onclick = function() {
            // Remove 'selected' from all sleeve buttons
            let allSleeveBtns = document.querySelectorAll('#sleeve-buttons .option-btn');
            for (let j = 0; j < allSleeveBtns.length; j++) {
                allSleeveBtns[j].classList.remove('selected');
            }
            // Add 'selected' to the clicked one
            btn.classList.add('selected');
            selectedSleeve = product.sleeves[i]; // save the choice
        };

        sleeveContainer.appendChild(btn);
    }
}

// Related Products 

function loadRelatedProducts(allProducts, currentProduct) {

    let relatedGrid = document.getElementById('related-grid');
    relatedGrid.innerHTML = ''; // clear loading text

    // Step A: Find products from the SAME team (but not the current one)
    let sameTeam = [];
    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].team === currentProduct.team && allProducts[i].id !== currentProduct.id) {
            sameTeam.push(allProducts[i]);
        }
    }

    //  Find OTHER products (different team, not the current one)
    let others = [];
    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].team !== currentProduct.team && allProducts[i].id !== currentProduct.id) {
            others.push(allProducts[i]);
        }
    }

    // Combine same team first, then others, limit to 4 total
    let related = sameTeam.concat(others);
    if (related.length > 4) {
        related = related.slice(0, 4); 
    }

    // If no related products found
    if (related.length === 0) {
        relatedGrid.innerHTML = '<p style="text-align:center; color:#888;">No related products found.</p>';
        return;
    }

    //related product
    for (let i = 0; i < related.length; i++) {
        let product = related[i];

        // Create the card HTML
        let card = document.createElement('a');
        card.href = 'product.html?id=' + product.id; // clicking goes to that product page
        card.className = 'product-link';

        card.innerHTML =
            '<div class="product-card">' +
                '<div class="product-image">' +
                    '<img src="' + product.image + '" alt="' + product.name + '">' +
                '</div>' +
                '<div class="product-info">' +
                    '<span class="category">' + product.team + '</span>' +
                    '<h3 class="product-title">' + product.name + '</h3>' +
                    '<p class="price">' + product.price.toFixed(2) + '৳</p>' +
                '</div>' +
            '</div>';

        // Add the card into the grid
        relatedGrid.appendChild(card);
    }
}


// Quantity buttons (+ and -)


function changeQty(amount) {
    quantity = quantity + amount;

    // Don't let it go below 1
    if (quantity < 1) {
        quantity = 1;
    }

    // Update the display
    document.getElementById('qty-display').textContent = quantity;
}



// Add to Cart and Buy Now buttons

function addToCart() {
    let name = document.getElementById('customer-name').value;

    // Check if user selected a size
    if (selectedSize === '') {
        alert('Please select a size!');
        return;
    }

    // Check if user selected a sleeve
    if (selectedSleeve === '') {
        alert('Please select Full Sleeve or Half Sleeve!');
        return;
    }

    // Check if product data is loaded 
    if (!currentProduct) {
        alert('Product loading, please wait...');
        return;
    }

    // item object to save in the cart
    let cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.image,
        size: selectedSize,
        sleeve: selectedSleeve,
        customName: name, 
        quantity: quantity
    };

    // Add it to localStorage
    addItemToCart(cartItem);

    // Slide open the cart drawer 
    openCart();
}

function buyNow() {
    let name = document.getElementById('customer-name').value;

    // Check if user filled in their name
    if (name.trim() === '') {
        alert('Please enter your Name or IGN!');
        return;
    }

    // Check if user selected a size
    if (selectedSize === '') {
        alert('Please select a size!');
        return;
    }

    // Check if user selected a sleeve
    if (selectedSleeve === '') {
        alert('Please select Full Sleeve or Half Sleeve!');
        return;
    }

    // Show order summary 
    alert('Order placed!\nName: ' + name + '\nSize: ' + selectedSize + '\nSleeve: ' + selectedSleeve + '\nQty: ' + quantity);
}

// START: Run when the page finishes loading


window.onload = function() {
    loadProductDetail();
};
