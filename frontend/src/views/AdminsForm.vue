<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

const items = ref([]);
const keyword = ref("");

// โหลดข้อมูลสินค้า
// โหลดข้อมูลสินค้า
const loadProducts = async () => {

  try {

    const res = await axios.get(
      "http://localhost:3000/admins",
      {
        params: {
          // ถ้า keyword ว่าง จะส่ง q ว่าง
          // API จะคืนสินค้าทั้งหมด
          q: keyword.value
        },
      }
    );


    items.value = res.data;

  } catch (err) {
    console.error(err);
  }

};



// ปุ่มรายการสินค้าทั้งหมด
const showAllProducts = () => {
    // เคลียร์คำค้นหา
    keyword.value = "";

    // โหลดสินค้าใหม่ทั้งหมด
    loadProducts();

};

// ลบสินค้า
const deleteProduct = async (id) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await axios.delete(`http://localhost:3000/admins/${id}`);
    loadProducts();
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  loadProducts();
});
</script>

<template>

  <!-- Navbar -->
  <Navbar />

  <div class="container mt-4">

    <h2 class="text-center mb-4">
      แสดงรายการสินค้าทั้งหมด
    </h2>

    <!-- Search -->
    <div class="search-box">

      <input
        v-model="keyword"
        class="form-control"
        placeholder="ค้นหาชื่อสินค้า"
      />

      <button
        class="btn btn-primary"
        @click="loadProducts"
      >
        ค้นหา
      </button>

      <RouterLink
        to="/insert"
        class="btn btn-success"
      >
        เพิ่มรายการสินค้า
      </RouterLink>

    </div>

    <!-- Table -->
    <table class="table table-striped table-bordered">

      <thead class="table-dark">
        <tr>
          <th>Product ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th width="100">Edit</th>
          <th width="100">Delete</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="item in items"
          :key="item.ProductID"
        >
          <td>{{ item.ProductID }}</td>
          <td>{{ item.ProductName }}</td>
          <td>{{ item.ProductPrice }}</td>
          <td>{{ item.UnitsInStock }}</td>

          <td class="text-center">
            <RouterLink
              :to="`/edit/${item.ProductID}`"
              class="btn btn-warning btn-sm"
            >
              Edit
            </RouterLink>
          </td>

          <td class="text-center">
            <button
              class="btn btn-danger btn-sm"
              @click="deleteProduct(item.ProductID)"
            >
              Delete
            </button>
          </td>
        </tr>

        <!-- ไม่มีข้อมูล -->
        <tr v-if="items.length === 0">
          <td colspan="6" class="text-center">
            ไม่พบข้อมูลสินค้า
          </td>
        </tr>

      </tbody>

    </table>

    <div class="text-center mt-3">

 <button
  class="btn btn-success"
  @click="showAllProducts"
>
  รายการสินค้าทั้งหมด
</button>

    </div>

  </div>

</template>

<style scoped>

.container{
    margin-top:30px;
}

.search-box{
    display:flex;
    gap:10px;
    margin-bottom:20px;
}

.search-box input{
    width:280px;
}

.table{
    background:#fff;
}

.table th{
    text-align:center;
}

.table td{
    vertical-align:middle;
}

</style>

.container{
    width:95%;
    margin:0 auto;
    padding-top:400px;
}