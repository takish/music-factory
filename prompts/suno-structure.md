# Suno Song Structure Patterns

Sunoで使用する楽曲構成パターンと各セクションの役割。

> Sources:
> - https://note.com/hoboai/n/nc8c56f542028
> - https://jackrighteous.com/en-us/pages/suno-ai-meta-tags-guide

---

## v5 構成制御のポイント

### Intelligent Composition Architecture

v5では長尺でも一貫した構成を維持できるようになった。

1. **フロントロード**: 重要なタグは最初の3-5行に
2. **Callback活用**: `[Callback: continue with same vibe as chorus]` で一貫性維持
3. **Energy推移**: `[Energy: Medium→High]` で自然な盛り上がり
4. **セクション編集**: Studio Timelineでより一貫した編集が可能

### 構成指定の書き方

Style Promptで明示的に指定可能：

```
[Structure: Intro → Verse → Chorus → Bridge → Chorus]
```

または各セクションで個別指定：

```
[Intro]
[Mood: Uplifting]
[Energy: Medium→High]
```

---

## 基本構成パターン

### 標準パターン（約70%の楽曲で採用）

```
[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Verse 2]
[Chorus]
[Bridge]
[Chorus Variation]
[Outro]
```

**特徴**:
- 曲にドラマチックな起承転結が生まれやすい
- 2回目のサビでリスナーを引き込み、ブリッジで変化を与え、最後にサビ変形で盛り上げ
- イントロとアウトロで「始まりから終わり」の流れを自然に構築

---

## 構成パターン一覧

### ABABパターン（シンプル）

```
[Intro] → [Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Outro]
```

| 項目 | 内容 |
|------|------|
| 用途 | 短めの曲、初心者向け |
| メリット | 短くまとまる、リピート感が強く耳に残る |
| デメリット | 変化に乏しく単調、大きな盛り上がりが難しい |

---

### ABABCBパターン（王道）

```
[Intro] → [Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Bridge] → [Chorus] → [Outro]
```

| 項目 | 内容 |
|------|------|
| 用途 | ポピュラー音楽の定番 |
| メリット | 中盤以降で転調や盛り上げを仕掛けやすい、飽きさせない |
| デメリット | サビが多め、ブリッジの質で印象が大きく変わる |

---

### AABABBパターン（ストーリー重視）

```
[Intro] → [Verse 1] → [Verse 2] → [Chorus] → [Verse 3] → [Chorus] → [Outro]
```

| 項目 | 内容 |
|------|------|
| 用途 | ラップ曲、ストーリー性重視 |
| メリット | 歌詞構成に重点、キャラクター視点の切り替え可能 |
| デメリット | 長めで冗長になるリスク、3つのVerseに差別化必要 |

---

### AB(Pre)Bパターン（J-POP/K-POP向け）

```
[Intro] → [Verse 1] → [Pre-Chorus] → [Chorus] → [Verse 2] → [Pre-Chorus] → [Chorus] → ...
```

| 項目 | 内容 |
|------|------|
| 用途 | J-POP、K-POP |
| メリット | サビ前の「じらし」で盛り上げ、メロディにドラマ性 |
| デメリット | Pre-Chorusが弱いと効果半減、やや長くなる |

---

### AAAパターン（ミニマル）

```
[Intro] → [Verse 1] → [Verse 2] → [Verse 3] → ... → [Outro]
```

| 項目 | 内容 |
|------|------|
| 用途 | 童謡、CMソング、実験的楽曲 |
| メリット | シンプルで覚えやすい |
| デメリット | 単調で飽きられやすい、メロディに高度な工夫必須 |

---

## 各セクションの役割と登場回数

### Intro（イントロ）

| 項目 | 内容 |
|------|------|
| 役割 | 曲の雰囲気を決定づける導入 |
| 登場率 | ほぼ全ての曲 |
| タグ例 | `[Intro]`, `[Instrumental intro]`, `[Intro: Piano solo]` |

---

### Verse（Aメロ）

| 項目 | 内容 |
|------|------|
| 役割 | ストーリーや歌詞の世界観を提示 |
| 回数 | 多くが2回（Verse 1, Verse 2）、ラップ曲は3回も |
| タグ例 | `[Verse 1]`, `[Verse 2]`, `[Verse 3]` |

---

### Pre-Chorus（Bメロ）

| 項目 | 内容 |
|------|------|
| 役割 | サビへの助走、緊張感を高める |
| 登場率 | 約半数以上（J-POP/K-POPで多用） |
| 注意 | なしの場合、Verse後半に盛り上げ要素が必要 |
| タグ例 | `[Pre-Chorus]`, `[Pre-Chorus: String crescendo]` |

---

### Chorus（サビ）

| 項目 | 内容 |
|------|------|
| 役割 | 曲のクライマックス、主題・フック |
| 回数 | 基本1種類を繰り返し |
| 終盤 | ダブルコーラス（2連続）で大団円も多い |
| タグ例 | `[Chorus]`, `[Chorus Variation]`, `[Final Chorus]` |

---

### Bridge（Cメロ）

| 項目 | 内容 |
|------|------|
| 役割 | 最後の盛り上がり前に変化を与える、転調に多用 |
| 登場率 | 約半数 |
| なしの場合 | 楽器ソロや短い間奏で変化を演出 |
| タグ例 | `[Bridge]`, `[Bridge: Key change to major]` |

---

### 間奏・ソロ

