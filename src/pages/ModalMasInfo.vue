<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2>🧪 Información Detallada</h2>
        <p class="subheader">FabLab ESAN · 2025</p>
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
  v-for="(thing, key) in things"
  :key="key"
  class="contamination-card"
  :style="{ backgroundColor: getColor(thing.name, thing.last_value) }"
>

              <div class="card-content">
                <div class="card-info">
                  <h4 class="card-title">{{ thing.name }}</h4>
                  <p class="value">
  {{ Math.round(thing.last_value) }}
  <span class="unit">{{ measurementUnits[thing.name] }}</span>
</p>

                </div>
                <button class="action-button" @click="hablarNivel(thing)" title="Escuchar nivel">
  <i>🔊</i>
</button>

              </div>
            </div>
          </div>
        </section>

        <!-- Recomendaciones -->
        <section class="recommendations">
  <h3 class="section-title">📌 Recomendaciones</h3>
  <div class="recommendations-container">

    <!-- 🔴 Evacuación -->
    <div v-if="shouldEvacuate" class="recommendation-item evacuate">
      <div class="recommendation-icon">🚨</div>
      <div class="recommendation-text">
        <div class="header-row">
          <strong>Evacuación recomendada</strong>
          <button @click="leerRecomendacion('evacuacion')" class="speak-button" title="Escuchar recomendación">🔊</button>
        </div>
        <p>La calidad del aire ha alcanzado niveles peligrosos:</p>
        <ul>
          <li>CO₂ actual: {{ co2 }} ppm</li>
          <li>PM1.0: {{ pm1_0 }}, PM2.5: {{ pm2_5 }}, PM10: {{ pm10 }} µg/m³</li>
        </ul>
        <p>Se recomienda evacuar el área si es posible, especialmente si hay personas con enfermedades respiratorias, niños o adultos mayores. Si debe permanecer, use mascarilla con filtro.</p>
      </div>
    </div>

    <!-- 🟠 Limitación de actividad -->
    <div v-else-if="shouldLimitActivities" class="recommendation-item caution">
      <div class="recommendation-icon">⚠️</div>
      <div class="recommendation-text">
        <div class="header-row">
          <strong>Reduzca actividades físicas</strong>
          <button @click="leerRecomendacion('limitacion')" class="speak-button" title="Escuchar recomendación">🔊</button>
        </div>
        <p>Los niveles de contaminación son elevados, lo cual puede afectar la salud si se realizan esfuerzos físicos.</p>
        <ul>
          <li>CO₂ actual: {{ co2 }} ppm</li>
          <li>PMs: {{ pm1_0 }}, {{ pm2_5 }}, {{ pm10 }} µg/m³</li>
        </ul>
        <p>Evite hacer ejercicio o moverse en exceso en este lugar. Si tiene síntomas respiratorios, busque zonas mejor ventiladas.</p>
      </div>
    </div>

    <!-- 🟡 Ventilación -->
    <div v-else-if="shouldVentilate" class="recommendation-item ventilate">
      <div class="recommendation-icon">🪟</div>
      <div class="recommendation-text">
        <div class="header-row">
          <strong>Requiere ventilación</strong>
          <button @click="leerRecomendacion('ventilar')" class="speak-button" title="Escuchar recomendación">🔊</button>
        </div>
        <p>El aire está viciado y podría acumular dióxido de carbono o partículas finas.</p>
        <ul>
          <li>CO₂ actual: {{ co2 }} ppm</li>
          <li>PMs: {{ pm1_0 }}, {{ pm2_5 }}, {{ pm10 }} µg/m³</li>
        </ul>
        <p>Abra ventanas o use ventiladores para mejorar la circulación del aire. Esto ayudará a reducir los riesgos para la salud.</p>
      </div>
    </div>

    <!-- 🟢 Óptimo -->
    <div v-if="isOptimal" class="recommendation-item optimal">
      <div class="recommendation-icon">✅</div>
      <div class="recommendation-text">
        <div class="header-row">
          <strong>Ambiente óptimo</strong>
          <button @click="leerRecomendacion('optimo')" class="speak-button" title="Escuchar recomendación">🔊</button>
        </div>
        <p>La calidad del aire es saludable:</p>
        <ul>
          <li>CO₂: {{ co2 }} ppm</li>
          <li>PMs: {{ pm1_0 }}, {{ pm2_5 }}, {{ pm10 }} µg/m³</li>
        </ul>
        <p>No hay restricciones para permanecer o realizar actividades físicas. Disfrute del espacio con tranquilidad.</p>
      </div>
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
import { ref, onMounted, watch, computed } from 'vue';
import { getThings } from '@/services/arduinoService';

