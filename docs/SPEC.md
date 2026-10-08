# Steam Tier Maker 仕様書（ドラフト v0.1）

## 1. コンセプト

**自分の Steam ライブラリから、何も考えずに Tier 表を作れるアプリ。**

- 所持ゲームは自動で取り込まれるので、画像を自分で集める必要がない
- 持っていないゲームも、Steam のウィッシュリストに入れておけば画像付きで取り込める
- つまり「Tier 表に入れたいゲーム = 所持 or ウィッシュリスト」に入れるだけで素材がそろう

## 2. 前提・制約

| 項目 | 内容 |
| --- | --- |
| フレームワーク | Nuxt 4（SPA モード / `ssr: false`、`nuxt generate` で静的出力） |
| ホスティング | GitHub Pages |
| UI 開発 | Storybook |
| データ読み込み | CSR（ブラウザで静的 JSON を fetch） |
| 利用者 | 自分だけ。他の人はリポジトリを fork して自分用に使える |
| 保存・共有 | サーバーなしで実現する |

### 重要な制約：ブラウザから Steam Web API は直接呼べない

1. **API キーが漏れる**：GitHub Pages は静的サイトなので、キーをフロントに埋め込むと誰でも見られる
2. **CORS**：`api.steampowered.com` は CORS ヘッダーを返さないため、ブラウザからの fetch はブロックされる

→ **GitHub Actions で定期的に Steam API を叩き、結果を JSON としてサイトに同梱する** 構成にする（§3）。

## 3. アーキテクチャ

```
┌──────────────── GitHub Actions（定期実行 / 手動実行）────────────────┐
│                                                                       │
│  Secrets: STEAM_API_KEY, STEAM_ID                                     │
│      │                                                                │
│      ▼                                                                │
│  scripts/fetch-steam.ts                                               │
│    ├─ IPlayerService/GetOwnedGames      → 所持ゲーム                  │
│    ├─ IWishlistService/GetWishlist      → ウィッシュリスト (appid)    │
│    └─ IStoreBrowseService/GetItems      → ウィッシュリストのゲーム名  │
│      │                                                                │
│      ▼                                                                │
│  public/data/library.json を生成                                      │
│      │                                                                │
│      ▼                                                                │
│  nuxt generate → GitHub Pages へデプロイ                              │
└───────────────────────────────────────────────────────────────────────┘

┌──────────────── ブラウザ（CSR）────────────────┐
│  fetch('/data/library.json')                    │
│  画像は Steam CDN から appid で直接表示         │
│  Tier 表の状態は localStorage / URL に保存      │
└─────────────────────────────────────────────────┘
```

- API キーは GitHub Secrets にだけ置かれ、公開サイトには出ない
- fork した人は Secrets に自分のキーと SteamID を入れて Actions を回すだけで自分用のサイトができる
- 実行タイミング：`schedule`（1日1回）+ `workflow_dispatch`（手動）+ main への push
- ローカル開発：`.env` にキーを置いて `npm run fetch` で JSON を生成。キーがなくても動くようにモック JSON も用意する

## 4. データ

### 4.1 library.json

```ts
type Library = {
  fetchedAt: string            // ISO 8601
  steamId: string
  games: Game[]
}

type Game = {
  appid: number
  name: string
  owned: boolean               // 所持している
  wishlisted: boolean          // ウィッシュリストに入っている
  playtimeMinutes?: number     // 所持ゲームのみ
  lastPlayedAt?: string        // 所持ゲームのみ
  wishlistPriority?: number    // ウィッシュリストのみ
}
```

- 所持とウィッシュリストは `appid` で統合する（両方に入っているケースもありうる）

### 4.2 画像

appid から URL を組み立てる（JSON には持たない）。

| 用途 | URL |
| --- | --- |
| Tier のカード（第一候補） | `https://cdn.cloudflare.steamstatic.com/steam/apps/{appid}/library_600x900.jpg`（縦長） |
| フォールバック | `https://cdn.cloudflare.steamstatic.com/steam/apps/{appid}/header.jpg`（横長） |

- 縦長画像が存在しないゲームがあるため、`<img>` の `error` イベントで `header.jpg` に切り替える
- カードの見た目（縦長 / 横長）は設定で選べるようにする（v1 では縦長固定でも可）

## 5. 機能

### 5.1 v1（最小構成）

