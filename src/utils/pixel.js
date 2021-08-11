import { platformConfig } from './enums'
!(function(window, document) {
	const { googlePixelId, fbPixelID, googlePixelOldId } = platformConfig.plushe
	const head = document.getElementsByTagName('head')[0]
	const script = document.createElement('script')
	script.src = `https://www.googletagmanager.com/gtag/js?id=${googlePixelId}`
	script.type = 'text/javascript'
	script.async = true
	head.appendChild(script) /*添加到HTML中*/
	window.dataLayer = window.dataLayer || []
	window.gtag = function() {
		window.dataLayer.push(arguments)
	}
	window.gtag('js', new Date())
	window.gtag('config', googlePixelId, { send_page_view: false, terminal: 'PC' })
	window.gtag('config', googlePixelOldId, { send_page_view: false, terminal: 'PC' })

	// fb初始化
	!(function(f, b, e, v, n, t, s) {
		if (f.fbq) return
		n = f.fbq = function() {
			n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
		}
		if (!f._fbq) f._fbq = n
		n.push = n
		n.loaded = !0
		n.version = '2.0'
		n.queue = []
		t = b.createElement(e)
		t.async = !0
		t.src = v
		s = b.getElementsByTagName(e)[0]
		s.parentNode.insertBefore(t, s)
	})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

	window.fbq('init', fbPixelID)
	window.fbq('track', 'PageView')

	// const head = document.getElementsByTagName('head')[0]
	const noscript = document.createElement('noscript')
	noscript.innerHTML = `<img height="1" width="1" src="https://www.facebook.com/tr?id=${fbPixelID}&ev=PageView&noscript=1" />`
	head.appendChild(noscript)

	// 仅正式环境才使用:
	if (process.env.NODE_ENV != 'production') return false
	// 线上plushe 热图---8月4号添加
	!(function(h, o, t, j, a, r) {
		h.hj =
			h.hj ||
			function() {
				(h.hj.q = h.hj.q || []).push(arguments)
			}
		h._hjSettings = {
			hjid: 2495446,
			hjsv: 6,
		}
		a = o.getElementsByTagName('head')[0]
		r = o.createElement('script')
		r.async = 1
		r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
		a.appendChild(r)
	})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
	// 抖音上报代码:
	!(function(w, d, t) {
		w.TiktokAnalyticsObject = t
		var ttq = (w[t] = w[t] || [])
		;(ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie']),
			(ttq.setAndDefer = function(t, e) {
				t[e] = function() {
					t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
				}
			})
		for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
		;(ttq.instance = function(t) {
			for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n])
			return e
		}),
			(ttq.load = function(e, n) {
				var i = 'https://analytics.tiktok.com/i18n/pixel/events.js'
				;(ttq._i = ttq._i || {}), (ttq._i[e] = []), (ttq._i[e]._u = i), (ttq._t = ttq._t || {}), (ttq._t[e] = +new Date()), (ttq._o = ttq._o || {}), (ttq._o[e] = n || {})
				var o = document.createElement('script')
				;(o.type = 'text/javascript'), (o.async = !0), (o.src = i + '?sdkid=' + e + '&lib=' + t)
				var a = document.getElementsByTagName('script')[0]
				a.parentNode.insertBefore(o, a)
			})

		//part2
		ttq.load('C40HD8KVE57P75FJRAU0')
		ttq.page()
	})(window, document, 'ttq')
})(window, document)
