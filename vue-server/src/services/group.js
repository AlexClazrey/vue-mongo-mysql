import api from '@/services/api'

export default {
    listGroup() {
        return api().get('/group');
    },
    listPrivileges() {
        return api().get('/group/privileges');
    },
    listUserToGroup() {
        return api().get('/group/user-to-group');
    },
    listGroupToPrivileges() {
        return api().get('/group/group-to-privileges');
    }
};