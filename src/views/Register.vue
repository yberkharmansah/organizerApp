<template>
    <div>
      <h1>Kayıt Ol</h1>
      <form @submit.prevent="registerUser">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
  
        <label for="password">Şifre:</label>
        <input type="password" v-model="password" required />
  
        <button type="submit">Kayıt Ol</button>
      </form>
      <p>
        Zaten bir hesabınız var mı? 
        <router-link to="/login">Giriş Yap</router-link>
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router'; // Vue Router'dan useRouter'ı içe aktar
  
  const email = ref('');
  const password = ref('');
  const router = useRouter(); // useRouter ile yönlendirme için bir örnek oluştur
  
  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      console.log("Kayıt yapıldı:", userCredential.user);
      // Kayıt olduktan sonra Home sayfasına yönlendir
      router.push('/login'); 
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kayıt hatası: " + error.message);
    }
  };
  </script>
  
  <style scoped>
  /* Stil ayarlamaları burada */
  </style>
  