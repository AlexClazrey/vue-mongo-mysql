<template lang="pug">
v-card(flat style="max-width: 1300px; margin: 0 auto;")
    v-container.py-0
        user-info(:uid="$route.params.uid")
</template>

<script>
import userInfo from '@/components/user-information/UserInfo.vue';
export default {
    components: {
        'user-info': userInfo,
    }
}
</script>
