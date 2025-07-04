"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "vue Element Admin"; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9627; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false, //process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      //开发运行代理地址 gateway网关地址
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE_API_POXY, // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
      // bimface代理地址
      [process.env.VUE_APP_BIM_FACE_API]: {
        target: process.env.VUE_APP_BIM_FACE_API_POXY, // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        secure: true, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          ["^" + process.env.VUE_APP_BIM_FACE_API]: "",
        },
      },
      // 配置视频代理的地址
      [process.env.VUE_APP_VIDEO_API]: {
        target: process.env.VUE_APP_VIDEO_API_POXY, // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        secure: true, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          ["^" + process.env.VUE_APP_VIDEO_API]: "",
        },
      },
      // 配置预览代理的地址
      [process.env.VUE_APP_VIEW_API]: {
        target: process.env.VUE_APP_VIEW_API_POXY, // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        secure: true, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          ["^" + process.env.VUE_APP_VIEW_API]: "",
        },
      },
    },
    //before: require('./mock/mock-server.js')  //模拟数据和代理之间有冲突
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
        "@api": resolve("src/api"),
        "@assets": resolve("src/assets"),
        "@components": resolve("src/components"),
        "@layout": resolve("src/layout"),
        "@views": resolve("src/views"),
        "@utils": resolve("src/utils"),
        "@store": resolve("src/store"),
      },
    },
    externals: {
      vue: "Vue",
      echarts: "echarts",

      BaiMap: "BMapGL",
    },
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        Quill: 'quill/dist/quill.js'
      })
    ]
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/styles/common.less")],
    },
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");

      // gzip压缩
      const CompressionPlugin = require("compression-webpack-plugin");
      const productionGzipExtensions =
        /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
      config.resolve.alias.set("@", resolve("src"));
      config.plugin("compressionPlugin").use(
        new CompressionPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        })
      );
    });
  },
};
