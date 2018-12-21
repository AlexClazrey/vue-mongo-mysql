<template>
    <div class='admin-panel'>
        <admin-panel-table 
         class="user-group"
         caption="Groups"
         :names="['GID', 'Name', 'Priority']"
         :loading="loading"
         :properties="['id', 'name', 'priority']"
         :data="adminPanel.groups"
        />
        <admin-panel-table
         class="privileges"
         caption="Privileges"
         :names="['Pri ID', 'Name']"
         :loading="loading"
         :properties="['id', 'name']"
         :data="adminPanel.privileges"
        />
        <admin-panel-table
         caption="Boards"
         :names="['BID', 'Name']"
         :loading="loading"
         :properties="['bid', 'name']"
         :data="boards"
        />
        <admin-panel-table
         caption="User To Group"
         :names="['ID', 'UID', 'GID', 'BID', 'Username', 'Nickname', 'Group', 'Board']"
         :loading="loading"
         :properties="['id', 'uid', 'gid', 'bid', 'username', 'nickname', 'groupName', 'boardName']"
         :data="userToGroupDetail"
         note="default group is omitted"
        />
        <admin-panel-table
         caption="Group To Privileges"
         :names="['GID', 'Pri ID', 'Permit']"
         :loading="loading"
         :properties="['gid', 'priId', 'permit']"
         :data="adminPanel.groupToPrivileges"
        />
        
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AdminPanelTable from './AdminPanelTable.vue';
export default {
    name: 'admin-panel',
    components: {
        'admin-panel-table': AdminPanelTable,
    },
    computed: {
        ...mapGetters(['adminPanel', 'boards']),
        loading() {
            return this.adminPanel.loaded < this.adminPanel.requests;
        },
        userToGroupDetail() {
            return this.adminPanel.userToGroup.map(entry => {
                var group = this.adminPanel.groups.find(group => group.id == entry.gid);
                var user = this.adminPanel.users.find(user => user.id == entry.uid);
                var board;
                if(entry.bid)
                    board = this.boards.find(board => board.bid == entry.bid);
                else
                    board = { name: "ALL", bid: "ALL" };
                return {
                    id: entry.id,
                    uid: entry.uid,
                    gid: entry.gid,
                    bid: entry.bid || board.bid,
                    groupName: group.name,
                    username: user.username,
                    nickname: user.nickname,
                    boardName: board.name,
                }
            });
        },
    },
    mounted() {
        this.refreshAdminPanel();
    },
    methods: {
        ...mapActions(['refreshAdminPanel']),
    }
}
</script>

<style>
.admin-panel {
    min-width: 500px;
    margin: 0 auto;
}
.admin-panel table {
    min-width: 500px;
	margin: 30px auto;
	font-family: Verdana, Geneva, Tahoma, sans-serif;
}
.admin-panel caption {
	text-align: center;
    font-size: 20px;
    margin: 20px;
}
.admin-panel tbody tr:nth-child(even) {
	background: #f2f2f2;
}
.admin-panel td, th {
	text-align: left;
	padding: 10px;
}
.admin-panel th {
	background: #36ac7b;
	color: #fff;
	font-size: 16px;
}

.admin-panel .user-group th:first-child {
    width: 25%;
}

</style>
