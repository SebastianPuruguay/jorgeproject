
import axios from 'axios';

// 🔥 No cambia el baseURL
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://southamerica-west1-jorgeproject-457717.cloudfunctions.net/function-hello-world'  // Azure Function API en producción
  : 'https://southamerica-west1-jorgeproject-457717.cloudfunctions.net/function-hello-world';  // También en local por ahora

export async function getThings() {
  try {
    const response = await axios.get(`${baseURL}`);
    console.log('Se obtuvieron los datos del Broker:');
    return response.data;  // 🔥 Ahora ya tienes directamente las Things
  } catch (error) {
    console.error('Error al obtener los datos del Broker:', error);
    throw error;
  }
}
