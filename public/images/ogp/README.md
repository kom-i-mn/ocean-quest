# OGP画像の差し替え方法

各ページのOGP画像は `lib/og/render.tsx` がコードで自動生成しています。
**このフォルダに `<ページキー>.png` (1200×630px) を置くだけで、生成画像の代わりにそのファイルが配信されます**（コード修正不要。反映は次のデプロイ時）。

| ページキー | 対象URL |
| --- | --- |
| `home.png` | / (トップ) |
| `videos.png` | /videos |
| `notes.png` | /notes |
| `ebooks.png` | /ebooks |
| `events.png` | /events |
| `companies.png` | /companies |
| `robotics.png` | /robotics |
| `diagnosis.png` | /diagnosis |
| `map.png` | /map |
| `contact.png` | /contact |

## 差し替え画像を作るときの構成ルール（クリック率のための原則）

1. **1200×630px・重要要素は中央1000×524px以内**（LINE/Discord等は上下端が切れる）
2. **スマホのタイムラインでは幅約350pxに縮む** → タイトルは最大2行・1行13文字前後・太字
3. 左上にOcean Questロゴ、下端に `ocean-quest.jp` ＋運営ロゴ（ブランドの一貫フレームを崩さない）
4. 写真だけにしない。「何のページか」を表す言葉かモチーフを必ず入れる（DESIGN-GUIDE 8.5）
5. 文字と背景のコントラスト比4.5:1以上（暗部グラデーションで確保）

## AI画像生成プロンプト（背景写真・ビジュアル素材用）

生成した画像はそのまま使わず、上記フレーム（ロゴ・タイトル・ドメイン）を重ねて書き出すこと。
共通サフィックス: `--ar 40:21` (Midjourney) / 「アスペクト比 1200:630」(その他)

- **トップ**: Cinematic aerial view of deep teal ocean meeting a modern Japanese port at dawn, vast horizon, soft orange sunlight, sense of scale and opportunity, photorealistic, no text
- **動画一覧**: Dark underwater scene with dramatic light rays from surface, cinematic film-still atmosphere, deep teal and navy palette, space on left for text, photorealistic, no text
- **note記事**: Minimal flat-lay of an open notebook and pen on a deep teal desk, soft window light, calm editorial mood, muted colors, space for large title text, no text
- **eBook**: Stack of clean modern report booklets with teal covers on a white desk, shallow depth of field, soft studio lighting, professional publishing feel, no text
- **イベント**: Warm harbor at sunset with people silhouettes networking on a pier, string lights, orange and teal tones, welcoming community atmosphere, photorealistic, no text
- **海洋企業紹介**: Impressive container port with gantry cranes at golden hour, low angle, industrial scale and precision, teal sea and orange sky, photorealistic, no text
- **インタビュー**: Portrait of a marine engineer on a research vessel deck, natural confident expression, shallow depth of field, ocean bokeh background, golden hour light, photorealistic
- **ニュース**: Abstract ocean surface texture from above, clean ripple patterns, deep teal gradient, minimal and journalistic, space for headline text, no text
