<template>
  <header class="header">
    
      <a href="https://airequerespiro.com/" class="return-button">Regresar a la página principal</a>
      <h1 class="title">MONITOREO DE CALIDAD DE AIRE</h1>
      
  </header>
</template>


<style scoped>
.header {
  position: relative;
  background: linear-gradient(135deg, #1e1e1e, #121212);
  color: white;
  padding: 14px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px; /* Asegura altura suficiente para centrar bien */
}

.return-button {
  position: absolute;
  left: 24px;
  background: linear-gradient(135deg, #5bb55d, #64A555);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 400;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-family: 'Segoe UI', sans-serif;
}

.return-button:hover {
  background: linear-gradient(135deg, #74e976, #6fb95f);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0;
  text-align: center;
}


</style>
