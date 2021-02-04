# crm-js

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

1. form 表单，返回联系人列表页数有问题，current 缓存了，页数问题, ✔
2. 联系人列表绑定外部联系人问题。 解决待测试， ✔
3. 新的需求是解绑外部联系人, ✔
4. 新增后列表没刷新 ✔
5. 下拉过滤条件后滚动条没有回到初始位置，✔
6. 一级菜单切换 current 问题 ✔
7. 每一个内容页面进行缓存，并且缓存
8. icon 覆盖 navbar

新的需求
名片 彩页 视频 ✔

<!-- 需要优化的地方 -->
<!-- 列表下拉刷新 -->
<!-- 列表增加男女性别 -->

code https://wxa.jiain.net/wx-crm-server/wx/oauth2/login?url=wxa.jiain.net/wx-crm

<!-- 优化内容-->

1.绑定操作移植到新首页，解绑功能 bug 修复 ✔ 2.缓存逻辑修改，当用户从某一模块退出到首页，清除所有缓存 ✔ 3.防流氓初始化模板，数据，页面同时加载完毕，才让用户进行操作 ✔ 4.首次登陆弹框提示成功，首次加载防流氓。非首次正常 ✔ 5.客户列表性别添加 ✔ 6.绑定，解绑弹框样式优化 ✔ 7.客户管理详细过滤第一次管用，第二次页数失效 ✔ 8.客户管理增加下拉刷新列表 ✔ 9.新版工作台 ✔ 10.首页增加下拉刷新 ✔

<!-- 年前增加内容 -->
1.企业微站， 2.软文素材 3.海报素材

<!-- 未解决问题 -->

