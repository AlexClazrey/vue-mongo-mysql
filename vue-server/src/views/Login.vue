<template>
    <div id="login">
        <v-card flat style="background-color:transparent; max-width: 1300px; margin: 0 auto;">
            <h1>Login form</h1>
            <div class="login-model">
                <div class="box-container user-name">
                    <input class="px-3 py-2" v-model="username" type="text" placeholder="Username" style="display: block; width: 400px; height: 40px; margin: 0 auto;">
                    <p v-if="this.username.length > 0 && usernameInvalid">用户名里只会出现小写字母和数字。</p>
                </div>
                <div class="box-container user-password">
                    <input class="px-3 py-2" v-model="password" type="password" placeholder="Password" style="display: block; width: 400px; height: 40px; margin: 0 auto;">
                </div>
                <div class="buttons">
                    <button class="register" @click="setNewuser">REGISTER</button>
                    <button class="login-confirm" @click="confirmLogin">LOGIN</button>
                </div>
            </div>
        </v-card>
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
    font-family: sans-serif;
    text-align: center;
    /* color:teal; */
    margin-top: 80px;
}
#login h1 {
    margin-bottom: 50px;
}
#login .box-container {
    margin-bottom: 20px;
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
    width: 130px;
    height: 50px;
    border-radius: 2px;
    font-family: monospace;
}
.text{
    background-image: url(../assets/user_name.png);
}
.pass {
    background-image: url(../assets/user_password.png);
}
.login-confirm {
    background-color: lightsalmon;
}
button.register {
    background-color: lightseagreen
}
</style>
