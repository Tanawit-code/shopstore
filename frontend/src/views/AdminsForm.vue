```vue
<script setup>
import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";

const router=useRouter();

const items=ref([]);
const keyword=ref("");

const user=JSON.parse(localStorage.getItem("user")||"{}");

const loadProducts=async()=>{
try{
const token=localStorage.getItem("token");

const res=await axios.get("http://localhost:3000/admins",{
headers:{
Authorization:`Bearer ${token}`
}
});

items.value=res.data;

}catch(err){
console.error("Load products error:",err);
}
};

const showAllProducts=()=>{
keyword.value="";
loadProducts();
};

const logout=()=>{
localStorage.removeItem("token");
localStorage.removeItem("user");
router.push("/login");
};

onMounted(()=>{
loadProducts();
});
</script>

<template>

<div class="container">

<div class="page-header">

<h2 class="text-center mb-4">
แสดงรายการสินค้าทั้งหมด
</h2>

<div class="user-info">

<span class="username">
{{user.username}}
</span>

<span class="badge bg-primary">
Admin
</span>

<button
class="btn btn-danger btn-sm"
@click="logout"
>
Logout
</button>

</div>

</div>

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

<td>{{item.ProductID}}</td>

<td>{{item.ProductName}}</td>

<td>{{item.ProductPrice}}</td>

<td>{{item.UnitsInStock}}</td>

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
>
Delete
</button>

</td>

</tr>

<tr v-if="items.length===0">

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
width:95%;
margin:0 auto;
padding-top:40px;
}

.page-header{
position:relative;
display:flex;
justify-content:center;
align-items:center;
}

.user-info{
position:absolute;
right:0;
top:0;
display:flex;
align-items:center;
gap:8px;
}

.username{
font-weight:bold;
}

.search-box{
display:flex;
gap:10px;
margin-bottom:20px;
}

.search-box input{
max-width:400px;
}

</style>
