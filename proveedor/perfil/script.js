document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('proveedor');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const user = egUserData(session.username);
  const empresaActual = user.empresa || user.nombre;

  document.getElementById('avatar-lg').textContent = empresaActual.charAt(0).toUpperCase();
  document.getElementById('display-name').textContent = empresaActual;
  document.getElementById('empresa').value = empresaActual;
  document.getElementById('nombre').value = user.nombre;
  document.getElementById('email').value = user.email;
  document.getElementById('password').value = user.password;

  document.getElementById('profile-form').addEventListener('submit', e => {
    e.preventDefault();
    const nuevaEmpresa = document.getElementById('empresa').value.trim();

    const users = egGetUsers().map(u => u.username === session.username ? {
      ...u,
      empresa: nuevaEmpresa,
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    } : u);
    egSetUsers(users);

    // mantiene la coherencia: actualiza el nombre de proveedor en sus productos publicados
    if(nuevaEmpresa !== empresaActual){
      const products = egGetProducts().map(p => p.proveedor === empresaActual ? { ...p, proveedor: nuevaEmpresa } : p);
      egSetProducts(products);
    }

    document.getElementById('display-name').textContent = nuevaEmpresa;
    document.getElementById('avatar-lg').textContent = nuevaEmpresa.charAt(0).toUpperCase();
    const note = document.getElementById('save-note');
    note.classList.add('show');
    setTimeout(() => note.classList.remove('show'), 2500);
    egToast('Perfil de empresa actualizado');
  });
});
