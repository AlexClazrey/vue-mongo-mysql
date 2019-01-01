import api from '@/services/api';

const ax = api('/file');

export default {
    getAddress(fileId) {
        return ax.get('/' + fileId);
    }
}