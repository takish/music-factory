# CLAUDE.md

music-factory: 曲分析とSunoプロンプト生成のためのツールキット

## 目的

```
┌─────────────────────────────────────────────┐
│  1. 曲分析（正本）                            │
│     └ すべての基盤。ここが正確でなければ意味がない  │
├─────────────────────────────────────────────┤
│  2. Suno素材生成                              │
│     └ 分析を元にstyle, lyrics, image_promptを生成│
└─────────────────────────────────────────────┘
```

**分析が正確でなければ、その後のすべてが破綻する。**

## コマンド

| コマンド | 説明 |
|----------|------|
| `/sc:suno-analyze {artist} {title}` | 曲を分析して正本を作成 |
| `/sc:suno-pack {slug}` | 分析からSuno素材を生成 |

## ファイル構造

```
data/
├── analysis/{slug}.md    # 曲分析（正本）
└── outputs/{slug}/       # Suno素材
    ├── title.md
    ├── suno_style.md
    ├── suno_lyrics.md
    └── image_prompt.md

prompts/
├── analysis-guide.md     # 分析フォーマット（正式定義）
├── suno-vocabulary.md    # Suno表現辞書
└── suno-structure.md     # 楽曲構成パターン
```

---

# 曲分析ルール

## `/sc:suno-analyze {artist} {title}` の処理

1. `prompts/analysis-guide.md` を読む（必須）
2. 曲を**設計視点**で分析する
3. `data/analysis/{slug}.md` に保存する

## 分析の正確性を担保する

### やるべきこと

1. **LLMの知識だけに頼らない**
   - 可能であれば曲を聴く（YouTubeリンクがあれば）
   - ネット上のコード進行分析を参照してもよい

2. **不確かな場合は明記する**
   ```markdown
   - **パターン**: i – VI – III – VII（推定）
   ```

3. **一般的なパターンに当てはめない**
   - 「よくあるJ-Popのコード進行」で済ませない
   - その曲固有の設計意図を言語化する

### やってはいけないこと

- 歌詞の直接引用
- メロディの採譜
- 推測を事実のように書く

## 分析の期待レベル

テンプレ埋めではなく、**その曲固有の設計意図**を言語化する。

**悪い例:**
```
- ジャンル: J-Pop
- コード: Am - F - C - G
- 特徴: キャッチーなメロディ
```

**良い例:**
```
## 曲の本質
- **二重構造**: 表層（完璧なアイドル像）/ 内面（虚構・孤独）
- **最大のフック**: 構造そのもの（明るさと不穏さの同居）
- **感情設計**: 語るが、救わない

### Chorus
- **パターン**: i – VI – III – VII（Verseと同型）
- **設計意図**: コードは変えず意味だけを反転 →「変わらない自分」を暗示
```

→ **なぜそう設計されているか**を言語化する

## 分析フォーマット

`prompts/analysis-guide.md` を参照。

必須セクション:
- 曲の本質
- Music Structure（曲展開）
- Harmony / Chord Progression（機能和声）
- Arrangement（楽器構成、密度設計、リズム/プロダクション設計）
- Lyrics Design
- 設計のポイント
- 概念キーワード

## slug命名規則

`{artist}_{title}` のASCII形式

例: `yoasobi_idol`, `yoasobi_yoru_ni_kakeru`, `aimyon_marigold`

## 分析済みの曲

| slug | アーティスト | 曲名 | 特徴 |
|------|-------------|------|------|
| `yoasobi_idol` | YOASOBI | アイドル | 二重構造、明と暗の同居 |
| `yoasobi_yoru_ni_kakeru` | YOASOBI | 夜に駆ける | 疾走感、切迫する感情 |
| `aimyon_marigold` | あいみょん | マリーゴールド | カノン進行、懐かしさと新鮮さ |

---

# Suno素材生成ルール

## `/sc:suno-pack {slug}` の処理

1. `data/analysis/{slug}.md` を読む
2. `prompts/suno-vocabulary.md` を参照してstyle生成
3. `prompts/suno-structure.md` を参照して構成設計
4. **実際の歌詞を書く**（プレースホルダーではなく）
5. `data/outputs/{slug}/` に保存

## 分析からSunoへの変換

| 分析セクション | Suno出力 |
|---------------|---------|
| Arrangement > ジャンル | Genre |
| Arrangement > 特徴・設計 | Style |
| Harmony > Key | Harmony |
| Music Structure > sections | Structure |
| 楽器構成・リズム/プロダクション設計 | Arrangement |
| Lyrics Design | Lyrics |

## style生成ルール

- `prompts/suno-vocabulary.md` の表現のみ使用
- 1000文字以内
- 分析のジャンル、特徴、楽器構成を反映

## lyrics生成ルール

- 分析の構成（Music Structure）に従う
- 分析のテーマ・キーワードを反映
- 視点（一人称など）を守る
- 言語密度に合わせた行数
- **実際の歌詞を書く**

---

# 参照ファイル

| 作業 | 参照ファイル |
|------|-------------|
| 曲分析 | `prompts/analysis-guide.md`（必須） |
| Suno style生成 | `prompts/suno-vocabulary.md` |
| Suno lyrics構成 | `prompts/suno-structure.md` |
