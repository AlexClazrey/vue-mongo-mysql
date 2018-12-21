<template>
    <table>
        <caption>{{ caption }}</caption>
        <caption v-if="note" class='note-caption'><small>{{ note }}</small></caption>
        <thead>
            <tr>
                <th v-for="name in names" :key="name">{{ name }}</th>
                <th v-if="showButton">{{ buttonHead || 'Operation' }}</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="loading">
                <tr>
                    <td :colspan="names.length + 1">Loading...</td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="entry in data" :key="entry.id">
                    <td v-for="property in properties" :key="property">{{ entry[property] }}</td>
                    <td v-if="showButton">
                        <button @click="buttonCallback(entry)">{{ buttonText }}</button>
                    </td>
                </tr>
                <tr v-if="data.length == 0">
                    <td :colspan="names.length + 1">Empty</td>
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
        showButton: Boolean,
        buttonHead: String,
        buttonText: String, 
        buttonCallback: Function,
    },
    
}
</script>

<style>
    table caption.note-caption {
        margin: 0;
    }
</style>