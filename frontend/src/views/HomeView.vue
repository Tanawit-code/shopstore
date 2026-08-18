<script setup>
import {ref,computed,onMounted} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import NavbarUser from "@/components/NavbarUser.vue";
import NavbarCustomer from "@/components/NavbarCustomer.vue";

const router=useRouter();

const products=ref([]);
const isLoading=ref(true);
const loadError=ref(false);
const currentPage=ref(1);
const perPage=10;

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

// /products เปิดให้ทุกคนดูได้แล้ว ไม่ต้อง login ก็โหลดได้เลย
isLoading.value=true;
loadError.value=false;

try{

const token=localStorage.getItem("token");

const res=await axios.get(
"http://localhost:3000/products",
token?{
headers:{
Authorization:`Bearer ${token}`
}
}:{}
);

products.value=res.data;

}catch(error){

console.error(error);

// สำคัญ: ดึงสินค้าไม่สำเร็จ ไม่ได้แปลว่า session หมดอายุเสมอไป
// จึงไม่ removeItem("token")/("user") และไม่เด้งไป /login ที่นี่
loadError.value=true;

}finally{

isLoading.value=false;

}

};

// ดูสินค้าได้ฟรี แต่ซื้อ/ใส่ตะกร้าต้อง login ก่อน
const handleBuyClick=(product)=>{

if(!isLoggedIn.value){
router.push("/login");
return;
}

// TODO: ต่อระบบตะกร้าจริงตรงนี้ ตอนนี้ยังไม่มี endpoint/ตารางตะกร้าในโปรเจกต์
alert(`เพิ่ม "${product.ProductName}" ลงตะกร้าแล้ว`);

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

<section class="hero">
<h1>Our Products</h1>
<p>เลือกซื้อสินค้าคุณภาพในราคาพิเศษ</p>
</section>

<!-- รายการสินค้า -->
<div class="container">

<!-- แจ้งเตือนแบบเบาๆ ถ้ายังไม่ login (ไม่บล็อกการดูสินค้า) -->
<div class="login-banner" v-if="!isLoading && !loadError && !isLoggedIn">
<span>เข้าสู่ระบบเพื่อสั่งซื้อสินค้า</span>
<div class="login-banner-actions">
<RouterLink to="/login" class="btn-primary btn-sm">เข้าสู่ระบบ</RouterLink>
<RouterLink to="/register" class="btn-outline btn-sm">สมัครสมาชิก</RouterLink>
</div>
</div>

<!-- ดึงข้อมูลไม่สำเร็จ: แจ้งเตือน ไม่บังคับ logout -->
<div class="error-state" v-if="loadError">

<div class="error-icon">⚠️</div>
<p class="error-title">ดึงข้อมูลสินค้าไม่สำเร็จ</p>
<span class="error-hint">คุณยังเข้าสู่ระบบอยู่ ลองใหม่อีกครั้งได้เลย</span>
<button class="btn-primary" @click="loadProducts">ลองอีกครั้ง</button>
</div>

<!-- Loading skeleton -->
<div class="product-grid" v-if="isLoading">

<div class="product-card skeleton-card" v-for="n in 10" :key="n">
<div class="skeleton-block image-skeleton"></div>
<div class="product-body">
<div class="skeleton-block text-skeleton"></div>
<div class="skeleton-block price-skeleton"></div>
<div class="skeleton-block btn-skeleton"></div>
</div>
</div>

</div>

<!-- Product grid -->
<template v-if="!isLoading && !loadError">

<p class="product-count">
พบสินค้า <strong>{{products.length}}</strong> รายการ
</p>

<div class="product-grid" v-if="showProducts.length>0">

<div
class="product-card"
v-for="(p,index) in showProducts"
:key="p.ProductID"
:style="{animationDelay: (index*0.05)+'s'}"
>

<div class="image-wrap">
<img
:src="'/images/'+p.Image"
:alt="p.ProductName"
class="product-image"
/>
</div>

<div class="product-body">

<h3>
{{p.ProductName}}
</h3>

<span class="price-tag">
<span class="price-amount">{{Number(p.ProductPrice).toLocaleString()}}</span>
<span class="price-unit">฿</span>
</span>

<button class="buy-btn" @click="handleBuyClick(p)">
<span class="cart-icon">🛒</span>
<span>ซื้อสินค้า</span>
</button>

</div>

</div>

</div>

<!-- Empty state -->
<div v-else class="empty-state">
<div class="empty-icon">📦</div>
<p class="no-product">ไม่พบข้อมูลสินค้า</p>
<span class="empty-hint">ลองกลับมาตรวจสอบอีกครั้งในภายหลัง</span>
</div>

<div class="pagination" v-if="totalPages>1">

<button
class="page-btn"
@click="changePage(currentPage-1)"
:disabled="currentPage===1"
aria-label="ก่อนหน้า"
>
◀
</button>

<button
v-for="page in totalPages"
:key="page"
class="page-number"
:class="{active:currentPage===page}"
@click="changePage(page)"
>
{{page}}
</button>

<button
class="page-btn"
@click="changePage(currentPage+1)"
:disabled="currentPage===totalPages"
aria-label="หน้าถัดไป"
>
▶
</button>

</div>

</template>

</div>

</template>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap');

:global(body){
margin:0;
font-family:'IBM Plex Sans Thai','Noto Sans Thai',sans-serif;
}

.hero{
margin-top:70px;
padding:60px 20px 46px;
text-align:center;
background:linear-gradient(160deg,#BFDFFF 0%,#EAF3FF 60%,#F6F8FB 100%);
}

.hero h1{
font-family:'Kanit',sans-serif;
font-weight:700;
font-size:34px;
color:#22303F;
margin:0 0 10px;
letter-spacing:.3px;
}

.hero p{
font-size:15px;
color:#4F6D9B;
margin:0;
}

.container{
width:95%;
max-width:1400px;
margin:0 auto;
padding:36px 30px 60px;
font-family:'IBM Plex Sans Thai','Noto Sans Thai',sans-serif;
background:#F6F8FB;
}

.product-count{
text-align:center;
color:#6B7686;
font-size:14px;
margin:0 0 26px;
}

.product-count strong{
color:#4F6D9B;
font-weight:600;
}

.login-banner{
display:flex;
align-items:center;
justify-content:space-between;
flex-wrap:wrap;
gap:12px;
background:#EAF3FF;
border:1px solid #BFDFFF;
border-radius:12px;
padding:12px 20px;
margin-bottom:24px;
font-size:14px;
color:#4F6D9B;
}

.login-banner-actions{
display:flex;
gap:10px;
}

.btn-sm{
padding:7px 18px!important;
font-size:13px!important;
}

.product-grid{
display:grid;
grid-template-columns:repeat(5,1fr);
gap:22px;
}

.product-card{
border:1px solid #E6EAF0;
border-radius:16px;
background:#fff;
overflow:hidden;
transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;
opacity:0;
animation:card-in .45s ease forwards;
}

@keyframes card-in{
from{
opacity:0;
transform:translateY(10px);
}
to{
opacity:1;
transform:translateY(0);
}
}

.product-card:hover{
transform:translateY(-6px);
box-shadow:0 16px 30px rgba(79,109,155,.16);
border-color:#8CB9FF;
}

.image-wrap{
background:#F3F5F8;
overflow:hidden;
}

.product-image{
width:100%;
height:180px;
object-fit:contain;
padding:14px;
display:block;
transition:transform .3s ease;
}

.product-card:hover .product-image{
transform:scale(1.06);
}

.product-body{
padding:16px 16px 18px;
text-align:center;
}

.product-body h3{
font-family:'Kanit',sans-serif;
font-weight:500;
font-size:16px;
color:#22303F;
margin:0 0 12px;
min-height:22px;
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
}

.price-tag{
position:relative;
display:inline-flex;
align-items:baseline;
gap:3px;
padding:7px 16px 7px 22px;
background:linear-gradient(135deg,#4F6D9B,#3B5170);
border-radius:3px 14px 14px 3px;
margin-bottom:16px;
}

.price-tag::before{
content:"";
position:absolute;
left:9px;
top:50%;
transform:translateY(-50%);
width:5px;
height:5px;
border-radius:50%;
background:#F3F5F8;
}

.price-amount{
font-family:'Kanit',sans-serif;
font-weight:600;
font-size:18px;
color:#fff;
}

.price-unit{
font-size:13px;
color:#DCE7FA;
}

.buy-btn{
width:100%;
display:flex;
align-items:center;
justify-content:center;
gap:8px;
padding:11px;
border:0;
border-radius:30px;
background:#FF6B4A;
color:#fff;
font-family:'IBM Plex Sans Thai',sans-serif;
font-weight:600;
font-size:15px;
cursor:pointer;
transition:background .2s ease,transform .15s ease;
}

.buy-btn:hover{
background:#F0532F;
transform:translateY(-1px);
}

.buy-btn:active{
transform:translateY(0);
}

.cart-icon{
transition:transform .2s ease;
}

.buy-btn:hover .cart-icon{
transform:scale(1.15) rotate(-8deg);
}

.skeleton-card{
opacity:1;
animation:none;
}

.skeleton-block{
background:linear-gradient(90deg,#EEF1F5 25%,#E4E9F0 37%,#EEF1F5 63%);
background-size:400% 100%;
animation:shimmer 1.4s ease infinite;
border-radius:6px;
}

@keyframes shimmer{
0%{background-position:100% 50%;}
100%{background-position:0 50%;}
}

.image-skeleton{
height:180px;
border-radius:0;
}

.text-skeleton{
height:16px;
width:70%;
margin:4px auto 14px;
}

.price-skeleton{
height:28px;
width:50%;
margin:0 auto 16px;
border-radius:14px;
}

.btn-skeleton{
height:38px;
width:100%;
border-radius:30px;
}

.empty-state,
.guest-prompt,
.error-state{
text-align:center;
padding:70px 20px;
}

.empty-icon,
.guest-icon,
.error-icon{
font-size:44px;
margin-bottom:14px;
}

.no-product,
.guest-title,
.error-title{
font-family:'Kanit',sans-serif;
font-size:17px;
color:#22303F;
margin:0 0 6px;
}

.empty-hint,
.guest-hint,
.error-hint{
font-size:13px;
color:#8A94A3;
display:block;
margin-bottom:22px;
}

.guest-actions{
display:flex;
justify-content:center;
gap:12px;
flex-wrap:wrap;
}

.btn-primary,
.btn-outline{
display:inline-block;
padding:11px 26px;
border-radius:30px;
font-size:15px;
font-weight:600;
text-decoration:none;
cursor:pointer;
border:2px solid transparent;
transition:all .2s ease;
}

.btn-primary{
background:#4F6D9B;
color:#fff;
}

.btn-primary:hover{
background:#3B5170;
}

.btn-outline{
background:transparent;
color:#4F6D9B;
border-color:#4F6D9B;
}

.btn-outline:hover{
background:#EAF3FF;
}

.pagination{
display:flex;
justify-content:center;
align-items:center;
gap:8px;
margin-top:40px;
flex-wrap:wrap;
}

.page-btn,
.page-number{
min-width:38px;
height:38px;
padding:0 12px;
border:1px solid #E6EAF0;
background:#fff;
border-radius:10px;
cursor:pointer;
font-family:'IBM Plex Sans Thai',sans-serif;
color:#22303F;
transition:all .18s ease;
}

.page-btn:hover:not(:disabled),
.page-number:hover:not(.active){
border-color:#8CB9FF;
color:#4F6D9B;
}

.page-number.active{
background:#4F6D9B;
border-color:#4F6D9B;
color:#fff;
font-weight:600;
}

.page-btn:disabled{
opacity:.4;
cursor:not-allowed;
}

@media(max-width:1200px){
.product-grid{
grid-template-columns:repeat(4,1fr);
}
}

@media(max-width:900px){
.product-grid{
grid-template-columns:repeat(3,1fr);
}
}

@media(max-width:600px){
.hero{
padding:48px 16px 36px;
}
.hero h1{
font-size:26px;
}
.container{
padding:26px 16px 40px;
}
.product-grid{
grid-template-columns:repeat(2,1fr);
gap:14px;
}
}

@media(prefers-reduced-motion:reduce){
.product-card,
.product-image,
.buy-btn,
.cart-icon,
.skeleton-block{
animation:none !important;
transition:none !important;
}
.product-card{
opacity:1;
}
}

</style>