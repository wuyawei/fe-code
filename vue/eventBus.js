import Vue from 'vue';
const bus = new Vue({
    data () {
        return {
            wsData: {}
        }
    },
    created () {
        this.$on('onMessage', val => {
            this.wsData = val;
        })
    },
    computed: {
        stateWs() {
            if (this.wsData.type === 'updateState') {
                return this.wsData;
            }
        }
    }
});
export default bus;