<template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated class="colorLAyout">
        <q-toolbar>
          <q-btn
            class="btnCerrar"
            flat
            dense
            round
            aria-label="Menu"
            @click="toggleLeftDrawer"
            v-if="showDivs && tipUser == 1"
          >
            <template v-slot:default>
              <img
                src="src/assets/menu.png"
                alt="Menu"
                style="width: 24px; height: 24px"
              />
            </template>
          </q-btn>
  
          <q-img
            src="src\assets\logofab.png"
            class="logFab"
            @click="DasbPrincipalLog"
          ></q-img>
  
          <q-btn-dropdown
            :label="currentLanguageLabel"
            icon="language"
            flat
            color="red"
          >
            <q-list>
              <q-item clickable v-close-popup @click="$i18n.locale = 'es-PE'">
                <q-item-section>Spanish</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$i18n.locale = 'en-US'">
                <q-item-section>English</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <div class="divNostr">
            <a @click="Nosotros" class="StyleNos">
              {{ $t("MainLayout.nosotros") }}
            </a>
          </div>
          <div class="divBtn">
            <q-btn
              class="stlBTIniciarSesion"
              @click="loguearse"
              v-if="!showDivs"
              >{{ $t("MainLayout.iniciarS") }}</q-btn
            >
            <q-btn
              class="stlBTCerrarSesion"
              v-if="showDivs"
              @click="cerrarSesion"
              >{{ $t("MainLayout.cerrarS") }}</q-btn
            >
          </div>
        </q-toolbar>
      </q-header>
  
      <q-drawer
        v-model="leftDrawerOpen"
        overlay
        bordered
        class="menuEstilo"
        v-if="tipUser == 1"
      >
        <q-toolbar>
          <q-btn flat round dense @click="toggleLeftDrawer" class="btnCerrar">
            <!-- Utiliza el slot de contenido del botón para colocar la imagen -->
            <template v-slot:default>
              <img
                src="src/assets/close.png"
                alt="Cerrar"
                style="width: 24px; height: 24px"
              />
            </template>
          </q-btn>
  
          <q-img src="src\assets\logofab.png" class="logFabtitle"></q-img>
        </q-toolbar>
        <div class="rectangulo-fino-horizontal"></div>
        <q-div>
          <EssentialLink />
        </q-div>
      </q-drawer>
  
      <q-page-container>
        <router-view @loginSuccess="handleLoginSuccess" />
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  
  </script>
  
  <style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap");
  
  /*///////////////////// Estilos para computadora /////////////////////////////*/
  @media screen and (min-width: 844px) {
    .colorLAyout {
      background-color: #d9d9d9;
      padding: 20px 20px;
    }
    .stlBTIniciarSesion {
      color: #ffff;
      background-color: #db0e0e;
      border-radius: 10px;
      font-family: "lexend";
      font-size: 120%;
    }
    .stlBTCerrarSesion {
      color: #ffff;
      background-color: #db0e0e;
      border-radius: 10px;
      font-family: "lexend";
      font-size: 120%;
    }
    .divBtn {
      margin-left: 70%;
    }
    .logFab {
      width: 10%;
      min-width: 10%;
      margin-left: 1%;
      cursor: pointer;
    }
    .menuEstilo {
      background-color: #d9d9d9;
    }
    .btnCerrar {
      color: #db0e0e;
    }
    .title_toolbar {
      font-family: "lexend";
      font-size: 250%;
      font-weight: 54%;
      color: #db0e0e;
    }
    .logFabtitle {
      width: 50%;
      margin-top: 5%;
      margin-left: 15%;
    }
  
    .rectangulo-fino-horizontal {
      margin-top: 5%;
      border: 1px solid #db0e0e;
      background-color: #db0e0e;
      width: 60%; /* Ancho del rectángulo */
      height: 0.05px; /* Altura del rectángulo */
      margin-left: 25%;
    }
    .StyleNos {
      font-family: "lexend";
      color: #db0e0e;
      text-decoration: underline;
      font-size: 18px;
      cursor: pointer;
    }
    .divNostr {
      position: absolute;
      left: 80%;
      top: 40%;
      height: 50px;
      width: 50px;
    }
    /* Estilo para el scroll */
    ::-webkit-scrollbar {
      width: 10px; /* Ancho del scroll */
    }
  
    /* Estilo para el pulgar (barra de desplazamiento) del scroll */
    ::-webkit-scrollbar-thumb {
      background-color: #2c3039; /* Color rojo */
      border-radius: 5px; /* Borde redondeado */
    }
    ::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }
  }
  
  /*///////////////////// Estilos para celulares /////////////////////////////*/
  @media screen and (max-width: 844px) {
    .colorLAyout {
      background-color: #d9d9d9;
      padding: 15px 15px;
    }
    .btnCerrar {
      color: #db0e0e;
    }
    .menuEstilo {
      background-color: #d9d9d9;
    }
    .logFab {
      width: 20%;
      min-width: 20%;
      margin-left: 1%;
      cursor: pointer;
    }
    .stlBTIniciarSesion {
      color: #ffff;
      background-color: #db0e0e;
      border-radius: 5px;
      font-family: "lexend";
      font-size: 80%;
    }
    .divBtn {
      margin-left: 2%;
    }
    .logFabtitle {
      width: 50%;
      margin-top: 5%;
      margin-left: 15%;
    }
  
    .rectangulo-fino-horizontal {
      margin-top: 5%;
      border: 1px solid #db0e0e;
      background-color: #db0e0e;
      width: 60%; /* Ancho del rectángulo */
      height: 0.05px; /* Altura del rectángulo */
      margin-left: 25%;
    }
    .StyleNos {
      font-family: "lexend";
      color: #db0e0e;
      text-decoration: underline;
      font-size: 14px;
    }
    .divNostr {
      padding-left: 0%;
    }
    .stlBTCerrarSesion {
      color: #ffff;
      background-color: #db0e0e;
      border-radius: 10px;
      font-family: "lexend";
      font-size: 80%;
    }
  }
  </style>
  