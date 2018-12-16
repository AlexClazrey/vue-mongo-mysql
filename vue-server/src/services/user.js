import api from '@/services/api'

export default{
    fetchUser() {
        return api().get('user');
    },
    
}