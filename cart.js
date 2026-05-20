// Coupon codes
let validCoupons = {
    'SMART10': 10,
    'NAZIM10': 10,
    'SUI20': 20,
    'SEN15': 15
};

let appliedDiscount = 0;

// Open and close cart drawer
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
        return JSON.parse(data);
    }
    return []; //If nothing saved yet, return empty array []
}
function saveCart(cart) {
    localStorage.setItem('jerseyCart', JSON.stringify(cart));
}

// Add item to cart
function addItemToCart(newItem) {
    let cart = getCart();
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (
            cart[i].id === newItem.id &&
            cart[i].size === newItem.size &&
            cart[i].sleeve === newItem.sleeve
        ) {
            cart[i].quantity = cart[i].quantity + newItem.quantity;
            found = true;
            break;
        }
    }
    if (!found) {
        cart.push(newItem);
    }
    saveCart(cart);
    updateCartCount();
}

// Remove item from cart
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    updateCartCount();
}

// Change cart item quantity
function changeCartQty(index, amount) {
    let cart = getCart();
    cart[index].quantity = cart[index].quantity + amount;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    let cart = getCart();
    let totalQty = 0;
    for (let i = 0; i < cart.length; i++) {
        totalQty = totalQty + cart[i].quantity;
    }
    let badges = document.querySelectorAll('.cart-count');
    for (let i = 0; i < badges.length; i++) {
        badges[i].textContent = totalQty;
    }
    updateCartPriceDisplay();
}

// Update cart price display
function updateCartPriceDisplay() {
    let cart = getCart();
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total = total + (cart[i].price * cart[i].quantity);
    }
    let finalTotal = total - (total * appliedDiscount / 100);
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

// Render cart drawer contents
function renderCart() {
    let cart = getCart();
    let itemsBox = document.getElementById('cart-items');
    let subtotalEl = document.getElementById('cart-subtotal');
    let totalEl = document.getElementById('cart-total');
    let discountRow = document.getElementById('cart-discount-row');
    let discountEl = document.getElementById('cart-discount-amount');
    let emptyMsg = document.getElementById('cart-empty-msg');
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
    emptyMsg.style.display = 'none';
    itemsBox.innerHTML = '';
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemTotal = item.price * item.quantity;
        subtotal = subtotal + itemTotal;
        let row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML =
            '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
            '<div class="cart-item-details">' +
            '<p class="cart-item-name">' + item.name + '</p>' +
            '<p class="cart-item-meta">' + item.size + ' · ' + item.sleeve + '</p>' +
            '<p class="cart-item-price">' + item.price + '৳</p>' +
            '</div>' +
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
    subtotalEl.textContent = subtotal.toFixed(2) + '৳';
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
    let finalTotal = subtotal;
    if (appliedDiscount > 0) {
        let discountAmount = subtotal * appliedDiscount / 100;
        finalTotal = subtotal - discountAmount;
        discountRow.style.display = 'flex';
        discountEl.textContent = '−' + discountAmount.toFixed(2) + '৳';
    } else {
        discountRow.style.display = 'none';
    }
    finalTotal = finalTotal + deliveryCharge;
    if (totalEl) {
        totalEl.textContent = finalTotal.toFixed(2) + '৳';
    }
}

// Apply coupon code
function applyCoupon() {
    let input = document.getElementById('coupon-input');
    let msgEl = document.getElementById('coupon-msg');
    let code = input.value.trim().toUpperCase();
    if (code === '') {
        msgEl.textContent = 'Please enter a coupon code.';
        msgEl.style.color = '#e74c3c';
        return;
    }
    if (validCoupons[code]) {
        appliedDiscount = validCoupons[code];
        msgEl.textContent = '✓ Coupon applied! You get ' + appliedDiscount + '% off.';
        msgEl.style.color = '#27ae60';
        renderCart();
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