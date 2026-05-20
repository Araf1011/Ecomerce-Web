# Jersey Lagbe ⚽👕

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: JS](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status: Complete](https://img.shields.io/badge/Status-Complete-success)](https://github.com/Araf1011/Ecomerce-Web)

**Jersey Lagbe** is a premium, responsive e-commerce web application dedicated to high-quality sports and esports jerseys in Bangladesh. Built with performance and user experience in mind, it offers a seamless shopping journey from browsing to checkout.

![Jersey Lagbe Banner](Assets/shop_banner.webp)

---

## ✨ Key Features

- **🛒 Advanced Shopping Cart**:
  - Slide-out drawer design for a non-intrusive experience.
  - Real-time price calculations (Subtotal, Tiered Delivery Charges, Total).
  - Dynamic coupon system (e.g., `SUI20`, `SMART10`) with instant feedback.
  - Persistent state using `localStorage`—your items stay even after a refresh.

- **📱 Fully Responsive Design**: 
  - Optimized for mobile, tablet, and desktop viewing.
  - Mobile-first approach for the modern shopper.

- **🛍️ Product Experience**:
  - **Dynamic Grids**: Categorized sections for "Flash Sale" and "New Launch".
  - **Detailed Product Pages**: Featuring high-quality zooms, team info, and custom attributes.
  - **Customization**: Option to add custom Name/IGN (In-Game Name) for a personalized touch.

- **✨ UI/UX Excellence**:
  - Automated hero carousel for featured collections.
  - Interactive customer review slider.
  - Smooth transitions and micro-interactions.
  - Integrated Google Maps for store location.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure & SEO optimization. |
| **CSS3** | Custom styling with Flexbox & Grid (Vanilla CSS). |
| **JavaScript** | Core logic, API/JSON fetching, & state management. |
| **JSON** | Local database for products and reviews. |
| **Font Awesome** | Modern iconography. |
| **Google Fonts** | Premium typography. |

---

## 📂 Project Structure

```text
├── Assets/             # High-quality images and brand assets
├── cart.js             # Cart management, logic & calculations
├── index.html          # Main landing page (Home, Jersey, About, Contact)
├── product.html        # Dynamic product details page
├── product.js          # Logic for fetching & displaying single product details
├── products.json       # Central product database
├── reviews.json        # Customer feedback database
├── script.js           # Main UI logic (Carousels, Navigation, Section toggling)
└── style.css           # Global design system & component styles
```

---

## 🚀 Getting Started

To run this project locally, follow these simple steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Araf1011/Ecomerce-Web.git
   ```
2. **Open the project**:
   Open the folder in your favorite code editor (we recommend [VS Code](https://code.visualstudio.com/)).
3. **Run with a Server**:
   Because the project fetches data from local JSON files, you **must** use a local server to avoid CORS issues.
   - If using VS Code, install the **Live Server** extension.
   - Right-click on `index.html` and select **Open with Live Server**.
4. **Browse**:
   Your default browser will open the site at `http://127.0.0.1:5500`.

---

## 🎫 Promo Codes

Want a discount? Try these during checkout:
- `SUI20` - 20% OFF
- `SEN15` - 15% OFF
- `SMART10` - 10% OFF

---

## 👥 Meet the Creators

This project was built with passion by:

- **Araf** ([@Araf1011](https://github.com/Araf1011)) - Founder & Lead Developer
- **Tasin** - Co-Founder & UI/UX Developer

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

&copy; 2026 **Jersey Lagbe**. All Rights Reserved.
