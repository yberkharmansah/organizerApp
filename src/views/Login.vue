<template>
    <div class="login-container d-flex justify-content-center align-items-center vh-100">
      <div class="login-card shadow-lg p-5">
        <h1 class="login-title text-center mb-4">Giriş Yap</h1>
        <form @submit.prevent="loginUser">
          <div class="form-group mb-3">
            <label for="email" class="form-label">Email:</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control text-center rounded-pill"
              required
              placeholder="Email adresinizi girin"
            />
          </div>
  
          <div class="form-group mb-4">
            <label for="password" class="form-label">Şifre:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control text-center rounded-pill"
              required
              placeholder="Şifrenizi girin"
            />
          </div>
  
          <button type="submit" class="btn btn-custom w-100 rounded-pill">Giriş Yap</button>
        </form>
  
        <p class="text-center mt-3">
          Hesabınız yok mu? 
          <router-link to="/register" class="text-decoration-none">Kayıt Ol</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const loginUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      console.log("Giriş yapıldı:", userCredential.user);
      router.push('/home'); 
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş hatası: " + error.message);
    }
  };
  </script>
  
  <style scoped>
  /* Ekranın tamamını kaplayan ve ortalanmış bir görünüm için */
  .login-container {
    background-color: #f1f3f4; /* Yumuşak bir arka plan rengi */
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Kart stilinde düzenlemeler */
  .login-card {
    background-color: white;
    border-radius: 15px;
    padding: 2rem;
    width: 400px;
    max-width: 100%;
  }
  
  /* Başlık için özel stil */
  .login-title {
    font-size: 2.5rem; /* Daha büyük yazı tipi */
    font-weight: 700; /* Kalın başlık */
    color: #333;
    border-bottom: 2px solid #4caf50; /* Başlık altı çizgi */
    padding-bottom: 0.5rem;
  }
  
  /* Tuşların görünümü */
  .btn-custom {
    background-color: #4caf50; /* Özel yeşil renk */
    color: white;
    border: none;
    padding: 0.75rem 1.5rem; /* Daha büyük buton */
    font-size: 1.2rem; /* Buton yazı boyutu */
    border-radius: 50px; /* Daha yuvarlak kenarlar */
    transition: background-color 0.3s ease;
  }
  
  .btn-custom:hover {
    background-color: #45a049; /* Hover efekti */
  }
  .form-group {
  margin-bottom: 1rem; /* Aradaki boşluğu artırmak için */
}

  
  /* Giriş alanları ortalı ve aynı hizada */
  .form-control {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    border-radius: 50px; /* Yuvarlak kenarlar */
    border: 1px solid #ccc;
    text-align: center; /* Giriş alanını ortala */
  }
  
  .form-control:focus {
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Hover'da mavi parıltı */
    border-color: #007bff; /* Fokus olduğunda sınır rengi */
  }
  
  /* Email ve Şifre textlerini büyüt ve bold yap */
  .form-label {
    font-size: 1.2rem; /* Etiket yazı boyutu */
    font-weight: bold; /* Kalın yazı */
    color: #333;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  /* Linkler için ekstra stil */
  .text-decoration-none {
    color: #007bff;
    transition: color 0.3s ease;
  }
  
  .text-decoration-none:hover {
    color: #0056b3;
  }
  </style>
  