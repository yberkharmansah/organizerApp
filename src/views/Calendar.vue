<template>
  <div>
    <vue-cal
      style="height: 600px"
      :events="events"
      :on-event-create="false"
      @cell-click="onDaySelect"
      @event-click="onEventClick"
      default-view="month"
      :time="true"
      :display-event-time="true"
    />
    <div v-if="selectedDay" class="container mt-4">
  <div class="card border-primary text-center">
    <div class="card-body">
      <h3 class="card-title">Seçilen Gün: {{ selectedDay }}</h3>

      <div class="form-group">
        <label for="goal-select" class="font-weight-bold">Görev Seç:</label>
        <select id="goal-select" v-model="selectedGoal" class="form-control">
          <option disabled value="">Görev Seçin</option>
          <option v-for="goal in goals" :key="goal.id" :value="goal.title">
            {{ goal.title }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="time-select" class="font-weight-bold">Saat Seç:</label>
        <select id="time-select" v-model="selectedTime" class="form-control">
          <option disabled value="">Saat Seçin</option>
          <option v-for="hour in hours" :key="hour" :value="hour">
            {{ hour }}
          </option>
        </select>
      </div>

      <button @click="addTaskToCalendar" class="btn btn-primary btn-lg">Görevi Takvime Ekle</button>
    </div>
  </div>
</div>
  </div>
</template>
<script>

import VueCal from 'vue-cal';

import 'vue-cal/dist/vuecal.css';

import { ref, onMounted } from 'vue';

import { db } from '../firebase'; // Firebase yapılandırma dosyanızın yolu

import { ref as dbRef, set, onValue, remove } from 'firebase/database'; // Firebase veritabanı işlevleri

import { useGoalsStore } from '../store.js'; // Store'dan hedefleri içe aktar

export default {

components: {

VueCal,

},

setup() {

const goalsStore = useGoalsStore(); // Goals store'dan hedefleri çekeceğiz

const goals = goalsStore.goals; // Hedefleri alıyoruz

const events = ref([]); // Takvime eklenecek etkinlikler (görevler)

const selectedDay = ref(null); // Seçilen gün

const selectedGoal = ref(''); // Seçilen görev

const selectedTime = ref(''); // Seçilen saat

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Saat aralığı

// Etkinlik renklerini günlük, haftalık, aylık seçimine göre belirle

const determineEventColor = (goalType) => {

if (goalType === 'daily') {

return 'green'; // Günlük görevler için yeşil

} else if (goalType === 'weekly') {

return 'blue'; // Haftalık görevler için mavi

} else if (goalType === 'monthly') {

return 'purple'; // Aylık görevler için mor

} else {

return 'gray'; // Belirtilmemiş bir tür için gri

}

};

// Tıklanan gün için gün bilgisi alıyoruz

const onDaySelect = (time) => {

selectedDay.value = new Date(time.date).toLocaleDateString('en-CA');

};

// Görevi takvime ekleme işlemi

const addTaskToCalendar = () => {
  if (selectedGoal.value && selectedDay.value && selectedTime.value) {
    const today = new Date();
    const selectedDate = new Date(selectedDay.value);

    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      console.warn('Geçmiş bir güne etkinlik eklenemez.');
      alert('Geçmiş bir güne etkinlik eklenemez. Lütfen bugünkü veya gelecekteki bir tarih seçin.');
      return;
    }

    const start = `${selectedDay.value} ${selectedTime.value}`;
    const end = `${selectedDay.value} ${parseInt(selectedTime.value.split(':')[0]) + 1}:00`;

    // Seçilen görevin türüne göre renk belirleme
    const selectedGoalObject = goals.value.find((goal) => goal.title === selectedGoal.value);
    const goalType = selectedGoalObject ? selectedGoalObject.frequency : 'belirtilmemiş'; 

    const newEvent = {
      start: start,
      end: end,
      title: selectedGoal.value, // Seçilen görev
      class: determineEventColor(goalType), // Renk sınıfı belirleme
    };

    events.value.push(newEvent);

    const newEventRef = dbRef(db, 'calendar-events/' + Date.now());
    set(newEventRef, newEvent)
      .then(() => {
        console.log('Yeni etkinlik veritabanına kaydedildi:', newEvent);
      })
      .catch((error) => {
        console.error('Etkinlik kaydedilirken hata oluştu:', error);
      });

    selectedGoal.value = '';
    selectedTime.value = '';
  } else {
    console.warn('Etkinlik eklenemedi, lütfen tüm alanları doldurun.');
  }
};
// Etkinliği silme fonksiyonu

const onEventClick = (event) => {

const eventId = event.id; // Tıklanan etkinliğin ID'sini alıyoruz

if (confirm(`Bu etkinliği silmek istediğinizden emin misiniz: ${event.title}?`)) {

// Firebase'den silme işlemi

const eventRef = dbRef(db, 'calendar-events/' + eventId); // Firebase'deki etkinliğin referansı

remove(eventRef)

.then(() => {

console.log('Etkinlik silindi:', event);

// Silinen etkinliği events listesinden de kaldırıyoruz

events.value = events.value.filter((e) => e.id !== eventId);

})

.catch((error) => {

console.error('Etkinlik silinirken hata oluştu:', error);

});

}

};

// Takvim başlangıçta yüklenirken etkinlikleri getir

const loadEventsFromDatabase = () => {

const eventsRef = dbRef(db, 'calendar-events');

onValue(eventsRef, (snapshot) => {

events.value = []; // Önceki etkinlikleri temizle

snapshot.forEach((childSnapshot) => {

const eventData = childSnapshot.val();

events.value.push({ id: childSnapshot.key, ...eventData }); // Firebase'deki etkinlik verisini al

});

});

};

onMounted(() => {

loadEventsFromDatabase(); // Bileşen yüklendiğinde etkinlikleri yükle

});

return {

goals,

events,

selectedDay,

selectedGoal,

selectedTime,

hours,

onDaySelect,

addTaskToCalendar,

onEventClick, // Silme işlemi için eklenen fonksiyon

};

},

};

