<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2>🧪 Información Detallada</h2>
        <p class="subheader">{{ getLocationName(currentPointKey) }} · 2025</p>
        <button class="close-button" @click="$emit('close')">
          <span class="close-icon">&times;</span>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">

        <!-- Sección general -->
        <section class="contamination-section">
          <h3 class="section-title">🔍 Información General</h3>
          <div class="cards-container">
            <div
              v-for="(value, key) in filteredData"
              :key="key"
              class="contamination-card"
              :style="{ backgroundColor: getColor(key, value) }"
            >
              <div class="card-content">
                <div class="card-info">
                  <h4 class="card-title">{{ getDisplayName(key) }}</h4>
                  <p class="value">
                    {{ Math.round(value) }}
                    <span class="unit">{{ measurementUnits[getDisplayName(key)] }}</span>
                  </p>
                </div>
                <button class="speak-button2" @click="hablarNivel(key, value)" title="Escuchar nivel">
                  🔊
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Timestamp -->
      <section class="timestamp-section" v-if="formattedTimestamp">
        <p class="timestamp">📅 Última actualización: {{ formattedTimestamp }}</p>
      </section>


        <!-- Recomendaciones -->
        <section class="recommendations">
          <h3 class="section-title">📌 Recomendaciones</h3>
          <div class="recommendations-container">

            <!-- 🔴 Ambiente no saludable -->
            <div v-if="shouldEvacuate" class="recommendation-item evacuate">
              <div class="recommendation-icon">🚨</div>
                <div class="recommendation-text">
                <div class="header-row">
                <strong>Ambiente no saludable</strong>
                <button @click="leerRecomendacion('evacuacion')" class="speak-button" title="Escuchar recomendación">🔊</button>
                </div>
              <p>La calidad del aire presenta algunas consideraciones en este momento:</p>
              <ul>
              <li>CO₂ actual: {{ co2 }} ppm</li>
              <li>PM2.5: {{ pm2_5 }}, PM10: {{ pm10 }} µg/m³</li>
              </ul>
              <p>Para su comodidad, le sugerimos considerar la ventilación del área. Si tiene sensibilidades respiratorias, o si hay niños o adultos mayores, tomar precauciones adicionales puede ser útil. Si se encuentra al aire libre, una mascarilla adecuada podría brindar un beneficio adicional.</p>
              </div>
                          <img
            src="@/assets/usarmascarilla.jpg"
            alt="Evacuación recomendada"
            class="image-alert"
            />
            </div>



            <!-- 🟠 Evita esfuerzos físicos -->
            <div v-else-if="shouldLimitActivities" class="recommendation-item caution">
            <div class="recommendation-icon">⚠️</div>
            <div class="recommendation-text">
            <div class="header-row">
            <strong>Evita esfuerzos físicos</strong>
            <button @click="leerRecomendacion('limitacion')" class="speak-button" title="Escuchar recomendación">🔊</button>
            </div>
            <p>La calidad del aire sugiere precaución, especialmente si planeas actividad física intensa.</p>
            <ul>
            <li>CO₂ actual: {{ co2 }} ppm</li>
            <li>PMs: {{ pm2_5 }}, {{ pm10 }} µg/m³</li>
            </ul>
            <p>Considera limitar los ejercicios de alta intensidad en este lugar por ahora. Si notas alguna molestia, busca un área con mejor ventilación para tu comodidad.</p>
            </div>
                        <img
            src="@/assets/noejericico.jpg"
            alt="Evacuación recomendada"
            class="image-alert"
            />
            </div>



            <!-- 🟡 Mejorar circulación -->
            <div v-else-if="shouldVentilate" class="recommendation-item ventilate">
            <div class="recommendation-icon">🪟</div>
            <div class="recommendation-text">
            <div class="header-row">
            <strong>Mejorar circulación de aire</strong>
            <button @click="leerRecomendacion('ventilar')" class="speak-button" title="Escuchar recomendación">🔊</button>
            </div>

            <p>El ambiente está algo cargado. Una buena ventilación puede marcar la diferencia.</p>
            <ul>
            <li>CO₂ actual: {{ co2 }} ppm</li>
            <li>PMs: {{ pm2_5 }}, {{ pm10 }} µg/m³</li>
            </ul>
            <p>Abre ventanas o usa ventiladores para renovar el aire y sentirte mejor.</p>
            </div>
            <!-- Imagen al lado derecho -->
            <img
            src="@/assets/ventilar.png"
            alt="Evacuación recomendada"
            class="image-alert"
            />
            </div>



            <!-- 🟢 Aire saludable -->
            <div v-if="isOptimal" class="recommendation-item optimal">
            <div class="recommendation-icon">✅</div>
            <div class="recommendation-text">
            <div class="header-row">
            <strong>Aire saludable</strong>
            <button @click="leerRecomendacion('optimo')" class="speak-button" title="Escuchar recomendación">🔊</button>
            </div>
            <p>¡Todo bien! El aire se encuentra en buen estado:</p>
            <ul>
            <li>CO₂: {{ co2 }} ppm</li>
            <li>PMs: {{ pm2_5 }}, {{ pm10 }} µg/m³</li>
            </ul>
            <p>Disfruta del espacio con tranquilidad. Es un buen momento para actividades al aire libre.</p>
            </div>
                        <img
            src="@/assets/calidadOptima.jpg"
            alt="Evacuación recomendada"
            class="image-alert"
            />  
            </div>


          </div>
        </section>

      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="close-button-secondary" @click="$emit('close')">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';

