<template>
  <footer class="footer">
    <div class="container">
      <!-- Logo y nombre -->
      <div class="logo-section">
        <img src="@/components/jorge1.jpg" alt="Logo" class="logo" />
        <span class="name">Jorge Valerio Araoz</span>
      </div>

      <!-- Navegación -->
      <nav class="nav-links">
        <a href="/">Sobre mí</a>
        <a href="/">Proyectos</a>
        <a href="/">Contacto</a>
        <a href="/">Términos</a>
      </nav>

      <!-- Redes -->
      <div class="social-links">
        <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
        <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="#" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>

    <hr class="divider" />

    <div class="copyright">
      &copy; {{ currentYear }} Jorge Valerio Araoz. Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: #111;
  color: white;
  padding: 30px 16px;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

.name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f3f4f6;
}

.nav-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-links a {
  text-decoration: none;
  color: #d1d5db;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #facc15; /* amarillo suave */
}

.social-links {
  display: flex;
  gap: 18px;
}

.social-links a {
  font-size: 1.2rem;
  color: #d1d5db;
  transition: transform 0.3s, color 0.3s;
}

.social-links a:hover {
  transform: scale(1.15);
  color: #60a5fa; /* azul claro al pasar el cursor */
}

.divider {
  width: 85%;
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 20px auto;
}

.copyright {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>
