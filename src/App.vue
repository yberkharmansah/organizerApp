<template>
  <div id="app">
    <nav>
      <router-link to="/">Ana Sayfa</router-link>
      <router-link to="/goals">Hedefler</router-link>
      <router-link to="/calendar">Takvim</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style>
nav {
  padding: 10px;
  background-color: #f0f0f0;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}
</style>
