<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {RouterLink} from "vue-router";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

const router=useRouter();

const username=ref("");
const password=ref("");

const login=async()=>{

try{

const res=await axios.post(
"http://localhost:3000/auths",
{
username:username.value,
password:password.value
}
);

localStorage.setItem("token",res.data.token);
localStorage.setItem("user",JSON.stringify(res.data.user));

const role=res.data.user.role;

if(role==="admin"){
router.push("/admins");
}
else if(role==="employee"){
router.push("/employee");
}
else if(role==="customer"){
router.push("/customer");
}
else{
alert("ไม่พบสิทธิ์การใช้งาน");
}

}
catch(err){
alert("Username หรือ Password ไม่ถูกต้อง");
}

};
</script>

<template>
<Navbar/>

<section class="login-section">
<div class="login-card">
<h2>Login</h2>

<form @submit.prevent="login">

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

<button type="submit">
Login
</button>

<div class="login-links">
<RouterLink to="/register">
สมัครสมาชิก
</RouterLink>

<RouterLink to="/forgot-password">
ลืมรหัสผ่าน?
</RouterLink>
</div>

</form>

</div>
</section>

</template>

<style scoped>
.login-section{
display:flex;
justify-content:center;
align-items:center;
min-height:calc(100vh - 70px);
padding-top:70px;
}

.login-card{
width:350px;
padding:30px;
background:#f5f5f5;
border:1px solid #ddd;
border-radius:15px;
box-shadow:0 5px 15px rgba(0,0,0,0.15);
}

.login-card h2{
text-align:center;
margin-bottom:25px;
color:#4F6D9B;
}

.login-card input{
width:100%;
padding:12px;
margin-bottom:15px;
border:1px solid #ccc;
border-radius:8px;
box-sizing:border-box;
}

.login-card button{
width:100%;
padding:12px;
background:#8CB9FF;
color:white;
border:none;
border-radius:30px;
cursor:pointer;
font-size:16px;
}

.login-card button:hover{
background:#6FA8FF;
}

.login-links{
display:flex;
justify-content:space-between;
margin-top:18px;
}

.login-links a{
text-decoration:none;
color:#4F6D9B;
font-size:14px;
font-weight:500;
}

.login-links a:hover{
text-decoration:underline;
}
</style>