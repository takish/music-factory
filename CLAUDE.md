# CLAUDE.md

このファイルはClaude Codeがmusic-factoryプロジェクトで作業する際のガイダンスを提供します。

## 目的（Purpose）

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
3. 同じ分析データを
   - 別ジャンル
   - 別歌詞テーマ
   - 別Suno設定
   に何度でも使い回せるようにする

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

③ analysis/<slug>.yaml
   （曲展開・コード機能・アレンジ・歌詞設計・キーワード）
   ※ このファイルが"正本"

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

## 各ステップの役割

### ① analyze_reference_song_to_analysis_yaml

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

### ② analysis.yaml（正本）

このプロジェクトで最も重要なファイル。
- すべての生成はここから始まる
- 人間が読んでも理解できる
- AIが読んでも安定して解釈できる

→ 分析の資産化・再利用の核。

### ③ generate_note_from_analysis

**目的**: 分析結果を「学びとして公開可能」にする

**特徴**:
- 既存曲の引用なし
- 「なぜそう設計されているか」を説明
- 他の曲にも転用できる形で言語化

### ④ generate_suno_pack

**目的**: Sunoに一撃で渡せる素材を作る

**生成物**:
- `title.txt`: 既存曲と非類似の新タイトル
- `suno_style.txt`: 構造化されたStyleプロンプト
- `suno_lyrics.txt`: []区切り・3分構成の歌詞
- `image_prompt.txt`: YouTube用ジャケット画像プロンプト

**重要思想**: 「3分にして」ではなく **展開設計で長さを作る**

## Sunoナレッジ参照ルール

Suno関連の出力を生成・編集する際は、必ず以下のナレッジファイルを参照すること。

### 参照すべきファイル

| ファイル | 用途 | 参照タイミング |
|----------|------|----------------|
| `prompts/suno-vocabulary.md` | 表現・タグ辞書 | スタイル/歌詞生成時 |
| `prompts/suno-structure.md` | 楽曲構成パターン | 構成設計時 |
| `prompts/types/<core_type>.md` | 設計タイプ別パターン | 分析/生成時 |

### 具体的な参照ルール

1. **suno_style.txt 生成時**
   - `suno-vocabulary.md` のジャンル表現、ムード表現、テンポ表現を使用
   - Sunoが認識できる表現のみ使用すること

2. **suno_lyrics.txt 生成時**
   - `suno-structure.md` の構成パターンに従う
   - `suno-vocabulary.md` のボーカルスタイル、ダイナミクス表現を使用
   - セクションタグは `[Verse 1]`, `[Pre-Chorus]` など標準形式

3. **analysis.yaml 作成時**
   - `suno-structure.md` の構成パターンを参考に sections を設計
   - 3分構成なら標準パターン（約70%採用）を基本に

4. **手動編集時**
   - ナレッジにない表現を使う場合は、ナレッジに追加してから使用

## core_type の位置づけ

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

→ 分析と生成の両方で共通言語として使う。

## 出力フォーマット

### suno_style.txt

```
Genre:
Japanese Pop, J-Pop, Idol Pop, Hyper Pop influenced

Style:
Energetic and dramatic Japanese pop song.
Bright idol-like surface with a dark, unsettling inner tone.

Tempo:
Fast, driving tempo.

Harmony:
Minor key.
Verse and Chorus share the same repeating minor progression
(i – VI – III – VII) to create obsession and fixation.

Length / Structure:
Aim for about 3 minutes.
Intro → Verse1 → Pre-Chorus → Chorus → Post-Chorus
→ Verse2 → Pre-Chorus → Chorus
→ Instrumental / Drop
→ Bridge
→ Final Chorus → Final Chorus (repeat) → Outro.

Arrangement:
Electronic-driven production.
Dense layers, sharp rhythm, powerful bass.

Melody:
Catchy and assertive.
Strong rhythmic phrasing.

Lyrics:
Japanese.
First-person.
Theme: [テーマ].
```

### suno_lyrics.txt

```
[Verse 1]
歌詞本文...

[Pre-Chorus]
歌詞本文...

[Chorus]
歌詞本文...
（キャッチーなフック）

[Instrumental]
（Drop / Vocal chop）

[Bridge]
歌詞本文...

[Final Chorus]
歌詞本文...

[Outro]
（息を吸う音で終わる）
```

## コマンド

```bash
# 依存関係インストール
bun install

# 型チェック
bun run type-check

# Lint
bun run lint

# MCPサーバー起動
bun run src/index.ts
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
│   ├── suno-vocabulary.md    # Sunoプロンプト表現辞書
│   ├── suno-structure.md     # 楽曲構成パターン
│   └── types/                # core_type説明（Markdown）
├── schema/
│   └── analysis.schema.json  # JSON Schema
├── analysis/                 # 曲分析yaml
├── notes/                    # note記事下書き
└── outputs/<slug>/           # Suno出力
```

## 最終的に実現したい状態

- 既存曲を1曲指定するだけで
- 分析データができ
- note記事ができ
- Suno用素材が揃い
- YouTube公開まで一気に進められる
- 同じ仕組みを何度でも回せる
- 人が変わっても再現できる