**Tier 表**
- デフォルトの段：S / A / B / C / D
- 段のラベル・色の変更、段の追加・削除・並べ替え
- 未配置エリア（プール）から段へドラッグ & ドロップ。段の間、段の中の並べ替えも D&D
- Tier 表のタイトル

**プール（未配置のゲーム一覧）**
- 絞り込み：所持 / ウィッシュリスト / 両方
- 名前で検索
- 並び替え：プレイ時間順 / 名前順 / 最終プレイ順
- 「プール全部を選ばずに、絞り込んだ結果から作る」ことができる（例：プレイ時間 1 時間以上だけ）

**保存**
- localStorage に保存（複数の Tier 表を保持、一覧から開く・削除）

**共有**
- **URL 共有**：Tier 表の状態（タイトル・段・各段の appid）を圧縮して URL のクエリに入れる
  - サーバー不要。appid は数値なので 100 本程度なら URL に収まる見込み
  - 共有 URL を開いた人は閲覧のみ。「コピーして編集」で自分の localStorage に取り込める
- **画像エクスポート**：Tier 表を PNG でダウンロード（SNS 投稿用）

### 5.2 v2 以降の候補

- JSON のエクスポート / インポート（バックアップ用）
- 所持もウィッシュリストもしていないゲームを appid で手動追加
- カードにプレイ時間を表示するオプション

## 6. 画面構成

| パス | 内容 |
| --- | --- |
| `/` | 保存済み Tier 表の一覧 + 新規作成 |
| `/edit?id=xxx` | Tier 表の編集画面（上：Tier 表、下：プール） |
| `/view?t=<圧縮データ>` | 共有された Tier 表の閲覧 |

- GitHub Pages は SPA のフォールバックを持たないため、動的なパスは使わずクエリで渡す
  （`/edit/123` のようなパスにすると直接アクセス時に 404 になる）
- `app.baseURL` をリポジトリ名（例：`/steam-app/`）に合わせる。fork 時はリポジトリ名が変わるので、Actions で自動設定する

## 7. コンポーネント（Storybook 対象）

| コンポーネント | 役割 |
| --- | --- |
| `GameCard` | ゲーム画像 1 枚。画像フォールバック、名前のツールチップ |
| `TierRow` | 1 段分（ラベル + カードの並び）。D&D の受け口 |
| `TierBoard` | 段の集合 = Tier 表全体 |
| `TierRowEditor` | 段のラベル・色の編集 |
| `GamePool` | 未配置ゲームの一覧 + 絞り込み・検索・並び替え |
| `TierListCard` | 一覧画面の 1 件 |

- Storybook はモック JSON で動かす（Steam API に依存しない）

## 8. 技術選定（案）

| 用途 | 候補 |
| --- | --- |
| D&D | `vue-draggable-plus`（SortableJS ベース、Vue 3 対応） |
| 状態管理 | Pinia または `useState` + composable |
| URL 圧縮 | `lz-string`（`compressToEncodedURIComponent`） |
| PNG 出力 | `modern-screenshot` / `html-to-image` |
| Storybook | `@nuxtjs/storybook`（Nuxt 4 対応状況によっては `@storybook/vue3-vite`） |
| データ取得スクリプト | Node.js + TypeScript（`tsx` で実行） |
| テスト | Vitest |

## 9. リスク・要確認事項

1. **PNG 出力時の CORS**：Steam CDN の画像を canvas に描くには、CDN が `Access-Control-Allow-Origin` を返す必要がある。返さない場合は、Actions で画像も取得してサイトに同梱する（数百本 × 数十 KB なら許容範囲）
2. **ウィッシュリストのゲーム名取得**：`IStoreBrowseService/GetItems` の仕様が変わる可能性。代替は `store.steampowered.com/api/appdetails`（レート制限が厳しい）
3. **プロフィールの公開設定**：所持ゲーム・ウィッシュリストが公開になっていないと取得できない。README に手順を書く
4. **公開されるデータ**：`library.json` は GitHub Pages 上で誰でも見られる（ただし元々公開プロフィールの情報）
5. **開発環境からの疎通**：開発用のクラウド環境からは Steam API に接続できないため、実データでの確認はローカルまたは Actions 上で行う

## 10. 配布方法（fork する人向け）

1. リポジトリを fork
2. Settings → Secrets に `STEAM_API_KEY` と `STEAM_ID` を登録
3. Settings → Pages で Source を「GitHub Actions」にする
4. Actions タブから「Deploy」を手動実行
5. `https://<ユーザー名>.github.io/<リポジトリ名>/` で使える
