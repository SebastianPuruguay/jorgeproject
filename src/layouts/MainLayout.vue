<!-- eslint-disable no-unused-vars -->
<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import BarraInform from '@/components/BarraInform.vue';
import { getThings } from '@/services/arduinoService';
import { ref, onMounted, onUnmounted } from 'vue';
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
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(initialMap.value);

    // Obtener datos desde Arduino IoT
    try {
        things.value = await getThings();
        console.log('Datos obtenidos:', things.value);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
    initialMap.value.whenReady(async () => {    
    const markers = L.markerClusterGroup();

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
    function getGifByCO2Level(level) {
      if (level.includes('Bajo (Excelente)')) {
        return "https://media.giphy.com/media/qXFLhFCzhUTPxNz91f/giphy.gif?cid=ecf05e47c7omy75yefgv44996by7tjda35dbrflv1q2iude6&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Bosque verde/naturaleza saludable
      } else if (level.includes('Bueno')) {
        return "https://media.giphy.com/media/qXFLhFCzhUTPxNz91f/giphy.gif?cid=ecf05e47c7omy75yefgv44996by7tjda35dbrflv1q2iude6&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Ciudad con algo de contaminación
      }else if (level.includes('Somnolencia')) {
        return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnExancyd2xsZWNzcm03eXI2amNnd21ua3Q0NzZ2OWpyamNwbGFzNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l378aiPPFAGEsetIk/giphy.gif"; // Ciudad con algo de contaminación
      } else if (level.includes('Alto (Fatiga)')) {
        return "https://media.giphy.com/media/r7iUygqqlRe6vpFEIw/giphy.gif?cid=790b76112mzqscgyf9xtqyd3nlht4d6611tzc03jtkv577cz&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Smog industrial
      } else if (level.includes('Muy alto (Mareos)')) {
        return "https://media.giphy.com/media/hUKYX9XcTmGDVn5TP0/giphy.gif?cid=790b7611pcuy2ia8jekfbf1yogbtlejxqtbpxfjlrbkof4p2&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Contaminación severa
      } else if (level.includes('Extremo (Emergencia)')) {
        return "https://media.giphy.com/media/iApH5a3k1sYvu/giphy.gif?cid=790b7611bo7g6aqu11aio0ykzyw3wk08l01lpqgim9zzag7m&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Emergencia/evacuación
      } else {
        return "https://media.giphy.com/media/Hkya3YFcXcmQ0/giphy.gif"; // GIF predeterminado
      }
    }

    function getGifByPM10Level(level) {
      if (level.includes('Bueno')) {
        return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXAzb3dnbm9wd2djZnAzaDloYzZiY2hrbDJ3dnYyNzVrMnpqMTY2biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jI77q8Mc5yOs5wncJe/giphy.gif"; // Aire limpio
      } else if (level.includes('Moderado')) {
        return "https://media.giphy.com/media/d2Z7keyUwp4rzuG4/giphy.gif?cid=790b7611hsul7000y5ur12tzz7u7hga81sm6mvttlejcpdgm&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Partículas flotando
      } else if (level.includes('Poco saludable')) {
        return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGxiejVteTk4ZGl1NGJxZ3hxYjNjeDNsM2o5aTZpY3RxbzQ4MXV1YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KchY32GLJK05JNktDq/giphy.gif"; // Polvo visible
      } else if (level.includes('Muy dañino')) {
        return "https://media.giphy.com/media/j7wBU7aHcKf7y/giphy.gif?cid=ecf05e470ermngvkjz9dmj0ect5zz18kph0tsf0ivrtgky8i&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Polvo denso/smog
      } else if (level.includes('Peligroso')) {
        return "https://media.giphy.com/media/I4G0jcOtIyagIT8Ory/giphy.gif?cid=ecf05e47t397pyufysrgndiz7m0c1727immo78tg3vurrt0i&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Tormenta de polvo/contaminación extrema
      } else {
        return "https://media.giphy.com/media/f6hnhHkks8bk4jwjh3/giphy.gif"; // GIF predeterminado
      }
    }

    function getGifByPM25Level(level) {
      if (level.includes('Bueno')) {
        return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXAzb3dnbm9wd2djZnAzaDloYzZiY2hrbDJ3dnYyNzVrMnpqMTY2biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jI77q8Mc5yOs5wncJe/giphy.gif"; // Respiración normal
      } else if (level.includes('Moderado')) {
        return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWVjcnAxc2F0bXp4YXF5cWFxN252cW9sZ2pmOXFkYTdwNmJmZ3hwcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vVHbd6Xj1kBtc3FAio/giphy.gif"; // Leve irritación
      } else if (level.includes('Poco saludable')) {
        return "https://media.giphy.com/media/pMMbIx8KqBfVPip6xV/giphy.gif?cid=790b7611gzzlyv7dv144zffdjw0801z23eyfsxp3urugg1tw&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Problema respiratorio
      } else if (level.includes('Muy dañino')) {
        return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGVvMXFhdnFncTRzZXBtaHBsN2VjaDBkeDY3d3A0N2lneGduaDBsaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Rm2iJHrOmNysyBCpF5/giphy.gif"; // Efectos graves respiratorios
      } else if (level.includes('Peligroso')) {
        return "https://media.giphy.com/media/I4G0jcOtIyagIT8Ory/giphy.gif?cid=ecf05e47t397pyufysrgndiz7m0c1727immo78tg3vurrt0i&ep=v1_gifs_search&rid=giphy.gif&ct=g"; // Mascarilla/protección extrema
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
            console.log('FIN POR',things.value[2])
           
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
        <h1>Arduino CLOUD</h1>
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
