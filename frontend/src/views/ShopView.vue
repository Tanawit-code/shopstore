<script setup>
import {ref,computed,onMounted} from "vue";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import NavbarUser from "@/components/NavbarUser.vue";
import NavbarCustomer from "@/components/NavbarCustomer.vue";

const products=ref([]);
const isLoading=ref(true);
const loadError=ref(false);
const currentPage=ref(1);
const perPage=8;

// อ่านสถานะ login จาก localStorage เฉยๆ ไม่มีจุดไหนไปลบทิ้งเอง
const currentUser=computed(()=>{

const data=localStorage.getItem("user");

return data?JSON.parse(data):null;

});

const isLoggedIn=computed(()=>{

return !!localStorage.getItem("token")&&!!currentUser.value;

});

// เลือก Navbar ตามสถานะ/สิทธิ์ผู้ใช้ ไม่บังคับให้กลายเป็น Navbar แขกทั้งที่ login อยู่
const activeNavbar=computed(()=>{

if(!isLoggedIn.value){
return Navbar;
}

const role=currentUser.value?.role;

if(role==="admin"||role==="employee"){
return NavbarUser;
}

return NavbarCustomer;

});

const loadProducts=async()=>{

// endpoint จริงบังคับ token + role customer ยิงเปล่าๆ ไปก็โดน 403 แน่นอน
if(!isLoggedIn.value){
isLoading.value=false;
return;
}

isLoading.value=true;
loadError.value=false;

try{

const token=localStorage.getItem("token");

const res=await axios.get(
"http://localhost:3000/products",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

products.value=res.data;

}catch(error){

console.error(error);

// สำคัญ: ดึงสินค้าไม่สำเร็จ ไม่ใช่ว่า session หมดอายุเสมอไป
// จึงไม่ removeItem("token")/("user") และไม่เด้งไป /login ที่นี่
loadError.value=true;

}finally{

isLoading.value=false;

}

};

const totalPages=computed(()=>{

return Math.ceil(
products.value.length/perPage
);

});

const showProducts=computed(()=>{

const start=(currentPage.value-1)*perPage;
const end=start+perPage;

return products.value.slice(start,end);

});

const changePage=(page)=>{

if(page<1){
return;
}

if(page>totalPages.value){
return;
}

currentPage.value=page;

window.scrollTo({top:0,behavior:"smooth"});

};

onMounted(()=>{

loadProducts();

});
</script>

<template>

<component :is="activeNavbar"/>

<div class="container py-4" style="margin-top:70px;">

<!-- Header -->
<div class="text-center mb-4">
<h1 class="fw-bold text-primary">🛍️ SHOP PAGE</h1>
<p class="text-muted mb-0">สินค้าออนไลน์ของเรา</p>
<p v-if="isLoggedIn && !isLoading && !loadError" class="text-muted small">
พบสินค้า <strong>{{products.length}}</strong> รายการ
</p>
</div>

<!-- ยังไม่ login: ชวนเข้าสู่ระบบแทนการยิง API ที่รู้อยู่แล้วว่าจะโดนปฏิเสธ -->
<div class="text-center py-5" v-if="!isLoggedIn">
<div class="fs-1 mb-3">🔒</div>
<p class="fw-semibold mb-1">เข้าสู่ระบบเพื่อดูสินค้าทั้งหมด</p>
<p class="text-muted small mb-3">สมัครสมาชิกฟรี ใช้เวลาไม่ถึงนาที</p>
<RouterLink to="/login" class="btn btn-primary rounded-pill px-4 me-2">
เข้าสู่ระบบ
</RouterLink>
<RouterLink to="/register" class="btn btn-outline-primary rounded-pill px-4">
สมัครสมาชิก
</RouterLink>
</div>

<!-- Login แล้วแต่ดึงข้อมูลไม่สำเร็จ: แจ้งเตือน ไม่บังคับ logout -->
<div class="text-center py-5" v-else-if="loadError">
<div class="fs-1 mb-3">⚠️</div>
<p class="fw-semibold mb-1">ดึงข้อมูลสินค้าไม่สำเร็จ</p>
<p class="text-muted small mb-3">คุณยังเข้าสู่ระบบอยู่ ลองใหม่อีกครั้งได้เลย</p>
<button class="btn btn-primary rounded-pill px-4" @click="loadProducts">
ลองอีกครั้ง
</button>
</div>

<!-- Loading skeleton (Bootstrap placeholder) -->
<div class="row g-4" v-else-if="isLoading">

<div
class="col-12 col-sm-6 col-md-4 col-lg-3"
v-for="n in 8"
:key="n"
>
<div class="card shadow-sm h-100 border-0">
<div class="placeholder-glow">
<span class="placeholder col-12" style="height:180px;display:block;"></span>
</div>
<div class="card-body text-center">
<span class="placeholder col-8 mb-2"></span><br/>
<span class="placeholder col-5 mb-3"></span><br/>
<span class="placeholder col-12" style="height:38px;border-radius:30px;display:block;"></span>
</div>
</div>
</div>

</div>

<!-- Product Grid -->
<template v-else>

<div class="row g-4" v-if="showProducts.length>0">

<div
class="col-12 col-sm-6 col-md-4 col-lg-3"
v-for="p in showProducts"
:key="p.ProductID"
>
<div class="card shadow-sm h-100 border-0 product-card">

<img
:src="'/images/'+p.Image"
:alt="p.ProductName"
class="card-img-top p-3"
style="height:180px; object-fit:contain;"
/>

<div class="card-body text-center">
<h5 class="card-title text-truncate">{{ p.ProductName }}</h5>

<p class="text-success fw-bold fs-5">
{{ Number(p.ProductPrice).toLocaleString() }} ฿
</p>

<button class="btn btn-primary w-100 rounded-pill">
🛒 Add to Cart
</button>
</div>

</div>
</div>

</div>

<!-- Empty state -->
<div class="text-center py-5" v-else>
<div class="fs-1 mb-3">📦</div>
<p class="fw-semibold mb-1">ไม่พบข้อมูลสินค้า</p>
<p class="text-muted small">ลองกลับมาตรวจสอบอีกครั้งในภายหลัง</p>
</div>

<!-- Pagination -->
<nav class="mt-4" v-if="totalPages>1">
<ul class="pagination justify-content-center">

<li class="page-item" :class="{disabled:currentPage===1}">
<button class="page-link" @click="changePage(currentPage-1)">
◀
</button>
</li>

<li
class="page-item"
v-for="page in totalPages"
:key="page"
:class="{active:currentPage===page}"
>
<button class="page-link" @click="changePage(page)">
{{page}}
</button>
</li>

<li class="page-item" :class="{disabled:currentPage===totalPages}">
<button class="page-link" @click="changePage(currentPage+1)">
▶
</button>
</li>

</ul>
</nav>

</template>

</div>

</template>

<style scoped>
.product-card{
transition:transform .2s ease,box-shadow .2s ease;
}

.product-card:hover{
transform:translateY(-4px);
box-shadow:0 12px 24px rgba(0,0,0,.12)!important;
}
</style>