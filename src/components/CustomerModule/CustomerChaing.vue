<template>
  <div>
    <van-button type="primary" size="mini" style="margin-left: 85%;" @click="sync">同步</van-button>
    <div style="height:66vh" @scroll="scrollEventselect" class="CustomerChaing">
      <ChatRecord></ChatRecord>
    </div>
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
    sync(){// 执行子组件同步方法
      this.$children[0].updateList(); 
    },
    scrollEventselect(){
      
    }
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