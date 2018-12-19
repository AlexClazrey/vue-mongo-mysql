<template>
    <div class='admin-panel'>
        <table class='user-groups'>
            <caption>User Groups</caption>
            <thead>
                <tr>
                    <th>Group ID</th>
                    <th>Name</th>
                    <th>Priority</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="group in groups" :key="group.id">
                    <td>{{ group.id }}</td>
                    <td>{{ group.name }}</td>
                    <td>{{ group.priority }}</td>
                </tr>
                <tr v-if="groups.length == 0">
                    <td colspan="3">Empty</td>
                </tr>
            </tbody>
        </table>
        <table class='privileges'>
            <caption>Privileges</caption>
            <thead>
                <tr>
                    <th>Privilege ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in privileges" :key="entry.id">
                    <td>{{ entry.id }}</td>
                    <td>{{ entry.name }}</td>
                </tr>
                <tr v-if="privileges.length == 0">
                    <td colspan="2">Empty</td>
                </tr>
            </tbody>
        </table>
        <table class='group-privilege'>
        </table>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters(['boards', 'groups', 'privileges']),
    },
    mounted() {
        this.refreshAdminPanel();
    },
    methods: {
        ...mapActions(['refreshAdminPanel']),
    }
}
</script>

<style scoped>
table {
	margin: 30px auto;
	text-align: center;
	font-family: monospace;
}
table caption {
    font-size: 20px;
    margin: 20px;
}
tbody tr:nth-child(even) {
	background: #f2f2f2;
}
td, th {
	text-align: left;
	padding: 10px;
}
th {
	background: #4d7ef7;
	color: #fff;
	font-size: 16px;
}
</style>
