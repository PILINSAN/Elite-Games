document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('usuario');
  if(!session) return;
  const user = egUserData(session.username);
  document.getElementById('name').textContent = user.nombre.split(' ')[0];
  document.getElementById('avatar').textContent = user.nombre.charAt(0).toUpperCase();
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const grid = document.getElementById('catalogo-grid');
  const search = document.getElementById('search');
  const filterCat = document.getElementById('filter-cat');

  const products = egGetProducts();
  const categorias = [...new Set(products.map(p => p.categoria))];
  filterCat.innerHTML = `<option value="">Todas las categorías</option>` + categorias.map(c => `<option value="${c}">${c}</option>`).join('');

  function favs(){ return egGetFav(session.username); }

  function render(){
    const term = search.value.toLowerCase();
    const cat = filterCat.value;
    const list = products.filter(p =>
      p.nombre.toLowerCase().includes(term) && (!cat || p.categoria === cat)
    );

    if(!list.length){
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1;"><div class="eyebrow">Sin resultados</div>Prueba con otra búsqueda o categoría.</div>`;
      return;
    }

    const favList = favs();
    grid.innerHTML = list.map(p => `
      <div class="card game-card">
        <div class="thumb"><img src="${p.img}" alt="${p.nombre}" onerror="this.parentElement.innerHTML=''"></div>
        <div class="cat">${p.categoria} · ${p.proveedor}</div>
        <div class="name">${p.nombre}</div>
        <div class="price">${egCurrency(p.precio)}</div>
        <div class="row">
          <button class="btn btn-primary btn-sm" data-add="${p.id}" ${p.stock===0?'disabled':''}>
            ${p.stock===0 ? 'Agotado' : '+ Agregar'}
          </button>
          <button class="fav-btn ${favList.includes(p.id)?'active':''}" data-fav="${p.id}"></button>
        </div>
      </div>
    `).join('');
  }

  grid.addEventListener('click', e => {
    const addId = e.target.dataset.add;
    const favId = e.target.dataset.fav;
    if(addId){
      const p = products.find(p => p.id == addId);
      const cart = egGetCart(session.username);
      const existing = cart.find(c => c.id == addId);
      if(existing) existing.cantidad++;
      else cart.push({ id:p.id, nombre:p.nombre, precio:p.precio, cantidad:1, img:p.img });
      egSetCart(session.username, cart);
      egToast(`${p.nombre} agregado al carrito`);
    }
    if(favId){
      let list = favs();
      if(list.includes(Number(favId))){
        list = list.filter(id => id !== Number(favId));
        egToast('Quitado de favoritos');
      } else {
        list.push(Number(favId));
        egToast('Agregado a favoritos');
      }
      egSetFav(session.username, list);
      render();
    }
  });

  search.addEventListener('input', render);
  filterCat.addEventListener('change', render);
  render();
});
