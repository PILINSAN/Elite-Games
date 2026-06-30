document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('proveedor');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const user = egUserData(session.username);
  const empresa = user.empresa || user.nombre;
  const tbody = document.getElementById('orders-body');
  const filters = document.getElementById('filters');
  const steps = ['preparando','enviado','entregado'];
  let currentFilter = '';

  function misItems(order){
    return order.items.filter(it => egGetProducts().some(p => p.id === it.id && p.proveedor === empresa));
  }

  function render(){
    const orders = egGetOrders()
      .filter(o => misItems(o).length > 0)
      .filter(o => !currentFilter || o.estado === currentFilter);

    if(!orders.length){
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty">No hay pedidos con este filtro.</div></td></tr>`;
      return;
    }

    tbody.innerHTML = orders.slice().reverse().map(o => {
      const mine = misItems(o);
      const nextStep = steps[Math.min(steps.length-1, steps.indexOf(o.estado)+1)];
      const isFinal = o.estado === 'entregado';
      return `
      <tr>
        <td>#${o.id}</td>
        <td>${o.usuario}</td>
        <td>${mine.map(it => `${it.cantidad}× ${it.nombre}`).join(', ')}</td>
        <td>${o.fecha}</td>
        <td>
          <span class="badge ${o.estado==='entregado'?'green':(o.estado==='enviado'?'violet':'amber')}">${o.estado}</span>
          ${!isFinal ? `<button class="btn btn-ghost btn-sm" data-advance="${o.id}" style="margin-left:8px;">Marcar "${nextStep}"</button>` : ''}
        </td>
      </tr>
    `;
    }).join('');
  }

  filters.addEventListener('click', e => {
    if(e.target.tagName !== 'BUTTON') return;
    filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.f;
    render();
  });

  tbody.addEventListener('click', e => {
    const id = e.target.dataset.advance;
    if(!id) return;
    const orders = egGetOrders().map(o => {
      if(o.id == id){
        const next = steps[Math.min(steps.length-1, steps.indexOf(o.estado)+1)];
        return { ...o, estado: next };
      }
      return o;
    });
    egSetOrders(orders);
    egToast(`Pedido #${id} actualizado`);
    render();
  });

  render();
});
