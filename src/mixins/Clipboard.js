import { Toast } from 'vant'
import Clipboard from 'clipboard'

export default {
	directives: {
		copy: {
			inserted(el) {
				const obj = new Clipboard(el)
				obj.on('success', () => {
					Toast('Copied')
				})
				obj.on('error', () => {
					Toast('Copy failed. Please select the email manually')
				})
			},
		},
	},
}
