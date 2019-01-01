<template>
    <div id="login">
        <h1>Welcome to our forum!</h1>
        <div class="login-model">
            <div class="user-name">
                <input class="text" type="text" placeholder="Username" v-model="username">
                <p v-if="this.username.length > 0 && usernameInvalid">用户名里只会出现小写字母和数字。</p>
            </div>
            <div class="user-password">
                <input class="pass" type="password" placeholder="Password" v-model="password">
            </div>
            <div class="buttons">
                <button class="login-confirm" @click="confirmLogin">Login</button>
                <button class="register" @click="setNewuser">Register</button>
            </div>
        </div>
    </div>
</template>

<script>
import UserService from '../services/user';
export default {
    name:'login',
    data() {
        return {
            username: '',
            password: '',
        }
    },
    components: {
    },
    computed: {
        usernameInvalid() {
            return !(this.username.match(/^[a-z0-9]+$/));
        },
    },
    methods: {
        async confirmLogin(){
            // TODO we can do a shake animation here.
            this.username = this.username.toLowerCase();
            if(this.usernameInvalid) {
                alert('用户名里只会出现小写字母和数字');
                return;
            }
            this.username = this.username.trim();
            this.password = this.password.trim();
            if(this.username == '' || this.password == ''){
                window.alert("Your user name or password is fault!");
            } else {
                const res = await UserService.loginAndCookies(this.username, this.password);
                if(res.data && res.data.success){
                    this.$store.dispatch('userLogin', res.data);
                    window.alert("Login Success");
                    if(window.history.length > 1)
                        this.$router.go(-1);
                    else
                        this.$router.replace('/');
                } else {
                    window.alert("Your username or password is wrong");
                }
            }
        },
        async setNewuser(){
            this.$router.push('/register');
        }
    }
}
</script>


<style scoped>
#login {
    font-family: monospace;
    text-align: center;
    color:teal;
    margin-top: 100px;
}
input {
    background-repeat: no-repeat;
    width: 200px;
    height: 40px;
    border: 1px solid #e0dede;
    padding-left: 50px;
	outline: none;
    font-family: monospace;
    margin-top: 10px;
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
