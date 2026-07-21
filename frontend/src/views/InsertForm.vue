<script setup>

import { ref } from "vue";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import { useRouter } from "vue-router";


const router = useRouter();
const product = ref({

    ProductName:"",
    ProductPrice:0,
    UnitsInStock:0

});



// บันทึกสินค้า

const saveProduct = async()=>{


    if(!confirm("Are you sure you want to save this product?")){
        return;
    }

    try{
        await axios.post(
            "http://localhost:3000/admins",
            product.value
        );
        alert("Save Product Success");

        router.push("/admins");


    }catch(error){


        console.error(error);


        alert("Cannot save product");


    }


};



</script>


<template>


<!-- Navbar -->

<Navbar />



<div class="page-content">



    <div class="title-box">

        <h2>
            เพิ่มรายการสินค้าสต๊อกของร้านค้า Shop Store
        </h2>

    </div>
    <div class="form-box">
        <h4>
            เพิ่มรายการสินค้า
        </h4>
        <form @submit.prevent="saveProduct">
            <div class="form-group">
                <label>
                    Name
                </label>
                <input
                    type="text"
                    class="form-control"
                    v-model="product.ProductName"
                    required
                />
            </div>
            <div class="form-group">
                <label>
                    Price
                </label>
                <input
                    type="number"
                    class="form-control"
                    v-model="product.ProductPrice"
                    required
                />
            </div>


            <div class="form-group">
                <label>
                    Stock
                </label>
                <input
                    type="number"
                    class="form-control"
                    v-model="product.UnitsInStock"
                    required
                />
            </div>
            <button
                type="submit"
                class="btn-save"
            >
                บันทึก
            </button>
        </form>

    </div>



</div>



</template>




<style scoped>


.page-content{

    width:95%;

    margin:120px auto;

}



.title-box{

    background:#BFDFFF;

    padding:20px;

    text-align:center;

    border-radius:10px;

    color:#4F6D9B;

}





.form-box{


    max-width:450px;


    margin:30px auto;


    padding:25px;


    background:#fff;


    border:1px solid #ccc;


    border-radius:10px;


    box-shadow:
    0 5px 15px rgba(0,0,0,.15);


}




.form-group{

    margin-bottom:15px;

}



.form-group label{

    font-weight:bold;

}



.form-control{


    width:100%;


    padding:10px;


    border-radius:5px;


    border:1px solid #ccc;


}





.btn-save{


    width:100%;


    padding:12px;


    border:none;


    border-radius:25px;


    background:#8CB9FF;


    color:white;


    font-size:16px;


    cursor:pointer;


}



.btn-save:hover{


    background:#6FA8FF;


}


</style>