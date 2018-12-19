import api from '@/services/api'

export default{
    getBoards(){
        return api().get('/boards');
    }
}