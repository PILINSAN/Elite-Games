document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('admin');
  if(!session) return;

  const user = egUserData(session.username);
  document.getElementById('admin-name').textContent = user.nombre.split(' ')[0];
  document.getElementById('admin-name-2').textContent = user.nombre;
  document.getElementById('admin-avatar').textContent = user.nombre.charAt(0).toUpperCase();

  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const products = egGetProducts();
  const orders = egGetOrders();
  const users = egGetUsers();

  const totalVentas = orders.reduce((sum,o) => sum + o.total, 0);
  const pendientes = orders.filter(o => o.estado !== 'entregado').length;
  const lowStock = products.filter(p => p.stock <= 8);

  const stats = [
    { icon:'', num: egCurrency(totalVentas), label:'Ventas totales', delta:'+12% vs mes anterior', up:true },
    { icon:'', num: orders.length, label:'Pedidos totales', delta:`${pendientes} en proceso`, up:true },
    { icon:'', num: products.length, label:'Productos activos', delta:`${lowStock.length} con stock bajo`, up:false },
    { icon:'', num: users.length, label:'Cuentas registradas', delta:'3 roles activos', up:true },
  ];

  document.getElementById('stat-cards').innerHTML = stats.map(s => `
    <div class="card stat">
      <div class="icon-box">${s.icon}</div>
      <div class="num">${s.num}</div>
      <div class="label">${s.label}</div>
      <div class="delta ${s.up ? 'up':'down'}">${s.delta}</div>
    </div>
  `).join('');

  document.getElementById('activity-list').innerHTML = orders.slice().reverse().slice(0,5).map(o => `
    <div class="activity-row">
      <div class="dot"></div>
      <div class="txt">Pedido #${o.id} de <b>${o.usuario}</b> — ${o.estado}</div>
      <div class="when">${o.fecha}</div>
    </div>
  `).join('') || '<p class="empty">Aún no hay actividad registrada.</p>';

  document.getElementById('low-stock-list').innerHTML = lowStock.length ? lowStock.map(p => `
    <div class="low-stock-item">
      <span>${p.img} ${p.nombre}</span>
      <span class="badge ${p.stock === 0 ? 'red':'amber'}">${p.stock === 0 ? 'Agotado' : p.stock + ' unidades'}</span>
    </div>
  `).join('') : '<p class="empty">Todo el inventario está en buen nivel 🎉</p>';
});
