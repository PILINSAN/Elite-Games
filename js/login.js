document.addEventListener('DOMContentLoaded', () => {

  // si ya hay sesión activa, redirige directo a su panel
  const s = egSession();
  if(s){ goToRole(s.role); return; }

  const form = document.getElementById('login-form');
  const errorBox = document.getElementById('login-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const user = egLogin(username, password);
    if(!user){
      errorBox.textContent = 'Usuario o contraseña incorrectos.';
      errorBox.classList.add('show');
      return;
    }
    errorBox.classList.remove('show');
    goToRole(user.role);
  });

  document.querySelectorAll('[data-fill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [u,p] = btn.dataset.fill.split(':');
      document.getElementById('username').value = u;
      document.getElementById('password').value = p;
    });
  });

  function goToRole(role){
    const routes = {
      admin: 'admin/dashboard/index.html',
      usuario: 'usuario/catalogo/index.html',
      proveedor: 'proveedor/dashboard/index.html'
    };
    window.location.href = routes[role];
  }
});
