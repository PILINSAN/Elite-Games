document.addEventListener("DOMContentLoaded", () => {

  const session = egSession();

  const navLog = document.getElementById("nav-logueado");
  const footPub = document.getElementById("foot-publico");
  const btnLogout = document.getElementById("btn-logout");

  if(session && session.role === "usuario"){
    if(navLog) navLog.style.display = "block";
    if(footPub) footPub.style.display = "none";

    const user = egUserData(session.username);

    if(user){
      document.getElementById("name").textContent = user.nombre.split(" ")[0];
      document.getElementById("avatar").textContent = user.nombre.charAt(0).toUpperCase();
    }

    if(btnLogout){
      btnLogout.addEventListener("click", () => egLogout());
    }

  } else {
    if(navLog) navLog.style.display = "none";
    if(footPub) footPub.style.display = "block";
    document.getElementById("name").textContent = "Invitado";
    document.getElementById("avatar").textContent = "?";
  }

  const grid = document.getElementById("catalogo-grid");
  const search = document.getElementById("search");
  const filterCat = document.getElementById("filter-cat");

  const products = egGetProducts();

  const categorias = [...new Set(products.map(p => p.categoria))];

  filterCat.innerHTML =
    `<option value="">Todas las categorías</option>` +
    categorias.map(c => `<option value="${c}">${c}</option>`).join("");

  function favs(){
    if(!session) return [];
    return egGetFav(session.username) || [];
  }

  /* ================= MODAL ================= */

  const modal = document.createElement("div");
  modal.className = "modal hidden";
  modal.innerHTML = `
    <div class="modal-content">

      <span class="close">×</span>

      <img class="modal-img">

      <h2></h2>
      <div class="modal-cat"></div>

      <p class="modal-desc"></p>

      <div class="modal-price"></div>

      <div class="modal-actions">

        <button class="buy">Comprar</button>
        <button class="cart">Agregar al carrito</button>
        <button class="fav">Favorito</button>

      </div>

    </div>
  `;
  document.body.appendChild(modal);

  const mImg = modal.querySelector(".modal-img");
  const mTitle = modal.querySelector("h2");
  const mCat = modal.querySelector(".modal-cat");
  const mDesc = modal.querySelector(".modal-desc");
  const mPrice = modal.querySelector(".modal-price");

  let currentProduct = null;

  function openModal(p){
    currentProduct = p;

    mImg.src = p.img;
    mTitle.textContent = p.nombre;
    mCat.textContent = `${p.categoria} · ${p.proveedor}`;
    mDesc.textContent = p.descripcion || "Sin descripción disponible";
    mPrice.textContent = egCurrency(p.precio);

    modal.classList.remove("hidden");
  }

  function closeModal(){
    modal.classList.add("hidden");
  }

  function toastClose(msg){
    closeModal();
    egToast(msg);
  }

  modal.querySelector(".close").onclick = closeModal;

  modal.querySelector(".cart").onclick = () => {
    if(!session) return location.href = "../../login.html";

    const cart = egGetCart(session.username);
    const ex = cart.find(c => c.id == currentProduct.id);

    if(ex) ex.cantidad++;
    else cart.push({
      id: currentProduct.id,
      nombre: currentProduct.nombre,
      precio: currentProduct.precio,
      cantidad: 1,
      img: currentProduct.img
    });

    egSetCart(session.username, cart);
    toastClose("Agregado al carrito");
  };

  modal.querySelector(".fav").onclick = () => {
    if(!session) return location.href = "../../login.html";

    let list = egGetFav(session.username);

    if(list.includes(currentProduct.id)){
      list = list.filter(id => id !== currentProduct.id);
      egSetFav(session.username, list);
      toastClose("Quitado de favoritos");
    } else {
      list.push(currentProduct.id);
      egSetFav(session.username, list);
      toastClose("Agregado a favoritos");
    }
  };

  modal.querySelector(".buy").onclick = () => {
    if(!session) return location.href = "../../login.html";
    toastClose("Compra realizada (simulación)");
  };

  /* ================= RENDER ================= */

  function render(){

    const term = search.value.toLowerCase();
    const cat = filterCat.value;

    const list = products.filter(p =>
      p.nombre.toLowerCase().includes(term) &&
      (!cat || p.categoria === cat)
    );

    const favList = favs();

    grid.innerHTML = list.map(p => `
      <div class="card game-card">

        <div class="thumb" data-id="${p.id}">
          <img src="${p.img}">
        </div>

        <div class="cat">${p.categoria} · ${p.proveedor}</div>
        <div class="name">${p.nombre}</div>
        <div class="price">${egCurrency(p.precio)}</div>

        <div class="row">

          <button
            class="btn btn-primary btn-sm"
            data-add="${p.id}"
            ${p.stock == 0 ? "disabled" : ""}
          >
            ${p.stock == 0 ? "Agotado" : "Agregar"}
          </button>

          <button
            class="fav-btn ${favList.includes(p.id) ? "active" : ""}"
            data-fav="${p.id}"
          >
            ❤
          </button>

        </div>

      </div>
    `).join("");
  }

  /* ================= EVENTS ================= */

  grid.addEventListener("click", (e) => {

    const addId = e.target.dataset.add;
    const favId = e.target.dataset.fav;
    const thumb = e.target.closest(".thumb");

    if(thumb){
      const id = Number(thumb.dataset.id);
      const product = products.find(p => p.id === id);
      openModal(product);
    }

    if(addId){
      if(!session) return location.href = "../../login.html";

      const p = products.find(x => x.id == addId);
      const cart = egGetCart(session.username);
      const ex = cart.find(c => c.id == addId);

      if(ex) ex.cantidad++;
      else cart.push({
        id:p.id,
        nombre:p.nombre,
        precio:p.precio,
        cantidad:1,
        img:p.img
      });

      egSetCart(session.username, cart);
      egToast("Agregado al carrito");
    }

    if(favId){
      if(!session) return location.href = "../../login.html";

      let list = egGetFav(session.username);

      if(list.includes(Number(favId))){
        list = list.filter(id => id !== Number(favId));
      } else {
        list.push(Number(favId));
      }

      egSetFav(session.username, list);
      render();
    }

  });

  search.addEventListener("input", render);
  filterCat.addEventListener("change", render);

  render();

});