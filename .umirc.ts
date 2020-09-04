import { defineConfig } from 'umi';

import defaultSettings from './config/defaultSettings';
import webpackPlugin from './config/plugin.config';
import router from './config/router.config';

const { primaryColor, title } = defaultSettings;


export default defineConfig({
  routes: router,
  chainWebpack: webpackPlugin,
  theme: {
    'primary-color': primaryColor,
  },
  targets: {
    ie: 9,
  },
  antd: {},
  dva: {
    immer:true,
    hmr: true,
  },
  manifest: {
    basePath: '/',
  },
  dll: false,
  title: title,
  dynamicImport: {
    // 无需 level, webpackChunkName 配置
    // loadingComponent: './components/PageLoading/index'
    loading: '@/components/PageLoading/index',
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  ignoreMomentLocale: true, //忽略 moment 的 locale 文件，用于减少尺寸
});
