document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('usuario');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const grid = document.getElementById('fav-grid');

  function render(){
    const favIds = egGetFav(session.username);
    const products = egGetProducts().filter(p => favIds.includes(p.id));

    if(!products.length){
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1;"><div class="eyebrow">Sin favoritos aún</div>Marca juegos con el corazón desde el catálogo.</div>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="card game-card">
        <div class="thumb"><img src="${p.img}" alt="${p.nombre}" onerror="this.parentElement.innerHTML='🎮'"></div>
        <div class="cat">${p.categoria} · ${p.proveedor}</div>
        <div class="name">${p.nombre}</div>
        <div class="price">${egCurrency(p.precio)}</div>
        <div class="row">
          <button class="btn btn-primary btn-sm" data-add="${p.id}" ${p.stock===0?'disabled':''}>
            ${p.stock===0 ? 'Agotado' : '+ Agregar'}
          </button>
          <button class="fav-btn active" data-remove="${p.id}">❤</button>
        </div>
      </div>
    `).join('');
  }

  grid.addEventListener('click', e => {
    const addId = e.target.dataset.add;
    const removeId = e.target.dataset.remove;
    if(addId){
      const p = egGetProducts().find(p => p.id == addId);
      const cart = egGetCart(session.username);
      const existing = cart.find(c => c.id == addId);
      if(existing) existing.cantidad++;
      else cart.push({ id:p.id, nombre:p.nombre, precio:p.precio, cantidad:1, img:p.img });
      egSetCart(session.username, cart);
      egToast(`${p.nombre} agregado al carrito`);
    }
    if(removeId){
      egSetFav(session.username, egGetFav(session.username).filter(id => id != removeId));
      egToast('Quitado de favoritos');
      render();
    }
  });

  render();
});
