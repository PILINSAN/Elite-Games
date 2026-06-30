/* =========================================================
   ELITE GAMES — Autenticación de sesión (simulada)
   ========================================================= */

function egLogin(username, password){
  const users = egGetUsers();
  const found = users.find(u => u.username === username && u.password === password);
  if(!found) return null;
  localStorage.setItem(DB_KEYS.session, JSON.stringify({ username: found.username, role: found.role }));
  return found;
}

function egSession(){
  try{ return JSON.parse(localStorage.getItem(DB_KEYS.session)); }
  catch(e){ return null; }
}

function egLogout(){
  localStorage.removeItem(DB_KEYS.session);
  window.location.href = egRootPath() + 'index.html';
}

/* calcula la ruta relativa hacia la raíz del sitio según la profundidad de carpetas */
function egRootPath(){
  const depth = window.location.pathname.split('/').filter(Boolean);
  // ej: /elite-games/admin/dashboard/index.html -> profundidad de carpetas internas = 2
  const marker = depth.indexOf('elite-games');
  const inner = marker >= 0 ? depth.length - marker - 2 : 0;
  return inner > 0 ? '../'.repeat(inner) : '';
}

/* protege una vista: exige sesión y rol correcto, si no, redirige al login */
function egRequireRole(role){
  const s = egSession();
  if(!s || s.role !== role){
    window.location.href = egRootPath() + 'index.html';
    return null;
  }
  return s;
}

function egUserData(username){
  return egGetUsers().find(u => u.username === username);
}
