<template>
  <nav class="navbar">

    <div class="logo">
      SHOPSTORE
    </div>

    <ul class="menu">
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/shop">Products</RouterLink></li>
      <li><a href="/service">Service</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>

    <div class="right-menu">
      <a href="/login">Login</a>

      <button class="cart-btn">
        🛒 Cart
      </button>
    </div>

  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

.navbar{
  height:70px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 60px;
  background:#BFDFFF;
  position:fixed;
  top:0;
  left:0;
  width:100%;
  z-index:1000;
}

.logo{
  color:#4F6D9B;
  font-size:28px;
  font-weight:bold;
}

.menu{
  display:flex;
  list-style:none;
  gap:35px;
}

.menu a{
  color:#4F6D9B;
  text-decoration:none;
}

.menu a:hover{
  color:#6FA8FF;
}

.right-menu{
  display:flex;
  align-items:center;
  gap:20px;
}

.right-menu a{
  color:#4F6D9B;
  text-decoration:none;
}

.cart-btn{
  border:none;
  padding:10px 20px;
  border-radius:30px;
  background:#8CB9FF;
  color:white;
  cursor:pointer;
}
</style>