import api from '@/services/api'

export default {
    listGroup() {
        return api().get('/group');
    }
};