// 🔸 Props
const props = defineProps({
  measurementUnits: {
    type: Object,
    default: () => ({
      Temperature: "°C",
      Humidity: "%",
      CO2: "ppm",
      PM10: "µg/m³",
      PM2_5: "µg/m³",
      "PM2.5": "µg/m³",
    })
  }
});

const emit = defineEmits(['close']);

// 🔸 Inyectar datos globales (asumiendo que los tienes disponibles globalmente)
// Si no los tienes así, puedes pasarlos como props también
const datosCalidadAire = inject('datosCalidadAire', ref({}));
const currentPointKey = inject('currentPointKey', ref('airedatos')); // El key del punto actual

// 🔸 Mapeo de nombres de ubicación
const locationNames = {
  "airedatos": "Lima - San Juan de Lurigancho - Sede Canto Rey",
  "airedatosSRCO": "Lima - Surco - Sede FabLab Esan", 
};

// 🔸 Mapeo de nombres de sensores  
const sensorNameMap = {
  "CO2": "CO2",
  "Temp": "Temperatura", 
  "Hum": "Humedad",
  "PM2_5": "PM2.5", 
  "PM10": "PM10"
};

// 🔸 Computed para datos actuales
const currentData = computed(() => {
  return datosCalidadAire.value[currentPointKey.value] || {};
});

// 🔸 Datos filtrados (excluir timestamp para las cards)
const filteredData = computed(() => {
  const data = { ...currentData.value };
  delete data.timestamp;
  delete data.PM1_0; // Excluir timestamp
  return data;
});

// 🔸 Watch para depurar
watch([currentData, currentPointKey], ([newData, newKey]) => {
  console.log('📌 Datos actuales del modal:', newData);
  console.log('📍 Punto actual:', newKey);
});
// 🔸 Obtener valores específicos con parseFloat
const co2 = computed(() => {
  const value = currentData.value.CO2;
  return value ? parseFloat(value) : null;
});
const timestamp = computed(() => {
  const value = localStorage.getItem("ultima actualizacion");
  if (!value) return null;


  console.log('Timestamp:', value);
  // Validar que sea una fecha válida
  return value;
  
});



const pm2_5 = computed(() => {
  const value = currentData.value.PM2_5;
  return value ? parseFloat(value) : null;
});

const pm10 = computed(() => {
  const value = currentData.value.PM10;
  return value ? parseFloat(value) : null;
});


// 🔸 Lógica ambiental
const shouldVentilate = computed(() => {
  return (
    (co2.value !== null && co2.value > 1000) ||
    (pm2_5.value !== null && pm2_5.value > 75) ||
    (pm10.value !== null && pm10.value > 50)
  );
});

const shouldLimitActivities = computed(() => {
  return (
    (co2.value !== null && co2.value > 1500) ||
    (pm2_5.value !== null && pm2_5.value > 115) ||
    (pm10.value !== null && pm10.value > 100)
  );
});

