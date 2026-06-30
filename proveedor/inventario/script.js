document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('proveedor');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const user = egUserData(session.username);
  const empresa = user.empresa || user.nombre;
  const tbody = document.getElementById('inventory-body');
  const MAX = 40;

  function colorFor(stock){
    if(stock === 0) return 'var(--danger)';
    if(stock <= 8) return 'var(--amber)';
    return 'var(--cyan)';
  }

  function render(){
    const mine = egGetProducts().filter(p => p.proveedor === empresa);
    if(!mine.length){
      tbody.innerHTML = `<tr><td colspan="4"><div class="empty">Aún no tienes productos para gestionar inventario.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = mine.map(p => `
      <tr>
        <td>${p.nombre}</td>
        <td><div class="stock-meter"><i style="width:${Math.min(100,(p.stock/MAX)*100)}%; background:${colorFor(p.stock)}"></i></div></td>
        <td>${p.stock} und.</td>
        <td>
          <div class="stock-control">
            <button data-dec="${p.id}">−</button>
            <button data-inc="${p.id}">+</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  tbody.addEventListener('click', e => {
    const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
    if(!inc && !dec) return;
    const products = egGetProducts().map(p => {
      if(p.id == (inc||dec) && p.proveedor === empresa){
        const stock = Math.max(0, p.stock + (inc ? 1 : -1));
        return { ...p, stock, estado: stock > 0 ? 'activo' : 'agotado' };
      }
      return p;
    });
    egSetProducts(products);
    render();
  });

  render();
});