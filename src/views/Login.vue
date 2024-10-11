<template>
    <div>
      <h1>Giriş Yap</h1>
      <form @submit.prevent="loginUser">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
  
        <label for="password">Şifre:</label>
        <input type="password" v-model="password" required />
  
        <button type="submit">Giriş Yap</button>
      </form>
      <p>
        Hesabınız yok mu? 
        <router-link to="/register">Kayıt Ol</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router'; // Vue Router'dan useRouter'ı içe aktar
  
  const email = ref('');
  const password = ref('');
  const router = useRouter(); // useRouter ile yönlendirme için bir örnek oluştur
  
  const loginUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      console.log("Giriş yapıldı:", userCredential.user);
      // Giriş yaptıktan sonra Home sayfasına yönlendir
      router.push('/home'); 
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş hatası: " + error.message);
    }
  };
  </script>
  
  <style scoped>
  /* Stil ayarlamaları burada */
  </style>
  