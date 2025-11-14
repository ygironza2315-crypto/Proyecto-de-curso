# Tienda de accesorios de PC

Pequeña web de catálogo y carrito de compras que usa HTML, CSS y JavaScript (localStorage). Abre [Index.html](Index.html) en el navegador o sirve la carpeta con un servidor estático (por ejemplo `python -m http.server`) para probar.

## Estructura del proyecto
- [Index.html](Index.html) — Página principal.
- [productos.html](productos.html) — Catálogo de productos (botones "Agregar al carrito").
- [carrito.html](carrito.html) — Vista del carrito con resumen, eliminar y vaciar.
- [contacto.html](contacto.html) — Formulario de contacto (envía a Formspree).
- [css/styles.css](css/styles.css) — Estilos.
- [js/cart.js](js/cart.js) — Lógica del carrito.
- [Images/](Images/) — Imágenes usadas (nota: cuidado con mayúsculas/minúsculas en rutas).

## Cómo funciona el carrito (resumen)
- Al hacer clic en un botón con la clase `add-to-cart` en [productos.html](productos.html) se crea un objeto producto con atributos `data-*` (id, name, price, img) y se llama a la función [`addToCart`](js/cart.js).
- Los productos se guardan en `localStorage` bajo la clave `cart` como un array serializado JSON.
- En [carrito.html](carrito.html) se llama a [`renderCart`](js/cart.js) para leer `localStorage`, renderizar filas en el `<tbody id="cart-body">` y calcular totales.
- Acciones disponibles en el carrito:
  - [`removeOne`](js/cart.js): resta una unidad o elimina el producto si la cantidad llega a 0.
  - [`removeProduct`](js/cart.js): elimina el producto completo.
  - [`clearCart`](js/cart.js): vacía todo el carrito (elimina la clave `cart` de localStorage).

Funciones principales en el código:
- [`addToCart`](js/cart.js)
- [`renderCart`](js/cart.js)
- [`removeOne`](js/cart.js)
- [`removeProduct`](js/cart.js)
- [`clearCart`](js/cart.js)

## Cómo agregar un producto nuevo
1. En [productos.html](productos.html) añade un nuevo bloque `<li>` con la estructura de producto.
2. Incluye un botón con:
   - class="add-to-cart"
   - data-id, data-name, data-price (en centavos o unidad mínima), data-img
   El script en [js/cart.js](js/cart.js) detectará automáticamente botones `.add-to-cart`.

Ejemplo de botón:
```html
<button class="add-to-cart" data-id="p11" data-name="Nuevo producto" data-price="99900" data-img="images/nuevo.jpg">Agregar al carrito</button>
```

## Notas importantes
- Las rutas de imágenes son sensibles al sistema de archivos del servidor (mayúsculas/minúsculas). Asegúrate de que `Images/` o `images/` coincidan con las referencias en HTML.
- El formulario de contacto en [contacto.html](contacto.html) usa Formspree (action: `https://formspree.io/f/mdkyanwa`).
- Para desarrollo local es recomendable usar un servidor estático para evitar problemas con rutas relativas.

Licencia y cambios
- Archivo base: editar `README.md` según necesidades.
- Código JS principal: [js/cart.js](js/cart.js). Cambios en la lógica del carrito deben hacerse ahí.
