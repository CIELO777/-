<template>
  <van-tabbar v-model="active" @change="tabbarChange" class="overallBar">
    <van-tabbar-item name="Home">
      <template #icon="props">
        <img :src="props.active ? Home.active : Home.inactive" class="barImg" />
        <span :style="{color:props.active ? 'red' : '#000'}" class="barText">联系人</span>
      </template>
    </van-tabbar-item>
    <van-tabbar-item name="Common">
      <template #icon="props">
        <img :src="props.active ? Common.active : Common.inactive" class="barImg" />
        <span :style="{color:props.active ? 'red' : '#000'}" class="barText">常用</span>
      </template>
    </van-tabbar-item>
    <van-tabbar-item name="HighSeas">
      <template #icon="props">
        <img :src="props.active ? HighSeas.active : HighSeas.inactive" class="barImg" />
        <span :style="{color:props.active ? 'red' : '#000'}" class="barText">公海</span>
      </template>
    </van-tabbar-item>
    <van-tabbar-item name="Checking">
      <template #icon="props">
        <img :src="props.active ? Checking.active : Checking.inactive" class="barImg" />
        <span :style="{color:props.active ? 'red' : '#000'}" class="barText">查重</span>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script >
export default {
  data() {
    return {
      active: '',
      Home: {
        active: require('../assets/img/contact_new_select@2x.png'),
        inactive: require('../assets/img/contact_new_unselect@2x.png'),
      },
      Common: {
        active: require('../assets/img/contact_top_select@2x.png'),
        inactive: require('../assets/img/contact_top_unselect@2x.png'),
      },
      HighSeas: {
        active: require('../assets/img/contact_opensea_select@2x.png'),
        inactive: require('../assets/img/contact_opensea_unselect@2x.png'),
      },
      Checking: {
        active: require('../assets/img/contact_check_select23@2x.png'),
        inactive: require('../assets/img/contact_check_unselect23@2x.png'),
      },
    }
  },
  methods: {
    tabbarChange(event) {
      sessionStorage.setItem('active', event);
      if (event == 'Home') {
        sessionStorage.setItem('TabIndex', 6);
      } else if (event == 'Common') {
        sessionStorage.setItem('TabIndex', 7);
      } else if (event == 'HighSeas') {
        sessionStorage.setItem('TabIndex', 8);
      }
      this.active = sessionStorage.getItem('active');
      this.$router.replace({ name: event })
    },
  },
  created() {
    this.active = sessionStorage.getItem('active') ?? "Home";
  }
}
</script>
<style lang="less" scoped>
.overallBar {
  .barImg {
    margin: 0 auto;
  }
  .barText {
    font-size: 12px;
  }
  /deep/ .van-tabbar-item__icon {
    margin-bottom: 0px;
  }
}
</style>