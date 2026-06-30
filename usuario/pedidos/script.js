document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('usuario');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const steps = ['preparando','enviado','entregado'];
  const list = document.getElementById('orders-list');
  const orders = egGetOrders().filter(o => o.usuario === session.username).reverse();

  if(!orders.length){
    list.innerHTML = `<div class="panel"><div class="empty"><div class="eyebrow">Aún no tienes pedidos</div>Visita el catálogo y arma tu primer pedido.</div></div>`;
    return;
  }

  list.innerHTML = orders.map(o => {
    const stepIndex = steps.indexOf(o.estado);
    return `
    <div class="panel order-card">
      <div class="head">
        <div class="id">Pedido #${o.id}</div>
        <span class="badge ${o.estado==='entregado'?'green':(o.estado==='enviado'?'violet':'amber')}">${o.estado}</span>
      </div>
      <div class="items">
        ${o.items.map(it => `<span>${it.cantidad}× ${it.nombre} — ${egCurrency(it.precio * it.cantidad)}</span>`).join('')}
      </div>
      <div class="items"><span><b>Total: ${egCurrency(o.total)}</b> · Pedido el ${o.fecha}</span></div>
      <div class="tracker">
        ${steps.map((s,i) => `<div class="step ${i<=stepIndex?'done':''}"></div>`).join('')}
      </div>
      <div class="tracker-labels"><span>Preparando</span><span>Enviado</span><span>Entregado</span></div>
    </div>
  `;
  }).join('');
});
