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
    userChangePass(oldPass, newPass) {
        return ax.post('/change-pass', {
            oldPass,
            newPass,
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
    },
    getUserDrafts(uid) {
        return ax.get('/' + uid + '/drafts');
    },
    getUserFavorites(uid) {
        return ax.get('/' + uid + '/favorites');
    },
}