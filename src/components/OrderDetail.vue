  <template>
  <div class="orderDetail">
    <!-- <div class="backGo" @click="backgo">
      <van-icon name="arrow-left" size="17px" color="#fff" />
    </div> -->
    <div class="dTitle">客户信息</div>
    <van-cell-group>
      <van-field
        type="number"
        label="订单金额"
        placeholder="必填项"
        v-model="money"
      />
      <van-field label="订单备注" placeholder="必填项" v-model="remark" />
      <van-cell is-link title="选择商品" to="ChooseCommodity" />
      <!-- 商品列表 -->
      <div
        v-if="productList.length > 0"
        style="background: #f1f1f1; padding: 2px"
      >
        <div
          class="productView"
          v-for="(item, index) in productList"
          :key="index"
        >
          <div class="img-text">
            <img :src="item.thumb" alt="" />
            <div class="text">
              <p>{{ item.title }}</p>
              <p style="color: rgb(138 133 133)">{{ item.description }}</p>
            </div>
          </div>
          <div>
            <span style="margin-right: 10px">当前商品总金额：</span>
            <span style="color: #f56464" v-if="item.models"
              >{{ item.modelPrice * item.shuliang }} 元</span
            >
            <span v-else>{{ (item.price * item.shuliang).toFixed(2) }} 元</span>
          </div>
          <!-- 商品型号 -->
          <div
            class="models"
            @click="ClickModel(JSON.parse(item.models), index)"
            v-if="item.models && JSON.parse(item.models).length > 0"
          >
            <span style="margin-right: 20px">商品型号:</span>
            <span>{{ item.modelsName }}</span>
            <van-icon name="arrow" />
          </div>
          <div class="orderNum">
            <span style="margin-right: 40px">商品数量：</span>
            <van-stepper
              button-size="20px"
              @plus="stepperChange(item.shuliang, index, item.modelPrice)"
              @minus="deduction(item.shuliang, index)"
              show-plus
              show-minus
              v-model="item.shuliang"
              min="1"
              :max="item.stock"
              @blur="StepperBlur(item.shuliang, index)"
            />
          </div>
        </div>
      </div>
      <!-- <van-action-sheet /> -->
      <div class="waupolad">
        <template v-for="(item, index) in imageList">
          <van-image
            :key="index"
            width="1.6rem"
            height="1.6rem"
            fit="cover"
            :src="item"
          >
            <div :style="style" @click="Del(index)">X</div>
          </van-image>
        </template>
        <div class="uploadView">
          <img src="../assets/img/addPhoto@2x.png" alt="" />
          <input
            type="file"
            class="upload"
            id="upload"
            multiple
            @change="addImg"
            style="opacity: 0"
          />
        </div>
      </div>
    </van-cell-group>
    <div class="dTitle">客户信息</div>
    <van-field
      label="客户姓名"
      readonly
      placeholder="必填项"
      v-model="receiptName"
    />
    <van-field
      type="tel"
      label="客户手机"
      placeholder="必填项"
      v-model="receiptMobile"
      readonly
    />
    <van-field
      is-link
      readonly
      label="订单所属"
      placeholder=""
      v-model="OrderquantityName"
      @click="skip"
    />
    <!-- <van-cell is-link title="订单所属" :value="OrderquantityName" /> -->
    <!-- <van-action-sheet /> -->
    <van-button type="primary" size="large" @click="OrderSave" class="saveBtn"
      >保存</van-button
    >
    <!-- 类型选择弹框 -->
    <van-action-sheet
      v-model="ModelShow"
      :actions="ModelsActions"
      description="请选择型号"
      @select="onSelect"
      class="actionSheet"
    />
  </div>
</template>

<script>
import { generateTimeout, generateNonce, generateSignature3, generateSignature4, randomWord } from '../uilts/tools';
import local from '../uilts/localStorage';


