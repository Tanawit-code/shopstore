<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {RouterLink} from "vue-router";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

const router=useRouter();

const name=ref("");
const lastname=ref("");
const address=ref("");
const tel=ref("");
const email=ref("");
const username=ref("");
const password=ref("");
const confirmPassword=ref("");

const errorMessage=ref("");
const successMessage=ref("");

const register=async()=>{

errorMessage.value="";
successMessage.value="";

if(password.value!==confirmPassword.value){
errorMessage.value="รหัสผ่านทั้งสองช่องไม่ตรงกัน";
return;
}

try{

const res=await axios.post(
"http://localhost:3000/register",
{
name:name.value,
lastname:lastname.value,
address:address.value,
tel:tel.value,
email:email.value,
username:username.value,
password:password.value
}
);

if(res.data.success){

successMessage.value="สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...";

setTimeout(()=>{
router.push("/login");
},1500);

}

}
catch(err){

if(err.response&&err.response.data&&err.response.data.message){
errorMessage.value=err.response.data.message;
}
else{
errorMessage.value="เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

}

};
</script>

<template>
<Navbar/>

<section class="register-section">
<div class="register-card">
<h2>สมัครสมาชิก</h2>

<form @submit.prevent="register">

<input
v-model="name"
type="text"
placeholder="ชื่อ"
required
/>

<input
v-model="lastname"
type="text"
placeholder="นามสกุล"
required
/>

<input
v-model="address"
type="text"
placeholder="ที่อยู่"
required
/>

<input
v-model="tel"
type="tel"
placeholder="เบอร์โทรศัพท์"
required
/>

<input
v-model="email"
type="email"
placeholder="อีเมล"
required
/>

<input
v-model="username"
type="text"
placeholder="Username"
required
/>

<input
v-model="password"
type="password"
placeholder="Password"
required
/>

<input
v-model="confirmPassword"
type="password"
placeholder="ยืนยัน Password"
required
/>

<p v-if="errorMessage" class="error-text">
{{ errorMessage }}
</p>

<p v-if="successMessage" class="success-text">
{{ successMessage }}
</p>

<button type="submit">
สมัครสมาชิก
</button>

<div class="register-links">
<RouterLink to="/login">
มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
</RouterLink>
</div>

</form>

</div>
</section>

</template>

<style scoped>
.register-section{
display:flex;
justify-content:center;
align-items:center;
min-height:calc(100vh - 70px);
padding:90px 20px 40px;
}

.register-card{
width:380px;
padding:30px;
background:#f5f5f5;
border:1px solid #ddd;
border-radius:15px;
box-shadow:0 5px 15px rgba(0,0,0,0.15);
}

.register-card h2{
text-align:center;
margin-bottom:25px;
color:#4F6D9B;
}

.register-card input{
width:100%;
padding:12px;
margin-bottom:15px;
border:1px solid #ccc;
border-radius:8px;
box-sizing:border-box;
}

.register-card button{
width:100%;
padding:12px;
background:#8CB9FF;
color:white;
border:none;
border-radius:30px;
cursor:pointer;
font-size:16px;
}

.register-card button:hover{
background:#6FA8FF;
}

.error-text{
color:#d9534f;
font-size:14px;
margin:-8px 0 15px;
text-align:center;
}

.success-text{
color:#2e8b57;
font-size:14px;
margin:-8px 0 15px;
text-align:center;
}

.register-links{
display:flex;
justify-content:center;
margin-top:18px;
}

.register-links a{
text-decoration:none;
color:#4F6D9B;
font-size:14px;
font-weight:500;
}

.register-links a:hover{
text-decoration:underline;
}
</style>