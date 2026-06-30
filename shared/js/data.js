
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
{ id:1, nombre:'EA Sports FC 26',          categoria:'Deportes',   precio:259900, stock:18, proveedor:'Nova Studios', estado:'activo', img:'../../assets/img/FC26.jpg' },
{ id:2, nombre:'Grand Theft Auto V',       categoria:'Acción',     precio:189900, stock:7,  proveedor:'Nova Studios', estado:'activo', img:'../../assets/img/GTAV.jpg' },
{ id:3, nombre:'Red Dead Redemption 2',    categoria:'Acción',     precio:219900, stock:11, proveedor:'Retro Forge',  estado:'activo', img:'../../assets/img/RDR2.jpg' },
{ id:4, nombre:'Call of Duty: Black Ops 6',categoria:'Disparos',   precio:249900, stock:0,  proveedor:'Nova Studios', estado:'agotado', img:'../../assets/img/COD-BO6.jpg' },
{ id:5, nombre:'The Legend of Zelda: TOTK',categoria:'Aventura',   precio:229900, stock:14, proveedor:'Retro Forge',  estado:'activo', img:'../../assets/img/ZELDA.jpg' },  
         ];
    localStorage.setItem(DB_KEYS.products, JSON.stringify(products));
  }

  if(!localStorage.getItem(DB_KEYS.orders)){
    const orders = [
      { id:1001, usuario:'usuario', items:[{id:1,nombre:'EA Sports FC 26',cantidad:1,precio:259900}], total:259900, estado:'enviado',   fecha:'2026-06-20', proveedor:'Nova Studios' },
      { id:1002, usuario:'usuario', items:[{id:3,nombre:'Red Dead Redemption 2',cantidad:2,precio:99900}],  total:199800, estado:'preparando', fecha:'2026-06-24', proveedor:'Retro Forge' },
      { id:1003, usuario:'invitado1', items:[{id:5,nombre:'The Legend of Zelda: TOTK',cantidad:1,precio:219900}], total:219900, estado:'entregado', fecha:'2026-06-10', proveedor:'Retro Forge' }
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
