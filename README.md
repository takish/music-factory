# music-factory

既存曲の構造分析を資産化し、Suno用プロンプト・note記事素材を生成するMCPサーバー

## 目的

このプロジェクトの目的は、既存のヒット曲を「再現可能な設計データ」に分解し、AI（Suno）で安定して"狙った曲"を生成できる状態を作ることです。

単なる模倣や一発生成ではなく、
- なぜその曲が成立しているのか
- どの構造・和声・言葉の使い方が効いているのか
- それをAIにどう伝えると再現性が上がるのか

を **分析 → 構造化 → 再利用** することを重視します。

## この仕組みでやりたいこと

1. 既存曲を分析して、`analysis.yaml`という共通フォーマットに落とす
2. `analysis.yaml` を唯一の入力として
   - note用の分析記事
   - Suno用のStyle / Lyrics / Title
   - YouTube用のジャケット画像プロンプト
   を自動生成する
3. 同じ分析データを別ジャンル・別テーマに何度でも使い回せるようにする

→ 音楽制作を「属人スキル」から「再現可能な設計プロセス」に変える。

## 全体フロー

```
① 既存曲を指定
   （タイトル / アーティスト / core_type）

        ↓

② analyze_reference_song_to_analysis_yaml
   └ 既存曲を抽象分析
   └ 著作権に触れない設計レベルで分解

        ↓

③ analysis/<slug>.yaml  ← 正本
   （曲展開・コード機能・アレンジ・歌詞設計・キーワード）

        ↓
        ├───────────────────────┐
        ↓                       ↓

④ generate_note_from_analysis     ⑤ generate_suno_pack
   └ note記事用Markdown生成         └ Suno用出力一式生成

        ↓                       ↓

notes/<slug>.md              outputs/<slug>/
                              ├ title.txt
                              ├ suno_style.txt
                              ├ suno_lyrics.txt
                              └ image_prompt.txt
```

## MCPツール

| ツール | 説明 |
|--------|------|
| `analyze_reference_song_to_analysis_yaml` | 既存曲 → analysis.yaml生成 |
| `generate_suno_pack` | analysis.yaml → Suno4ファイル生成 |
| `generate_note_from_analysis` | analysis.yaml → note記事下書き生成 |
| `validate_suno_pack` | 1000文字制限・セクション検証 |
| `list_core_types` | 利用可能なcore_type一覧 |

## core_types（設計タイプ）

core_type は「アーティスト模倣」ではなく、**設計タイプ（音楽的な型）**を表します。

| タイプ | 特徴 |
|--------|------|
| `ado` | 反逆、パワフルボーカル、グロウル/ファルセット、ボカロ由来 |
| `yorushika` | 情景優先、抑制、余韻、ギター中心 |
| `illit` | 反復、ミニマル、耳残り、軽い感情 |
| `yoasobi` | 高密度言語、構造でフック、転換/Drop強め |
| `aimyon` | 素直な言葉、日常、盛り上げ過ぎない、アコギ中心 |
| `gurenka` | 意志、宣言、強いサビ、アニロック |
| `byoushin` | 内省/葛藤、言語密度、陰影、ロック |

## 各ステップの役割

### analyze_reference_song_to_analysis_yaml

**目的**: 曲を「真似る対象」ではなく「設計思想のサンプル」として取り込む

**やらないこと**:
- 歌詞の転載
- メロディの採譜
- 実コード名の断定

**やること**:
- 曲構造（1番2番、サビ、ラスサビ、間奏）
- 機能和声（ローマ数字）
- アレンジの層構造
- 歌詞の思想・密度・視点
- 世界観キーワード

### analysis.yaml（正本）

このプロジェクトで最も重要なファイル。
- すべての生成はここから始まる
- 人間が読んでも理解できる
- AIが読んでも安定して解釈できる

### generate_suno_pack

**目的**: Sunoに一撃で渡せる素材を作る

**生成物**:
- `title.txt`: 既存曲と非類似の新タイトル
- `suno_style.txt`: 構造化されたStyleプロンプト
- `suno_lyrics.txt`: []区切り・3分構成の歌詞
- `image_prompt.txt`: YouTube用ジャケット画像プロンプト

**重要思想**: 「3分にして」ではなく **展開設計で長さを作る**

## セットアップ

```bash
# 依存関係インストール
bun install

# 型チェック
bun run type-check

# Lint
bun run lint
```

## 使い方

### Claude Code連携

`.mcp.json` をプロジェクトルートに配置:

```json
{
  "mcpServers": {
    "music-factory": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "src/index.ts"]
    }
  }
}
```

### 使用例

```
# 1. 既存曲を分析
analyze_reference_song_to_analysis_yaml({
  title: "マリーゴールド",
  artist: "あいみょん",
  core_type: "aimyon",
  genre_tags: ["Japanese Pop", "Folk Pop"],
  notes: "情景少なめ、盛り上げ過ぎない"
})
# → analysis/aimyon_marigold.yaml

# 2. Sunoプロンプト生成
generate_suno_pack({
  analysis_path: "analysis/aimyon_marigold.yaml"
})
# → outputs/aimyon_marigold/

# 3. note記事素材生成
generate_note_from_analysis({
  analysis_path: "analysis/aimyon_marigold.yaml"
})
# → notes/aimyon_marigold.md
```

## ディレクトリ構造

```
music-factory/
├── src/
│   ├── index.ts              # MCPサーバーエントリ
│   ├── core/
│   │   ├── generators/       # style/lyrics/image生成
│   │   ├── types/            # core_typeパターン定義
│   │   └── validators/       # 検証ロジック
│   ├── schemas/              # Zodスキーマ
│   ├── tools/                # MCPツール実装
│   └── utils/                # ユーティリティ
├── prompts/
│   └── types/                # core_type説明（Markdown）
├── schema/
│   └── analysis.schema.json  # JSON Schema
├── analysis/                 # 曲分析yaml（正本）
├── notes/                    # note記事下書き
└── outputs/<slug>/           # Suno出力
```

## 仕様

### slug命名規則

- **ASCII文字のみ**（`a-z0-9_`）
- 例: `aimyon_marigold`, `yorushika_tada_kimi_ni_hare`
- 日本語タイトル/アーティスト名は `source_song` 内に保持

### 品質チェック

- `suno_style.txt`: 構造化フォーマット
- `suno_lyrics.txt`: 必須セクション（Verse1/2, Chorus, Instrumental, Bridge, FinalChorus）

## 開発

```bash
# pre-commit hookインストール
bunx lefthook install

# MCPサーバー起動（デバッグ用）
bun run src/index.ts
```

## ライセンス

MIT
