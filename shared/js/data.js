
const DB_KEYS = {
  users: 'eg_users',
  products: 'eg_products',
  orders: 'eg_orders',
  cart: 'eg_cart_',      // + username
  favorites: 'eg_fav_',  // + username
  session: 'eg_session'
};

function egSeed(){
  if(!localStorage.getItem(DB_KEYS.users)){
    const users = [
      { username:'admin',     password:'admin123', role:'admin',     nombre:'Ana Administradora', email:'admin@elitegames.com' },
      { username:'usuario',   password:'user123',  role:'usuario',   nombre:'Carlos Jugador',      email:'usuario@elitegames.com' },
      { username:'proveedor', password:'prov123',  role:'proveedor', nombre:'Nova Studios',        email:'proveedor@elitegames.com', empresa:'Nova Studios' }
    ];
    localStorage.setItem(DB_KEYS.users, JSON.stringify(users));
  }

  if(!localStorage.getItem(DB_KEYS.products)){
    const products = [
      { id:1, nombre:'Starforge Odyssey',  categoria:'RPG',      precio:259900, stock:18, proveedor:'Nova Studios', estado:'activo', img:'' },
      { id:2, nombre:'Shadow Circuit',     categoria:'Acción',   precio:189900, stock:7,  proveedor:'Nova Studios', estado:'activo', img:'' },
      { id:3, nombre:'Pixel Kart League',  categoria:'Carreras', precio:99900,  stock:32, proveedor:'Retro Forge',  estado:'activo', img:'' },
      { id:4, nombre:'Mind Maze VR',       categoria:'Puzzle',   precio:149900, stock:0,  proveedor:'Nova Studios', estado:'agotado', img:'' },
      { id:5, nombre:'Kingdom Embers',     categoria:'Estrategia', precio:219900, stock:11, proveedor:'Retro Forge', estado:'activo', img:'' },
      { id:6, nombre:'Neon Strikers',      categoria:'Deportes', precio:129900, stock:14, proveedor:'Nova Studios', estado:'activo', img:'' }
    ];
    localStorage.setItem(DB_KEYS.products, JSON.stringify(products));
  }

  if(!localStorage.getItem(DB_KEYS.orders)){
    const orders = [
      { id:1001, usuario:'usuario', items:[{id:1,nombre:'Starforge Odyssey',cantidad:1,precio:259900}], total:259900, estado:'enviado',   fecha:'2026-06-20', proveedor:'Nova Studios' },
      { id:1002, usuario:'usuario', items:[{id:3,nombre:'Pixel Kart League',cantidad:2,precio:99900}],  total:199800, estado:'preparando', fecha:'2026-06-24', proveedor:'Retro Forge' },
      { id:1003, usuario:'invitado1', items:[{id:5,nombre:'Kingdom Embers',cantidad:1,precio:219900}], total:219900, estado:'entregado', fecha:'2026-06-10', proveedor:'Retro Forge' }
    ];
    localStorage.setItem(DB_KEYS.orders, JSON.stringify(orders));
  }
}

function egGet(key){ return JSON.parse(localStorage.getItem(key) || '[]'); }
function egSet(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function egGetUsers(){ return egGet(DB_KEYS.users); }
function egSetUsers(v){ egSet(DB_KEYS.users, v); }
function egGetProducts(){ return egGet(DB_KEYS.products); }
function egSetProducts(v){ egSet(DB_KEYS.products, v); }
function egGetOrders(){ return egGet(DB_KEYS.orders); }
function egSetOrders(v){ egSet(DB_KEYS.orders, v); }

function egCurrency(n){
  return '$' + Number(n).toLocaleString('es-CO');
}

function egToast(msg){
  let t = document.querySelector('.toast');
  if(!t){
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=> t.classList.remove('show'), 2200);
}

function egGetCart(username){ return egGet(DB_KEYS.cart + username); }
function egSetCart(username, val){ egSet(DB_KEYS.cart + username, val); }
function egGetFav(username){ return egGet(DB_KEYS.favorites + username); }
function egSetFav(username, val){ egSet(DB_KEYS.favorites + username, val); }

egSeed();
