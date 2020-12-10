<template>
  <van-tabbar v-model="active" @change="tabbarChange">
    <van-tabbar-item icon="home-o" name="Home">联系人</van-tabbar-item>
    <van-tabbar-item icon="search" name="Common">常用</van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="HighSeas">公海</van-tabbar-item>
    <van-tabbar-item icon="setting-o" name="Checking">查重</van-tabbar-item>
  </van-tabbar>
</template>

<script >
export default {
  data() {
    return {
      active: ''
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