</script>

<style>
.vuecal {
  border: 1px solid #e0e0e0 !important;
  background-color: #ffffff !important;
}

.vuecal__header {
  background-color: #4a90e2 !important;
  color: white !important;
  font-size: 1.5rem !important;
  padding: 10px !important;
  text-align: center !important;
}
.vuecal__day {
  border: 1px solid #f0f0f0 !important;
  padding: 15px !important;
  text-align: center !important;
}
.vuecal__day:hover {
  background-color: #f7f7f7 !important;
}

.vuecal__event {
  border-radius: 6px !important;
  padding: 5px !important;
  color: white !important;
  margin: 2px 0 !important;
  background-color: rgb(52, 131, 221) !important; /* Arka plan rengini mavi yap */
}
.card {
  max-width: 400px; /* Kart genişliği */
  margin: 0 auto; /* Ortalamak için */
  margin-top: 20px; /* Üstten boşluk */
  border-radius: 10px; /* Köşe yuvarlama */
  background-color: rgb(52, 131, 221) !important; /* Kart arka plan rengi */
  color: white; /* Kart içindeki yazıların beyaz olması */
}

.card-title {
  font-size: 1.8rem; /* Başlık yazı büyüklüğü */
  margin-bottom: 20px; /* Başlık altında boşluk */
  color: white; /* Başlık yazısı beyaz */
}

.form-group {
  margin-bottom: 20px; /* Dropdown ve inputlar arasında daha fazla boşluk */
  margin: 20px auto 0; /* Ortalamak için yukarıdan boşluk ve ortalama */
}

label {
  font-size: 1.2rem; /* Label yazı büyüklüğü */
  color: white; /* Label yazısı beyaz */
}

.form-control {
  margin: 10px 0; /* Dropdownlar arasında boşluk */
  font-size: 1.1rem; /* Dropdown yazı büyüklüğü */
  color: black; /* Dropdown içindeki yazı rengi (istenirse değiştirilebilir) */
}

.btn {
  font-size: 1.2rem; /* Buton yazı büyüklüğü */
  padding: 10px 20px; /* Buton iç boşlukları */
  display: block; /* Butonu bloğa çevir */
  margin: 20px auto 0; /* Ortalamak için yukarıdan boşluk ve ortalama */
  color: rgb(52, 131, 221); /* Buton yazısı beyaz */
}

</style>