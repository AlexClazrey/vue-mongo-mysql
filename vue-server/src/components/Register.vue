<template>
    <div id="register">
        <h1>register</h1>
        <div>
            <div>
                <input class="noimage" placeholder="Username" v-model="username">
                <p class="error-alert" v-if="usernameError.seen" >{{ usernameError.errorLog }}</p>
            </div>
            <div>
                <input class="noimage" placeholder="password" v-model="password" type="password">
                <p class="error-alert" v-if="passwordError.seen">{{ passwordError.errorLog }}</p>
            </div>
            <div>
                <input class="noimage" placeholder="repeat password" v-model="repeatpass" type="password">
                <p class="error-alert" v-if="repeatpassError.seen">{{ repeatpassError.errorLog }}</p>
            </div>
            <div>
                <input class="noimage" placeholder="nick name" v-model="nickname">
                <p class="error-alert" v-if="nicknameError.seen">{{ nicknameError.errorLog }}</p>
            </div>
            <div>
                <input class="noimage" placeholder="e-mail address" v-model="emailaddress">
                <p class="error-alert" v-if="emailError.seen">{{ emailError.errorLog }}</p>
            </div>
            <button class="commit" @click="commitClick(username,password,repeatpass,nickname,emailaddress)">Commit</button>
        </div>
    </div>
</template>

<script>
import UserService from '../services/user';
export default {
    name: "register",
    data(){
        return{
            username: '',
            password: '',
            repeatpass: '',
            nickname: '',
            emailaddress: '',
            usernameError: {
                errorLog: "null",
                seen:false
            },
            passwordError: {
                errorLog: "null",
                seen: false
            },
            repeatpassError: {
                errorLog: "null",
                seen: false
            },
            nicknameError: {
                errorLog: "null",
                seen: false
            },
            emailError: {
                errorLog: "null",
                seen: false
            }
        }
    },
    methods: {
        async commitClick(USERNAME,PASSWORD,REPEATPASS,NICKNAME,EMAILADDRESS) {
            /*this.usernameError.seen = false;
            this.passwordError.seen = false;
            this.repeatpassError.seen = false;
            this.nicknameError.seen = false;
            this.emailaddress.seen = false;
            alert(PASSWORD);
            alert(REPEATPASS);
            if(PASSWORD != REPEATPASS){
                alert("SUCCESS");
            }*/
            if(USERNAME != '' && PASSWORD != '' && REPEATPASS != '' && NICKNAME != '' && EMAILADDRESS != ''){
                if(PASSWORD != REPEATPASS){
                    this.repeatpassError.errorLog = "*This has to be same as your password"
                    this.repeatpassError.seen = true;
                    this.usernameError.seen = false;
                    this.passwordError.seen = false;
                    this.nicknameError.seen = false;
                    this.emailError.seen = false;
                }else{
                    this.repeatpassError.seen = false;
                    const resonse = await UserService.userRegister(USERNAME,PASSWORD,NICKNAME,EMAILADDRESS);
                    if(resonse.data.success){
                        window.alert("register success!");
                    }
                }
            }else{
                if(USERNAME == ''){
                    this.usernameError.errorLog = "*User name can't be null";
                    this.usernameError.seen = true;
                }else{
                    this.usernameError.seen = false;
                }
                if(PASSWORD == ''){
                    this.passwordError.errorLog = "*Password can't be null";
                    this.passwordError.seen = true;
                }else{
                    this.passwordError.seen = false;
                }
                if(REPEATPASS == ''){
                    this.repeatpassError.errorLog = "*Please repeat your password";
                    this.repeatpassError.seen = true;
                }else{
                    this.repeatpassError.seen = false;
                }
                if(NICKNAME == ''){
                    this.nicknameError.errorLog = "*Nick name can't be null";
                    this.nicknameError.seen = true;
                }else{
                    this.nicknameError.seen = false;
                }
                if(EMAILADDRESS == ''){
                    this.emailError.errorLog = "*E-mail address can't be null";
                    this.emailError.seen = true;
                }else{
                    this.emailaddress.seen = false;
                }
            }
        }
    }
}
</script>


<style>
#register {
    text-align: center;
    margin-top: 100px;
}
.noimage{
    padding-left: 10px;
    width: 240px;
}
.commit {
    background-color: darkgray;
    height: 40px;
    width: 240px; 
}
.error-alert {
    color:crimson;
    font-size: 12px;
}
</style>
