document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('usuario');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const user = egUserData(session.username);
  document.getElementById('avatar-lg').textContent = user.nombre.charAt(0).toUpperCase();
  document.getElementById('display-name').textContent = user.nombre;
  document.getElementById('nombre').value = user.nombre;
  document.getElementById('email').value = user.email;
  document.getElementById('password').value = user.password;

  document.getElementById('profile-form').addEventListener('submit', e => {
    e.preventDefault();
    const users = egGetUsers().map(u => u.username === session.username ? {
      ...u,
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    } : u);
    egSetUsers(users);
    document.getElementById('display-name').textContent = document.getElementById('nombre').value;
    document.getElementById('avatar-lg').textContent = document.getElementById('nombre').value.charAt(0).toUpperCase();
    const note = document.getElementById('save-note');
    note.classList.add('show');
    setTimeout(() => note.classList.remove('show'), 2500);
    egToast('Perfil actualizado');
  });
});
