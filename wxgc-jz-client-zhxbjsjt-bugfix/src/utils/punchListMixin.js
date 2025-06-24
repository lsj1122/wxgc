import punchlist from '@/components/punchlists'
export default {
    components: {
        punchlist,
    },
    methods: {
        rowdbclickFn(row) {
            this.$refs.punchl.viewPunch(row)
        }
    }
}