export default {
  name: 'OrderDetail',
  data() {
    return {
      receiptName: '',
      receiptMobile: '',
      productList: [],
      OrderquantityName: "",
      OrderquantityId: "",
      money: '',
      remark: "",
      imageList: [],
      ModelsActions: [],
      ModelShow: false,
      ModelIdx: null,
      style: {
        textAlign: 'center',
        width: '0.2rem',
        height: '0.2rem',
        lineHeight: '0.2rem',
        color: '#fff',
        padding: '0.06rem',
        background: 'red',
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft: "-0.1rem",
        marginTop: "-0.1rem",
        borderRadius: '50%',
      }
    }
  },
  methods: {
    OrderSave() {   // 新增订单保存
      let that = this;
      let crmInfo = JSON.parse(sessionStorage.getItem('_crm_info'))?.id;
      let timeout = generateTimeout()
      let nonce = generateNonce();
      let userId = this.$U || local.U();
      let compId = this.$C || local.C();
      let signature = generateSignature3(userId, compId, timeout, nonce);
      if (Number(this.money) === 0) {
        this.$toast.fail('请输入订单金额')
        return;
      } else if (this.remark === '') {
        this.$toast.fail('请输入订单备注')
        return;
      } else if (this.receiptName === '') {
        this.$toast.fail('请输入客户姓名')
        return;

      } else if (this.receiptMobile === '') {
        this.$toast.fail('请输入客户手机')
        return;
      };
      // console.log(this.productList);
      let product = this.productList.map(item => {
        return {
          amount: item.shuliang.toString(),
          id: 0,
          price: item.price.toString(),
          productId: item.id,
          productModelId: item.productModelId,
          title: item.title,
          thumb: item.thumb,
        }
      })
      console.log(product);
      let param = new URLSearchParams();
      param.append("actualTotal", this.money);
      param.append("compId", compId);
      param.append("customerId", crmInfo);
      param.append("loginId", userId);
      param.append("nonce", nonce);
      param.append("promote", this.OrderquantityId);
      param.append("receiptMobile", this.receiptMobile);
      param.append("receiptName", this.receiptName);
      param.append("signature", signature);
      param.append("shopId", 0);
      param.append("timeout", timeout);
      param.append("title", this.remark);
      param.append("userId", userId);
      param.append("photos", this.imageList.toString());
      param.append("products", JSON.stringify(product));
      this.$post1('/api/request/mall/order/create', param)
        .then(function (res) {
          if (res.error == 'success') {
            that.$toast({
              message: '新增成功',
              position: 'bottom',
            }); // 先去设置弹框和存储数据，然后跳转。
            sessionStorage.removeItem("shelvesIds")
            sessionStorage.removeItem("shelvesData")
            setTimeout(() => {
              that.$router.push({ name: 'LinkDetailed', params: { userId: 12 } })
              sessionStorage.setItem('tabNum', 2)
            }, 800)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    backgo() {  // 点击返回的时候保存信息
      sessionStorage.setItem('tabNum', 2);
      this.$router.push('/linkDetailed')
      sessionStorage.removeItem('shelvesData');
      sessionStorage.removeItem('shelvesIds');
    },
    stepperChange(shuliang, index) { // 计数器++
      // 每一次选择好计算总金额
      let Tprice = 0;
      this.productList[index].shuliang = ++shuliang;
      this.productList.map(item => {
        if (item.models) {
          Tprice += (item.shuliang * item.modelPrice)
        } else {
          Tprice += (item.shuliang * item.price)
        }
      })
      this.money = Tprice.toFixed(2);
    },
    deduction(shuliang, index) { // 计数器--
      let Tprice = 0;
      this.productList[index].shuliang = --shuliang;
      this.productList.map(item => {
        if (item.models) {
          Tprice += (item.shuliang * item.modelPrice)
        } else {
          Tprice += (item.shuliang * item.price)
        }
      })
      this.money = Tprice.toFixed(2);
    },
    StepperBlur(shuliang, index) {
      let Tprice = 0;
      this.productList[index].shuliang = shuliang;
      this.productList.map(item => {
        Tprice += (item.shuliang * item.price)
      })
      this.money = Tprice.toFixed(2);
    },
    addImg(e) {
      console.log(this.imageList.length > 8);
      let file = e.target.files[0];
      if (file == undefined) return false;
      if (e.target.files.length === 1) {  //单文件上传
        var fileSize = file.size; //获得文件大小；
        var filePath = file.type.split("/")[1];
        // var fileType = filePath[filePath.length - 1]; //获得文件结尾的类型如 zip rar 这种写法确保是最后的
        if (!(filePath == "png" || filePath == "jpg" || filePath == "jpeg" || filePath == "gif")) {
          this.$toast.fail('文件格式不符合要求！支持png和jpg文件');
          return false
        } else if (fileSize > 1048576) {
          this.$toast.fail('请上传不超过1M的图片!');
          return false
        }
        this.uploadImg(file, sessionStorage.getItem('userinfo')?.id);
      } else if (e.target.files.length > 1) {  // 多文件上传
        console.log(e.target.files);
        let filesPath = [];  // 文件后缀数组，目的是监听文件格式符合要求
        let fileSize = [];  // 每个文件的大小
        for (const key in e.target.files) {
          if (e.target.files[key].type) {
            filesPath.push(e.target.files[key].type.split("/")[1]);
          }
          if (e.target.files[key].size) {
            fileSize.push(e.target.files[key].size)
          }
        }
        console.log(filesPath);
        console.log(fileSize);
        let filePaths = filesPath.every((item) => { // 判断图片类型是否合规
          return !(item == "png" || item == "jpg" || item == "jpeg" || item == "gif")
        })
        let fileSizes = fileSize.every((item) => { // 判断图片大小是否合规
          console.log(item < 1048576);
          return item > 1048576;
        })
        if (fileSizes) { // 一真则证明不符合规格
          this.$toast.fail('请上传不超过1M的图片!');
          return;
        }
        if (filePaths) {
          this.$toast.fail('文件格式不符合要求！支持png和jpg文件');
          return;
        }
        for (const key in e.target.files) {  // 如果符合条件那么就请求接口2
          if (e.target.files[key].type && e.target.files[key].size) {
            this.uploadImg(e.target.files[key])
          }
        }
      }
    },
    uploadImg(file, compId) {
      // return;
      var that = this;
      var formData = new FormData();
      formData.append('id', this.$U || local.U());
      formData.append('type', 1);
      formData.append('file', file); // 单个上传
      this.$post('//upload.jiain.net/upload', formData).then(res => {
        if (res.state === 'success') {
          let url = 'http://ego-file.soperson.com' + res.url;
          if (that.imageList.length >= 9) {
            that.$toast.fail('最多上传9张图片!');
            return;
          }
          that.imageList.push(url);
        } else {
          that.$toast.fail('上传失败请稍后再试!');
        }
      }).catch(err => {
        console.log(err)
      })
    },
    ClickModel(data, index) { // 点击商品分类事件
      console.log(data, index);
      this.ModelsActions = data.map((item) => {
        return {
          ...item,
          name: item.title,
          subname: item.price + '元'
        }
      });
      this.ModelShow = true;
      this.ModelIdx = index;
    },
    onSelect(action, index) {
      console.log(action);
      this.productList[this.ModelIdx].modelsName = action.title;
      this.productList[this.ModelIdx].modelPrice = action.price;
      this.productList[this.ModelIdx].productModelId = action.id;
      // 每一次选择好计算总金额
      let Tprice = 0;
      console.log(this.productList);
      this.productList.map(item => {
        if (item.models) {
          Tprice += (item.shuliang * item.modelPrice)
          console.log(item.shuliang, action.price, '111111111');
        } else {
          Tprice += (item.shuliang * item.price)
        }
      })
      console.log(Tprice);
      this.money = Tprice.toFixed(2);
      // 计算当前价格
      this.ModelShow = false;
    },
    skip() {
      this.$router.push({
        path: '/OrderList',
      })
    },
    Del(index) { // 删除图片
      this.imageList.splice(index, 1)
    }
  },
  created() {
    if (this.$route.params.add) {  // 如果是新增的话，那么就清空表单
      this.receiptName = this.$route.params.name;
      this.receiptMobile = this.$route.params.phone;
      this.OrderquantityName = JSON.parse(sessionStorage.getItem('userinfo')).nickname;
      this.OrderquantityId = JSON.parse(sessionStorage.getItem('userinfo')).id;
      this.productList = [];
      this.money = "";
      this.remark = "";
      this.imageList = [];
    }
    let productList = JSON.parse(sessionStorage.getItem('shelvesData'));  // 渲染已经选择的商品列表
    if (!productList) return;
    this.productList = productList.map(item => {
      if (item.models) {
        item.modelsName = JSON.parse(item.models)[0].title;
      }
      return {
        ...item,
        shuliang: 1,
      }
    })

  },
  activated() {
    console.log(JSON.parse(sessionStorage.getItem('shelvesData')), 'activated');
    if (sessionStorage.getItem('orderSelectInfo')) {
      this.OrderquantityName = JSON.parse(sessionStorage.getItem('orderSelectInfo')).name;
      this.OrderquantityId = JSON.parse(sessionStorage.getItem('orderSelectInfo')).id;
    }
    this.productList = [];
    let productList = JSON.parse(sessionStorage.getItem('shelvesData'));
    if (!productList) { // 没有的话直接清空，
      this.productList = []
    } else {  // 有数据的话直接去循环渲染
      this.productList = productList.map(item => {
        if (item.models) {
          item.modelsName = JSON.parse(item.models)[0].title;
          item.modelPrice = JSON.parse(item.models)[0].price * 1;
          item.productModelId = JSON.parse(item.models)[0].id;
        }
        return {
          ...item,
          shuliang: 1
        }
      })
    };
    // 每一次选择好计算总金额
    let Tprice = 0;
    this.productList.map(item => {
      if (item.models) {
        Tprice += (item.shuliang * item.modelPrice)
      } else {
        Tprice += (item.shuliang * item.price)
      }
    })
    this.money = Tprice.toFixed(2);
  },
  beforeRouteEnter(to, from, next) {
    //  因为顶部tabbar 被移除，获取不到点击事件，所以通过路由控制数组是否存在
    if (to.name == 'OrderDetail' && from.name == 'LinkDetailed') {
      sessionStorage.removeItem("shelvesIds")
      sessionStorage.removeItem("shelvesData")
    }
    // 注意，在路由进入之前，组件实例还未渲染，所以无法获取this实例，只能通过vm来访问组件实例
    next(vm => {
      vm.$store.commit("cache", "Home,Common,HighSeas,OrderDetail,LinkDetailed");
    })
  },
  beforeRouteLeave(to, from, next) {
    // 即将跳转的路由地址 // 即将离开并且删除订单所属数据
    if (to.name == 'LinkDetailed' && from.name == 'OrderDetail') {
      sessionStorage.removeItem("orderSelectInfo");
      this.$store.commit("cache", "Home,Common,HighSeas,LinkDetailed");
    }
    next()
  },
}
</script>

<style lang="less" scoped>
.orderDetail {
  font-size: 14px;
  padding-bottom: 50px;

  .waupolad {
    padding: 0.2rem 0.26rem;
    display: flex;
    flex-wrap: wrap;
    .van-image {
      margin-right: 0.2rem;
      margin-bottom: 0.2rem;
      position: relative;
    }
  }

  .backGo {
    width: 1rem;
    height: 45px;
    position: fixed;
    top: 0;
    z-index: 999;
    left: 0;
    background: #5c5c5c;
    i {
      padding-top: 14px;
      padding-left: 16px;
    }
  }
  .dTitle {
    height: 41px;
    line-height: 41px;
    padding-left: 14px;
    color: #597896;
    background: #f1f1f1;
  }
  .productView {
    padding: 0.3rem 0.3rem;
    border-radius: 21px;
    width: 90%;
    margin: 0.2rem auto;
    background: #fff;
    .img-text {
      display: flex;
      margin-bottom: 0.25rem;

      img {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.2rem;
      }
      .text {
        display: flex;
        justify-content: center;
        flex-direction: column;
        p:first-child {
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 4rem;
        }
        p:last-child {
          margin-bottom: 0.1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 4rem;
        }
      }
    }
    .orderNum {
      display: flex;
      margin-top: 0.25rem;
      align-items: center;
    }
  }
  .uploadView {
    position: relative;
    img {
      width: 1.6rem;
      height: 1.6rem;
    }
    .upload {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
  .saveBtn {
    background: #51bbba;
    margin-top: 10px;
    display: block;
    margin: 10px auto 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .models {
    height: auto;
    margin-top: 0.25rem;
    i {
      float: right;
    }
  }
  .actionSheet {
    /deep/ .van-action-sheet__description {
      color: black;
    }
  }
}
</style>