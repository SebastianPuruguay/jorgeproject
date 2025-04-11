<template>
  <header class="header">
    <div class="toolbar">
      <button class="menu-btn" @click="$emit('toggleDrawer')">
        ☰
      </button>
      <h1 class="title">Moniterio de caldidad de Aire</h1>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
/* Estilos para el header */
.header {
  
  background: linear-gradient(135deg, #1e1e1e, #121212);
  color: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
}

/* Estilos para la barra */
.toolbar {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

/* Botón de menú */
.menu-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.menu-btn:hover {
  transform: scale(1.1);
}

/* Título del proyecto */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
