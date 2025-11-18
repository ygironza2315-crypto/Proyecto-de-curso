const API_URL = 'http://localhost:3000/contactos';

const form = document.getElementById('contact-form');
const list = document.getElementById('contact-list');
const cancelBtn = document.getElementById('cancel-edit');
const contactIdInput = document.getElementById('contact-id');

function fetchContacts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      list.innerHTML = '';
      data.forEach(contact => {
        const li = document.createElement('li');
        li.textContent = `${contact.nombre} - ${contact.email} - ${contact.mensaje}`;

        const editBtn = document.createElement('button');
        editBtn.type = "button";
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => loadContactForEdit(contact);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = "button";
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => deleteContact(contact.id); // Solo alerta

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        list.appendChild(li);
      });
    });
}

function loadContactForEdit(contact) {
  contactIdInput.value = contact.id;
  form.elements['nombre'].value = contact.nombre;
  form.elements['email'].value = contact.email;
  form.elements['mensaje'].value = contact.mensaje;
  cancelBtn.style.display = 'inline';
}

function resetForm() {
  contactIdInput.value = '';
  form.elements['nombre'].value = '';
  form.elements['email'].value = '';
  form.elements['mensaje'].value = '';
  cancelBtn.style.display = 'none';
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const id = contactIdInput.value;
  const nombre = form.nombre.value;
  const email = form.email.value;
  const mensaje = form.mensaje.value;

  const payload = { nombre, email, mensaje };
  let method = 'POST';
  let url = API_URL;

  if (id) {
    method = 'PUT';
    url = `${API_URL}/${id}`;
  }

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  .then(res => res.json())
  .then(() => {
    resetForm();
    if (id) {
      fetchContacts();
    }
  })
  .catch(console.error);
});

cancelBtn.onclick = () => resetForm();

function deleteContact(id) {
  alert('Esta acción está deshabilitada. El contacto no se eliminará.');
  // No hace nada
}

