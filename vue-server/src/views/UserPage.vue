<template lang="pug">
v-card(flat style="max-width: 1300px; margin: 0 auto;")
    v-container
        user-info()
</template>

<script>
import userInfo from '@/components/user-information/UserInfo.vue';
export default {
    components: {
        'user-info': userInfo,
    }
}
</script>
