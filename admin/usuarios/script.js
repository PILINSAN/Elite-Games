document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('admin');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const tbody = document.getElementById('users-body');
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('user-form');

  function render(){
    const users = egGetUsers();
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.nombre}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td><span class="role-pill ${u.role}"><i></i>${u.role}</span></td>
        <td>
          <button class="btn btn-ghost btn-sm" data-edit="${u.username}">Editar</button>
          ${u.username !== session.username ? `<button class="btn btn-danger btn-sm" data-del="${u.username}">Eliminar</button>` : ''}
        </td>
      </tr>
    `).join('');
  }

  function openModal(user){
    document.getElementById('modal-title').textContent = user ? 'Editar cuenta' : 'Nueva cuenta';
    document.getElementById('u-original').value = user ? user.username : '';
    document.getElementById('u-nombre').value = user ? user.nombre : '';
    document.getElementById('u-username').value = user ? user.username : '';
    document.getElementById('u-email').value = user ? user.email : '';
    document.getElementById('u-password').value = user ? user.password : '';
    document.getElementById('u-role').value = user ? user.role : 'usuario';
    overlay.style.display = 'flex';
  }
  function closeModal(){ overlay.style.display = 'none'; form.reset(); }

  document.getElementById('btn-new').addEventListener('click', () => openModal(null));
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const original = document.getElementById('u-original').value;
    let users = egGetUsers();
    const data = {
      nombre: document.getElementById('u-nombre').value.trim(),
      username: document.getElementById('u-username').value.trim(),
      email: document.getElementById('u-email').value.trim(),
      password: document.getElementById('u-password').value,
      role: document.getElementById('u-role').value
    };

    if(original){
      users = users.map(u => u.username === original ? { ...u, ...data } : u);
      egToast('Cuenta actualizada');
    } else {
      if(users.some(u => u.username === data.username)){
        alert('Ese nombre de usuario ya existe.');
        return;
      }
      users.push(data);
      egToast('Cuenta creada correctamente');
    }
    egSetUsers(users);
    closeModal();
    render();
  });

  tbody.addEventListener('click', e => {
    const editU = e.target.dataset.edit;
    const delU = e.target.dataset.del;
    if(editU) openModal(egGetUsers().find(u => u.username === editU));
    if(delU){
      if(confirm(`¿Eliminar la cuenta "${delU}"?`)){
        egSetUsers(egGetUsers().filter(u => u.username !== delU));
        egToast('Cuenta eliminada');
        render();
      }
    }
  });

  render();
});
