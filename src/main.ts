import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'vue-cal/dist/vuecal.css';
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';

// Ionic'in temel CSS dosyalarını import edelim
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

// Tema dosyalarını import edelim (isteğe bağlı)
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

const app = createApp(App);
app.use(createPinia());

app.use(IonicVue); // IonicVue eklendi
app.use(router);

app.mount('#app');
