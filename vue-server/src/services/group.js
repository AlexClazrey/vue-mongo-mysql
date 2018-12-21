import api from '@/services/api'

const ax = api('/group');

export default {
    listGroup() {
        return ax.get('/group');
    },
    addGroup(name, priority) {
        return ax.post('/group', {name, priority});
    },
    removeGroup(gid) {
        return ax.delete('/group/' + gid);
    },

    listPrivileges() {
        return ax.get('/privilege');
    },
    addPrivilege(name) {
        return ax.post('/privilege', {name});
    },
    removePrivilege(priId) {
        return ax.delete('/privilege/' + priId);
    },

    listUserToGroup() {
        return ax.get('/user-to-group');
    },
    addUserToGroup(uid, gid, bid) {
        return ax.post('/user-to-group', {uid, gid, bid});
    },
    removeUserFromGroup(id) {
        return ax.delete('/user-to-group/' + id);
    },

    listGroupToPrivileges() {
        return ax.get('/group-to-privileges');
    },
    addPrivilegeToGroup(priId, gid, permit) {
        return ax.post('/group-to-privileges', {priId, gid, permit});
    },
    removePrivilegeFromGroup(priId, gid) {
        return ax.delete('/group-to-privileges/?pri_id=' + priId + '&gid=' + gid);
    },

    listUser() {
        return ax.get('/user-list');
    },
};