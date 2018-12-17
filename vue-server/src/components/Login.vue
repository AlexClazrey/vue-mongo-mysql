<template>
    <div id="login">
        <h1>Welcome to our forum!</h1>
        <div id="login-model">
            <div id="user-name">
                <input class="text" type="text" placeholder="User name" v-model="user_name">
            </div>
            <div id="user-password">
                <input class="pass" type="password" placeholder="Password" v-model="password">
            </div>
            <div id="buttons">
                <button class="login-confirm" @click="confirmLogin">Login</button>
                <button class="register" @click="Register">Register</button>
            </div>
        </div>
    </div>
</template>

<script>
//import UserService from '../services/user';
import Register from '@/Register.vue';
export default {
    name:'login',
    data() {
        return {
            id: 1,
            user_name: null,
            password: null,
            status: false
        }
    },
    methods: {
        async confirmLogin(){
            //const resonse = await UserService.getPassword(this.data.id);
            if(this.status){
                this.status = false;
                window.alert("success");
            }else{
                this.status = true;
                window.alert("Your username or password is wrong");
            }
        },
        async setNewuser(){

        }
    }
}
</script>


<style>
#login {
    font-family: monospace;
    text-align: center;
    color:teal;
    margin-top: 200px;
}
input {
    background-repeat: no-repeat;
    width: 200px;
    height: 40px;
    border: 1px solid #e0dede;
    padding-left: 50px;
	outline: none;
    font-family: monospace;
}
button {
    margin-top: 30px;
    margin-left: 20px;
    margin-right: 20px;
    text-align: center;
    text-decoration: #e0dede;
    width: 100px;
    height: 50px;
    border-radius: 15px;
    font-family: monospace;
}
.text{
    background-image: url(../assets/user_name.png);
}
.pass {
    background-image: url(../assets/user_password.png);
}
.login-confirm {
    background-color: crimson;
}
</style>
