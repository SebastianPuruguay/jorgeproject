import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://api2.arduino.cc'  // URL para producción
  : '';  // Ruta de proxy para desarrollo

const clientId = 't7DN3Z1XFITFRMPBxS4wg0vWUT8kTkrG';
const clientSecret = 'yiFYoi36tibqoCpsTmdz10QuPyPRZqoR0h1GEQ9R779SSilWLMxwtcy8I5vmeiHT';

async function getToken() {
  try {
    const response = await axios.post(`${baseURL}/api/iot/v1/clients/token`, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: 'https://api2.arduino.cc/iot'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
}

export async function getThings() {
  try {
    const token = await getToken();

    const response = await axios.get(`${baseURL}/api/iot/v2/things/5e7d6f36-3fc2-4d2a-a743-2e864ab34fd3/properties`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener las Things:', error);
    throw error;
  }
}
