<template lang="pug">
v-form(v-model="valid")
    v-container()
        v-layout(raw wrap)
            v-flex(xs12 md5)
                v-card.ml-2(flat)
                    v-flex
                        v-text-field(type="password" v-model="oldPassword" :counter="20" :rules="passRules" label="Old password" required)
                    v-flex
                        v-text-field(type="password" v-model="password" :counter="20" :rules="passRules" label="New password" required)
                    v-flex
                        v-text-field(type="password" v-model="repeatPassword" :counter="20" :rules="repassRules" label="Repeat password" required)
        v-layout(raw wrap)
            v-flex(xs12 md4)
                v-btn(depressed color="primary" @click="submit")
                    span submit
</template>

<script>
import UserApi from '@/services/user';
export default {
    data(){
        return {
            valid: false,
            oldPassword: '',
            password:'',
            repeatPassword:'',
            passRules:[
                v => !!v ||'New password is required',
                v => /^[a-zA-Z0-9%-_=&$]+$/.test(v) || 'Password can only include letter and special character as "%$-_=&"',
                v => (v.length <= 20 && v.length >= 6) || 'Password must be between 6 - 20 digits'
            ],
            repassRules:[
                v => !!v || 'You must repeat your new password',
                v => v === this.password || 'Must be same as your new password' 
            ]
        }
    },
    computed: {
        uid() {
            return this.$store.getters.uid;
        }
    },
    methods:{
        async submit(){
            if(!this.valid) {
                alert('Please make a valid input.');
                return;
            }
            if(!this.uid) {
                alert('You should login first.');
                this.$router.push({name: 'login'});
                return;
            }
            var res = await UserApi.userChangePass(this.oldPassword, this.password);
            if(res.data.success) {
                alert('Password successfully changed.')
                this.oldPassword = '';
                this.password = '';
                this.repeatPassword = '';
                this.$router.go(-1);
            } else {
                alert('Failed.')
            }
        }
    }
}
</script>
