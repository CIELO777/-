<template>
  <div
    :style="{ height: height }"
    @scroll="scrollEventselect"
    class="CustomerChaing"
  >
    <ChatRecord></ChatRecord>
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3 } from '../../uilts/tools';
import ChatRecord from '../ChatRecord.vue';
export default {
  name: "CustomerChaing",
  components: { ChatRecord },
  props: ['height'],
  data() {
    return {

    };
  },
  watch: {},
  computed: {},
  methods: {
    scrollEventselect() {
      let read = document.querySelector('.CustomerChaing')
      var scrollTop = read.scrollTop;
      var windowHeight = read.clientHeight;
      var scrollHeight = read.scrollHeight;
      if (parseInt(scrollTop) + windowHeight == scrollHeight && scrollTop > 15) {
      }
    },

  },
  created() {
  },
  mounted() { }
};
</script>

<style lang="less" scoped>
.CustomerChaing {
  overflow-y: scroll;
  height: 78vh;
  padding-top: 15px;
}
</style>