import api from '@/services/api'

const ax = api('/user');

export default {
    loginAndCookies(username, pass) {
        return ax.post('/login', {
            username,
            pass
        });
    },
    userRegister(username, pass, nickname, email) {
        return ax.post('/register', {
            username,
            pass,
            nickname,
            email
        });
    },
    userLogout() {
        return ax.delete('/');
    },
    getInfo(uid) {
        return ax.get('/' + uid);
    },
    getPrivileges(uid) {
        return ax.get('/' + uid + '/privileges');
    },
    getUserPosts(uid){
        return ax.get('/' + uid + '/posts');
    }
}