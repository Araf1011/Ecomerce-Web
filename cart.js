// VALID COUPON CODES

let validCoupons = {
    'SMART10': 10,
    'NAZIM10': 10,   // 10% discount pabe
    'SUI20': 20,   // 20% discount pabe
    'SEN15': 15     //  5% discount pabe
};

// Keeps track of the applied discount %
let appliedDiscount = 0;


// OPEN & CLOSE THE CART DRAWER


function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('show');
    renderCart(); // always refresh the items when opening
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('show');
}


// =============================================
// READ & WRITE CART FROM LOCALSTORAGE
// =============================================

// Get the cart array from localStorage
// If nothing saved yet, return empty array []
function getCart() {
    let data = localStorage.getItem('jerseyCart');
    if (data) {
        return JSON.parse(data); // convert saved text back to array
    }
    return [];
}

// Save the cart array to localStorage
function saveCart(cart) {
    localStorage.setItem('jerseyCart', JSON.stringify(cart));
}


// =============================================
// ADD AN ITEM TO THE CART
// Called from product.js when user clicks ADD TO CART
// =============================================

function addItemToCart(newItem) {

    let cart = getCart();

    // Check if the exact same item already exists
    // (same product id + same size + same sleeve)
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (
            cart[i].id === newItem.id &&
            cart[i].size === newItem.size &&
            cart[i].sleeve === newItem.sleeve
        ) {
            // Item already in cart — just increase quantity
            cart[i].quantity = cart[i].quantity + newItem.quantity;
            found = true;
            break;
        }
    }

    // If not found, add it as a new item
    if (!found) {
        cart.push(newItem);
    }

    // Save the updated cart
    saveCart(cart);

    // Update the cart count badge in the header
    updateCartCount();
}

// REMOVE AN ITEM FROM THE CART
// index = position of the item in the array


function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1); // remove 1 item at position "index"
    saveCart(cart);
    renderCart();           // refresh the drawer
    updateCartCount();
}

// CHANGE QUANTITY OF AN ITEM
// index = item position, amount = +1 or -1


function changeCartQty(index, amount) {
    let cart = getCart();
    cart[index].quantity = cart[index].quantity + amount;

    // If quantity drops to 0, remove the item entirely
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
    updateCartCount();
}
// UPDATE THE CART COUNT BADGE IN HEADER


function updateCartCount() {
    let cart = getCart();

    // Add up total quantity across all items
    let totalQty = 0;
    for (let i = 0; i < cart.length; i++) {
        totalQty = totalQty + cart[i].quantity;
    }

    // Update all cart-count badges on the pag
    let badges = document.querySelectorAll('.cart-count');
    for (let i = 0; i < badges.length; i++) {
        badges[i].textContent = totalQty;
    }

    // Update the price display in the header
    updateCartPriceDisplay();
}
// UPDATE HEADER PRICE (e.g. "850.00Tk")


function updateCartPriceDisplay() {
    let cart = getCart();
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total = total + (cart[i].price * cart[i].quantity);
    }

    // Apply discount if coupon is active
    let finalTotal = total - (total * appliedDiscount / 100);

    // Add Delivery Charge
    let deliveryCharge = 0;
    if (total > 0) {
        if (total < 500) {
            deliveryCharge = 50;
        } else if (total < 1000) {
            deliveryCharge = 80;
        } else {
            deliveryCharge = 100;
        }
    }

    finalTotal = finalTotal + deliveryCharge;

    let priceDisplays = document.querySelectorAll('.cart-price');
    for (let i = 0; i < priceDisplays.length; i++) {
        priceDisplays[i].textContent = finalTotal.toFixed(2) + '৳';
    }
}
// RENDER (BUILD) THE CART DRAWER CONTENTS


function renderCart() {
    let cart = getCart();
    let itemsBox = document.getElementById('cart-items');
    let subtotalEl = document.getElementById('cart-subtotal');
    let totalEl = document.getElementById('cart-total');
    let discountRow = document.getElementById('cart-discount-row');
    let discountEl = document.getElementById('cart-discount-amount');
    let emptyMsg = document.getElementById('cart-empty-msg');

    // If cart is empty, show the empty message
    if (cart.length === 0) {
        itemsBox.innerHTML = '';
        emptyMsg.style.display = 'block';
        subtotalEl.textContent = '0৳';
        totalEl.textContent = '0৳';
        discountRow.style.display = 'none';
        
        let deliveryEl = document.getElementById('cart-delivery');
        if (deliveryEl) {
            deliveryEl.textContent = '0৳';
        }
        return;
    }

    // Hide empty message
    emptyMsg.style.display = 'none';

    // Build each item row
    itemsBox.innerHTML = '';
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemTotal = item.price * item.quantity;
        subtotal = subtotal + itemTotal;

        let row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML =
            // Product image (small thumbnail)
            '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +

            // Item details
            '<div class="cart-item-details">' +
            '<p class="cart-item-name">' + item.name + '</p>' +
            '<p class="cart-item-meta">' + item.size + ' · ' + item.sleeve + '</p>' +
            '<p class="cart-item-price">' + item.price + '৳</p>' +
            '</div>' +

            // Quantity stepper + remove button
            '<div class="cart-item-right">' +
            '<div class="cart-qty-box">' +
            '<button onclick="changeCartQty(' + i + ', -1)">−</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button onclick="changeCartQty(' + i + ', 1)">+</button>' +
            '</div>' +
            '<button class="cart-remove-btn" onclick="removeFromCart(' + i + ')">✕</button>' +
            '</div>';

        itemsBox.appendChild(row);
    }

    // Show subtotal
    subtotalEl.textContent = subtotal.toFixed(2) + '৳';

    // Calculate Delivery Charge
    let deliveryCharge = 0;
    if (subtotal < 500) {
        deliveryCharge = 50;
    } else if (subtotal < 1000) {
        deliveryCharge = 80;
    } else {
        deliveryCharge = 100;
    }
    
    let deliveryEl = document.getElementById('cart-delivery');
    if (deliveryEl) {
        deliveryEl.textContent = deliveryCharge.toFixed(2) + '৳';
    }

    // Apply discount if a coupon is active
    let finalTotal = subtotal;
    if (appliedDiscount > 0) {
        let discountAmount = subtotal * appliedDiscount / 100;
        finalTotal = subtotal - discountAmount;

        discountRow.style.display = 'flex';
        discountEl.textContent = '−' + discountAmount.toFixed(2) + '৳';
    } else {
        discountRow.style.display = 'none';
    }

    // Add delivery to final total
    finalTotal = finalTotal + deliveryCharge;
    if (totalEl) {
        totalEl.textContent = finalTotal.toFixed(2) + '৳';
    }
}


// APPLY COUPON CODE

function applyCoupon() {
    let input = document.getElementById('coupon-input');
    let msgEl = document.getElementById('coupon-msg');
    let code = input.value.trim().toUpperCase(); // make uppercase so it works regardless of case

    if (code === '') {
        msgEl.textContent = 'Please enter a coupon code.';
        msgEl.style.color = '#e74c3c';
        return;
    }

    // Check if the code is in our valid list
    if (validCoupons[code]) {
        appliedDiscount = validCoupons[code];
        msgEl.textContent = '✓ Coupon applied! You get ' + appliedDiscount + '% off.';
        msgEl.style.color = '#27ae60';
        renderCart(); // total amount ta refresh hbe 
    } else {
        appliedDiscount = 0;
        msgEl.textContent = '✕ Invalid coupon code.';
        msgEl.style.color = '#e74c3c';
        renderCart();
    }
}


document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
});
