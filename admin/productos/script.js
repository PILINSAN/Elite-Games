document.addEventListener('DOMContentLoaded', () => {
  if(!egRequireRole('admin')) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const tbody = document.getElementById('products-body');
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('product-form');
  const search = document.getElementById('search');
  const filterEstado = document.getElementById('filter-estado');

  function render(){
    const term = search.value.toLowerCase();
    const estado = filterEstado.value;
    const products = egGetProducts().filter(p =>
      (p.nombre.toLowerCase().includes(term) || p.categoria.toLowerCase().includes(term)) &&
      (!estado || p.estado === estado)
    );

    if(!products.length){
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><div class="eyebrow">Sin resultados</div>No encontramos productos con ese filtro.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><span class="product-emoji">${p.img||'🎮'}</span>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${p.proveedor}</td>
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

  function openModal(product){
    document.getElementById('modal-title').textContent = product ? 'Editar producto' : 'Nuevo producto';
    document.getElementById('p-id').value = product ? product.id : '';
    document.getElementById('p-nombre').value = product ? product.nombre : '';
    document.getElementById('p-categoria').value = product ? product.categoria : '';
    document.getElementById('p-precio').value = product ? product.precio : '';
    document.getElementById('p-stock').value = product ? product.stock : '';
    document.getElementById('p-proveedor').value = product ? product.proveedor : '';
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
      proveedor: document.getElementById('p-proveedor').value.trim(),
      estado: stock > 0 ? 'activo' : 'agotado',
      img: '🎮'
    };

    if(id){
      const idx = products.findIndex(p => p.id == id);
      products[idx] = { ...products[idx], ...data };
      egToast('Producto actualizado correctamente');
    } else {
      const newId = products.length ? Math.max(...products.map(p=>p.id)) + 1 : 1;
      products.push({ id:newId, ...data });
      egToast('Producto creado correctamente');
    }
    egSetProducts(products);
    closeModal();
    render();
  });

  tbody.addEventListener('click', e => {
    const editId = e.target.dataset.edit;
    const delId = e.target.dataset.del;
    if(editId){
      const p = egGetProducts().find(p => p.id == editId);
      openModal(p);
    }
    if(delId){
      if(confirm('¿Eliminar este producto del catálogo?')){
        egSetProducts(egGetProducts().filter(p => p.id != delId));
        egToast('Producto eliminado');
        render();
      }
    }
  });

  search.addEventListener('input', render);
  filterEstado.addEventListener('change', render);
  render();
});
