document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('proveedor');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const user = egUserData(session.username);
  const empresa = user.empresa || user.nombre;

  const tbody = document.getElementById('products-body');
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('product-form');

  function render(){
    const mine = egGetProducts().filter(p => p.proveedor === empresa);
    if(!mine.length){
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty"><div class="eyebrow">Sin productos</div>Publica tu primer juego en Elite Games.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = mine.map(p => `
      <tr>
        <td><span class="product-emoji">${p.img||''}</span>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${egCurrency(p.precio)}</td>
        <td>${p.stock}</td>
        <td><span class="badge ${p.estado==='activo'?'green':'red'}">${p.estado}</span></td>
        <td>
          <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Editar</button>
          <button class="btn btn-danger btn-sm" data-del="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function openModal(p){
    document.getElementById('modal-title').textContent = p ? 'Editar producto' : 'Publicar producto';
    document.getElementById('p-id').value = p ? p.id : '';
    document.getElementById('p-nombre').value = p ? p.nombre : '';
    document.getElementById('p-categoria').value = p ? p.categoria : '';
    document.getElementById('p-precio').value = p ? p.precio : '';
    document.getElementById('p-stock').value = p ? p.stock : '';
    overlay.classList.add('show');
  }
  function closeModal(){ overlay.classList.remove('show'); form.reset(); }

  document.getElementById('btn-new').addEventListener('click', () => openModal(null));
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('p-id').value;
    const products = egGetProducts();
    const stock = Number(document.getElementById('p-stock').value);
    const data = {
      nombre: document.getElementById('p-nombre').value.trim(),
      categoria: document.getElementById('p-categoria').value.trim(),
      precio: Number(document.getElementById('p-precio').value),
      stock,
      proveedor: empresa,
      estado: stock > 0 ? 'activo' : 'agotado',
      img: ''
    };
    if(id){
      const idx = products.findIndex(p => p.id == id && p.proveedor === empresa);
      if(idx === -1) return;
      products[idx] = { ...products[idx], ...data };
      egToast('Producto actualizado');
    } else {
      const newId = products.length ? Math.max(...products.map(p=>p.id)) + 1 : 1;
      products.push({ id:newId, ...data });
      egToast('Producto publicado en Elite Games');
    }
    egSetProducts(products);
    closeModal();
    render();
  });

  tbody.addEventListener('click', e => {
    const editId = e.target.dataset.edit, delId = e.target.dataset.del;
    if(editId) openModal(egGetProducts().find(p => p.id == editId));
    if(delId){
      if(confirm('¿Eliminar este producto de tu catálogo?')){
        egSetProducts(egGetProducts().filter(p => !(p.id == delId && p.proveedor === empresa)));
        egToast('Producto eliminado');
        render();
      }
    }
  });

  render();
});
