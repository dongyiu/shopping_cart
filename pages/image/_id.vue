<template>
    <main>
        <img :src="test" alt="">
    </main>
</template>

<script>
export default {
    data() {
        return {
            test: null,
            id: null
        }
    },
    async mounted() {
        const res = await this.$axios.get(`/api/uploadPhoto/${this.$route.params.id}`)
        var bytes = new Uint8Array(res.data.image.data.data);
        var binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
        this.test = "data:image/jpeg;base64," + btoa(binary);
    }
}
</script>