<!-- eslint-disable no-unused-vars -->
<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import BarraInform from '@/components/BarraInform.vue';
import { getThings } from '@/services/arduinoService';
import { ref, onMounted, onUnmounted, provide } from 'vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import "leaflet.markercluster";
import { addressPoints } from '@/components/markerDemo';
import icon from '@/components/icon.png';
import markerShadow from '@/components/marker-shadow.png';
import ModalComponent from "@/pages/ModalMasInfo.vue";
// pa que hable la pag

const datosCalidadAire = ref([]);
const currentPointKey = ref('airedatos');

provide('datosCalidadAire', datosCalidadAire);
provide('currentPointKey', currentPointKey);
const isModalOpen = ref(false);
const selectedContaminationData = ref(null);
// Estado para manejar qué modal está abierto
const activeModal = ref(null);
const openModal = (ModalComponent) => {
  selectedContaminationData.value = ModalComponent;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const mapContainer = ref(null);
const initialMap = ref(null);
const toggleDrawer = () => {
  console.log("Abrir/cerrar menú lateral");
};
const myIcon = L.icon({
    iconUrl: icon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowUrl: markerShadow,
    shadowSize: [60, 30],
    shadowAnchor: [15, 30]
});

onMounted(async () => {

    if (!mapContainer.value) return;

  // Inicializa el mapa
  initialMap.value = L.map('map', {
    zoomControl: true,
    zoom: 1,
    zoomAnimation: false,
    fadeAnimation: true,
    markerZoomAnimation: true
  }).setView([-12.10057710407106, -76.98658195437011], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(initialMap.value);

    // Obtener datos desde Arduino IoT
    try {
        datosCalidadAire.value = await getThings();
        console.log('Datos obtenidos:', datosCalidadAire);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }

    initialMap.value.whenReady(async () => {    
    const markers = L.markerClusterGroup();

const levels = {
  co2: [
    { max: 800, color: '#00FF00', label: 'Óptimo (Aire Fresco)' }, // Unificamos "Excelente" y "Bueno" hasta un umbral razonable
    { max: 1200, color: '#FFFF00', label: 'Aceptable (Ventilar)' }, // Aquí es donde la somnolencia empieza a ser un factor, sugiere ventilación
    { max: 2000, color: '#FFA500', label: 'Elevado (Fatiga)' },
    { max: 5000, color: '#FF4500', label: 'Muy Alto (Mareos/Riesgo)' },
    { max: Infinity, color: '#8B0000', label: 'Crítico (Evacuar)' }
  ],
  pm10: [
    { max: 50, color: '#00FF00', label: 'Óptimo' },
    { max: 100, color: '#FFFF00', label: 'Moderado' },
    { max: 200, color: '#FFA500', label: 'Elevado (Evitar)' }, // Subimos el umbral para "Poco saludable" para mayor diferenciación
    { max: 300, color: '#FF4500', label: 'Muy Alto (Dañino)' },
    { max: Infinity, color: '#8B0000', label: 'Crítico (Peligroso)' }
  ],
  pm25: [
    { max: 35, color: '#00FF00', label: 'Óptimo' }, // Ajuste para ser más estricto con PM2.5
    { max: 75, color: '#FFFF00', label: 'Moderado' },
    { max: 150, color: '#FFA500', label: 'Elevado (Evitar)' },
    { max: 250, color: '#FF4500', label: 'Muy Alto (Dañino)' },
    { max: Infinity, color: '#8B0000', label: 'Crítico (Peligroso)' }
  ],
};

// Las funciones getGifBy...Level permanecen igual, pero los labels que reciben ahora son los nuevos.
// Asegúrate de actualizar los GIFs si quieres que reflejen los nuevos labels/significados más específicos.
function getGifByCO2Level(level) {
  if (level.includes('Óptimo')) {
    return "https://media.giphy.com/media/qXFLhFCzhUTPxNz91f/giphy.gif?cid=ecf05e47c7omy75yefgv44996by7tjda35dbrflv1q2iude6&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Bosque verde/naturaleza saludable
  } else if (level.includes('Aceptable')) {
    return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnExancyd2xsZWNzcm03eXI2amNnd21ua3Q0NzZ2OWpyamNwbGFzNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l378aiPPFAGEsetIk/giphy.gif"; // Ciudad con algo de contaminación / ventilación
  } else if (level.includes('Elevado')) {
    return "https://media.giphy.com/media/r7iUygqqlRe6vpFEIw/giphy.gif?cid=790b76112mzqscgyf9xtqyd3nlht4d6611tzc03jtkv577cz&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Smog industrial
  } else if (level.includes('Muy Alto')) {
    return "https://media.giphy.com/media/hUKYX9XcTmGDVn5TP0/giphy.gif?cid=790b7611pcuy2ia8jekfbf1yogbtlejxqtbpxfjlrbkof4p2&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Contaminación severa
  } else if (level.includes('Crítico')) {
    return "https://media.giphy.com/media/iApH5a3k1sYvu/giphy.gif?cid=790b7611bo7g6aqu11aio0ykzyw3wk08l01lpqgim9zzag7m&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Emergencia/evacuación
  } else {
    return "https://media.giphy.com/media/Hkya3YFcXcmQ0/giphy.gif"; // GIF predeterminado
  }
}

function getGifByPM10Level(level) {
  if (level.includes('Óptimo')) {
    return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXAzb3dnbm9wd2djZnAzaDloYzZiY2hrbDJ3dnYyNzVrMnpqMTY2biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jI77q8Mc5yOs5wncJe/giphy.gif"; // Aire limpio
  } else if (level.includes('Moderado')) {
    return "https://media.giphy.com/media/d2Z7keyUwp4rzuG4/giphy.gif?cid=790b7611hsul7000y5ur12tzz7u7hga81sm6mvttlejcpdgm&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Partículas flotando
  } else if (level.includes('Elevado')) {
    return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGxiejVteTk4ZGl1NGJxZ3hxYjNjeDNsM2o5aTZpY3RxbzQ4MXV1YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KchY32GLJK05JNktDq/giphy.gif"; // Polvo visible
  } else if (level.includes('Muy Alto')) {
    return "https://media.giphy.com/media/j7wBU7aHcKf7y/giphy.gif?cid=ecf05e470ermngvkjz9dmj0ect5zz18kph0tsf0ivrtgky8i&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Polvo denso/smog
  } else if (level.includes('Crítico')) {
    return "https://media.giphy.com/media/I4G0jcOtIyagIT8Ory/giphy.gif?cid=ecf05e47t397pyufysrgndiz7m0c1727immo78tg3vurrt0i&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Tormenta de polvo/contaminación extrema
  } else {
    return "https://media.giphy.com/media/f6hnhHkks8bk4jwjh3/giphy.gif"; // GIF predeterminado
  }
}

function getGifByPM25Level(level) {
  if (level.includes('Óptimo')) {
    return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXAzb3dnbm9wd2djZnAzaDloYzZiY2hrbDJ3dnYyNzVrMnpqMTY2biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jI77q8Mc5yOs5wncJe/giphy.gif"; // Respiración normal
  } else if (level.includes('Moderado')) {
    return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWVjcnAxc2F0bXp4YXF5cWFxN252cW9sZ2pmOXFkYTdwNmJmZ3hwcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vVHbd6Xj1kBtc3FAio/giphy.gif"; // Leve irritación
  } else if (level.includes('Elevado')) {
    return "https://media.giphy.com/media/pMMbIx8KqBfVPip6xV/giphy.gif?cid=790b7611gzzlyv7dv144zffdjw0801z23eyfsxp3urugg1tw&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Problema respiratorio
  } else if (level.includes('Muy Alto')) {
    return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGVvMXFhdnFncTRzZXBtaHBsN2VjaDBkeDY3d3A0N2lneGduaDBsaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Rm2iJHrOmNysyBCpF5/giphy.gif"; // Efectos graves respiratorios
  } else if (level.includes('Crítico')) {
    return "https://media.giphy.com/media/I4G0jcOtIyagIT8Ory/giphy.gif?cid=ecf05e47t397pyufysrgndiz7m0c1727immo78tg3vurrt0i&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Mascarilla/protección extrema
  } else {
    return "https://media.giphy.com/media/3o7TKsQGzYHxz5OfAA/giphy.gif"; // GIF predeterminado
  }
}

addressPoints.forEach((point) => {

  if (point.latitude && point.longitude && datosCalidadAire.value[point.key]) {
    const data = datosCalidadAire.value[point.key];
    const co2Value = parseFloat(data.CO2) || 0;
    const pm10Value = parseFloat(data.PM10) || 0;
    const pm25Value = parseFloat(data.PM2_5) || 0;

    const co2Level = levels.co2.find(l => co2Value <= l.max);
    const pm10Level = levels.pm10.find(l => pm10Value <= l.max);
    const pm25Level = levels.pm25.find(l => pm25Value <= l.max);

    // 1. Encontrar el índice de severidad para cada contaminante.
    // Un índice más alto significa un peor estado.
    const co2Index = levels.co2.indexOf(co2Level);
    const pm10Index = levels.pm10.indexOf(pm10Level);
    const pm25Index = levels.pm25.indexOf(pm25Level);

    // 2. Determinar cuál es el peor nivel general.
    let worstIndex = Math.max(co2Index, pm10Index, pm25Index);
    let worstPollutantName = 'CO₂';
    let worstPollutantLevel = co2Level;
    let worstPollutantGif = getGifByCO2Level(co2Level.label);

    if (pm10Index > worstIndex) { // Corregido: solo actualiza si es estrictamente peor
      worstIndex = pm10Index;
      worstPollutantName = 'PM10';
      worstPollutantLevel = pm10Level;
      worstPollutantGif = getGifByPM10Level(pm10Level.label);
    }
    if (pm25Index > worstIndex) { // Corregido: solo actualiza si es estrictamente peor
      // PM2.5 tiene prioridad si su índice es igual al de PM10 por ser más dañino.
      worstIndex = pm25Index;
      worstPollutantName = 'PM2.5';
      worstPollutantLevel = pm25Level;
      worstPollutantGif = getGifByPM25Level(pm25Level.label);
    } else if (pm25Index === worstIndex && worstPollutantName !== 'PM2.5') {
        // Si PM2.5 tiene el mismo índice que el peor actual y no es PM2.5, le damos prioridad
        worstPollutantName = 'PM2.5';
        worstPollutantLevel = pm25Level;
        worstPollutantGif = getGifByPM25Level(pm25Level.label);
    }

    // 3. Crear perfiles generales de estado basados en el índice de severidad.
    const statusProfiles = {
      0: { label: 'Excelente', message: '¡El aire es fresco y puro! Ideal para todas las actividades al aire libre.' },
      1: { label: 'Moderado', message: 'La calidad del aire es moderada. Puedes disfrutar del exterior con normalidad.' },
      2: { label: 'Regular', message: 'La calidad del aire es aceptable. Personas sensibles deben tener precaución.' },
      3: { label: 'Dañino', message: 'Evita la actividad física intensa. Considera usar mascarilla si eres sensible.' },
      4: { label: 'Muy Dañino', message: 'Evita salir a menos que sea esencial. Cierra ventanas y usa purificador de aire.' },
      5: { label: 'Peligroso', message: '¡Alerta máxima! Permanece en interiores, filtra el aire y sigue las indicaciones de las autoridades.' }
    };

    // Seleccionar el perfil de estado general basado en el peor índice encontrado.
    const overallStatus = statusProfiles[worstIndex] || statusProfiles[5];


    let recommendationMessage = '';
    let recommendationColor = overallStatus.color; // Usamos el color del estado general por defecto


    // Asegurarse de que el color del popup refleje la recomendación más crítica o el estado general si no hay una recomendación específica de acción
    const finalPopupColor = recommendationColor || worstPollutantLevel.color;


    const iconUrl = point.key === "airedatosSRCO"
      ? "icon-srco.png"
      : "icon-normal.png";

    // Crear el botón manualmente
    const button = document.createElement("button");
    button.textContent = "+ Info";
    button.style.cssText = `
    background-color: #2563eb; /* azul elegante */
    color: white;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: background-color 0.3s ease;
    margin-top: 20px;
  `;
    button.onmouseover = () => button.style.backgroundColor = '#1d4ed8';
    button.onmouseout = () => button.style.backgroundColor = '#2563eb';

    button.addEventListener("click", () => {
      currentPointKey.value = point.key;
      openModal(ModalComponent);
    });


    const popupDiv = document.createElement("div");

    popupDiv.innerHTML = `
<div style="
  background: ${finalPopupColor};
  color: #111;
  padding: 20px;
  border-radius: 16px;
  max-width: 550px;
  margin: 0 auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  font-family: 'Segoe UI', sans-serif;
  border: 3px solid rgba(255, 255, 255, 0.6);
">
  <div style="text-align: center; padding-bottom: 15px; margin-bottom: 15px; border-bottom: 2px solid rgba(0, 0, 0, 0.1);">
    <h3 style="font-size: 1.8rem; margin: 0; font-weight: 700;">
      Calidad del Aire: ${overallStatus.label}
    </h3>
  </div>

  <div style="display: flex; align-items: center; gap: 20px;">
    
    <div style="flex-shrink: 0;">
      <img src="${worstPollutantGif}" alt="Icono de calidad del aire" style="
        width: 120px; 
        height: 120px; 
        border-radius: 12px; 
        object-fit: cover;
        display: block;
      ">
    </div>

    <div style="flex: 1; text-align: left;">
      <p style="font-size: 1rem; margin: 0 0 12px 0; font-weight: 500;">
        ${overallStatus.message}
      </p>

    </div>
  </div>
</div>
`;  



                // Add button to popup
                popupDiv.appendChild(button);
                // Replace popup content with new dynamic div
                const popupContainer = document.getElementById("popup-container");
                if (popupContainer) {
                    popupContainer.innerHTML = "";
                    popupContainer.appendChild(popupDiv);
                }

                // Create marker and add to cluster
                const marker = L.marker([point.latitude, point.longitude], { icon: myIcon })
                .bindPopup(popupDiv, { maxWidth: "auto", minWidth: 400, maxHeight: 500 });
                marker.on('popupopen', () => {
                const timestamp = datosCalidadAire.value[point.key]?.timestamp;
                if (timestamp) {
                  localStorage.setItem("ultima actualizacion", timestamp);
                  console.log("Guardado en localStorage:", timestamp);
                }
              });
                markers.addLayer(marker);
            }
        });

        // Add marker cluster to map
        initialMap.value.addLayer(markers);

        // Fit map to markers if any exist
        if (markers.getLayers().length > 0) {
            initialMap.value.fitBounds(markers.getBounds());
        }
    });
    // Añadir marcadores con datos dinámicos


    // Leyenda de temperatura y humedad (arriba a la derecha)
const climateLegend = L.control({ position: 'topright' });
climateLegend.onAdd = function () {
  const thingHumidity = datosCalidadAire.value.airedatos.Hum || 0;
  const thingTemperature = datosCalidadAire.value.airedatos.Temp || 0;

             

  const div = L.DomUtil.create('div', 'info climate-legend');
  const temp = Math.round((thingHumidity)) || "--";
  const hum = Math.round((thingTemperature)) || "--";

  div.innerHTML = `
    <div style="
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 12px 16px;
      font-family: 'Segoe UI', sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 180px;
    ">
      <div style="font-weight: 600; font-size: 1rem; margin-bottom: 8px; color: #111;">
        🌤️ Condiciones Ambientales
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem;">🌡️</span>
        <span style="color: #dc2626; font-weight: bold;"> ${hum} °C</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
        <span style="font-size: 1.2rem;">💧</span>
        <span style="color: #2563eb; font-weight: bold;">${temp}%</span>
      </div>
    </div>
  `;
  return div;
};

climateLegend.addTo(initialMap.value);


    // Añadir leyenda de contaminación
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 20, 40, 60, 80, 100];
        const colors = ['#00FF00', '#FFFF00', '#FFA500', '#FF4500', '#FF0000', '#8B0000'];

        div.innerHTML = '<strong>Niveles de Contaminación</strong><br>';
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                `<i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> 
                ${grades[i]}% ${grades[i + 1] ? ' - ' + grades[i + 1] + '%' : '+'}<br>`;
        }
        return div;
    };

    legend.addTo(initialMap.value);
});
</script>

<template>
  <div>
    <HeaderComponent />

    <!-- Este div será el mapa -->
    <div id="map" ref="mapContainer" class="map-container"></div>

    <ModalComponent v-if="isModalOpen" @close="closeModal" />
  </div>
</template>


  
<style>
.arduino-header {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #615f5f, #121212);
  padding: 24px 20px;
  color: white;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.arduino-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.legend {
  background: white;
  padding: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #333;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
.legend i {
  border: 1px solid #999;
}
/* Asegurar que no haya márgenes ni espacios blancos */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Hacer que el `body` y `html` ocupen toda la pantalla */
html, body {
  width: 100%;
  margin: 0;
  background: #504e4ed9; /* Opcional: color de fondo oscuro */
  color: white; /* Opcional: color de texto */
  overflow-x: hidden; /* Evita scroll horizontal */
}

#map {
  position: absolute;
  top: 10;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 0; /* Ajusta según el z-index del HeaderComponent */
}
/* Asegurar que el `div` raíz también ocupe toda la pantalla */
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
#popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
}

.contenedor-principal {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
</style>
