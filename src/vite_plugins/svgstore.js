/* eslint-disable */
import path from 'path'
import fs from 'fs'
import store from 'svgstore' // 用于制作 SVG Sprites
import { optimize } from 'svgo' // 用于优化 SVG 文件

export const svgstore = (options = {}) => {
	const inputFolder = options.inputFolder || 'src/assets/icons'
	return {
		name: 'svgstore',
		resolveId(id) {
			// 如果导入的模块 ID 为 "@svgstore"，则将其解析为 "svg_bundle.js"，以便在后续 load 方法中加载
			if (id === '@svgstore') {
				return 'svg_bundle.js'
			}
		},
		load(id) {
			// 在 load 方法中，如果加载的模块 ID 为 "svg_bundle.js"
			if (id === 'svg_bundle.js') {
				// 创建一个 SVG sprite 对象，并遍历指定目录下的所有 SVG 文件，将每个 SVG 文件添加到 SVG sprite 中
				const sprites = store(options)
				const iconsDir = path.resolve(inputFolder)
				for (const file of fs.readdirSync(iconsDir)) {
					const filepath = path.join(iconsDir, file)
					const svgid = path.parse(file).name
					let code = fs.readFileSync(filepath, { encoding: 'utf-8' })
					sprites.add(svgid, code)
				}
				// 使用 "svgo" 模块对 SVG sprite 进行优化，去除不必要的属性和元素。
				const { data: code } = optimize(sprites.toString({ inline: options.inline }), {
					plugins: [
						'cleanupAttrs',
						'removeDoctype',
						'removeComments',
						'removeTitle',
						'removeDesc',
						'removeEmptyAttrs',
						{ name: 'removeAttrs', params: { attrs: '(data-name|data-xxx)' } },
					],
				})
				// 将优化后的 SVG sprite 代码嵌入到一个 div 元素中，并将其添加到页面的开头位置，以确保在加载页面时立即可用。
				return `const div = document.createElement('div')
div.innerHTML = \`${code}\`
div.style.display = 'none'
const svg = div.getElementsByTagName('svg')[0]
// listen dom ready event
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.firstChild) {
    document.body.insertBefore(div, document.body.firstChild)
  } else {
    document.body.appendChild(div)
  }
})`
			}
		},
	}
}
