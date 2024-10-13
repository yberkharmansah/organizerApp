<template>
  <div class="goals-container">
    <h1 class="goals-title">Hedeflerim</h1>
    
    <div class="goal-inputs">
      <input v-model="goal.title" placeholder="Hedef Başlığı" />
      <textarea v-model="goal.description" placeholder="Açıklama"></textarea>
      <select v-model="goal.frequency">
        <option value="daily">Günlük</option>
        <option value="weekly">Haftalık</option>
        <option value="monthly">Aylık</option>
      </select>
      <button class="add-goal-button" @click="addGoal">Hedef Ekle</button>
    </div>

    <div class="goals-grid">
      <div v-for="(goal, index) in goals" :key="goal.id" class="goal-card">
        <button class="delete-button" @click="removeGoal(goal.id)">&#10006;</button> <!-- Estetik "X" sembolü -->
        <h3 class="goal-title">{{ goal.title }}</h3>
        <p class="goal-description">{{ goal.description }}</p>
        <p class="goal-deadline">Kalan Süre: {{ calculateRemainingTime(goal.createdAt, goal.frequency) }}</p>
      </div>
    </div>
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
      goals: [],
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
        id: newGoalRef.key,
      })
      .then(() => {
        this.goal.title = '';
        this.goal.description = '';
        this.goal.frequency = 'daily';
        this.fetchGoals();
      })
      .catch((error) => {
        console.error('Hedef eklenirken hata oluştu:', error);
      });
    },

    removeGoal(goalId) {
      const goalRef = dbRef(db, 'goals/' + goalId);
      remove(goalRef)
      .then(() => {
        this.fetchGoals();
      })
      .catch((error) => {
        console.error('Hedef silinirken hata oluştu:', error);
      });
    },

    fetchGoals() {
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
    this.fetchGoals();
  }
};
</script>

<style scoped>
body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}

.goals-container {
  padding: 2rem;
  background-color: #f1f3f4;
  min-height: 100vh; /* Sayfanın tam yüksekliğini kaplar */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; /* Dikey kaydırmayı etkinleştirir */
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  overflow-x: auto; /* Yatay kaydırmayı etkinleştirir */
}

/* Başlık */
.goals-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

/* Hedef girişi */
.goal-inputs {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.goal-inputs input,
.goal-inputs textarea,
.goal-inputs select {
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 300px;
}

/* Hedef Ekle butonu */
.add-goal-button {
  background-color: #00bfff; /* Daha canlı mavi/turkuaz renk */
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-goal-button:hover {
  background-color: #009acd; /* Hover sırasında daha koyu turkuaz */
}

/* Hedef kartları */
.goal-card {
  position: relative;
  background-color: #40E0D0; /* Turkuaz renk */
  color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.goal-description {
  font-size: 1.2rem;
  margin: 1rem 0;
}

.goal-deadline {
  font-size: 1rem;
  font-weight: bold;
  align-self: flex-end;
}

/* Silme butonu */
.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: black; /* Daha şık siyah renk */
  border: 2px solid black; /* Siyah çerçeve */
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.delete-button:hover {
  background-color: black;
  color: white; /* Hover sırasında ters çevirme efekti */
}
.main-content {
  max-height: 100%;
  overflow-y: auto;
}

</style>
