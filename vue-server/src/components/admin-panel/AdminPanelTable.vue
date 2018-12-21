<template>
    <table>
        <caption>{{ caption }}</caption>
        <caption v-if="note" class='note-caption'><small>{{ note }}</small></caption>
        <thead>
            <tr>
                <th v-for="name in names" :key="name">{{ name }}</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="loading">
                <tr>
                    <td :colspan="names.length">Loading...</td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="entry in data" :key="entry.id">
                    <td v-for="property in properties" :key="property">{{ entry[property] }}</td>
                </tr>
                <tr v-if="data.length == 0">
                    <td :colspan="names.length">Empty</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        caption: String,
        names: Array,
        properties: Array,
        data: Array,
        loading: Boolean,
        note: String,
    },
    
}
</script>

<style>
    table caption.note-caption {
        margin: 0;
    }
</style>