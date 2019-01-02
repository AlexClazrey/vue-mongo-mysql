<template lang="pug">
    v-form(v-model="valid")
        v-container()
            v-layout.justify-center(raw wrap)
                v-flex(xs12 md5)
                    v-card.flat.pa-3()
                        v-flex()
                            v-text-field(v-model="nickname" :counter="10" :rules="nameRules" label="Nickname" required)
                        v-flex()
                            v-text-field(type="password" v-model="password" :counter="20" :rules="passRules" label="New password" required)
                        v-flex()
                            v-text-field(type="password" v-model="repeatpassword" :counter="20" :rules="repassRules" label="Repeat password" required)
            v-layout.justify-center(raw wrap)
                v-flex(xs12 md4)
                    v-btn(color="success" @click="confirmModify")
                        span confirm
                    v-btn(color="error" @click="cancelModify")
                        span cancel
</template>

<script>
export default {
    data(){
        return {
            valid: false,
            nickname:'',
            password:'',
            repeatpassword:'',
            nameRules:[
                v => !!v || 'Nickname is required',
                v => v.length <= 10 || 'Nickname must be less than 10 characters'
            ],
            passRules:[
                v => !!v ||'New password is required',
                v => /^[a-zA-Z0-9%-_=&$]+$/.test(v) || 'Password can only include letter and special character as "%$-_=&"',
                v => (v.length <= 20 && v.length >= 6) || 'Password must be between 6 - 9 digits'
            ],
            repassRules:[
                v => !!v || 'You must repeat your new password',
                v => v === this.password || 'Must be same as your new password' 
            ]
        }
    },
    methods:{
        async confirmModify(){

        }
    }
}
</script>
