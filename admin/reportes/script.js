document.addEventListener('DOMContentLoaded', () => {
  if(!egRequireRole('admin')) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const products = egGetProducts();
  const orders = egGetOrders();

  const porCategoria = {};
  orders.forEach(o => o.items.forEach(it => {
    const prod = products.find(p => p.id === it.id);
    const cat = prod ? prod.categoria : 'Otros';
    porCategoria[cat] = (porCategoria[cat]||0) + it.precio * it.cantidad;
  }));
  
  products.forEach(p => { if(!(p.categoria in porCategoria)) porCategoria[p.categoria] = p.precio * (10 - p.stock > 0 ? 10 - p.stock : 1); });

  const max = Math.max(...Object.values(porCategoria));
  document.getElementById('bars').innerHTML = Object.entries(porCategoria).map(([cat, val]) => `
    <div class="bar-col">
      <div class="bar-value">${egCurrency(val)}</div>
      <div class="bar" style="height:${Math.max(8,(val/max)*150)}px"></div>
      <div class="bar-label">${cat}</div>
    </div>
  `).join('');

  const ranked = products.slice().sort((a,b) => a.stock - b.stock).slice(0,5);
  const maxVendido = 30;
  document.getElementById('rank-list').innerHTML = ranked.map((p,i) => {
    const vendidos = Math.max(2, 30 - p.stock);
    return `
    <div class="rank-row">
      <div class="pos">#${i+1}</div>
      <div style="width:120px;">${p.nombre}</div>
      <div class="bar-bg"><div class="bar-fg" style="width:${(vendidos/maxVendido)*100}%"></div></div>
      <div class="val">${vendidos} und.</div>
    </div>
  `;
  }).join('');
});
