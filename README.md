# music-factory

曲分析とSunoプロンプト生成のためのツールキット

## 目的

```
1. 曲分析（正本）    ← すべての基盤
2. Suno素材生成      ← メイン出力
```

## クイックスタート

```bash
# 1. 曲を分析（正本を作成）
/sc:suno-analyze あいみょん マリーゴールド

# 2. Suno素材を生成
/sc:suno-pack aimyon_marigold
```

## コマンド

| コマンド | 説明 |
|----------|------|
| `/sc:suno-analyze {artist} {title}` | 曲を分析して正本を作成 |
| `/sc:suno-pack {slug}` | 分析からSuno素材を生成 |

## ワークフロー

```
/sc:suno-analyze あいみょん マリーゴールド
        ↓
data/analysis/aimyon_marigold.md（正本）
        ↓
/sc:suno-pack aimyon_marigold
        ↓
data/outputs/aimyon_marigold/
├── title.md          # 新しいタイトル
├── suno_style.md     # Sunoスタイルプロンプト
├── suno_lyrics.md    # 歌詞（実際の歌詞）
└── image_prompt.md   # YouTube用サムネイル画像プロンプト
```

## 分析済みの曲

| slug | アーティスト | 曲名 |
|------|-------------|------|
| `yoasobi_idol` | YOASOBI | アイドル |
| `yoasobi_yoru_ni_kakeru` | YOASOBI | 夜に駆ける |
| `aimyon_marigold` | あいみょん | マリーゴールド |

## ファイル構造

```
music-factory/
├── data/
│   ├── analysis/         # 曲分析（正本）
│   │   ├── yoasobi_idol.md
│   │   ├── yoasobi_yoru_ni_kakeru.md
│   │   └── aimyon_marigold.md
│   └── outputs/{slug}/   # Suno素材
│       ├── title.md
│       ├── suno_style.md
│       ├── suno_lyrics.md
│       └── image_prompt.md
└── prompts/
    ├── analysis-guide.md   # 分析フォーマット（正式定義）
    ├── suno-vocabulary.md  # Suno表現辞書（v5対応）
    └── suno-structure.md   # 楽曲構成パターン
```

## 分析の考え方

テンプレ埋めではなく、**その曲固有の設計意図**を言語化する。

- なぜその曲が成立しているのか
- どの構造・和声・言葉の使い方が効いているのか

→ 詳細は `prompts/analysis-guide.md` を参照

## 著作権配慮

- コード進行はローマ数字（機能和声）で記述
- 歌詞の直接引用禁止
- メロディの採譜なし

## ライセンス

MIT
