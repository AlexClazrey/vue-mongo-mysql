<template>
    <div class='admin-panel'>
        <admin-panel-table 
         class="user-group comfort-table"
         caption="Groups"
         :names="['GID', 'Name', 'Priority']"
         :loading="loading"
         :properties="['id', 'name', 'priority']"
         :data="adminPanel.groups"
         :show-button="true"
         button-text="Remove"
         :button-callback="removeGroup"
        />
        <div class="add-panel add-group-panel">
            <input type="text" name="groupName" placeholder="Group Name" v-model="groupName">
            <input type="number" name="groupPriority" placeholder="Group Priority" v-model="groupPriority">
            <button class="add-group" @click="addGroup">Add Group</button>
        </div>
        <admin-panel-table
         class="privileges comfort-table"
         caption="Privileges"
         :names="['Pri ID', 'Name']"
         :loading="loading"
         :properties="['id', 'name']"
         :data="adminPanel.privileges"
         :show-button="true"
         button-text="Remove"
         :button-callback="removePrivilege"
        />
        <div class="add-panel add-privilege-panel">
            <input type="text" name="privilegeName" placeholder="Privilege Name" v-model="privilegeName">
            <button class="add-privilege" @click="addPrivilege">Add Privilege</button>
        </div>
        <admin-panel-table
         class="boards comfort-table"
         caption="Boards"
         :names="['BID', 'Name']"
         :loading="loading"
         :properties="['id', 'name']"
         :data="boards"
         :show-button="true"
         button-text="Remove"
         :button-callback="removeBoard"
        />
        <div class="add-panel add-board-panel">
            <input type="text" name="boardName" placeholder="Board Name" v-model="boardName">
            <button class="add-board" @click="addBoard">Add Board</button>
        </div>
        <admin-panel-table
         class="user-to-group"
         caption="User To Group Rules"
         :names="['ID', 'UID', 'GID', 'BID', 'Username', 'Nickname', 'Group', 'Board']"
         :loading="loading"
         :properties="['id', 'uid', 'gid', 'bid', 'username', 'nickname', 'groupName', 'boardName']"
         :data="userToGroupDetail"
         note="default group is omitted"
         :show-button="true"
         button-text="Remove"
         :button-callback="removeUserFromGroup"
        />
        <div class="add-panel add-user-to-group-panel">
            <input type="text" name="userId" placeholder="User ID" v-model="userToGroup.uid">
            <select v-model="userToGroup.gid">
                <option :value="null" disabled selected>Choose a group...</option>
                <option v-for="group in adminPanel.groups" :key="group.id" :value="group.id">{{ group.id + '. ' + group.name }}</option>
            </select>
            <select v-model="userToGroup.bid">
                <option :value="null" disabled selected>Choose a board...</option>
                <option v-for="board in boards" :key="board.id" :value="board.id">{{ board.id + '. ' + board.name }}</option>
            </select>
            <button class="add-user-to-group" @click="addUserToGroup">Add User To Group</button>
        </div>
        <admin-panel-table
         class="group-to-privileges"
         caption="Group To Privileges Rules"
         :names="['GID', 'Pri ID', 'Group', 'Privilege', 'Permit']"
         :loading="loading"
         :properties="['gid', 'priId', 'groupName', 'privilegeName', 'permit']"
         :data="groupToPrivilegesDetail"
         :show-button="true"
         button-text="Remove"
         :button-callback="removePrivilegeFromGroup"
        />
        <div class="add-panel add-privilege-to-group-panel">
            <select v-model="groupToPrivileges.gid">
                <option :value="null" disabled selected>Choose a group...</option>
                <option v-for="group in adminPanel.groups" :key="group.id" :value="group.id">{{ group.id + '. ' + group.name }}</option>
            </select>
            <select v-model="groupToPrivileges.priId">
                <option :value="null" disabled selected>Choose a privilege...</option>
                <option v-for="privilege in adminPanel.privileges" :key="privilege.id" :value="privilege.id">{{ privilege.id + '. ' + privilege.name }}</option>
            </select>
            <select v-model="groupToPrivileges.permit">
                <option :value="null" disabled selected>Choose if permit...</option>
                <option :value="1">Permit</option>
                <option :value="0">Forbidden</option>
            </select>
            <button class="add-privilege-to-group" @click="addPrivilegeToGroup">Add Privilege To Group</button>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AdminPanelTable from './AdminPanelTable.vue';
import groupApi from '@/services/group.js';
import boardApi from '@/services/boards.js';

