# FreshMall 生鲜商城

一个基于 Vue 3 的移动端电商应用，提供完整的购物流程体验。

## How to Run

### 开发环境

```bash
# 进入前端目录
cd frontend-user

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

### Docker 部署

```bash
# 使用 docker-compose 启动
docker-compose up -d
```

访问 http://localhost:8081

## Services

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend-user | 8081 | 用户端前端应用 |

## 测试账号

| 邮箱 | 密码 | 说明 |
|------|------|------|
| user@test.com | 123456 | 普通用户 |

也可以通过注册页面创建新账号。

## 题目内容

1项目为手机电商客户端项目，平台为H5，整体布局为纵向移动项目布局。 
2内容可以借鉴网上成熟的电商平台H5网站、微信小程序、App端的布局。 
3网站整体配色明快清新，不要采用过于跳跃的配色。 
4项目需使用Vue.js框架以SPA（单页应用模式）进行开发，项目中可使用mui、Element-UI、Bootstrap等第三方UI框架。 
5项目构建方式可以自行搭建项目结构，也可以利用vue/cli工具构建脚手架项目。 
5项目中用到的资源素材自行设计。 
6项目中至少应包含登陆、注册、商品详情、首页（含推荐列表）、购物车等组件,必须使用官方插件router和Vuex实现组件切换和数据状态管理，功能不设上线越丰富分数越高。 
7项目中不可出现反动内容，如出现按0分计分。

## 项目结构

```
label-02871/
├── .gitignore
├── docker-compose.yml
├── README.md
└── frontend-user/
    ├── Dockerfile
    ├── index.html
    ├── nginx.conf
    ├── package-lock.json
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── App.vue
        ├── main.js
        ├── api/
        │   └── index.js
        ├── assets/
        │   └── styles/
        │       ├── main.scss
        │       └── variables.scss
        ├── components/
        │   ├── NavBar.vue
        │   ├── NotLoggedIn.vue
        │   ├── ProductCard.vue
        │   └── TabBar.vue
        ├── mock/
        │   └── data.js
        ├── router/
        │   └── index.js
        ├── store/
        │   ├── address.js
        │   ├── cart.js
        │   ├── order.js
        │   └── user.js
        └── views/
            ├── Address.vue
            ├── Cart.vue
            ├── Category.vue
            ├── Checkout.vue
            ├── Home.vue
            ├── Login.vue
            ├── Order.vue
            ├── Pay.vue
            ├── ProductDetail.vue
            ├── Profile.vue
            ├── Register.vue
            └── Search.vue
```

## 技术栈

- Vue 3 - 前端框架
- Vue Router - 路由管理
- Pinia - 状态管理
- Element Plus - UI 组件库
- Vite - 构建工具
- SCSS - CSS 预处理器
- Axios - HTTP 请求
- Docker + Nginx - 部署方案

## 功能特性

- 响应式移动端布局
- 用户登录状态持久化
- 购物车数据本地存储
- 收货地址按用户独立存储
- 订单数据按用户独立存储
- 完整的购物流程
