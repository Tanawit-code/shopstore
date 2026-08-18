  <script setup>
import {ref,onMounted} from "vue";
import axios from "axios";
import {useRoute,useRouter} from "vue-router";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const product = ref({

    ProductName:"",
    ProductPrice:"",
    UnitsInStock:"",
    Image:""
});


// ======================
// โหลดข้อมูลสินค้า
// ======================

const loadProduct = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
            `http://localhost:3000/admins/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        product.value = res.data;

    } catch (error) {

        console.error(error);

    }

};

// ======================
// Update
// ======================

const updateProduct = async () => {

    if (!confirm("คุณต้องการแก้ไขสินค้าใช่ไหม?")) {
        return;
    }


    try {

        const token = localStorage.getItem("token");

        await axios.put(
            `http://localhost:3000/admins/${id}`,
            product.value,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        alert("แก้ไขเรียบร้อย");

        router.push("/admins");


    } catch (error) {

        console.error(error);

        alert("ไม่สามารถแก้ไขสินค้าได้");

    }

};

onMounted(()=>{
    loadProduct();
});

</script>


<template>
<Navbar />
<div class="edit-container">
<h2>
แก้ไขรายการสินค้า
</h2>

<form @submit.prevent="updateProduct">

<label>
ชื่อสินค้า
</label>
<input
type="text"
v-model="product.ProductName"
/>

<label>
ราคา
</label>
<input
type="number"
v-model="product.ProductPrice"
/>

<label>
จำนวน
</label>
<input
type="number"
v-model="product.UnitsInStock"
/>




<label>
รูปภาพ
</label>


<input
type="text"
v-model="product.Image"
/>





<button>

แก้ไข

</button>
</form>


</div>


</template>



<style scoped>


.edit-container{

width:400px;

margin:120px auto;

padding:30px;

background:white;

border-radius:15px;

box-shadow:0 5px 15px #ccc;

}



h2{

text-align:center;

color:#4F6D9B;

}



label{

display:block;

margin-top:15px;

font-weight:bold;

}



input{

width:100%;

padding:10px;

border:1px solid #ccc;

border-radius:5px;

}



button{

margin-top:20px;

width:100%;

padding:12px;

border:none;

border-radius:20px;

background:#8CB9FF;

color:white;

}


</style>