<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Planlama Asistanı</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="ion-padding">
          <h2>Günlük Görevler</h2>
          <ul>
            <li v-for="(task, index) in tasks" :key="index">
              {{ task }}
            </li>
          </ul>
          <ion-button expand="block" @click="addTask">Yeni Görev Ekle</ion-button>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tasks: ['Almanca çalış', '15 dakika kitap oku'], // Başlangıç görevleri
      };
    },
    methods: {
      addTask() {
        const newTask = prompt('Yeni görev girin:');
        if (newTask) {
          this.tasks.push(newTask); // Yeni görev ekleme işlemi
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
  }
  </style>
  