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
    col.onclick;

    const card = document.createElement("div");
    card.className = "card product-card";
    // Menambahkan efek hover menggunakan event listener
    card.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.2s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.transition = "transform 0.2s ease";
    });

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

    const p_price = document.createElement("p");
    p_price.className = "card-text";
    p_price.textContent = `Purchase Price: ${product.purchase_price}`;

    const price = document.createElement("p");
    price.className = "card-text";
    price.textContent = `Price: ${product.price}`;

    const stock = document.createElement("p");
    stock.className = "card-text";
    stock.textContent = `Stock: ${product.stock}`;

    const diskon = document.createElement("p");
    diskon.className = "card-text";
    diskon.textContent = `Diskon: ${product.discount}%`;

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
    cardBody.appendChild(p_price);
    cardBody.appendChild(price);
    cardBody.appendChild(stock);
    cardBody.appendChild(diskon);
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
const maxProductsToShow = 9; // Jumlah maksimum produk yang ingin ditampilkan

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

    // Filter produk berdasarkan nama produk, productcode, discount, stock, price, atau purchase_price jika searchTerm tidak kosong
    if (searchTerm !== "") {
      filteredProducts = data.products.filter((product) => {
        return (
          product.product.toLowerCase().includes(searchTerm) ||
          product.productcode.toLowerCase().includes(searchTerm) ||
          product.discount.toString().includes(searchTerm) ||
          product.stock.toString().includes(searchTerm) ||
          product.price.toString().includes(searchTerm) ||
          product.purchase_price.toString().includes(searchTerm)
        );
      });
    } else {
      // Jika searchTerm kosong, ambil sejumlah produk maksimum untuk ditampilkan
      filteredProducts = data.products.slice(0, maxProductsToShow);
    }

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

const addDataBtn = document
  .querySelector("#addDataProduct")
  .addEventListener("click", function () {
    Swal.fire({
      title: "Masukkan informasi Anda",
      html: `
      <style>
        #add-product-form {
          text-align: left;
        }
        #add-product-form .form-group {
          margin-bottom: 15px;
        }
        #add-product-form label {
          display: block;
          margin-bottom: 5px;
        }
        #add-product-form input {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }
      </style>
      <form id="add-product-form" enctype="multipart/form-data">
        <div class="form-group">
          <label for="product">Product Name</label>
          <input
            type="text"
            class="form-control"
            id="product"
            name="product"
            required
          />
        </div>
        <div class="form-group">
          <label for="productcode">Product Code</label>
          <input
            type="text"
            class="form-control"
            id="productcode"
            name="productcode"
            required
          />
        </div>
        <div class="form-group">
          <label for="barcode">Barcode</label>
          <input
            type="text"
            class="form-control"
            id="barcode"
            name="barcode"
            required
          />
        </div>
        <div class="form-group">
          <label for="purchase_price">Purchase Price</label>
          <input
            type="number"
            class="form-control"
            id="purchase_price"
            name="purchase_price"
            required
          />
        </div>
        <div class="form-group">
          <label for="price">Price</label>
          <input
            type="number"
            class="form-control"
            id="price"
            name="price"
            required
          />
        </div>
        <div class="form-group">
          <label for="discount">Discount</label>
          <input
            type="number"
            class="form-control"
            id="discount"
            name="discount"
            value="0"
          />
        </div>
        <div class="form-group">
          <label for="stock">Stock</label>
          <input
            type="number"
            class="form-control"
            id="stock"
            name="stock"
            value="0"
          />
        </div>
        <div class="form-group">
          <label for="file">File (Optional)</label>
          <input
            type="file"
            class="form-control-file"
            id="file"
            name="file"
          />
        </div>
      </form>
    `,
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: () => {
        const form = Swal.getPopup().querySelector("#add-product-form");
        const product = form.product.value;
        const productcode = form.productcode.value;
        const barcode = form.barcode.value;
        const purchase_price = form.purchase_price.value;
        const price = form.price.value;
        const discount = form.discount.value;
        const stock = form.stock.value;
        const file = form.file.files[0];

        if (!product || !productcode || !barcode || !purchase_price || !price) {
          Swal.showValidationMessage("Tolong isi semua field yang diperlukan.");
          return false;
        }
        return {
          product,
          productcode,
          barcode,
          purchase_price,
          price,
          discount,
          stock,
          file,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = result.value;
        // Proses data form di sini
        addNewProduct(formData);
      }
    });
  });

async function addNewProduct(formData) {
  const {
    product,
    productcode,
    barcode,
    purchase_price,
    price,
    discount,
    stock,
    file,
  } = formData;

  try {
    // Ambil jumlah data produk untuk menentukan ID produk baru
    const dataCount = await fetchProductCount();
    const newProductId = dataCount + 1;

    const newProduct = {
      id: newProductId,
      owner_id: 49, // Ganti dengan owner_id yang sesuai
      product,
      productcode,
      barcode,
      category_id: 1, // Ganti dengan category_id yang sesuai
      unit_id: 1, // Ganti dengan unit_id yang sesuai
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

    // Tampilkan modal loading (jika diperlukan)
    // showLoadingModal();

    let timerInterval;
    Swal.fire({
      icon: "info",
      title: "Add New Product",
      html: "Processing..",
      timer: 8000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          title: "Success!",
          text: "New file has been Added.",
          icon: "success",
        }).then(
          setInterval(() => {
            location.reload();
          }, 3000)
        );
      }
    });

    // Kosongkan form setelah submit (jika diperlukan)
    document.getElementById("add-product-form").reset();
  } catch (error) {
    console.error("Error adding new product:", error);
    // Tampilkan pesan error kepada pengguna (jika diperlukan)
    Swal.fire("Error", "Gagal menambahkan produk. Silakan coba lagi.", "error");
  }
}

