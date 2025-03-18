<template>
  <footer class="footer">
    <div class="container">
      <!-- Logo y Nombre -->
      <div class="logo-section">
        <img src="https://via.placeholder.com/50" alt="Logo" class="logo">
        <span class="name">Nombre de la Persona</span>
      </div>

      <!-- Enlaces -->
      <nav class="nav-links">
        <ul>
          <li><a href="/">Sobre mí</a></li>
          <li><a href="/">Proyectos</a></li>
          <li><a href="/">Contacto</a></li>
          <li><a href="/">Términos</a></li>
        </ul>
      </nav>

      <!-- Redes Sociales -->
      <div class="social-links">
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-linkedin"></i></a>
      </div>
    </div>

    <!-- Línea Divisoria -->
    <hr class="divider">

    <!-- Derechos de Autor -->
    <div class="copyright">
      &copy; {{ currentYear }} Nombre de la Persona. Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
/* Fondo oscuro con gradiente */
.footer {
  
  background: linear-gradient(135deg, #222, #111);
  color: white;
  padding: 20px 10px;
  text-align: center;
}

/* Contenedor principal */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Sección del logo */
.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.3);
}

.name {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Enlaces de navegación */
.nav-links ul {
  list-style: none;
  display: flex;
  gap: 15px;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-size: 1rem;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #ffeb3b;
}

/* Redes sociales */
.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  font-size: 1.5rem;
  color: white;
  transition: transform 0.3s;
}

.social-links a:hover {
  transform: scale(1.2);
}

/* Línea divisoria */
.divider {
  width: 80%;
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 15px auto;
}

/* Derechos de autor */
.copyright {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>
