function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.getElementById('cart-body');
  let total = 0;
  tbody.innerHTML = '';
  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tu carrito está vacío.</td></tr>';
    document.getElementById('checkout').setAttribute('disabled', 'true');
    document.getElementById('cart-total').textContent = "$0";
  } else {
    cart.forEach((product, index) => {
      const cantidad = typeof product.cantidad === 'number' && product.cantidad > 0 ? product.cantidad : 1;
      const precio = Number(product.precio) || 0;
      const subtotal = cantidad * precio;
      total += subtotal;
      tbody.innerHTML += `
        <tr>
          <td><img src="${product.img}" alt="${product.nombre}" style="height:50px; object-fit:contain;"></td>
          <td>${product.nombre}</td>
          <td>${cantidad}</td>
          <td>$${precio.toLocaleString()}</td>
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
    document.getElementById('cart-total').textContent = `$${total.toLocaleString()}`;
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex(item => item.id === product.id);
  const precioNum = Number(product.precio);
  if (existingIndex >= 0) {
    cart[existingIndex].cantidad = (cart[existingIndex].cantidad || 1) + 1;
  } else {
    cart.push({ ...product, cantidad: 1, precio: precioNum });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Producto "${product.nombre}" agregado al carrito.`);
  renderCart();
}

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

function removeProduct(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function clearCart() {
  localStorage.removeItem('cart');
  renderCart();
}

function setupCartEventListeners() {
  document.getElementById('clear-cart')?.addEventListener('click', clearCart);
  document.getElementById('checkout')?.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Añade productos antes de pagar.');
      return;
    }
    const total = cart.reduce((sum, p) => {
      const precio = Number(p.precio) || 0;
      const cantidad = p.cantidad || 1;
      return sum + precio * cantidad;
    }, 0);
    if (confirm(`El total a pagar es $${total.toLocaleString()}. ¿Deseas confirmar la compra?`)) {
      alert('¡Pago realizado con éxito! Gracias por tu compra.');
      localStorage.removeItem('cart');
      renderCart();
    }
  });
}

// Hacer funciones disponibles globalmente para onclick en botones
window.renderCart = renderCart;
window.addToCart = addToCart;
window.removeOne = removeOne;
window.removeProduct = removeProduct;
window.clearCart = clearCart;
window.setupCartEventListeners = setupCartEventListeners;

document.addEventListener('DOMContentLoaded', () => {
  setupCartEventListeners();
  renderCart();
});

