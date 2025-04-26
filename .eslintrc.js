module.exports = {
  env: {
    browser: true,      // Configuración para el navegador
    es2021: true,       // Habilitar ES2021
    node: true,         // Habilitar Node.js
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',  // Asegúrate de que Vue 3 está configurado
  ],
  parserOptions: {
    ecmaVersion: 2021,  // Usar la versión de ECMAScript 2021
    sourceType: 'module',  // Habilitar los módulos ES6
  },
  plugins: ['vue'],
  globals: {
    defineEmits: 'readonly',
    defineProps: 'readonly',
    defineExpose: 'readonly',
    // Si estás usando `__dirname` o `process`, también puedes agregarlos aquí:
    process: 'readonly', // Agregar process para evitar el error de "process is not defined"
    module: 'readonly',  // Agregar module para evitar el error de "module is not defined"
  },
};
