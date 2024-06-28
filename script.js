const token = "Bearer DpacnJf3uEQeM7HN";
const apiUrl = "https://newapi.katib.id/app/product/49";
const apiUrlAdd = "https://newapi.katib.id/add/product";

const productsPerPage = 9;
let currentPage = 1;
let totalProducts = 0;

function renderProductCards(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "card product-card";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const icon = document.createElement("div");
    icon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-box-seam-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.01-.003.268-.108a.75.75 0 0 1 .558 0l.269.108.01.003zM10.404 2 4.25 4.461 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339L8 5.961 5.596 5l6.154-2.461z"/>
</svg>

    `;
    icon.classList.add("custom-icon");

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = product.product;

    const productCode = document.createElement("p");
    productCode.className = "card-text";
    productCode.textContent = `Product Code: ${product.productcode}`;

    const barcode = document.createElement("p");
    barcode.className = "card-text";
    barcode.textContent = `Barcode: ${product.barcode}`;

    const price = document.createElement("p");
    price.className = "card-text";
    price.textContent = `Price: ${product.price}`;

    const stock = document.createElement("p");
    stock.className = "card-text";
    stock.textContent = `Stock: ${product.stock}`;

    // Tombol Update
    const updateButton = document.createElement("button");
    updateButton.className = "btn btn-primary mr-2";
    updateButton.textContent = "Update";
    updateButton.onclick = () => showUpdateModal(product);

    // Tombol Delete
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => showDeleteModal(product.product_id); // Panggil deleteProduct dengan id produk saat tombol ditekan

    cardBody.appendChild(icon);
    cardBody.appendChild(title);
    cardBody.appendChild(productCode);
    cardBody.appendChild(barcode);
    cardBody.appendChild(price);
    cardBody.appendChild(stock);
    cardBody.appendChild(updateButton);
    cardBody.appendChild(deleteButton);

    card.appendChild(cardBody);
    col.appendChild(card);
    productList.appendChild(col);
  });
}

async function fetchProducts(page = 1) {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    totalProducts = data.products.length;

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const products = data.products.slice(startIndex, endIndex);

    renderProductCards(products);
    renderPagination();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const prevLi = document.createElement("li");
  prevLi.className = "page-item";
  if (currentPage === 1) {
    prevLi.classList.add("disabled");
  }

  const prevA = document.createElement("a");
  prevA.className = "page-link";
  prevA.href = "#";
  prevA.textContent = "Previous";
  prevA.onclick = function () {
    if (currentPage > 1) {
      currentPage--;
      fetchProducts(currentPage);
    }
  };

  prevLi.appendChild(prevA);
  pagination.appendChild(prevLi);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    if (i === currentPage) {
      li.classList.add("active");
    }

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = i;
    a.onclick = (function (page) {
      return function () {
        currentPage = page;
        fetchProducts(page);
      };
    })(i);

    li.appendChild(a);
    pagination.appendChild(li);
  }

  const nextLi = document.createElement("li");
  nextLi.className = "page-item";
  if (currentPage === totalPages) {
    nextLi.classList.add("disabled");
  }

  const nextA = document.createElement("a");
  nextA.className = "page-link";
  nextA.href = "#";
  nextA.textContent = "Next";
  nextA.onclick = function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchProducts(currentPage);
    }
  };

  nextLi.appendChild(nextA);
  pagination.appendChild(nextLi);
}

function showLoadingModal() {
  document.getElementById("loadingModal").style.display = "block";
}

function hideLoadingModal() {
  document.getElementById("loadingModal").style.display = "none";
}

let filteredProducts = []; // Menyimpan produk yang sudah difilter

async function searchProducts() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Filter produk berdasarkan nama produk
    filteredProducts = data.products.filter((product) =>
      product.product.toLowerCase().includes(searchTerm)
    );

    renderProductCards(filteredProducts);
    renderPagination();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

// Panggil fungsi searchProducts saat halaman dimuat pertama kali
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInput")
    .addEventListener("input", debounce(searchProducts, 300));
});

// Debounce function untuk menunda eksekusi pencarian
function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

async function fetchProductCount() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    totalProducts = data.products.length;
    return totalProducts;
  } catch (error) {
    console.error("Error fetching product count:", error);
    return 0;
  }
}

function showSuccessModal() {
  $("#successModal").modal("show");
}

async function addNewProduct() {
  const product = document.querySelector("#product").value;
  const productcode = document.querySelector("#productcode").value;
  const barcode = document.querySelector("#barcode").value;
  const purchase_price = document.querySelector("#purchase_price").value;
  const price = document.querySelector("#price").value;
  const discount = document.querySelector("#discount").value;
  const stock = document.querySelector("#stock").value;
  const file = document.querySelector("#file").files[0];

  try {
    // Tampilkan modal loading
    showLoadingModal();

    // Tunggu 4 detik untuk simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 8000));

    // Ambil jumlah data produk untuk menentukan ID produk baru
    const dataCount = await fetchProductCount();
    const newProductId = dataCount + 1;

    const newProduct = {
      id: newProductId,
      owner_id: 49,
      product,
      productcode,
      barcode,
      category_id: 1,
      unit_id: 1,
      purchase_price: parseFloat(purchase_price),
      price: parseFloat(price),
      discount: parseFloat(discount),
      stock: parseInt(stock),
      file: file ? file.name : null,
    };

    const response = await fetch(apiUrlAdd, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error("Failed to add new product");
    }

    showLoadingModal();
    // Refresh daftar produk setelah penambahan berhasil
    setTimeout(() => {
      location.reload();
    }, 8000);

    fetchProducts();

    // Menutup modal dan menampilkan modal sukses
    $("#addProductModal").modal("hide");
    showSuccessModal();

    // Kosongkan form setelah submit
    // document.getElementById("add-product-form").reset();
  } catch (error) {
    console.error("Error adding new product:", error);
  }
}

$("#successModal").on("hidden.bs.modal", function () {
  handleSuccessModalHidden();
});

let currentProduct = null;

function showUpdateModal(product) {
  currentProduct = product;
  $("#update-product").val(product.product);
  $("#update-productcode").val(product.productcode);
  $("#update-barcode").val(product.barcode);
  $("#update-purchase_price").val(product.purchase_price);
  $("#update-price").val(product.price);
  $("#update-discount").val(product.discount);
  $("#update-stock").val(product.stock);
  $("#updateModal").modal("show");
}

async function updateProduct() {
  if (!currentProduct) return;

  const updateUrl = `https://newapi.katib.id/data/product/${currentProduct.product_id}`;

  // Retrieve updated data from form fields
  const product = document.querySelector("#update-product").value;
  const productcode = document.querySelector("#update-productcode").value;
  const barcode = document.querySelector("#update-barcode").value;
  const purchase_price = document.querySelector("#update-purchase_price").value;
  const price = document.querySelector("#update-price").value;
  const discount = document.querySelector("#update-discount").value;
  const stock = document.querySelector("#update-stock").value;

  try {
    // Tampilkan modal loading
    showLoadingModal();

    // Tunggu 4 detik untuk simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 6000));

    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        product,
        productcode,
        barcode,
        purchase_price,
        price,
        discount,
        stock,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    // Refresh product list after successful update
    setTimeout(() => {
      location.reload();
    }, 6000);

    fetchProducts();

    // Close modal and show success modal
    $("#updateModal").modal("hide");
    showSuccessModal();
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

// Fungsi untuk menampilkan modal delete
function showDeleteModal(productId) {
  // Mengatur pesan konfirmasi penghapusan
  var deleteMessage = "Are you sure you want to delete this product?";
  document.getElementById("deleteModalBody").textContent = deleteMessage;

  // Menangani klik tombol Delete
  $("#confirmDeleteBtn")
    .off("click")
    .on("click", function () {
      // Panggil fungsi untuk menghapus produk
      deleteProduct(productId);
      // Sembunyikan modal setelah menghapus
      $("#deleteModal").modal("hide");
    });

  // Tampilkan modal delete
  $("#deleteModal").modal("show");
}

function showSuccessModalDelete() {
  $("#successModalDelete").modal("show");
}

async function deleteProduct(productId) {
  const deleteUrl = `https://newapi.katib.id/data/product/delete/${productId}`;

  try {
    // Tampilkan modal loading
    showLoadingModal();

    // Tunggu 4 detik untuk simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 8000));

    const response = await fetch(deleteUrl, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleted: "yes" }), // Mengubah deleted menjadi "yes"
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    // Panggil modal keberhasilan
    showSuccessModalDelete();

    // Sembunyikan modal loading setelah penghapusan berhasil
    hideLoadingModal();

    setTimeout(() => {
      location.reload();
    }, 8000);

    // Refresh daftar produk setelah penghapusan berhasil
    fetchProducts();

    // Reload halaman setelah 4 detik
  } catch (error) {
    console.error("Error deleting product:", error);
    // Sembunyikan modal loading jika terjadi error
    hideLoadingModal();
  }
}

fetchProducts();
