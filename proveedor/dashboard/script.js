document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('proveedor');
  if(!session) return;
  const user = egUserData(session.username);
  const empresa = user.empresa || user.nombre;

  document.getElementById('empresa-name').textContent = empresa;
  document.getElementById('name2').textContent = empresa;
  document.getElementById('avatar').textContent = empresa.charAt(0).toUpperCase();
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const misProductos = egGetProducts().filter(p => p.proveedor === empresa);
  const misPedidos = egGetOrders().filter(o => o.items.some(it => misProductos.some(p => p.id === it.id)));

  const totalVentas = misPedidos.reduce((s,o) => s + o.items.filter(it => misProductos.some(p=>p.id===it.id)).reduce((a,it)=>a+it.precio*it.cantidad,0), 0);
  const lowStock = misProductos.filter(p => p.stock <= 8);

  const stats = [
    { icon:'', num: misProductos.length, label:'Productos publicados' },
    { icon:'', num: egCurrency(totalVentas), label:'Ventas generadas' },
    { icon:'', num: misPedidos.length, label:'Pedidos con tus juegos' },
    { icon:'', num: lowStock.length, label:'Productos con stock bajo' },
  ];

  document.getElementById('stat-cards').innerHTML = stats.map(s => `
    <div class="card stat">
      <div class="icon-box">${s.icon}</div>
      <div class="num">${s.num}</div>
      <div class="label">${s.label}</div>
    </div>
  `).join('');

  document.getElementById('activity-list').innerHTML = misPedidos.length ? misPedidos.slice().reverse().slice(0,6).map(o => `
    <div class="activity-row">
      <div class="dot"></div>
      <div class="txt">Pedido #${o.id} — cliente ${o.usuario} — estado: ${o.estado}</div>
      <div class="when">${o.fecha}</div>
    </div>
  `).join('') : '<p class="empty">Aún no tienes pedidos con tus productos.</p>';
});
