// goals.js (veya store.js)
import { db } from './firebase'; // Firebase yapılandırma dosyanızın yolu
import { ref as dbRef, onValue, set } from 'firebase/database';
import { ref } from 'vue';

export const useGoalsStore = () => {
  const goals = ref([]);

  const loadGoalsFromDatabase = () => {
    const goalsRef = dbRef(db, 'goals'); // 'goals' düğümüne referans
    onValue(goalsRef, (snapshot) => {
      goals.value = []; // Önceki hedefleri temizle
      snapshot.forEach((childSnapshot) => {
        const goalData = childSnapshot.val();
        goals.value.push({ id: childSnapshot.key, ...goalData }); // Hedefleri ekle
      });
    });
  };

  // Hedef ekleme işlevi
  const addGoal = async (newGoal) => {
    const goalsRef = dbRef(db, 'goals'); // 'goals' düğümüne referans
    const newGoalRef = dbRef(goalsRef, Date.now().toString()); // Yeni hedef için child referansı oluştur
    try {
      await set(newGoalRef, newGoal); // Yeni hedefi veritabanına ekle
      console.log('Yeni hedef eklendi:', newGoal);
    } catch (error) {
      console.error('Hedef eklenirken hata oluştu:', error);
    }
  };

  // Bileşen yüklendiğinde hedefleri yükle
  loadGoalsFromDatabase();

  return {
    goals,
    addGoal, // Yeni hedef ekleme fonksiyonunu döndür
  };
};
