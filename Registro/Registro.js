document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registro-form");
    const errorBox = document.getElementById("registro-error");

    form.addEventListener("submit", function(e){

        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if(nombre === "" || email === "" || username === "" || password === ""){
            mostrarError("Todos los campos son obligatorios.");
            return;
        }

        const users = egGetUsers();

        // Verificar usuario repetido
        if(users.some(u => u.username.toLowerCase() === username.toLowerCase())){
            mostrarError("Ese nombre de usuario ya existe.");
            return;
        }

        // Verificar correo repetido
        if(users.some(u => u.email.toLowerCase() === email.toLowerCase())){
            mostrarError("Ese correo ya está registrado.");
            return;
        }

        // Crear nuevo usuario
        users.push({
            username: username,
            password: password,
            role: "usuario",
            nombre: nombre,
            email: email
        });

        egSetUsers(users);

        alert("¡Cuenta creada correctamente! Ahora inicia sesión.");

        window.location.href = "../login.html";

    });

    function mostrarError(msg){
        errorBox.textContent = msg;
        errorBox.classList.add("show");
    }

});