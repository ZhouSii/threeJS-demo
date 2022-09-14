/* eslint-disable prettier/prettier */
import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path'
import autoprefixer from 'autoprefixer'
import windi from 'vite-plugin-windicss'
import svgLoader from 'vite-svg-loader'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/styles/variable.scss'))

// https://vitejs.dev/config/
export default defineConfig({
    base: '/', //打包路径
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    plugins: [
        vue(),
        windi(),
        svgLoader(),
        Components({
            resolvers: [VantResolver()],
        }),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                {
                    // '@/hooks/global/useCommon': ['useCommon'],
                    // '@/hooks/global/useVant': ['useVant'],
                    // '@/hooks/global/useVueRouter': ['useVueRouter'],
                    // '@/service/http': ['axiosReq'],
                },
            ],
            eslintrc: {
                enabled: true, // Default `false`
                filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
            dts: true, //auto generation auto-imports.d.ts file
        })
    ],
    // css 相关的配置
    css: {
        preprocessorOptions: {
            scss: {
                // additionalData 的内容会在每个 scss 文件的开头自动注入
                additionalData: `@import "${variablePath}";`,
            },
        },
        modules: {
            generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
        // 进行 PostCSS 配置
        postcss: {
            plugins: [
                autoprefixer({
                    // 指定目标浏览器
                    overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11'],
                }),
            ],
        },
    },
    //启动服务配置
    server: {
        //设置 server.hmr.overlay 为 false 可以禁用开发服务器错误的屏蔽。
        hmr: { overlay: false },
        host: '0.0.0.0',
        port: 8099,
        open: true,
        https: false,
        proxy: {
            // [processEnv.VITE_APP_BASE_API]: {
            //     target: processEnv.VITE_APP_BASE_URL,
            //     // target: `http://edu.jiuweiedu.com:81`,
            //     changeOrigin: true,
            //     rewrite: (path: string) =>
            //         path.replace(new RegExp(processEnv.VITE_APP_BASE_API + '/', 'g'), ''),
            // },
        },
    },
    // 生产环境打包配置
    //去除 console debugger
    build: {
        minify: 'terser', //默认modules
        // 消除打包大小超过500kb警告
        chunkSizeWarningLimit: 5000,
        //remote console.log in prod
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        }
    },
})
