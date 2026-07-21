<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
 
const products = ref([]);
 
onMounted(async () => {
  const res = await axios.get("http://localhost:3000/products");
  products.value = res.data;
});
</script>
 
<template>
  <div class="container py-4">
 
    <!-- Header -->
    <div class="text-center mb-4">
      <h1 class="fw-bold text-primary">🛍️ SHOP PAGE</h1>
      <p class="text-muted">สินค้าออนไลน์ของเรา</p>
    </div>
 
    <!-- Product Grid -->
    <div class="row g-4">
     
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="p in products"
        :key="p.id"
      >
        <div class="card shadow-sm h-100 border-0">
 
          <img
            :src="p.image"
            class="card-img-top p-3"
            style="height:180px; object-fit:contain;"
          />
 
          <div class="card-body text-center">
            <h5 class="card-title">{{ p.name }}</h5>
 
            <p class="text-success fw-bold">
              {{ p.price.toLocaleString() }} ฿
            </p>
 
            <button class="btn btn-primary w-100">
              🛒 Add to Cart
            </button>
          </div>
 
        </div>
      </div>
 
    </div>
 
  </div>
</template>