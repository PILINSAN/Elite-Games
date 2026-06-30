function egLogin(username, password){
  const users = egGetUsers();
  const found = users.find(u => u.username === username && u.password === password);
  if(!found) return null;

  localStorage.setItem(DB_KEYS.session, JSON.stringify({
    username: found.username,
    role: found.role
  }));

  return found;
}

function egSession(){
  try{
    return JSON.parse(localStorage.getItem(DB_KEYS.session));
  }catch(e){
    return null;
  }
}

function egLogout(){
  localStorage.removeItem(DB_KEYS.session);
  window.location.href = "/Elite-Games/index.html";
}

function egRequireRole(role){
  const s = egSession();

  if(!s || s.role !== role){
    window.location.href = "/Elite-Games/index.html";
    return null;
  }

  return s;
}

function egUserData(username){
  return egGetUsers().find(u => u.username === username);
}