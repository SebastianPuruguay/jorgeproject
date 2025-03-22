
<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 >
  Información Detallada - FabLab ESAN - 21/03/2025
                    </h2>

        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- Datos de contaminación -->
        <div class="contamination-section">
          <h3>Informacion General</h3>
          
          <div v-for="(thing, key) in things" :key="key" class="contamination-card" >
            <div class="contamination-header" >
              <h4>{{ thing.name }}</h4>
            </div>
            <div class="contamination-body">
              <p class="value">{{ thing.last_value }} {{ measurementUnits[thing.name]}}</p>
            </div>
          </div>
        </div>
        
        
        <!-- Recomendaciones -->
    <div class="recommendations">
          <h3>Recomendaciones</h3>
        <ul>
          <li v-if="shouldVentilate">
            <strong>Ventilación:</strong> Abra las ventanas para mejorar la circulación de aire.
          </li>
          <li v-if="shouldLimitActivities">
            <strong>Limitación de actividades:</strong> Evite actividades físicas intensas en este lugar.
          </li>
          <li v-if="shouldEvacuate">
            <strong>Advertencia:</strong> Se recomienda evacuar o usar equipo de protección adecuado.
          </li>
          <li v-if="isOptimal">
            <strong>Óptimo:</strong> Los niveles de contaminación son adecuados para todas las actividades.
          </li>
        </ul>
        </div>
      
      <div class="modal-footer">
        <button class="download-button">Descargar Informe</button>
        <button class="close-button-secondary" @click="$emit('close')">Cerrar</button>
      </div>
    </div>
  </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { getThings } from '@/services/arduinoService';
// Mapeo de unidades de medida
const measurementUnits = {
  Temperature: "°C",
  Humidity: "%",
  CO2: "ppm",
  PM10: "µg/m³",
  PM1_0: "µg/m³",
  PM2_5: "µg/m³"
};
const things = ref([]);

// Ver cambios en things.value
watch(things, (newVal) => {
  console.log('📌 Nuevo valor de things:', newVal);
});

onMounted(async () => {
  try {
    const data = await getThings();
    things.value = Array.isArray(data) ? data : [];
    console.log('✅ Datos cargados en things:', things.value);
  } catch (error) {
    console.error('❌ Error al cargar things:', error);
    things.value = [];
  }
});

// 🔹 **Funciones Computadas para evaluar el estado del ambiente** 🔹
// 🔹 **Funciones Computadas para evaluar el estado del ambiente** 🔹
const shouldVentilate = computed(() => {
  return things.value?.some(thing => 
    (thing.name === "CO2" && thing.last_value > 1000) ||
    (thing.name.startsWith("PM") && thing.last_value > 50)
  ) ?? false;
});

const shouldLimitActivities = computed(() => {
  return things.value?.some(thing => 
    (thing.name === "CO2" && thing.last_value > 1500) ||
    (thing.name.startsWith("PM") && thing.last_value > 100)
  ) ?? false;
});

const shouldEvacuate = computed(() => {
  return things.value?.some(thing => 
    (thing.name === "CO2" && thing.last_value > 2000) ||
    (thing.name.startsWith("PM") && thing.last_value > 150)
  ) ?? false;
});

const isOptimal = computed(() => {
  return !shouldVentilate.value && !shouldLimitActivities.value && !shouldEvacuate.value;
});



// Función para cerrar el modal cuando se hace clic en el overlay
const closeModal = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    event.preventDefault();
    event.stopPropagation();
    // Emitir el evento close para que el componente padre pueda cerrarlo
    // eslint-disable-next-line no-undef
    emit('close');
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eaeaea;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.contamination-section {
  margin-bottom: 25px;
}

.contamination-section h3 {
  margin-bottom: 15px;
  color: #333;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 8px;
}

.contamination-card {
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contamination-header {
  padding: 10px 15px;
  color: rgb(61, 60, 60);
}

.contamination-header h4 {
  margin: 0;
  font-size: 1.2rem;
  color:#333
}

.contamination-body {
  padding: 15px;
  position: relative;
}

.value {
  font-size: 1.8rem;
  font-weight: bold;
  color: black;
  margin: 0 0 5px 0;
}

.level {
  color: black;
  font-size: 1.1rem;
  margin: 0;
}

.info-tooltip {
  position: absolute;
  top: 15px;
  right: 15px;
}

.info-icon {
  cursor: pointer;
  font-size: 18px;
}

.tooltip-text {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #333;
  color: rgb(55, 54, 54);
  padding: 10px;
  border-radius: 5px;
  width: 250px;
  z-index: 100;
}

.info-tooltip:hover .tooltip-text {
  display: block;
}

.additional-data {
  margin-bottom: 25px;
}

.additional-data h3 {
  margin-bottom: 15px;
  color: #333;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 8px;
}

.environmental-cards {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.env-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.env-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.env-details {
  display: flex;
  flex-direction: column;
}

.env-label {
  font-size: 0.9rem;
  color: #666;
}

.env-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
}

.recommendations {
  margin-bottom: 20px;
}

.recommendations h3 {
  margin-bottom: 15px;
  color: #333;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 8px;
}

.recommendations ul {
  padding-left: 20px;
  color: #333;
}

.recommendations li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.download-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.download-button:hover {
  background-color: #45a049;
}

.close-button-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.close-button-secondary:hover {
  background-color: #e3e3e3;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
  }
  
  .environmental-cards {
    flex-direction: column;
  }
  
  .env-card {
    min-width: unset;
  }
}
</style>