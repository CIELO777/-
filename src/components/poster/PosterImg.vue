<template>
  <div :class="ani" class="PostImg" @click.prevent="close" v-show="src">
    <img :src="src" alt="" />
    <p style="color: #fff">长按图片保存到本地</p>
  </div>
</template>

<script>
export default {
  name: "PostImg",
  components: {},
  props: ['src'],
  data() {
    return {
      ani: ''
    };
  },
  watch: {},
  computed: {},
  methods: {
    close() {
      this.ani = 'fadeOut';
      document.body.removeAttribute('style')
      setTimeout(() => {
        this.$emit('update:src', '')
      }, 300)
    }
  },
  watch: {
    src(val, oldVal) {//普通的watch监听
      if (val) {
        this.ani = 'fadeIn';
        document.querySelector('body').setAttribute('style', 'height: 100%;overflow: hidden;')
      }
    },
  },
  created() { },
  mounted() { }
};
</script>

<style lang="less" scoped>
.PostImg {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  width: 100%;
  flex-direction: column;
  img {
    width: 50%;
  }
  p {
    padding-top: 0.1rem;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.fadeOut {
  animation: fadeOut 0.5s;
}
.fadeIn {
  animation: fadeIn 0.5s;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 999999;
}
</style>