# Ocean Quest — プロジェクトキャッチアップ

このファイルは、どの環境・アカウントのClaude Code / Claudeでも一発で文脈を掴むためのキャッチアップ資料です。リポジトリをクローンすれば自動で読み込まれます。**大きな設計判断・運用ルールが変わったら、このファイルと DESIGN-GUIDE.md を必ず更新すること。**

## プロジェクト概要

- **Ocean Quest** — 海洋産業のキャリア・情報プラットフォーム。https://ocean-quest.jp
- 運営: 株式会社ポテンシャライト。責任者: ミネナホ（サイト上の表記は「Ocean Quest 責任者 ミネナホ」）
- 構想: 親サイト（トップ）＋領域別の子Questサイト群。第1号は「水中ロボティクスQuest」(/robotics)。将来9領域まで拡張予定
- 設計のお手本: PM Quest (pmquest.jp) — 診断・eBook・フッター・ロックアップの設計パターンを参考にしている

## 技術スタック / インフラ

- Next.js (App Router) + TypeScript。Vercelに`main`ブランチから自動デプロイ
- GitHub: kom-i-mn/ocean-quest
- データ: Supabase（動画・note記事・eBook・診断結果・お問い合わせ）。キーは `.env.local`（リポジトリには含まれない — 新環境ではVercelの環境変数から取得）
- 海の地図: 海上保安庁「海しる」API（現在は公開試用キー）
- YouTube: プレイリスト取り込み時に本編/Shortsを判定し `metadata.is_short` に保存（lib/youtube.ts）
- フォントはWebフォント不使用。游明朝のシステムフォントスタック

## デザイン（最重要）

**正本は `DESIGN-GUIDE.md`。デザイン変更・ユーザーFBは必ずそこへ追記する。**

要点だけ:
- 2026-07-13に全ページを「エディトリアル・リデザイン」済み（AIっぽさの排除が目的）。白/墨＋オレンジ1色、游明朝（見出しMedium 500–600・本文Regular 400）、カードではなくタイポグラフィのリスト、余白のリズム
- CSS名前空間: トップ＋下層 = `rd-`（app/redesign.css）、/robotics = `qrd-`（app/robotics/quest-rd.css）。旧globals.cssと共存
- 本文サイズは可読性FBで14px基準（詳細はDESIGN-GUIDE §11）
- /roboticsはスクロール連動の「深く潜る」背景（DepthJourney）＋ページ全長の深度線＋基準マーク（富士山〜チャレンジャー海淵10,920m）が核。壊さないこと

## 主要機能（消してはいけないもの）

- 分岐型キャリア診断（11問・9領域×4職種=36タイプ・結果メール+PDF）→ /diagnosis
- 海の地図β（海しるAPI・出典表記あり）→ /map
- 動画（本編上層・Shorts下層の2段構成、本編はタイトルのみ）/ note / eBook（メールゲートDL）/ イベント
- FAQ + JSON-LD、llms.txt などのSEO/AEO施策
- Quest追加は1行: `lib/content.ts` の `publishedQuestAreas` に領域キーを足すだけで全導線（ヘッダー・フッター・診断結果リンク）に自動反映

## 運用ルール

- **PRは自分でマージしない。** ユーザーの明示的な承認（「デプロイして」等）を得てからマージする
- デプロイ後は `curl https://ocean-quest.jp` で本番反映を確認する（HTMLはテキストがspanで分割されるので注意。CSSは外部 `/_next/static/css/*.css`）
- dev server稼働中に `npm run build` を実行しない（.nextが壊れる）
- eBook生成は手動運用（API課金回避。note公開時にセッション内で生成→Supabase登録）
- ミネナホさんのローカル環境では、作業ログを `新規事業調査/ai-worklog/YYYY-MM-DD.md` に記録する運用（他環境では不要）

## 現在のステータス / 未完了（2026-07-15時点）

- エディトリアル・リデザイン全ページ本番反映済み（トップ・下層6ページ・/robotics）
- 未完了・外部待ち:
  - Vercelに `ANTHROPIC_API_KEY` 追加（eBook自動生成の再開用）
  - 海しる本登録キーの海保申請
  - 診断監修情報が届いたら診断内容・年収帯を再監修
- 本文フォントをもう一段（15px）上げるかは保留中（現状14px）

## 迷ったら読むファイル

| 知りたいこと | ファイル |
|---|---|
| デザインルール全般 | `DESIGN-GUIDE.md` |
| サイト構成・導線 | `lib/content.ts` |
| トップページ | `app/page.tsx` + `app/redesign.css` |
| /robotics | `app/robotics/page.tsx` + `quest-rd.css` + `DepthJourney.tsx` / `DepthMarks.tsx` |
| eBook自動化の仕組み | `docs/content-automation.md` |