const shouldEvacuate = computed(() => {
  return (
    (co2.value !== null && co2.value > 2000) ||
    (pm2_5.value !== null && pm2_5.value > 150) ||
    (pm10.value !== null && pm10.value > 150)
  );
});

const isOptimal = computed(() => {
  return !shouldVentilate.value && !shouldLimitActivities.value && !shouldEvacuate.value;
});

// 🔸 Configuración de niveles de colores (igual que en tu mapa)
const levels = {
  co2: [
    { max: 400, color: '#00FF00', label: 'Bajo (Excelente)' },
    { max: 1000, color: '#00FF00', label: 'Bueno' },
    { max: 1500, color: '#FFA200', label: 'Somnolencia' },
    { max: 2000, color: '#FFA500', label: 'Alto (Fatiga)' },
    { max: 5000, color: '#FF4500', label: 'Muy alto (Mareos)' },
    { max: Infinity, color: '#8B0000', label: 'Extremo (Emergencia)' }
  ],
  pm10: [
    { max: 50, color: '#00FF00', label: 'Bueno' },
    { max: 100, color: '#FFFF00', label: 'Moderado' },
    { max: 150, color: '#FFA500', label: 'Poco saludable' },
    { max: 200, color: '#FF4500', label: 'Muy dañino' },
    { max: Infinity, color: '#8B0000', label: 'Peligroso' }
  ],
  pm25: [
    { max: 75, color: '#00FF00', label: 'Bueno' },
    { max: 115, color: '#FFFF00', label: 'Moderado' },
    { max: 150, color: '#FFA500', label: 'Poco saludable' },
    { max: 250, color: '#FF4500', label: 'Muy dañino' },
    { max: Infinity, color: '#8B0000', label: 'Peligroso' }
  ],
  pm1_0: [
    { max: 30, color: '#00FF00', label: 'Bueno' },
    { max: 60, color: '#FFFF00', label: 'Moderado' },
    { max: 150, color: '#FFA500', label: 'Poco saludable' },
    { max: 250, color: '#FF4500', label: 'Muy dañino' },
    { max: Infinity, color: '#8B0000', label: 'Peligroso' }
  ]
};

// 🔸 Métodos auxiliares
const getLocationName = (key) => {
  return locationNames[key] || key;
};

const getDisplayName = (key) => {
  return sensorNameMap[key] || key;
};

const formattedTimestamp = computed(() => {
  return timestamp.value
    ? timestamp.value.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';
});

const getColor = (key, value) => {
  if (!value || !key) return '#f3f4f6';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '#f3f4f6';
  
  // Mapear keys igual que en tu código del mapa
  let levelKey = key.toLowerCase();
  if (levelKey === 'pm2_5') levelKey = 'pm25';
  if (levelKey === 'pm1_0') levelKey = 'pm1_0';
  
  const grupo = levels[levelKey];
  if (!grupo) return '#e5e7eb';

  return grupo.find(l => numValue <= l.max)?.color || '#f3f4f6';
};

const closeModal = (event) => {
  if (event.target === event.currentTarget || event.target.classList.contains('modal-overlay')) {
    emit('close');
  }
};

// 🔸 Funciones de audio
const hablarConGoogleTTS = async (texto) => {
  const apiKey = 'AIzaSyCJKvUyLnK90FR2Q8w0JXgoqde7vHgruOY';

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: texto },
          voice: { languageCode: 'es-US', name: 'es-US-Neural2-A' },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    );

    const data = await response.json();
    const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
    audio.play();
  } catch (error) {
    console.error('Error en TTS:', error);
  }
};

