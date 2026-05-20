let selectedSize   = '';
let selectedSleeve = '';
let quantity       = 1;
let currentProduct = null;

// Get product ID from URL query params
function getProductIdFromURL() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id'); 
    return Number(id);         
}

// Load product details from products.json
function loadProductDetail() {
    let productId = getProductIdFromURL();
    fetch('products.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(products) {
            let product = null;
            for (let i = 0; i < products.length; i++) {
                if (products[i].id === productId) {
                    product = products[i];
                    break;
                }
            }
            if (product === null) {
                document.getElementById('product-detail').innerHTML =
                    '<p style="text-align:center; padding:60px; color:red;">Product not found!</p>';
                return;
            }
            showProductOnPage(product);
        })
        .catch(function(error) {
            document.getElementById('product-detail').innerHTML =
                '<p>Could not load product.</p>';
            console.log('Error:', error);
        });
}

// Populate product details in the HTML
function showProductOnPage(product) {
    currentProduct = product;
    document.title = product.name + ' — Jersey Lagbe';
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = product.price.toFixed(2) + '৳';
    document.getElementById('product-description').textContent = product.description;
    let featureList = document.getElementById('product-features');
    featureList.innerHTML = ''; 
    for (let i = 0; i < product.features.length; i++) {
        let li = document.createElement('li');
        li.textContent = product.features[i];
        featureList.appendChild(li);
    }
    
    // Build size buttons
    let sizeContainer = document.getElementById('size-buttons');
    sizeContainer.innerHTML = '';
    for (let i = 0; i < product.sizes.length; i++) {
        let btn = document.createElement('button');
        btn.textContent = product.sizes[i];
        btn.className = 'option-btn';
        btn.onclick = function() {
            let allSizeBtns = document.querySelectorAll('#size-buttons .option-btn');
            for (let j = 0; j < allSizeBtns.length; j++) {
                allSizeBtns[j].classList.remove('selected');
            }
            btn.classList.add('selected');
            selectedSize = product.sizes[i];
        };
        sizeContainer.appendChild(btn);
    }
    
    // Build sleeve buttons
    let sleeveContainer = document.getElementById('sleeve-buttons');
    sleeveContainer.innerHTML = '';
    for (let i = 0; i < product.sleeves.length; i++) {
        let btn = document.createElement('button');
        btn.textContent = product.sleeves[i];
        btn.className = 'option-btn';
        btn.onclick = function() {
            let allSleeveBtns = document.querySelectorAll('#sleeve-buttons .option-btn');
            for (let j = 0; j < allSleeveBtns.length; j++) {
                allSleeveBtns[j].classList.remove('selected');
            }
            btn.classList.add('selected');
            selectedSleeve = product.sleeves[i]; 
        };
        sleeveContainer.appendChild(btn);
    }
}

// Change product quantity
function changeQty(amount) {
    quantity = quantity + amount;
    if (quantity < 1) {
        quantity = 1;
    }
    document.getElementById('qty-display').textContent = quantity;
}

// Add item to cart
function addToCart() {
    let name = document.getElementById('customer-name').value;
    if (selectedSize === '') {
        alert('Please select a size!');
        return;
    }
    if (selectedSleeve === '') {
        alert('Please select Full Sleeve or Half Sleeve!');
        return;
    }
    if (!currentProduct) {
        alert('Product loading, please wait...');
        return;
    }
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
    addItemToCart(cartItem);
    openCart();
}

// Buy item now
function buyNow() {
    let name = document.getElementById('customer-name').value;
    if (name.trim() === '') {
        alert('Please enter your Name or IGN!');
        return;
    }
    if (selectedSize === '') {
        alert('Please select a size!');
        return;
    }
    if (selectedSleeve === '') {
        alert('Please select Full Sleeve or Half Sleeve!');
        return;
    }
    alert('Order placed!\nName: ' + name + '\nSize: ' + selectedSize + '\nSleeve: ' + selectedSleeve + '\nQty: ' + quantity);
}

// Page initialization
window.onload = function() {
    loadProductDetail();
};