$("#successModal").on("hidden.bs.modal", function () {
  handleSuccessModalHidden();
});

let currentProduct = null; // Inisialisasi currentProduct dengan null

// Fungsi untuk menampilkan modal update
function showUpdateModal(product) {
  currentProduct = product; // Mengatur currentProduct dengan nilai produk yang ingin diupdate

  Swal.fire({
    title: "Update Product",
    html: `
      <style>
        #update-product-form {
          text-align: left;
        }
        #update-product-form .form-group {
          margin-bottom: 15px;
        }
        #update-product-form label {
          display: block;
          margin-bottom: 5px;
        }
        #update-product-form input {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }
      </style>
      <form id="update-product-form" enctype="multipart/form-data">
        <div class="form-group">
          <label for="update-product">Product Name</label>
          <input
            type="text"
            class="form-control"
            id="update-product"
            name="update-product"
            value="${product.product}"
            required
          />
        </div>
        <div class="form-group">
          <label for="update-productcode">Product Code</label>
          <input
            type="text"
            class="form-control"
            id="update-productcode"
            name="update-productcode"
            value="${product.productcode}"
            required
          />
        </div>
        <div class="form-group">
          <label for="update-barcode">Barcode</label>
          <input
            type="text"
            class="form-control"
            id="update-barcode"
            name="update-barcode"
            value="${product.barcode}"
            required
          />
        </div>
        <div class="form-group">
          <label for="update-purchase_price">Purchase Price</label>
          <input
            type="number"
            class="form-control"
            id="update-purchase_price"
            name="update-purchase_price"
            value="${product.purchase_price}"
            required
          />
        </div>
        <div class="form-group">
          <label for="update-price">Price</label>
          <input
            type="number"
            class="form-control"
            id="update-price"
            name="update-price"
            value="${product.price}"
            required
          />
        </div>
        <div class="form-group">
          <label for="update-discount">Discount</label>
          <input
            type="number"
            class="form-control"
            id="update-discount"
            name="update-discount"
            value="${product.discount}"
          />
        </div>
        <div class="form-group">
          <label for="update-stock">Stock</label>
          <input
            type="number"
            class="form-control"
            id="update-stock"
            name="update-stock"
            value="${product.stock}"
          />
        </div>
      </form>
    `,
    showCancelButton: true,
    confirmButtonText: "Update",
    preConfirm: () => {
      const form = Swal.getPopup().querySelector("#update-product-form");
      const product = form["update-product"].value;
      const productcode = form["update-productcode"].value;
      const barcode = form["update-barcode"].value;
      const purchase_price = form["update-purchase_price"].value;
      const price = form["update-price"].value;
      const discount = form["update-discount"].value;
      const stock = form["update-stock"].value;

      if (!product || !productcode || !purchase_price || !price) {
        Swal.showValidationMessage("Please fill in all required fields.");
        return false;
      }

      return {
        product,
        productcode,
        barcode,
        purchase_price,
        price,
        discount,
        stock,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const formData = result.value;
      updateProduct(formData); // Panggil fungsi updateProduct dengan formData yang diperoleh
    }
  });
}
async function updateProduct(formData) {
  try {
    if (!currentProduct || !currentProduct.product_id) {
      throw new Error("Product data is invalid");
    }

    // Tampilkan modal loading (jika diperlukan)
    // showLoadingModal();

    // URL untuk update produk (ganti dengan URL dan method PUT yang sesuai)
    const updateUrl = `https://newapi.katib.id/data/product/${currentProduct.product_id}`;

    // Mengirim permintaan update ke server
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(formData), // Menggunakan formData yang telah diambil dari form
    });

    // Memeriksa apakah permintaan berhasil
    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    let timerInterval;
    Swal.fire({
      icon: "info",
      title: "Update Product",
      html: "Processing..",
      timer: 8000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          title: "Success!",
          text: "file has been updated.",
          icon: "success",
        }).then(
          setInterval(() => {
            location.reload();
          }, 3000)
        );
      }
    });

    // Fetch ulang produk setelah update berhasil
    fetchProducts();

    // Menutup modal update (jika diperlukan)
    $("#updateModal").modal("hide");
  } catch (error) {
    console.error("Error updating product:", error);
    // Menampilkan pesan error kepada pengguna (jika diperlukan)
    Swal.fire("Error", "Failed to update product. Please try again.", "error");
  }
}

// Fungsi untuk menampilkan modal delete
function showDeleteModal(productId) {
  // Mengatur pesan konfirmasi penghapusan
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteProduct(productId);
    }
  });
}

function showSuccessModalDelete() {
  $("#successModalDelete").modal("show");
}

async function deleteProduct(productId) {
  const deleteUrl = `https://newapi.katib.id/data/product/delete/${productId}`;

  try {
    // Tampilkan modal loading
    // showLoadingModal();

    // Tunggu 4 detik untuk simulasi loading
    // await new Promise((resolve) => setTimeout(resolve, 8000));

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

    let timerInterval;
    Swal.fire({
      icon: "error",
      title: "Deleting Product Data",
      html: "Processing..",
      timer: 8000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        }).then(
          setInterval(() => {
            location.reload();
          }, 3000)
        );
      }
    });

    // Panggil modal keberhasilan
    // showSuccessModalDelete();

    // Sembunyikan modal loading setelah penghapusan berhasil
    // hideLoadingModal();

    // setTimeout(() => {
    // }, 8000);

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
