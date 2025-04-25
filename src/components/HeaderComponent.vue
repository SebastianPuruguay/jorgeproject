<template>
  <header class="header">
    <div class="toolbar">
      <h1 class="title">MONITOREO DE CALIDAD DE AIRE</h1>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #1e1e1e, #121212);
  color: white;
  padding: 14px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', sans-serif;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.menu-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.3s ease;
}

.menu-btn:hover {
  transform: scale(1.15);
  color: #facc15; /* Amarillo suave al pasar */
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  margin: 0;
  text-align: center;
  flex-grow: 1;
}
</style>
