<script setup>
import {computed} from "vue";
import {useRouter} from "vue-router";



const router=useRouter();

const user=computed(()=>{
const data=localStorage.getItem("user");
return data?JSON.parse(data):{};
});

const cartCount=computed(()=>{
const data=localStorage.getItem("cart");
if(!data){
return 0;
}
try{
const cart=JSON.parse(data);
return Array.isArray(cart)?cart.length:0;
}catch(error){
return 0;
}
});

const logout=()=>{
localStorage.removeItem("token");
localStorage.removeItem("user");
router.push("/login");
};
</script>

<template>
<nav class="navbar">
<div class="logo">
SHOPSTORE
</div>
<ul class="menu">
<li>
<RouterLink to="/">
Home
</RouterLink>
</li>
<li>
<RouterLink to="/shop">
Products
</RouterLink>
</li>
<li>
<RouterLink to="/customer">
Dashboard
</RouterLink>
</li>
<li>
<RouterLink to="/orders">
My Orders
</RouterLink>
</li>
<li>
<RouterLink to="/contact">
Contact
</RouterLink>
</li>
</ul>
<div class="right-menu">
<span class="username">
👤 {{user.fullname}}
<span class="role">
(Customer)
</span>
</span>
    <RouterLink to="/cart" class="cart-btn">
    🛒 Cart ({{cartCount}})
    </RouterLink>
<button class="logout-btn" @click="logout">
Logout
</button>
</div>
</nav>
</template>

<style scoped>
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
font-size:28px;
font-weight:bold;
color:#4F6D9B;
}
.menu{
display:flex;
gap:35px;
list-style:none;
}
.menu a{
text-decoration:none;
color:#4F6D9B;
}
.menu a:hover{
color:#6FA8FF;
}
.right-menu{
display:flex;
align-items:center;
gap:15px;
}
.username{
color:#4F6D9B;
font-weight:bold;
}
.role{
color:#6FA8FF;
font-size:14px;
}
.cart-btn{
padding:10px 18px;
background:#8CB9FF;
color:white;
border-radius:25px;
text-decoration:none;
}
.cart-btn:hover{
background:#6FA8FF;
}
.logout-btn{
padding:10px 18px;
border:none;
border-radius:25px;
background:#ff6b6b;
color:white;
cursor:pointer;
}
.logout-btn:hover{
background:#e74c3c;
}
</style>