const hablarNivel = async (key, value) => {
  const displayName = getDisplayName(key);
  const valor = Math.round(parseFloat(value));
  const locationName = getLocationName(currentPointKey.value);
  
  let mensaje = `En ${locationName}, ${displayName} es de ${valor} ${props.measurementUnits[displayName]}. `;

  // Explicación por tipo
  if (key === "CO2") {
    if (valor <= 1000) {
      mensaje += "Los niveles de dióxido de carbono son bajos y saludables. Disfruta del ambiente.";
    } else if (valor <= 1500) {
      mensaje += "Sugiero mejorar un poco la ventilación para mayor comodidad.";
    } else if (valor <= 2000) {
      mensaje += "Los niveles de dióxido de carbono pueden afectar la concentración; renueva el aire pronto.";
    } else {
      mensaje += "Los niveles de dióxido de carbono son altos. Para sentirte mejor, ventila ahora el ambiente.";
    }
  }
  
else if (key === "PM2_5") {
  if (valor < 75) {
    mensaje += `El aire está limpio; aprovecha para actividades al aire libre.`;
  } else if (valor <= 115) { // Rango 15 - 35
    mensaje += `La calidad es aceptable, pero conviene limitar el humo interior.`;
  } else if (valor <= 150) { // Rango 35 - 55
    mensaje += `Personas con asma podrían sentir molestias; filtra el aire si es posible.`;
  } else { // Rango > 55 (hasta 150 según tu ejemplo anterior, pero el texto aplica para > 55)
    mensaje += `Conviene limitar la actividad física hasta que el aire mejore.`;
  }
}
  else if (key === "PM10") {
  if (valor < 50) {
    mensaje += `El nivel de partículas gruesas es bajo; respira tranquilo.`;
  } else if (valor <= 100) { // Rango 50 - 100
    mensaje += `La calidad es aceptable; evita actividades que generen polvo extra.`;
  } else if (valor <= 150) { // Rango 100 - 150
    mensaje += `Personas alérgicas podrían notar molestias; toma precauciones.`;
  } else { // Rango > 150
    mensaje += `Hay mucho polvo en el ambiente; procura filtrar el aire interior.`;
  }
}
  else if (key === "Temp") {
    if (valor < 18) {
      mensaje += "La temperatura es baja. Se recomienda abrigarse.";
    } else if (valor <= 26) {
      mensaje += "La temperatura está en un rango confortable.";
    } else {
      mensaje += "La temperatura es alta. Manténgase hidratado.";
    }
  }
  
  else if (key === "Hum") {
    if (valor < 30) {
      mensaje += "La humedad es baja.";
    } else if (valor <= 60) {
      mensaje += "La humedad está en un nivel saludable.";
    } else {
      mensaje += "La humedad es alta.";
    }
  }

  await hablarConGoogleTTS(mensaje);
};

const leerRecomendacion = async (tipo) => {
  const locationName = getLocationName(currentPointKey.value);
  let texto = `En ${locationName}: `;

  switch (tipo) {
    case 'evacuacion':
      texto += `La calidad del aire es elevada. Para tu bienestar, ventila el ambiente y limita la actividad física intensa hasta que mejore`;
      break;
    case 'limitacion':
      texto += `La calidad del aire está en un nivel más alto. Si eres sensible o tienes condiciones respiratorias, toma precauciones adicionales y considera filtrar el aire.`;
      break;
    case 'ventilar':
      texto += `La calidad del aire es buena. Para mayor confort, podrías considerar ventilar un poco o limitar fuentes de humo.`;
      break;
    case 'optimo':
      texto += `El ambiente es óptimo. C O 2: ${co2.value}.`;
      break;
  }

  await hablarConGoogleTTS(texto);
};

</script>



<style scoped>
.image-alert {
  display: block;
  max-width: 20%;
  width: 100%;
  border-radius: 12px;
}
.modal-overlay {
  font-family: 'Segoe UI', sans-serif;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.speak-button {
  background: none;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  margin-left: 8px;
}
.speak-button2 {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  margin-left: 8px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-content {
  color: #111 !important;
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  font-size: 1.4rem;  
  color: #1e3a8a;
}

.subheader {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 4px;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.contamination-card {
  flex: 1 1 120px;
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.card-title {
  font-size: 1rem;
  margin-bottom: 4px;
}

.value {
  font-size: 0.95rem;
  font-weight: bold;
}

.recommendations-container {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background-color: #f3f4f6;
}

.recommendation-item.evacuate { background-color: #fee2e2; }
.recommendation-item.caution { background-color: #fef3c7; }
.recommendation-item.ventilate { background-color: #dbeafe; }
.recommendation-item.optimal { background-color: #dcfce7; }

.recommendation-icon {
  font-size: 1.8rem;
}

.recommendation-text ul {
  margin: 4px 0;
  padding-left: 18px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}

.close-button-secondary {
  background: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button-secondary:hover {
  background: #1e40af;
}

</style>


