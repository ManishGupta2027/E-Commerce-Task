const apiURL = "https://interveiw-mock-api.vercel.app/api/getProducts";
const loadBtn = document.getElementById("loadBtn");
const sortSelect = document.getElementById("sortSelect");
const productList = document.getElementById("productList");
const infoMessage = document.getElementById("infoMessage");

let products = [];
const cart = []; // store added items

// Helper to get price safely
function getProductPrice(product) {
  return product.variants?.[0]?.price || "0.00";
}

// Helper to get image safely
function getProductImage(product) {
  if (product.images && product.images.length > 0) {
    return product.images[0].src;
  }
  // fallback image
  return `https://source.unsplash.com/400x300/?snowboard&sig=${product.id}`;
}

// Create product card with animation
function createProductCard(productWrapper, index) {
  const product = productWrapper.product;

  const title = product.title || "No Title";
  const description = product.tags || "No description available";
  const price = getProductPrice(product);
  const imageURL = getProductImage(product);

  const card = document.createElement("div");
  card.className = "card";

  setTimeout(() => card.classList.add("visible"), index * 100);

  card.innerHTML = `
    <img src="${imageURL}" alt="${title}" />
    <div class="card-content">
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="price">₹${parseFloat(price).toFixed(2)}</div>
    </div>
    <button class="add-to-cart">Add to Cart</button>
  `;

  card.querySelector(".add-to-cart").addEventListener("click", () => {
    cart.push({
      id: product.id,
      title,
      price: parseFloat(price),
      image: imageURL,
    });
    alert(`✅ "${title}" added to cart (${cart.length} items).`);
  });

  return card;
}

// Render all products
function renderProducts(data) {
  productList.innerHTML = "";
  data.forEach((product, index) => {
    const card = createProductCard(product, index);
    productList.appendChild(card);
  });
}

// Load products on button click
loadBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    products = data.data || [];
    renderProducts(products);

    // ✅ Hide the info message after loading
    if (infoMessage) infoMessage.style.display = "none";
  } catch (error) {
    console.error("Failed to fetch products", error);
    alert("⚠️ Failed to load products. Please try again later.");
  }
});

// Sort by price
sortSelect.addEventListener("change", () => {
  const sortBy = sortSelect.value;
  if (!sortBy) return;

  const sorted = [...products].sort((a, b) => {
    const priceA = parseFloat(a.product?.variants?.[0]?.price || "0");
    const priceB = parseFloat(b.product?.variants?.[0]?.price || "0");
    return sortBy === "asc" ? priceA - priceB : priceB - priceA;
  });

  renderProducts(sorted);
});
