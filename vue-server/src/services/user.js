import api from '@/services/api'

export default{
    loginAndCookies(username, pass) {
        return api().post('/user/login', {
            username,
            pass
        });
    },
    userRegister(username,pass,nickname,email){
        return api().post('/user/register',{
            username,
            pass,
            nickname,
            email
        });
    },
    getInfo(uid) {
        return api().get('/user/' + uid);
    }
}