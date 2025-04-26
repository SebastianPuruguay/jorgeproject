import axios from 'axios';

// 🔥 No cambia el baseURL
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://jorgeprojectapiarduino.azurewebsites.net/api'  // Azure Function API en producción
  : 'https://jorgeprojectapiarduino.azurewebsites.net/api';  // También en local por ahora

export async function getThings() {
  try {
    const response = await axios.get(`${baseURL}/getToken`);
    console.log('Se obtuvieron las Things:');
    return response.data;  // 🔥 Ahora ya tienes directamente las Things
  } catch (error) {
    console.error('Error al obtener las Things:', error);
    throw error;
  }
}
