<!-- eslint-disable no-unused-vars -->
<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import BarraInform from '@/components/BarraInform.vue';
import { getThings } from '@/services/arduinoService';
import { ref, onMounted } from 'vue';
import "leaflet/dist/leaflet.css";
import * as L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import "leaflet.markercluster";
import { addressPoints } from '../components/markerDemo';
import icon from '../components/icon.png';
import markerShadow from '../components/marker-shadow.png';
import ModalComponent from "@/pages/ModalMasInfo.vue";

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
const things = ref([]);
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
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(initialMap.value);

    // Obtener datos desde Arduino IoT
    try {
        things.value = await getThings();
        console.log('Things:', things.value);
    } catch (error) {
        console.error('Error al cargar las Things:', error);
    }
    initialMap.value.whenReady(async () => {    
    const markers = L.markerClusterGroup();

    const levels = {
    co2: [
        { max: 400, color: '#00FF00', label: 'Bajo (Excelente)' }, 
        { max: 1000, color: '#FFFF00', label: 'Moderado' }, 
        { max: 2000, color: '#FFA500', label: 'Alto (Precaución)' }, 
        { max: 5000, color: '#FF4500', label: 'Muy alto (Peligro)' }, 
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
function getGifByCO2Level(level) {
  if (level.includes('Bajo (Excelente)')) {
    return "https://media.giphy.com/media/l0MYSvPXN9StPGx4k/giphy.gif"; // Bosque verde/naturaleza saludable
  } else if (level.includes('Moderado')) {
    return "https://media.giphy.com/media/JoV2BiMWVZ96taSewG/giphy.gif"; // Ciudad con algo de contaminación
  } else if (level.includes('Alto') || level.includes('Precaución')) {
    return "https://media.giphy.com/media/3o7TKsQzRs1VWXuG3u/giphy.gif"; // Smog industrial
  } else if (level.includes('Muy alto') || level.includes('Peligro')) {
    return "https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif"; // Contaminación severa
  } else if (level.includes('Extremo') || level.includes('Emergencia')) {
    return "https://media.giphy.com/media/3o7aD4GrHwn8vsGBTa/giphy.gif"; // Emergencia/evacuación
  } else {
    return "https://media.giphy.com/media/Hkya3YFcXcmQ0/giphy.gif"; // GIF predeterminado
  }
}

function getGifByPM10Level(level) {
  if (level.includes('Bueno')) {
    return "https://media.giphy.com/media/3ohzdJVOJsJR3nN0zK/giphy.gif"; // Aire limpio
  } else if (level.includes('Moderado')) {
    return "https://media.giphy.com/media/toXKzaJP3WIgM/giphy.gif"; // Partículas flotando
  } else if (level.includes('Poco saludable')) {
    return "https://media.giphy.com/media/kEuaRuXBVLfTAcUb9v/giphy.gif"; // Polvo visible
  } else if (level.includes('Muy dañino')) {
    return "https://media.giphy.com/media/3o7TKzzMMNluisJTFe/giphy.gif"; // Polvo denso/smog
  } else if (level.includes('Peligroso')) {
    return "https://media.giphy.com/media/l0ExheuOUuXZ8F72g/giphy.gif"; // Tormenta de polvo/contaminación extrema
  } else {
    return "https://media.giphy.com/media/f6hnhHkks8bk4jwjh3/giphy.gif"; // GIF predeterminado
  }
}

function getGifByPM25Level(level) {
  if (level.includes('Bueno')) {
    return "https://media.giphy.com/media/3o7TKEKj0pMjzs7Fv2/giphy.gif"; // Respiración normal
  } else if (level.includes('Moderado')) {
    return "https://media.giphy.com/media/kHZVpxPHv5Rkk/giphy.gif"; // Leve irritación
  } else if (level.includes('Poco saludable')) {
    return "https://media.giphy.com/media/l2JJvKbgIEsD55EZi/giphy.gif"; // Problema respiratorio
  } else if (level.includes('Muy dañino')) {
    return "https://media.giphy.com/media/eK12uCsrAh4wmTXejp/giphy.gif"; // Efectos graves respiratorios
  } else if (level.includes('Peligroso')) {
    return "https://media.giphy.com/media/gj4ZUnOLg0Us4p5jft/giphy.gif"; // Mascarilla/protección extrema
  } else {
    return "https://media.giphy.com/media/3o7TKsQGzYHxz5OfAA/giphy.gif"; // GIF predeterminado
  }
}

    addressPoints.forEach((point) => {
        if (point.latitude && point.longitude && things.value.length > 2) {
            const thingHumidity = things.value[0] || { name: 'Desconocido', last_value: 'N/A' };
            const thingTemperature = things.value[1] || { name: 'Desconocido', last_value: 'N/A' };
            const thingCO2 = things.value[2] || { name: 'Desconocido', last_value: 'N/A' };
            const thingPM10 = things.value[3] || { name: 'Desconocido', last_value: 'N/A' };
            const thingPM1_0 = things.value[4] || { name: 'Desconocido', last_value: 'N/A' };
            const thingPM25 = things.value[5] || { name: 'Desconocido', last_value: 'N/A' };

           
        const co2Value = parseFloat(thingCO2.last_value) || 0;
        const pm10Value = parseFloat(thingPM10.last_value) || 0;
        const pm25Value = parseFloat(thingPM25.last_value) || 0;

        const co2Level = levels.co2.find(l => co2Value <= l.max);
        const pm10Level = levels.pm10.find(l => pm10Value <= l.max);
        const pm25Level = levels.pm25.find(l => pm25Value <= l.max);

        // Determinar el color más crítico (peor valor)
        const worstColor = [co2Level.color, pm10Level.color, pm25Level.color].sort((a, b) => {
            return Object.values(levels).flat().find(l => l.color === b).max - 
                   Object.values(levels).flat().find(l => l.color === a).max;
        })[0];

         // Crear el botón manualmente
  const button = document.createElement("button");
  button.textContent = "+ Info";
  button.style.cssText = `
    background-color: #3b82f6; 
    color: white; 
    padding: 10px 20px; 
    border-radius: 5px; 
    border: none; 
    cursor: pointer;
    margin-top: 10px;
  `;

  // Agregar el evento al botón para abrir el modal
  button.addEventListener("click", () => {
  openModal(ModalComponent);
});

  // Crear el contenido del popup
  const popupDiv = document.createElement("div");
         popupDiv.innerHTML =`
<div style="color: #000; background-color: white; padding: 20px; border-radius: 10px; text-align: center; font-weight: bold; width: 500px; max-width: 900px; margin: 0 auto; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h3 style="margin: 0 0 15px; font-size: 1.5em;">Niveles de Contaminación</h3>
    
    <!-- Contenedor con columnas verticales -->
    <div style="display: flex; flex-direction: row; justify-content: space-between; text-align: center; color: #000;">
        
        <!-- Columna CO2 -->
        <div style="flex: 1; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
            <p style="font-size: 1.1em; background-color: ${co2Level.color}; padding: 8px; border-radius: 8px; width: 100%; margin-bottom: 15px;">
                CO2: ${co2Value} ppm — ${co2Level.label}
            </p>
            <div style="width: 100%; text-align: center; padding: 0 5px;">
                <img src="${getGifByCO2Level(co2Level.label)}" style="width: 150px; max-width: 100%; height: auto; border-radius: 8px;" alt="Nivel de CO2">
            </div>
        </div>
        
        <!-- Columna PM10 -->
        <div style="flex: 1; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
            <p style="font-size: 1.1em; background-color: ${pm10Level.color}; padding: 8px; border-radius: 8px; width: 100%; margin-bottom: 15px;">
                PM10: ${pm10Value} µg/m³ — ${pm10Level.label}
            </p>
            <div style="width: 100%; text-align: center; padding: 0 5px;">
                <img src="${getGifByPM10Level(pm10Level.label)}" style="width: 150px; max-width: 100%; height: auto; border-radius: 8px;" alt="Nivel de PM10">
            </div>
        </div>
        
        <!-- Columna PM2.5 -->
        <div style="flex: 1; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
            <p style="font-size: 1.1em; background-color: ${pm25Level.color}; padding: 8px; border-radius: 8px; width: 100%; margin-bottom: 15px;">
                PM2.5: ${pm25Value} µg/m³ — ${pm25Level.label}
            </p>
            <div style="width: 100%; text-align: center; padding: 0 5px;">
                <img src="${getGifByPM25Level(pm25Level.label)}" style="width: 150px; max-width: 100%; height: auto; border-radius: 8px;" alt="Nivel de PM2.5">
            </div>
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
        <HeaderComponent @toggleDrawer="toggleDrawer" />
        <h1>Arduino Things</h1>
        <ul>
          <li v-for="thing in things" :key="thing.last_value">
            {{ thing.name }} (Valor: {{ thing.last_value }})
          </li>
        </ul>
      </div>
  
      <div id="map" ref="mapContainer" style="height: 515px;"></div>
      <ModalComponent v-if="isModalOpen" @close="closeModal" />

      <BarraInform class="bg-red-500 text-white" />  
  </template>
  
<style>
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
  height: 100%;
  background: #504e4ed9; /* Opcional: color de fondo oscuro */
  color: white; /* Opcional: color de texto */
  overflow-x: hidden; /* Evita scroll horizontal */
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
