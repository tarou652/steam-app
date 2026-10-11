const CDN = 'https://cdn.cloudflare.steamstatic.com/steam/apps'

/** Tier のカードに使う縦長画像 */
export function steamCapsuleUrl(appid: number): string {
  return `${CDN}/${appid}/library_600x900.jpg`
}

/** 縦長画像がないゲーム向けのフォールバック（横長） */
export function steamHeaderUrl(appid: number): string {
  return `${CDN}/${appid}/header.jpg`
}
