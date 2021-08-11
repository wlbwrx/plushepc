export const platformId = (location.host.includes('geemart') && 2) || (location.host.includes('bondot') && 3) || 1
document.title = (platformId == 2 && 'GeeMart') || (platformId == 3 && 'Bondot') || 'Plushe' // 修改标题
// export const platformId = 2
