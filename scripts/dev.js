// 该文件主要用来打包 packages下的模块，最终打包出js文件
// node dev.js (要打包的名字 -f 打包的格式) === argv.slice(2)

/*
  注意：js文件通过node执行时采用的cjs规范，直接import会报错，因为import时esm规范
  需要通过esm规范来执行js文件或者package.json中设置type为modul
*/
import minimist from "minimist";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuild from "esbuild";
// node中的命令行参数通过process来获取 process.argv
const args = minimist(process.argv.slice(2));
// node中esm模块没有__dirname,所以用下面方式获取dirname
const __filename = fileURLToPath(import.meta.url); // 获取文件的绝对路径 file: -> /usr
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url); // 获取require方法
const target = args._[0] || "reactivity"; // 打包哪个模块
const format = args.f || "iife"; // 打包后的规范
console.log(target, format);

console.log("filename", __filename, "dirname", __dirname, "require", require);

// 入口文件 根据命令行提供的路径来解析
const entry = resolve(__dirname, `../packages/${target}/src/index.js`);
const pkg = require(`../packages/${target}/package.json`);

// 根据需要进行打包
esbuild
  .context({
    entryPoints: [entry], //入口
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`), // 出口
    bundle: true, // 如果reactivity依赖shared则会打包到一起
    platform: "browser", // 打包后给浏览器使用
    sourcemap: true, // 可以调试源码
    format, // cjs esm iife
    globalName: pkg.buildOptions?.name, // iife下的全局名字
  })
  .then((ctx) => {
    console.log("start dev");
    return ctx.watch();
  });