| 項目 | 内容 |
|------|------|
| タイミング | サビ後やブリッジ前後 |
| バラード系 | 間奏短めで歌中心 |
| ロック系 | 2番サビ後にギターソロでクライマックス |
| タグ例 | `[Instrumental Break]`, `[Guitar Solo]`, `[Piano Solo]` |

---

### Outro（アウトロ）

| 項目 | 内容 |
|------|------|
| 役割 | 曲の締めくくり |
| 登場率 | ほぼ全ての曲 |
| タグ例 | `[Outro]`, `[Fade out]`, `[End]` |

---

## ジャンル別構成例

### EDM / エレクトロニック

```
[Intro: Glitch effects]
[Drop]
[Verse 1: Robotic vocoder]
[Build-up: Rising arpeggiator]
[Breakdown: Bass drop]
[Outro: Bitcrushed fade]
```

**ポイント**:
- Verse→Chorusではなく、Intro→Drop→Breakdownが主軸
- Dropのタイミングと演出が重要
- タグで明示するとAIが認識しやすい

---

### バラード

```
[Intro: Piano solo]
[Verse 1: Vulnerable vocals]
[Pre-Chorus: String crescendo]
[Chorus: Cathartic release]
[Bridge: Key change to major]
[Instrumental: Koto]
[Outro: Falsetto adlibs]
```

**ポイント**:
- ピアノやストリングスでイントロ・アウトロ
- ブリッジで転調してドラマチックに
- 感情の起伏を演出

---

### ロック

```
[Intro: Distorted guitar riff]
[Verse 1: Aggressive vocals]
[Chorus: High-energy full band]
[Guitar Solo]
[Outro: Feedback fade]
```

**ポイント**:
- ギターソロや力強いシャウトが魅力
- サビ直後にソロでメリハリ

---

### 複雑な感情表現型

```
[Intro: Piano solo]
[Verse 1: Vulnerable vocals]
[Pre-Chorus: String crescendo]
[Chorus: Cathartic release]
[Instrumental Break: Guitar weeping]
[Bridge: Key change to major]
[Outro: Falsetto adlibs]
```

**ポイント**:
- 感情の波が激しい曲向け
- ストーリー性を持たせたい場合に有効

---

### 物語的進行型

```
[Intro: Narrative voiceover]
[Verse 1: Character A perspective]
[Verse 2: Character B perspective]
[Bridge: Dialogue interlude]
[Outro: Moral conclusion]
```

**ポイント**:
- ミュージカル風、ドラマ仕立て
- 視点の切り替えで物語展開

---

## 特殊タグ

### ライブ感・インタラクション

| タグ | 用途 |
|------|------|
| `[Call and response]` | 観客との掛け合い |
| `[Shout]` | シャウト、叫び |

### 言語切り替え

| タグ | 用途 |
|------|------|
| `[Verse 3 - Japanese]` | 特定セクションの言語指定 |
| `[Rap: English]` | ラップ部分の言語切り替え |

### メタ的演出

| タグ | 用途 |
|------|------|
| `[False Ending]` | 偽のエンディング |
| `[Surprise Revival]` | False Ending後の再開 |

### 特殊効果

| タグ | 用途 |
|------|------|
| `[Key Change]` | 転調（ブリッジ後や曲後半が自然） |
| `[Drop]` | EDM的落差（Chorus直前が効果的） |

---

## 自然な流れを作るコツ

### 1. 基本の流れを念頭に置く

```
1. [Intro] - 曲の雰囲気を決定
2. [Verse 1] - 世界観を提示
3. [Pre-Chorus] - サビへの助走
4. [Chorus] - クライマックス
5. [Verse 2] - 歌詞・展開の発展
6. [Chorus] - 再度の盛り上げ
7. [Bridge] - 曲に変化
8. [Chorus Variation] - 最終的な大盛り上がり
9. [Outro] - エンディング
```

### 2. タグを明示しないと...

- `[Intro]`なし → 曲が唐突に始まる
- `[Outro]`なし → 曲が突然終わる

### 3. 特殊効果の位置

- Key Changeは早すぎるとクライマックス分散
- ブリッジ後や曲後半にまとめると自然

### 4. 声のバリエーション

- Adlib、Voiceoverなどは後半に集中
- コア構成（Verse→Chorus）がしっかりしていることが前提

### 5. 類似パートのグループ化

- 複数のInterludeやInstrumentalはまとめて指示
- 「Interludeを2回入れる」など明示

---

## 3分構成の目安

| セクション | 目安時間 |
|------------|----------|
| Intro | 10-15秒 |
| Verse 1 | 25-30秒 |
| Pre-Chorus | 15-20秒 |
| Chorus | 30-35秒 |
| Verse 2 | 25-30秒 |
| Chorus | 30-35秒 |
| Bridge | 20-25秒 |
| Final Chorus | 30-35秒 |
| Outro | 10-15秒 |
| **合計** | **約3分** |

---

## music-factory用構成テンプレート

### 標準3分構成

```
[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Verse 2]
[Pre-Chorus]
[Chorus]
[Instrumental]
[Bridge]
[Final Chorus]
[Outro]
```

### 4分構成（Post-Chorus追加）

```
[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Post-Chorus]
[Verse 2]
[Pre-Chorus]
[Chorus]
[Post-Chorus]
[Instrumental]
[Bridge]
[Final Chorus]
[Final Chorus]
[Outro]
```
