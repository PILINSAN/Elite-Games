document.addEventListener('DOMContentLoaded', () => {
  const session = egRequireRole('usuario');
  if(!session) return;
  document.getElementById('btn-logout').addEventListener('click', egLogout);

  const cartList = document.getElementById('cart-list');

  function render(){
    const cart = egGetCart(session.username);
    if(!cart.length){
      cartList.innerHTML = `<div class="empty"><div class="eyebrow">Carrito vacío</div>Agrega juegos desde el catálogo para verlos aquí.</div>`;
    } else {
      cartList.innerHTML = cart.map(c => `
        <div class="cart-row">
          <div class="thumb">${c.img||''}</div>
          <div class="info">
            <div class="n">${c.nombre}</div>
            <div class="p">${egCurrency(c.precio)} c/u</div>
          </div>
          <div class="qty-control">
            <button data-dec="${c.id}">−</button>
            <span>${c.cantidad}</span>
            <button data-inc="${c.id}">+</button>
          </div>
          <button class="btn btn-danger btn-sm" data-del="${c.id}">Quitar</button>
        </div>
      `).join('');
    }

    const subtotal = cart.reduce((s,c) => s + c.precio * c.cantidad, 0);
    const envio = subtotal > 0 ? 9900 : 0;
    document.getElementById('sum-subtotal').textContent = egCurrency(subtotal);
    document.getElementById('sum-envio').textContent = egCurrency(envio);
    document.getElementById('sum-total').textContent = egCurrency(subtotal + envio);
    document.getElementById('btn-checkout').disabled = cart.length === 0;
  }

  cartList.addEventListener('click', e => {
    const inc = e.target.dataset.inc, dec = e.target.dataset.dec, del = e.target.dataset.del;
    let cart = egGetCart(session.username);
    if(inc) cart = cart.map(c => c.id == inc ? { ...c, cantidad: c.cantidad + 1 } : c);
    if(dec) cart = cart.map(c => c.id == dec ? { ...c, cantidad: Math.max(1, c.cantidad - 1) } : c);
    if(del) cart = cart.filter(c => c.id != del);
    egSetCart(session.username, cart);
    render();
  });

  document.getElementById('btn-checkout').addEventListener('click', () => {
    const cart = egGetCart(session.username);
    if(!cart.length) return;
    const orders = egGetOrders();
    const total = cart.reduce((s,c) => s + c.precio * c.cantidad, 0) + 9900;
    const newOrder = {
      id: orders.length ? Math.max(...orders.map(o=>o.id)) + 1 : 1001,
      usuario: session.username,
      items: cart.map(c => ({ id:c.id, nombre:c.nombre, cantidad:c.cantidad, precio:c.precio })),
      total,
      estado: 'preparando',
      fecha: new Date().toISOString().slice(0,10),
      proveedor: 'Elite Games'
    };
    orders.push(newOrder);
    egSetOrders(orders);
    egSetCart(session.username, []);
    egToast('¡Pedido confirmado! Revisa "Mis pedidos"');
    render();
  });

  render();
});
