<template>
  <div>
    <vue-cal
      style="height: 600px"
      :events="events" 
      @cell-click="onDaySelect" 
      @event-click="onEventClick" 
    />

    <div v-if="selectedDay">
      <h3>Seçilen Gün: {{ selectedDay }}</h3>

      <label for="goal-select">Görev Seç:</label>
      <select id="goal-select" v-model="selectedGoal">
        <option disabled value="">Görev Seçin</option>
        <option v-for="goal in goals" :key="goal.id" :value="goal.title">
          {{ goal.title }}
        </option>
      </select>

      <!-- Saat seçimi -->
      <label for="time-select">Saat Seç:</label>
      <select id="time-select" v-model="selectedTime">
        <option disabled value="">Saat Seçin</option>
        <option v-for="hour in hours" :key="hour" :value="hour">
          {{ hour }}
        </option>
      </select>

      <button @click="addTaskToCalendar">Görevi Takvime Ekle</button>
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

    // Tıklanan gün için gün bilgisi alıyoruz
    const onDaySelect = (time) => {
      selectedDay.value = new Date(time.date).toLocaleDateString('en-CA');
    };

    // Görevi takvime ekleme işlemi
    const addTaskToCalendar = () => {
      if (selectedGoal.value && selectedDay.value && selectedTime.value) {
        const today = new Date();
        const selectedDate = new Date(selectedDay.value);

        // Geçmiş tarihe etkinlik eklenmesini önle
        if (selectedDate < today.setHours(0, 0, 0, 0)) {
          console.warn('Geçmiş bir güne etkinlik eklenemez.');
          alert('Geçmiş bir güne etkinlik eklenemez. Lütfen bugünkü veya gelecekteki bir tarih seçin.');
          return; // İşlemi durdur
        }

        const newEvent = {
          start: `${selectedDay.value} ${selectedTime.value}`, // Seçilen gün ve saat
          end: `${selectedDay.value} ${parseInt(selectedTime.value.split(':')[0]) + 1}:00`, // Varsayılan olarak 1 saat
          title: selectedGoal.value, // Seçilen görev
        };

        // Yeni etkinliği takvime ekle
        events.value.push(newEvent);

        // Firebase'e etkinliği kaydet
        const newEventRef = dbRef(db, 'calendar-events/' + Date.now()); // Date.now() ile benzersiz ID oluşturuyoruz
        set(newEventRef, newEvent)
          .then(() => {
            console.log('Yeni etkinlik veritabanına kaydedildi:', newEvent);
          })
          .catch((error) => {
            console.error('Etkinlik kaydedilirken hata oluştu:', error);
          });

        // Seçimleri sıfırla
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

<style scoped>
/* VueCal bileşeni için özel stil (isteğe bağlı) */
</style>
