<template>
  <div>
    <h1>Hedeflerim</h1>
    
    <div>
      <input v-model="goal.title" placeholder="Hedef Başlığı" />
      <textarea v-model="goal.description" placeholder="Açıklama"></textarea>
      <select v-model="goal.frequency">
        <option value="daily">Günlük</option>
        <option value="weekly">Haftalık</option>
        <option value="monthly">Aylık</option>
      </select>
      <button @click="addGoal">Hedef Ekle</button>
    </div>

    <ul>
      <li v-for="(goal, index) in goals" :key="index">
        <h3>{{ goal.title }}</h3>
        <p>{{ goal.description }}</p>
        <p>Kalan Süre: {{ calculateRemainingTime(goal.createdAt, goal.frequency) }}</p>
        <button @click="removeGoal(goal.id)">Sil</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase'; 
import { ref as dbRef, set, remove, onValue } from 'firebase/database';

export default {
  data() {
    return {
      goal: {
        title: '',
        description: '',
        frequency: 'daily',
      },
      goals: [], // Burada hedefleri tutacağız
    };
  },
  methods: {
    addGoal() {
      const newGoalRef = dbRef(db, 'goals/' + Date.now());
      set(newGoalRef, {
        title: this.goal.title,
        description: this.goal.description,
        frequency: this.goal.frequency,
        createdAt: new Date().toISOString(),
        id: newGoalRef.key, // Her hedefe bir ID veriyoruz
      })
      .then(() => {
        console.log('Yeni hedef eklendi:', this.goal);
        this.goal.title = '';
        this.goal.description = '';
        this.goal.frequency = 'daily';
        this.fetchGoals(); // Hedefleri tekrar yükle
      })
      .catch((error) => {
        console.error('Hedef eklenirken hata oluştu:', error);
      });
    },

    removeGoal(goalId) {
      const goalRef = dbRef(db, 'goals/' + goalId);
      remove(goalRef)
      .then(() => {
        console.log('Hedef silindi:', goalId);
        this.fetchGoals(); // Hedefleri tekrar yükle
      })
      .catch((error) => {
        console.error('Hedef silinirken hata oluştu:', error);
      });
    },

    fetchGoals() {
      // Firebase'den hedefleri yükleme fonksiyonu
      const goalsRef = dbRef(db, 'goals');
      onValue(goalsRef, (snapshot) => {
        this.goals = [];
        snapshot.forEach((childSnapshot) => {
          const goalData = childSnapshot.val();
          this.goals.push({ ...goalData, id: childSnapshot.key });
        });
      });
    },

    calculateRemainingTime(createdAt, frequency) {
      const createdDate = new Date(createdAt);
      let targetDate;

      switch (frequency) {
        case 'daily':
          targetDate = new Date(createdDate.setDate(createdDate.getDate() + 1));
          break;
        case 'weekly':
          targetDate = new Date(createdDate.setDate(createdDate.getDate() + 7));
          break;
        case 'monthly':
          targetDate = new Date(createdDate.setMonth(createdDate.getMonth() + 1));
          break;
      }

      const now = new Date();
      const timeDiff = targetDate - now;

      if (timeDiff < 0) {
        return 'Tarihi geçmiş görev';
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      return `${days} gün, ${hours} saat, ${minutes} dakika`;
    },
  },

  mounted() {
    this.fetchGoals(); // Bileşen yüklendiğinde hedefleri al
  }
};
</script>

<style scoped>
/* Buraya stil ekleyebilirsiniz */
</style>
