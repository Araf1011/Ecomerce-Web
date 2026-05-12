// CAROUSEL (Image Slider)

let slideIndex = 0;

let autoSlideTimer;

function showSlide(index) {

    // Get all the slides and dots from the HTML
    let slides = document.querySelectorAll('.carousel-item');
    let dots   = document.querySelectorAll('.dot');

    // If we go past the last slide, go back to slide 0 (first)
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }

    // If we go before the first slide, jump to the last slide
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    // Move the slider left or right using CSS
    let carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';

    // Remove "active" from all dots first
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    // Then add "active" to the current dot
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add('active');
    }
}

// This runs when user clicks the NEXT or PREV button
// step = +1 means go forward, step = -1 means go backward
function moveSlide(step) {
    slideIndex = slideIndex + step;
    showSlide(slideIndex);
    startAutoSlide(); // restart the timer so it doesn't jump too fast
}

// This runs when user clicks a dot
function goToSlide(index) {
    slideIndex = index;
    showSlide(slideIndex);
    startAutoSlide(); // restart the timer
}

// This automatically moves to the next slide every 5 seconds
function startAutoSlide() {
    // Stop any existing timer first
    clearInterval(autoSlideTimer);

    // Start a new timer: every 5000ms (5 seconds), go to next slide
    autoSlideTimer = setInterval(function() {
        slideIndex = slideIndex + 1;
        showSlide(slideIndex);
    }, 5000);
}



// SECTION SWITCHING (Home / Jersey / About / Contact)

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
        loadProducts(); // fetch products from products.json
    }

    if (sectionName === 'about') {
        aboutSection.style.display = 'block';
    }

    if (sectionName === 'contact') {
        contactSection.style.display = 'block';
    }

    window.scrollTo(0,0);
}


// LOAD PRODUCTS FROM products.json


function createProductCard(product) {
    let badgeHTML = '';
    if (product.badge) {
        // Convert "Flash Sale" to "flash-sale" for the class name
        let badgeClass = product.badge.toLowerCase().replace(' ', '-');
        badgeHTML = '<span class="product-badge badge-' + badgeClass + '">' + product.badge + '</span>';
    }
    if (!product.inStock) {
        badgeHTML = '<span class="product-badge badge-sold">Sold Out</span>';
    }

    // Add out-of-stock class if not in stock
    let cardClass = 'product-card';
    if (!product.inStock) {
        cardClass = 'product-card out-of-stock';
    }

    // Clicking the card opens product.html with the product's id in the URL
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

// This function reads products.json and builds the product cards for the shop page
function loadProducts() {

    // Step 1: Find the product grid container in the HTML
    let grid = document.getElementById('shop-grid');
    if (!grid) return;

    // Step 2: Show a "Loading..." message while we wait
    grid.innerHTML = '<p style="text-align:center; padding:40px;">Loading products...</p>';

    // Step 3: Fetch (read) the products.json file
    fetch('products.json')

        // Step 4: When the file arrives, convert it to a JavaScript list
        .then(function(response) {
            return response.json();
        })

        // Step 5: Now we have the product list — build the cards!
        .then(function(products) {

            // Clear the "Loading..." text
            grid.innerHTML = '';

            // Update the results count text
            let resultsCount = document.querySelector('.results-count');
            if (resultsCount) {
                resultsCount.textContent = 'Showing ' + products.length + ' results';
            }

            // Loop through every product and create an HTML card for it
            for (let i = 0; i < products.length; i++) {
                grid.innerHTML += createProductCard(products[i]);
            }
        })

        // Step 6: If something goes wrong, show an error message
        .catch(function(error) {
            grid.innerHTML = '<p style="text-align:center; color:red; padding:40px;">Could not load products. Make sure you are using Live Server!</p>';
            console.log('Error:', error);
        });
}

// This function loads products for the Home page sections (Flash Sale, New Launch)
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


//  REVIEWS CAROUSEL

let reviewIndex = 0;
let reviewTimer;

function loadReviews() {
    let track = document.getElementById('reviews-track');
    let dotsContainer = document.getElementById('reviews-dots');

    if (!track) return; // Not on home page?

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

function moveReview(step) {
    reviewIndex += step;
    showReview(reviewIndex);
    startReviewSlide();
}

function goToReview(index) {
    reviewIndex = index;
    showReview(reviewIndex);
    startReviewSlide();
}

function startReviewSlide() {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(function() {
        reviewIndex++;
        showReview(reviewIndex);
    }, 5000);
}


//  START EVERYTHING WHEN PAGE LOADS

window.onload = function() {
    showSlide(slideIndex); // show the first image carousel slide
    startAutoSlide();      // start the image carousel auto-slide timer
    loadHomeProducts();    // Load Flash Sale and New Launch sections
    loadReviews();         // Load customer reviews on home page

    // Check if there is a hash in the URL (like #jersey) and show that section
    let hash = window.location.hash.substring(1); // remove the #
    if (hash === 'jersey' || hash === 'about' || hash === 'contact') {
        showSection(hash);
    } else {
        showSection('home');
    }
};