// 🔸 Props
const props = defineProps({
  measurementUnits: {
    type: Object,
    default: () => ({
      Temperature: "°C",
      Humidity: "%",
      CO2: "ppm",
      PM10: "µg/m³",
      PM1_0: "µg/m³",
      PM2_5: "µg/m³"
    })
  }
});


const emit = defineEmits(['close', 'show-details']);

// 🔸 Data
const things = ref([]);

// 🔸 Ciclo de vida: cargar datos al montar
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

// 🔸 Watch para depurar cambios en things
watch(things, (newVal) => {
  console.log('📌 Nuevo valor de things:', newVal);
});

// 🔸 Obtener valores por nombre
const getValueByName = (name) =>
  things.value?.find(thing => thing.name === name)?.last_value ?? null;

const co2 = computed(() => getValueByName("CO2"));
const pm1_0 = computed(() => getValueByName("PM1_0"));
const pm2_5 = computed(() => getValueByName("PM2_5"));
const pm10 = computed(() => getValueByName("PM10"));

// 🔸 Lógica ambiental
const shouldVentilate = computed(() => {
  return (
    (co2.value !== null && co2.value > 1000) ||
    (pm1_0.value !== null && pm1_0.value > 50) ||
    (pm2_5.value !== null && pm2_5.value > 50) ||
    (pm10.value !== null && pm10.value > 50)
  );
});

const shouldLimitActivities = computed(() => {
  return (
    (co2.value !== null && co2.value > 1500) ||
    (pm1_0.value !== null && pm1_0.value > 100) ||
    (pm2_5.value !== null && pm2_5.value > 100) ||
    (pm10.value !== null && pm10.value > 100)
  );
});

const shouldEvacuate = computed(() => {
  return (
    (co2.value !== null && co2.value > 2000) ||
    (pm1_0.value !== null && pm1_0.value > 150) ||
    (pm2_5.value !== null && pm2_5.value > 150) ||
    (pm10.value !== null && pm10.value > 150)
  );
});

const isOptimal = computed(() => {
  return !shouldVentilate.value && !shouldLimitActivities.value && !shouldEvacuate.value;
});
//Color de modales de contaminación
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
    { max: 250, color: '#FFA500', label: 'Poco saludable' },
    { max: 350, color: '#FF4500', label: 'Muy dañino' },
    { max: Infinity, color: '#8B0000', label: 'Peligroso' }
  ],
  pm25: [
    { max: 30, color: '#00FF00', label: 'Bueno' },
    { max: 60, color: '#FFFF00', label: 'Moderado' },
    { max: 150, color: '#FFA500', label: 'Poco saludable' },
    { max: 250, color: '#FF4500', label: 'Muy dañino' },
    { max: Infinity, color: '#8B0000', label: 'Peligroso' }
  ]
};

const getColor = (name, value) => {
  if (!value || !name) return '#f3f4f6'; // fondo por defecto
  const key = name.toLowerCase().replace('_', ''); // ej: PM2_5 -> pm25
  const grupo = levels[key];
  if (!grupo) return '#e5e7eb';

  return grupo.find(l => value <= l.max)?.color || '#f3f4f6';
};

// 🔸 Métodos
const closeModal = (event) => {
  if (event.target === event.currentTarget || event.target.classList.contains('modal-overlay')) {
    emit('close');
  }
};
const hablarConGoogleTTS = async (texto) => {
  const apiKey = 'AIzaSyCJKvUyLnK90FR2Q8w0JXgoqde7vHgruOY';

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
};

