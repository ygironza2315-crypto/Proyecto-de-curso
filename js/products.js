document.addEventListener('DOMContentLoaded', () => {
  const API_PRODUCTS = 'http://localhost:3000/productos';

  const searchForm = document.getElementById('search-form');
  const productForm = document.getElementById('product-form');
  const productsTbody = document.getElementById('products-tbody');
  const cancelEditBtn = document.getElementById('cancel-edit-product');
  const productIdInput = document.getElementById('product-id');

  let allProducts = [];
  let ocultos = new Set();

  function fetchProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.nombre && filters.nombre.trim() !== '') params.append('nombre', filters.nombre.trim());
    if (filters.descripcion && filters.descripcion.trim() !== '') params.append('descripcion', filters.descripcion.trim());
    if (filters.precio && filters.precio.trim() !== '') params.append('precio', filters.precio.trim());
    const url = params.toString() ? `${API_PRODUCTS}?${params}` : API_PRODUCTS;
    return fetch(url, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        allProducts = data;
        return data;
      });
  }

  function renderProducts(products) {
    productsTbody.innerHTML = '';
    if (products.length === 0) {
      productsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron productos</td></tr>`;
      return;
    }
    products
      .filter(product => !ocultos.has(product.id))
      .forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${product.img ? product.img : 'Images/default.png'}" alt="${product.nombre}" style="height:50px; object-fit:contain;"></td>
          <td>${product.nombre}</td>
          <td>${product.descripcion}</td>
          <td>$${parseFloat(product.precio).toLocaleString()}</td>
          <td>
            <button type="button" class="edit-btn">Editar</button>
            <button type="button" class="delete-btn">Eliminar</button>
            <button type="button" class="add-cart-btn">Agregar al carrito</button>
          </td>
        `;
        tr.querySelector('.edit-btn').onclick = () => loadProductForEdit(product);
        tr.querySelector('.delete-btn').onclick = () => {
          ocultos.add(product.id);
          renderProducts(allProducts);
        };
        // El botón "Agregar al carrito" llama a la función global definida en carrito.js
        tr.querySelector('.add-cart-btn').onclick = () => addToCart(product);
        productsTbody.appendChild(tr);
      });
  }

  document.getElementById('search-btn').onclick = () => {
    const nombre = document.getElementById('search-nombre').value.trim().toLowerCase();
    const descripcion = document.getElementById('search-descripcion').value.trim().toLowerCase();
    const precio = document.getElementById('search-precio').value.trim();

    fetchProducts().then(() => {
      const productoEncontrado = allProducts.find(product => {
        const nombreMatch = nombre && product.nombre.toLowerCase() === nombre;
        const descripcionMatch = descripcion && product.descripcion.toLowerCase() === descripcion;
        const precioMatch = precio && String(product.precio) === precio;
        return nombreMatch || descripcionMatch || precioMatch;
      });
      const resultadosLabel = document.getElementById('resultados-label');
      if (productoEncontrado) {
        if (resultadosLabel) resultadosLabel.style.display = 'block';
        renderProducts([productoEncontrado]);
      } else {
        if (resultadosLabel) resultadosLabel.style.display = 'none';
        renderProducts([]);
      }
    });
  };

  document.getElementById('reset-btn').onclick = () => {
    searchForm.reset();
    document.getElementById('search-nombre').value = '';
    document.getElementById('search-descripcion').value = '';
    document.getElementById('search-precio').value = '';
    ocultos.clear();
    const resultadosLabel = document.getElementById('resultados-label');
    if (resultadosLabel) resultadosLabel.style.display = 'none';
    productsTbody.innerHTML = '';
  };

  function loadProductForEdit(product) {
    productIdInput.value = product.id;
    productForm.nombre.value = product.nombre;
    productForm.descripcion.value = product.descripcion;
    productForm.precio.value = product.precio;
    productForm.img.value = product.img;
    cancelEditBtn.style.display = 'inline';
  }

  function resetProductForm() {
    productIdInput.value = '';
    productForm.nombre.value = '';
    productForm.descripcion.value = '';
    productForm.precio.value = '';
    productForm.img.value = '';
    cancelEditBtn.style.display = 'none';
  }

  productForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = productIdInput.value;
    const nombre = productForm.nombre.value.trim();
    const descripcion = productForm.descripcion.value.trim();
    const precio = productForm.precio.value.trim();
    const img = productForm.img.value.trim();

    if (!img) {
      alert('Debes especificar la ruta de la imagen (por ejemplo: Images/product1.png)');
      return;
    }

    const payload = { nombre, descripcion, precio, img };
    let method = 'POST';
    let url = API_PRODUCTS;

    if (id) {
      method = 'PUT';
      url = `${API_PRODUCTS}/${id}`;
    }

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(() => {
        resetProductForm();
        ocultos.clear();
        fetchProducts().then(products => renderProducts(products));
      })
      .catch(console.error);
  });

  cancelEditBtn.onclick = () => resetProductForm();

  // Estado inicial limpio
  searchForm.reset();
  document.getElementById('search-nombre').value = '';
  document.getElementById('search-descripcion').value = '';
  document.getElementById('search-precio').value = '';
  ocultos.clear();
  const resultadosLabel = document.getElementById('resultados-label');
  if (resultadosLabel) resultadosLabel.style.display = 'none';
  productsTbody.innerHTML = '';
});
