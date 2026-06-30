document.addEventListener('DOMContentLoaded', () => {
  if(!egRequireRole('admin')) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const tbody = document.getElementById('orders-body');
  const filters = document.getElementById('filters');
  let currentFilter = '';

  function render(){
    const orders = egGetOrders().filter(o => !currentFilter || o.estado === currentFilter);
    if(!orders.length){
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty">No hay pedidos con este estado.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = orders.slice().reverse().map(o => `
      <tr>
        <td>#${o.id}</td>
        <td>${o.usuario}</td>
        <td>${o.proveedor||'—'}</td>
        <td>${o.fecha}</td>
        <td>${egCurrency(o.total)}</td>
        <td>
          <select class="estado-select" data-id="${o.id}">
            <option value="preparando" ${o.estado==='preparando'?'selected':''}>Preparando</option>
            <option value="enviado" ${o.estado==='enviado'?'selected':''}>Enviado</option>
            <option value="entregado" ${o.estado==='entregado'?'selected':''}>Entregado</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  filters.addEventListener('click', e => {
    if(e.target.tagName !== 'BUTTON') return;
    filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.f;
    render();
  });

  tbody.addEventListener('change', e => {
    if(!e.target.classList.contains('estado-select')) return;
    const id = Number(e.target.dataset.id);
    const orders = egGetOrders().map(o => o.id === id ? { ...o, estado: e.target.value } : o);
    egSetOrders(orders);
    egToast(`Pedido #${id} actualizado a "${e.target.value}"`);
  });

  render();
});
