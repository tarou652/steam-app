# Steam Tier Maker

自分の Steam ライブラリ（所持ゲーム + ウィッシュリスト）から、何も考えずに Tier 表を作れるアプリ。

仕様は [docs/SPEC.md](docs/SPEC.md) を参照。

## 自分用にデプロイする（fork する人向け）

1. このリポジトリを fork
2. Steam のプロフィール設定で「ゲームの詳細」とウィッシュリストを **公開** にする
3. Settings → Secrets and variables → Actions に以下を登録
   - `STEAM_API_KEY`: https://steamcommunity.com/dev/apikey で発行
   - `STEAM_ID`: SteamID64（17桁の数字）
4. Settings → Pages の Source を **GitHub Actions** にする
5. Actions タブから **Deploy** を手動実行（Run workflow）
6. `https://<ユーザー名>.github.io/<リポジトリ名>/` で使える

データは毎日 6:00 (JST) に自動更新される。

## 開発

```bash
npm install

# データの用意（どちらか）
npm run fetch -- --mock   # モックデータを使う
cp .env.example .env      # 実データを使う場合はキーと SteamID を書いてから
npm run fetch

npm run dev               # http://localhost:3000
npm run storybook         # http://localhost:6006
npm test                  # Vitest
npm run typecheck
```

| ディレクトリ | 内容 |
| --- | --- |
| `app/` | Nuxt アプリ本体（pages / components / composables） |
| `shared/` | アプリとデータ取得スクリプトで共有する型・関数 |
| `scripts/fetch-steam.ts` | Steam Web API から `public/data/library.json` を生成 |
| `mocks/` | 開発・Storybook 用のモックデータ |
| `.github/workflows/deploy.yml` | データ取得 → 静的生成 → GitHub Pages デプロイ |