const hablarNivel = async (thing) => {
  const valor = Math.round(thing.last_value);
  const nombre = thing.name;
  let mensaje = `${nombre} es de ${valor} ${props.measurementUnits[nombre]}. `;

  // Explicación por tipo
  if (nombre === "CO2") {
    if (valor <= 1000) {
      mensaje += "El nivel de dióxido de carbono es bajo, lo cual indica que hay una buena ventilación en el ambiente. Puede permanecer en este espacio sin preocupaciones, realizar cualquier actividad y respirar con normalidad.";
    } else if (valor <= 1500) {
      mensaje += "El nivel de CO₂ es moderadamente alto. Esto podría deberse a una ventilación insuficiente. Se recomienda abrir las ventanas o activar sistemas de ventilación para mejorar la calidad del aire, especialmente si hay varias personas en el lugar.";
    } else if (valor <= 2000) {
      mensaje += "El nivel de CO₂ es alto. Permanecer en este ambiente durante periodos prolongados podría causar somnolencia, fatiga o dolores de cabeza. Es aconsejable reducir el tiempo en este lugar y evitar esfuerzos físicos. Ventile el área lo antes posible.";
    } else {
      mensaje += "El nivel de CO₂ es muy elevado. Esta situación puede ser peligrosa para la salud, especialmente en personas con problemas respiratorios. Se recomienda evacuar el área si es posible o utilizar equipos de protección como mascarillas con filtro. Ventile inmediatamente.";
    }
  }

  else if (["PM10", "PM2_5", "PM1_0"].includes(nombre)) {
    if (valor <= 50) {
      mensaje += `El nivel de partículas ${nombre} es bajo, lo que indica que la calidad del aire es buena. Puede respirar sin riesgos y realizar cualquier actividad, incluso al aire libre, sin necesidad de precauciones especiales.`;
    } else if (valor <= 100) {
      mensaje += `El nivel de partículas ${nombre} es moderado. Aunque no representa un riesgo grave para la mayoría de las personas, quienes padecen enfermedades respiratorias o cardiovasculares deberían considerar reducir su exposición prolongada.`;
    } else if (valor <= 150) {
      mensaje += `El nivel de partículas ${nombre} es alto. Esto puede afectar la salud, especialmente en niños, adultos mayores y personas con condiciones respiratorias. Se recomienda evitar ejercicios al aire libre, cerrar ventanas y usar purificadores de aire si es posible.`;
    } else {
      mensaje += `El nivel de partículas ${nombre} es muy alto y peligroso. La exposición a este aire puede causar problemas respiratorios severos. Se recomienda permanecer en interiores, evitar cualquier esfuerzo físico, y utilizar mascarillas con filtros certificados si debe salir.`;
    }
  }

  else if (nombre === "Temperature") {
    if (valor < 18) {
      mensaje += "La temperatura es baja. Puede sentirse frío en interiores sin calefacción. Se recomienda abrigarse adecuadamente.";
    } else if (valor <= 26) {
      mensaje += "La temperatura está dentro de un rango confortable. Es ideal para la mayoría de actividades cotidianas sin necesidad de ajustes.";
    } else if (valor <= 32) {
      mensaje += "La temperatura es cálida. Se recomienda mantenerse hidratado, especialmente si se realiza actividad física.";
    } else {
      mensaje += "La temperatura es alta. Existe riesgo de golpe de calor. Evite exponerse directamente al sol y use ropa ligera.";
    }
  }

  else if (nombre === "Humidity") {
    if (valor < 30) {
      mensaje += "La humedad es baja, lo que puede resecar la piel y las vías respiratorias. Se recomienda usar humidificadores o hidratarse más de lo normal.";
    } else if (valor <= 60) {
      mensaje += "La humedad está en un nivel saludable. No representa riesgo para la mayoría de personas.";
    } else {
      mensaje += "La humedad es alta. Puede generar incomodidad, condensación o favorecer la proliferación de hongos. Se recomienda ventilar el espacio.";
    }
  }

  await hablarConGoogleTTS(mensaje);
};

const leerRecomendacion = async (tipo) => {
  let texto = "";

  switch (tipo) {
    case 'evacuacion':
      texto = `Los niveles de contaminación son peligrosos. Se recomienda evacuar la zona o usar protección. CO2 actual: ${co2.value} partes por millón. Partículas: PM uno punto cero ${pm1_0.value}, PM dos punto cinco ${pm2_5.value}, y PM diez ${pm10.value}.`;
      break;
    case 'limitacion':
      texto = `La calidad del aire es mala. Evite esfuerzos físicos. CO2 actual: ${co2.value}. PM uno punto cero: ${pm1_0.value}, dos punto cinco: ${pm2_5.value}, y diez: ${pm10.value}.`;
      break;
    case 'ventilar':
      texto = `El ambiente requiere ventilación. Los niveles de dióxido de carbono o partículas son altos. CO2 actual: ${co2.value}. PMs: ${pm1_0.value}, ${pm2_5.value}, ${pm10.value}.`;
      break;
    case 'optimo':
      texto = `El ambiente es óptimo. Todos los niveles están dentro de rangos saludables. CO2: ${co2.value}. PMs: uno punto cero ${pm1_0.value}, dos punto cinco ${pm2_5.value}, diez ${pm10.value}.`;
      break;
  }

  await hablarConGoogleTTS(texto);
};

</script>


<style scoped>
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
  font-size: 1.2rem;
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