export default {
    name: 'admin-panel',
    data() {
        return {
            groupName: '',
            groupPriority: null,
            privilegeName: '',
            boardName: '',
            userToGroup: {
                uid: null,
                username: null,
                gid: null,
                bid: null,
            },
            groupToPrivileges: {
                gid: null,
                priId: null,
                permit: null,
            },
        }
    },
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
                    board = this.boards.find(board => board.id == entry.bid);
                else
                    board = { name: "ALL", id: "ALL" };
                return {
                    id: entry.id,
                    uid: entry.uid,
                    gid: entry.gid,
                    bid: entry.bid || board.id,
                    groupName: group ? group.name : 'null',
                    username: user ? user.username : 'null',
                    nickname: user ? user.nickname : 'null',
                    boardName: board ? board.name : 'null',
                }
            });
        },
        groupToPrivilegesDetail() {
            return this.adminPanel.groupToPrivileges.map(entry => {
                var group = this.adminPanel.groups.find(group => group.id == entry.gid);
                var privilege = this.adminPanel.privileges.find(privilege => privilege.id == entry.priId);
                return {
                    gid: entry.gid,
                    priId: entry.priId,
                    groupName: group ? group.name : 'null',
                    privilegeName: privilege ? privilege.name : 'null',
                    permit: entry.permit ? 'Yes' : 'No',
                }
            });
        }
    },
    mounted() {
        this.refreshAdminPanel();
    },
    methods: {
        ...mapActions(['refreshAdminPanel']),
        async addGroup() {
            var result = await groupApi.addGroup(this.groupName, this.groupPriority);
            if(result.data && result.data.success) {
                alert('添加成功');
                this.$store.dispatch('refreshGroups');
            } else {
                alert('添加失败');
            }
        },
        async removeGroup(entry) {
            if(entry.id == 1) {
                alert('你不能删除默认用户组。');
                return;
            }
            if(entry.id == 2) {
                alert('你不能删除管理员用户组。');
                return;
            }
            if(confirm('真的要删除用户组' + entry.name + '吗？')) {
                var result = await groupApi.removeGroup(entry.id);
                if(result.data && result.data.success) {
                    alert('删除成功');
                    this.$store.dispatch('refreshGroups');
                }
            }
        },
        async addPrivilege() {
            var result = await groupApi.addPrivilege(this.privilegeName);
            if(result.data && result.data.success) {
                alert('Privilege added.')
                this.$store.dispatch('refreshPrivileges');
            }
        },
        async removePrivilege(entry) {
            if(entry.name == 'user admin') {
                alert('You cannot remove the admin privilege.');
                return;
            }
            if(this.adminPanel.groupToPrivileges.find(x => x.gid == 1 && x.priId == entry.id)) {
                alert('You cannot remove a privilege which is currently granted to default user group.\nYou need to revoke it first.');
                return;
            }
            if(confirm('Do you want to remove the privilege "' + entry.name + '"?')) {
                var result = await groupApi.removePrivilege(entry.id);
                if(result.data && result.data.success) {
                    alert('Privilege removed');
                    this.$store.dispatch('refreshPrivileges');
                }
            }
        },
        async addBoard() {
            var result = await boardApi.addBoard(this.boardName);
            if(result.data && result.data.success) {
                alert('Board added');
                this.$store.dispatch('refreshBoards');
            }
        },
        async removeBoard(entry) {
            if(confirm('Do you really want to remove the board "' + entry.name + '"?\nAll posts within will be hidden.')) {
                var result = await boardApi.removeBoard(entry.id);
                if(result.data && result.data.success) {
                    alert('Board removed.');
                    this.$store.dispatch('refreshBoards');
                }
            }
        },
        async addUserToGroup() {
            var result = await groupApi.addUserToGroup(this.userToGroup.uid, this.userToGroup.gid, this.userToGroup.bid);
            if(result.data && result.data.success) {
                alert('Rule added.');
            } else {
                alert('Add rule failed.');
            }
            this.$store.dispatch('refreshUserToGroup');
        },
        async removeUserFromGroup(entry) {
            if(confirm('Do you want to remove this rule?')) {
                var result = await groupApi.removeUserFromGroup(entry.id);
                if(result.data && result.data.success) {
                    alert('Rule removed.');
                } else {
                    alert('Remove rule failed.');
                }
                this.$store.dispatch('refreshUserToGroup');
            }
        },
        async addPrivilegeToGroup() {
            var result = await groupApi.addPrivilegeToGroup(this.groupToPrivileges.priId, this.groupToPrivileges.gid, this.groupToPrivileges.permit);
            if(result.data && result.data.success) {
                alert('Rule added.');
            } else {
                alert('Add rule failed.');
            }
            this.$store.dispatch('refreshGroupToPrivileges');
        },
        async removePrivilegeFromGroup(entry) {
            if(confirm('Do you want to remove this rule?')) {
                var result = await groupApi.removePrivilegeFromGroup(entry.priId, entry.gid);
                if(result.data && result.data.success) {
                    alert('Rule removed.');
                } else {
                    alert('Remove rule failed.');
                }
                this.$store.dispatch('refreshGroupToPrivileges');
            }
        },
    }
}
</script>

<style>
.admin-panel {
    min-width: 800px;
    max-width: 960px;
    margin: 0 auto;
}
.admin-panel table {
    width: 800px;
	margin: 30px auto;
	font-family: Verdana, Geneva, Tahoma, sans-serif;
    border: 2px #36ac7b solid;
    border-collapse:collapse;
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

.admin-panel .comfort-table th:first-child  {
    width: 15%;
}

.admin-panel th:last-child {
    width: 15%;
}

.admin-panel .add-panel {
    width: 800px;
    margin: 0 auto;
    text-align: center;
}


</style>
