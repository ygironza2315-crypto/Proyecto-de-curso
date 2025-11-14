// ------ AGREGAR PRODUCTOS DESDE PRODUCTOS.HTML ------
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({...product, cantidad: 1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Producto agregado al carrito");
}

// Vincular eventos en productos.html
if (document.querySelectorAll('.add-to-cart').length) {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const product = {
        id: btn.dataset.id,
        nombre: btn.dataset.name,
        precio: parseInt(btn.dataset.price, 10),
        img: btn.dataset.img
      };
      addToCart(product);
    });
  });
}

// ------ FUNCIONES DEL CARRITO (carrito.html) -------
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.getElementById('cart-body');
  tbody.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tu carrito está vacío.</td></tr>';
    document.getElementById('checkout').setAttribute('disabled', 'true');
  } else {
    cart.forEach((product, index) => {
      const subtotal = product.precio * product.cantidad;
      total += subtotal;
      tbody.innerHTML += `
        <tr>
          <td><img src="${product.img}" alt="${product.nombre}" styles="height:50px; object-fit:contain;"></td>
          <td>${product.nombre}</td>
          <td>${product.cantidad}</td>
          <td>$${product.precio.toLocaleString()}</td>
          <td>$${subtotal.toLocaleString()}</td>
          <td>
            <button onclick="removeOne(${index})">-1</button>
            <button onclick="removeProduct(${index})">Eliminar</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML += `
      <tr>
        <td colspan="5" style="text-align:right"><strong>Total:</strong></td>
        <td><strong>$${total.toLocaleString()}</strong></td>
      </tr>
    `;
    document.getElementById('checkout').removeAttribute('disabled');
  }
}

// Quitar una unidad
function removeOne(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart[index].cantidad > 1) {
    cart[index].cantidad -= 1;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Eliminar producto por completo
function removeProduct(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Vaciar todo el carrito
function clearCart() {
  localStorage.removeItem('cart');
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCart);
  }
});
