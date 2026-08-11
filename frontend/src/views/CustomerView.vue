```vue
<script setup>
import {ref,computed,onMounted} from "vue";
import axios from "axios";

const products=ref([]);
const currentPage=ref(1);
const perPage=10;

const loadProducts=async()=>{

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

};

onMounted(()=>{

loadProducts();

});
</script>

<template>

<div class="container">

<h2>
สินค้าทั้งหมด
</h2>

<div class="product-grid">

<div
class="product-card"
v-for="p in showProducts"
:key="p.ProductID"
>

<img
:src="'/images/'+p.Image"
:alt="p.ProductName"
class="product-image"
/>

<div class="product-body">

<h3>
{{p.ProductName}}
</h3>

<p class="price">
{{Number(p.ProductPrice).toLocaleString()}} ฿
</p>

<button class="buy-btn">
🛒 ซื้อสินค้า
</button>

</div>

</div>

</div>

<p
v-if="showProducts.length===0"
class="no-product"
>
ไม่พบข้อมูลสินค้า
</p>

<div class="pagination">

<button
class="page-btn"
@click="changePage(currentPage-1)"
:disabled="currentPage===1"
>
◀ ก่อนหน้า
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
>
หน้าถัดไป ▶
</button>

</div>

</div>

</template>

<style scoped>

.container{
width:95%;
margin:0 auto;
padding:30px;
}

h2{
text-align:center;
margin-bottom:30px;
}

.product-grid{
display:grid;
grid-template-columns:repeat(5,1fr);
gap:20px;
}

.product-card{
border:1px solid #ddd;
border-radius:10px;
background:white;
overflow:hidden;
}

.product-image{
width:100%;
height:180px;
object-fit:contain;
padding:10px;
}

.product-body{
padding:15px;
text-align:center;
}

.product-body h3{
font-size:18px;
margin:10px 0;
}

.price{
font-size:20px;
font-weight:bold;
color:red;
}

.buy-btn{
width:100%;
padding:10px;
border:0;
border-radius:5px;
background:#198754;
color:white;
font-size:16px;
cursor:pointer;
}

.pagination{
display:flex;
justify-content:center;
gap:8px;
margin-top:30px;
}

.page-btn,
.page-number{
padding:8px 14px;
border:1px solid #ddd;
background:white;
border-radius:5px;
cursor:pointer;
}

.page-number.active{
background:#0d6efd;
color:white;
}

.page-btn:disabled{
opacity:.5;
cursor:not-allowed;
}

.no-product{
text-align:center;
margin:30px;
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

.product-grid{
grid-template-columns:repeat(2,1fr);
}

}

</style>

