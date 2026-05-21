// Carousel configuration
let slideIndex = 0;
let autoSlideTimer;

// Page initialization
window.onload = function() {
    showSlide(slideIndex);
    startAutoSlide();
    loadHomeProducts();
    loadReviews();
    let hash = window.location.hash.substring(1);
    if (hash === 'jersey' || hash === 'about' || hash === 'contact') {
        showSection(hash);
    } else {
        showSection('home');
    }
};

// Display active carousel slide
function showSlide(index) {
    let slides = document.querySelectorAll('.carousel-item');
    let dots   = document.querySelectorAll('.dot');
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }
    let carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}

// Move slide forward or backward
function moveSlide(step) {
    slideIndex = slideIndex + step;
    showSlide(slideIndex);
    startAutoSlide();
}

// Go directly to slide index
function goToSlide(index) {
    slideIndex = index;
    showSlide(slideIndex);
    startAutoSlide();
}

// Auto-play carousel slides
function startAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(function() {
        slideIndex = slideIndex + 1;
        showSlide(slideIndex);
    }, 5000);
}

// Navigate between page sections
function showSection(sectionName) {
    let homeSection    = document.getElementById('home');
    let jerseySection  = document.getElementById('jersey');
    let aboutSection   = document.getElementById('about');
    let contactSection = document.getElementById('contact');
    homeSection.style.display    = 'none';
    jerseySection.style.display  = 'none';
    aboutSection.style.display   = 'none';
    contactSection.style.display = 'none';
    if (sectionName === 'home') {
        homeSection.style.display = 'block';
    }
    if (sectionName === 'jersey') {
        jerseySection.style.display = 'block';
        loadProducts();
    }
    if (sectionName === 'about') {
        aboutSection.style.display = 'block';
    }
    if (sectionName === 'contact') {
        contactSection.style.display = 'block';
    }
    window.scrollTo(0,0);
}

// Create HTML for product card
function createProductCard(product) {
    let badgeHTML = '';
    if (product.badge) {
        let badgeClass = product.badge.toLowerCase().replace(' ', '-');
        badgeHTML = '<span class="product-badge badge-' + badgeClass + '">' + product.badge + '</span>';
    }
    if (!product.inStock) {
        badgeHTML = '<span class="product-badge badge-sold">Sold Out</span>';
    }
    let cardClass = 'product-card';
    if (!product.inStock) {
        cardClass = 'product-card out-of-stock';
    }
    return '<a href="product.html?id=' + product.id + '" class="product-link">' +
                '<div class="' + cardClass + '">' +
                    badgeHTML +
                    '<div class="product-image">' +
                        '<img src="' + product.image + '" alt="' + product.name + '">' +
                    '</div>' +
                    '<div class="product-info">' +
                        '<span class="category">' + product.team + '</span>' +
                        '<h3 class="product-title">' + product.name + '</h3>' +
                        '<p class="price">' + product.price.toFixed(2) + '৳</p>' +
                    '</div>' +
                '</div>' +
            '</a>';
}

// Load products for shop grid
function loadProducts() {
    let grid = document.getElementById('shop-grid');
    if (!grid) return;
    grid.innerHTML = '<p style="text-align:center; padding:40px;">Loading products...</p>';
    fetch('products.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(products) {
            grid.innerHTML = '';
            let resultsCount = document.querySelector('.results-count');
            if (resultsCount) {
                resultsCount.textContent = 'Showing ' + products.length + ' results';
            }
            for (let i = 0; i < products.length; i++) {
                grid.innerHTML += createProductCard(products[i]);
            }
        })
        .catch(function(error) {
            grid.innerHTML = '<p style="text-align:center; color:red; padding:40px;">Could not load products. Make sure you are using Live Server!</p>';
            console.log('Error:', error);
        });
}

// Load featured products on home page
function loadHomeProducts() {
    let flashGrid = document.getElementById('flash-sale-grid');
    let newLaunchGrid = document.getElementById('new-launch-grid');
    if (!flashGrid || !newLaunchGrid) return;
    flashGrid.innerHTML = '<p style="text-align:center; padding:20px;">Loading...</p>';
    newLaunchGrid.innerHTML = '<p style="text-align:center; padding:20px;">Loading...</p>';
    fetch('products.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(products) {
            flashGrid.innerHTML = '';
            newLaunchGrid.innerHTML = '';
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                if (product.badge === 'Flash Sale') {
                    flashGrid.innerHTML += createProductCard(product);
                } else if (product.badge === 'New Launch') {
                    newLaunchGrid.innerHTML += createProductCard(product);
                }
            }
        })
        .catch(function(error) {
            console.log('Error loading home products:', error);
        });
}

// Reviews configuration
let reviewIndex = 0;
let reviewTimer;

// Load customer reviews on home page
function loadReviews() {
    let track = document.getElementById('reviews-track');
    let dotsContainer = document.getElementById('reviews-dots');
    if (!track) return; 
    track.innerHTML = '<p style="text-align:center; padding:40px;">Loading reviews...</p>';
    fetch('reviews.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(reviews) {
            track.innerHTML = '';
            dotsContainer.innerHTML = '';
            for (let i = 0; i < reviews.length; i++) {
                let review = reviews[i];
                let stars = '';
                for (let s = 1; s <= 5; s++) {
                    stars += (s <= review.rating) ? '<span class="star filled">&#9733;</span>' : '<span class="star">&#9733;</span>';
                }
                let initial = review.name.charAt(0).toUpperCase();
                let card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML = 
                    '<div class="review-avatar">' + initial + '</div>' +
                    '<div class="review-stars">' + stars + '</div>' +
                    '<p class="review-comment">' + review.comment + '</p>' +
                    '<div class="reviewer-name">' + review.name + '</div>' +
                    '<div class="review-product">' + review.product + '</div>';
                track.appendChild(card);
                let dot = document.createElement('span');
                dot.className = 'review-dot' + (i === 0 ? ' active' : '');
                dot.onclick = (function(idx) { return function() { goToReview(idx); }; })(i);
                dotsContainer.appendChild(dot);
            }
            reviewIndex = 0;
            showReview(reviewIndex);
            startReviewSlide();
        })
        .catch(function(error) {
            track.innerHTML = '<p style="text-align:center; color:red; padding:20px;">Could not load reviews.</p>';
        });
}

// Display active review slide
function showReview(index) {
    let track = document.getElementById('reviews-track');
    let dots = document.querySelectorAll('.review-dot');
    let cards = document.querySelectorAll('.review-card');
    if (!track || cards.length === 0) return;
    if (index >= cards.length) reviewIndex = 0;
    if (index < 0) reviewIndex = cards.length - 1;
    track.style.transform = 'translateX(-' + (reviewIndex * 100) + '%)';
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    if (dots[reviewIndex]) dots[reviewIndex].classList.add('active');
}

// Move reviews slide forward or backward
function moveReview(step) {
    reviewIndex += step;
    showReview(reviewIndex);
    startReviewSlide();
}

// Go directly to review slide index
function goToReview(index) {
    reviewIndex = index;
    showReview(reviewIndex);
    startReviewSlide();
}

// Auto-play review slides
function startReviewSlide() {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(function() {
        reviewIndex++;
        showReview(reviewIndex);
    }, 5000);
}