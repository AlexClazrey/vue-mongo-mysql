import api from '@/services/api'

export default{
    loginAndCookies(username, pass) {
        return api().post('/user/login', {
            username,
            pass
        });
    }
}