import api from '@/services/api'

const ax = api('/boards');

export default{
    getBoards(){
        return ax.get('/');
    },
    addBoard(name) {
        return ax.post('/', {name});
    },
    removeBoard(bid) {
        return ax.delete('/' + bid);
    }
}