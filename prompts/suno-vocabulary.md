# Suno Prompt Vocabulary

Sunoで使用できる表現・タグの一覧。スタイルプロンプト生成時に参照する。

> Sources:
> - https://zenn.dev/devp/articles/241a962af54c38
> - https://sunoaiwiki.com/resources/2024-05-13-list-of-metatags/
> - https://vozart.ai/blog/suno-ai-metatags-guide
> - https://sider.ai/blog/ai-tools/what-s-new-in-suno-v5-and-how-to-prompt-its-vocal-controls-like-a-pro

---

## Suno v5 特有の機能

### v5の主な改善点

| 機能 | 説明 |
|------|------|
| Intelligent Composition Architecture | 短いフックから長尺まで一貫した構成維持 |
| Studio-grade fidelity | より高品質なミックス |
| 感情パース改善 | 感情タグがより正確に反映 |
| ボーカルエンジン強化 | フレージング、音節アラインメント向上 |
| Studio Timeline連携 | セクション編集がより一貫性を持つ |

### Style of Music フィールド（重要）

**200文字制限**。以下の5要素を含める：

| 要素 | 例 |
|------|-----|
| Genre | pop, trap, gospel, jazz-hop, synthwave |
| Mood | dark, uplifting, melancholic, cinematic |
| Instrumentation | 808s, analog synths, orchestral strings |
| Vocal Style | female, whispery, layered, soulful |
| Structure Hints | big chorus, slow build, ambient intro |

**例**: `Uplifting gospel trap with 808s, female layered vocals, and a big cinematic chorus`

### v5プロンプトのベストプラクティス

1. **トップアンカー方式**: 最初の20-30語でスタイルを確定
   - 例: `Female pop vocalist, breathy, intimate, 90s R&B groove`
2. **タグは1-2語**: 長いタグは効果が薄れる
3. **楽器は2-4種類まで**: 多すぎると混乱
4. **セクション変更時にタグ再指定**: 重要なポイントで明示

---

## v5 高度なメタタグ

### セクション内制御タグ

| タグ | 用途 | 例 |
|------|------|-----|
| `[Tempo: Mid]` | テンポ指定 | `[Tempo: Fast]` |
| `[Vocalist: Female]` | ボーカリスト | `[Vocalist: Male tenor]` |
| `[Mood: Defiant]` | ムード | `[Mood: Melancholic]` |
| `[Key: C minor]` | キー | `[Key: G major]` |
| `[Energy: Medium→High]` | エネルギー推移 | `[Energy: Low→Medium]` |
| `[Texture: Tape-Saturated]` | テクスチャ | `[Texture: Clean digital]` |
| `[Callback: ...]` | 前セクション参照 | `[Callback: continue with same vibe as chorus]` |

### 複合セクションタグ

```
[Intro]
[Mood: Uplifting]
[Energy: Medium→High]
[Instrument: Bright Electric Guitars, Live Drums]
[Vocal Style: Open, Confident]
```

### 転調・特殊指示

| タグ | 用途 |
|------|------|
| `[modulate up a key]` | 半音上げ |
| `[modulate down]` | 半音下げ |
| `[key change to major]` | メジャーキーへ転調 |
| `[tempo change: slower]` | テンポダウン |

---

## 構成タグ（Metatags）

歌詞内で使用するセクション区切り。

| タグ | 用途 | 備考 |
|------|------|------|
| `[Intro]` | 導入部 | インスト or ボーカル |
| `[Verse]` | Aメロ | 物語展開 |
| `[Verse 1]`, `[Verse 2]` | 番号付きVerse | 区別が必要な場合 |
| `[Pre-Chorus]` | Bメロ | サビへの橋渡し |
| `[Chorus]` | サビ | 主題・フック |
| `[Post-Chorus]` | サビ後 | 余韻・繰り返し |
| `[Bridge]` | Cメロ | 転換・新展開 |
| `[Interlude]` | 間奏 | インスト |
| `[Instrumental]` | 演奏パート | Interludeと同義 |
| `[Drop]` | EDM的落差 | ビルドアップ後の解放 |
| `[Buildup]` | 高揚前段階 | Dropへの準備 |
| `[Breakdown]` | ブレイクダウン | 密度低下→再構築 |
| `[Theme]` | 主題提示 | 映画音楽的 |
| `[Theme Reprise]` | 主題再提示 | 回帰 |
| `[Outro]` | 終結部 | フェードアウト等 |
| `[End]` | 終了指示 | 強制終了 |

---

## ジャンル表現（Genres）

### J-Pop / アジア系

| 英語表記 | 日本語 | 特徴 |
|----------|--------|------|
| J-Pop | J-ポップ | 日本のポップス全般 |
| Japanese Pop | 日本のポップ | J-Popと同義 |
| 80s Japanese City Pop | 80年代シティポップ | 山下達郎、竹内まりや風 |
| Modern City Pop | 現代シティポップ | ネオシティポップ |
| K-Pop | K-ポップ | 韓国ポップス |
| Idol Pop | アイドルポップ | 明るく元気 |
| Anime | アニメ | アニソン風 |
| Vocaloid | ボカロ | ボカロ曲風 |

### ロック系

| 英語表記 | 日本語 | 特徴 |
|----------|--------|------|
| Rock | ロック | 基本ロック |
| Alternative Rock | オルタナティブロック | 90年代以降 |
| Indie Rock | インディーロック | 独立系 |
| Progressive Rock | プログレッシブロック | 複雑な展開 |
| Progressive Metal | プログレッシブメタル | テクニカル |
| Post-Rock | ポストロック | 壮大・インスト重視 |
| Punk Rock | パンクロック | 攻撃的・高速 |
| Pop Punk | ポップパンク | メロディアスなパンク |
| Hard Rock | ハードロック | 重厚 |
| Heavy Metal | ヘヴィメタル | 激しい |
| Metalcore | メタルコア | メタル+ハードコア |
| Nu Metal | ニューメタル | 90年代後半 |
| Grunge | グランジ | 90年代シアトル |

### エレクトロニック系

| 英語表記 | 日本語 | 特徴 |
|----------|--------|------|
| EDM | EDM | エレクトロニックダンス全般 |
| House | ハウス | 4つ打ち基本 |
| Deep House | ディープハウス | 深い・落ち着いた |
| Progressive House | プログレッシブハウス | 展開重視 |
| Tropical House | トロピカルハウス | 夏っぽい |
| Future Bass | フューチャーベース | シンセ多用 |
| UK Garage | UKガラージ | 2ステップ |
| Drum and Bass | ドラムンベース | 高速ブレイクビーツ |
| Dubstep | ダブステップ | ワブルベース |
| Synthwave | シンセウェイブ | 80年代風シンセ |
| Retrowave | レトロウェイブ | Synthwaveと類似 |
| Hyper Pop | ハイパーポップ | 過激・実験的ポップ |
| Electropop | エレクトロポップ | シンセポップ |
| Techno | テクノ | ミニマル反復 |
| Trance | トランス | 高揚感 |

### その他

| 英語表記 | 日本語 | 特徴 |
|----------|--------|------|
| Lo-fi | ローファイ | ノスタルジック・暖かい |
| Lo-fi Hip Hop | ローファイヒップホップ | チルビート |
| R&B | R&B | リズム&ブルース |
| Soul | ソウル | 黒人音楽 |
| Jazz | ジャズ | 即興・複雑和声 |
| Classical | クラシカル | クラシック風 |
| Orchestral | オーケストラル | 管弦楽 |
| Acoustic | アコースティック | 生楽器 |
| Folk | フォーク | 民謡的 |
| Country | カントリー | アメリカ南部 |
| Reggae | レゲエ | ジャマイカ |
| Latin | ラテン | ラテン系全般 |
| Bossa Nova | ボサノバ | ブラジル |

---

## ボーカルスタイル（Vocal Modifiers）

歌詞内で()で囲んで使用。v5ではより正確に反映される。

### v5 ボーカル制御のコツ

1. **プライマリ + セカンダリ**: `breathy + vibrato`, `raspy + restrained falsetto`
2. **セクション指定**: `[Verse: falsetto, sad]`, `[Chorus: belting, powerful]`
3. **息遣い表現**: `audible air between lines`, `close-mic intimacy`, `sigh-like breath release`

### 歌唱法

| 表記 | 意味 | 用途 |
|------|------|------|
| `(whispering)` | ささやき | 親密・秘密感 |
| `(whispered verse)` | ささやきバース | v5セクション指定 |
| `(softly)` | 優しく | 柔らかい表現 |
| `(gently)` | 穏やかに | 落ち着いた |
| `(powerfully)` | 力強く | サビ・決め |
| `(belting)` | ベルティング | 張り上げ |
| `(shouting)` | 叫び | 激情 |
| `(screaming)` | 絶叫 | 極端な感情 |
| `(growling)` | グロウル | メタル的 |
| `(grunting)` | うなり | 力強い |
| `(yelping)` | 叫び（短い） | アクセント |
| `(yodeling)` | ヨーデル | 裏声切り替え |
| `(falsetto)` | ファルセット | 裏声・高音 |
| `(head voice)` | ヘッドボイス | 裏声（柔らかめ） |
| `(chest voice)` | チェストボイス | 地声 |
| `(mixed voice)` | ミックスボイス | 地声と裏声の中間 |
| `(breathy)` | 息混じり | 色っぽい・儚い |
| `(raspy)` | かすれ | ハスキー |
| `(nasal)` | 鼻声 | 個性的 |
| `(vibrato)` | ビブラート | 声の揺れ |
| `(melismatic)` | メリスマ | 1音節に複数音 |
| `(clear diction)` | 明瞭な発音 | 聞き取りやすい |

### v5 ボーカルペルソナ指定

Style Promptで使用：

| 表記 | 用途 |
|------|------|
| `female mid-range, breathy` | 女性中音域、息混じり |
| `male tenor, clear diction` | 男性テナー、明瞭 |
| `duet with harmonies` | デュエット+ハモリ |
| `female layered vocals` | 女性重ね録り |
| `robotic vocoder` | ロボット風ボコーダー |
| `vulnerable vocals` | 脆い・繊細なボーカル |
| `aggressive vocals` | 攻撃的なボーカル |
| `whispered doubles` | ささやきダブリング |

### 感情表現

| 表記 | 意味 | 用途 |
|------|------|------|
| `(sadly)` | 哀しげに | バラード |
| `(angrily)` | 怒りを込めて | 激情 |
| `(joyfully)` | 喜びを込めて | 明るい |
| `(desperately)` | 必死に | 切迫感 |
| `(tenderly)` | 優しく・愛おしげに | ラブソング |
| `(coldly)` | 冷たく | 距離感 |
| `(longingly)` | 切なく・憧れて | 恋愛 |

### 特殊表現

| 表記 | 意味 | 用途 |
|------|------|------|
| `(spoken)` | 語り | ラップ的・ポエトリー |
| `(rapping)` | ラップ | ヒップホップ |
| `(chanting)` | 唱和 | 反復・お経的 |
| `(humming)` | ハミング | 鼻歌 |
| `(vocalizing)` | ヴォカリーズ | 母音のみ |
| `(ad-libs)` | アドリブ | 合いの手 |
| `(scat)` | スキャット | ジャズ的 |

### ハーモニー

| 表記 | 意味 | 用途 |
|------|------|------|
| `(harmonies)` | ハモリ | 一般的 |
| `(harmonies: third above)` | 3度上ハモリ | 明るい |
| `(harmonies: third below)` | 3度下ハモリ | 厚み |
| `(octave double)` | オクターブユニゾン | 厚み |
| `(unison)` | ユニゾン | 合唱 |
| `(call and response)` | 掛け合い | 対話的 |
| `(choir)` | 合唱 | 壮大 |
| `(backing vocals)` | バッキングボーカル | コーラス |

---

## ムード表現（Mood）

Style Promptで使用。

### 感情系

| 英語 | 日本語 | 用途 |
|------|--------|------|
| Emotional | エモーショナル | 感情的 |
| Melancholic | メランコリック | 憂鬱 |
| Sad | 悲しい | 直接的 |
| Happy | 幸せ | 明るい |
| Joyful | 喜びに満ちた | 祝祭的 |
| Angry | 怒り | 激情 |
| Aggressive | アグレッシブ | 攻撃的 |
| Peaceful | 穏やか | 静か |
| Calm | 落ち着いた | 静穏 |
| Anxious | 不安 | 緊張感 |
| Hopeful | 希望に満ちた | 前向き |
| Desperate | 絶望的 | 切迫 |
| Longing | 切ない・憧れ | 恋愛 |
| Bittersweet | 甘くて苦い | 複雑な感情 |

### 雰囲気系

| 英語 | 日本語 | 用途 |
|------|--------|------|
| Nostalgic | ノスタルジック | 懐かしい |
| Dreamy | 夢見心地 | 幻想的 |
| Ethereal | 空気のような | 儚い |
| Mysterious | 神秘的 | 謎めいた |
| Dark | 暗い | ダーク |
| Bright | 明るい | 爽やか |
| Intense | 激しい | 強烈 |
| Epic | 壮大 | 映画的 |
| Intimate | 親密 | プライベート |
| Cinematic | 映画的 | ドラマチック |
| Romantic | ロマンティック | 恋愛 |
| Sensual | 官能的 | セクシー |
| Playful | 遊び心のある | 軽快 |
| Quirky | 風変わり | 個性的 |

### シーン系

| 英語 | 日本語 | 用途 |
|------|--------|------|
| Night drive | 夜のドライブ | シティポップ |
| Rainy day | 雨の日 | メランコリック |
| Summer | 夏 | 爽やか |
| Winter | 冬 | 寂しい・温かい |
| Urban | 都会的 | 洗練 |
| Nature | 自然 | オーガニック |

---

## 楽器指定（Instruments）

### v5 楽器指定のベストプラクティス

1. **具体的に指定**: `guitar` → `acoustic fingerstyle guitar`, `Rhodes piano`
2. **2-4種類まで**: 多すぎると混乱する
3. **修飾語を活用**: `warm`, `bright`, `distorted` など
4. **セクション別指定可能**: `[instrumental: acoustic guitar, strings]`

### 記法

```
[Instrument: Acoustic guitar]
[Instrument: Strings (legato, warm)]
[Instrument: Piano, soft]
[instrumental: acoustic guitar, strings]  # v5セクション内
[breakdown: 808s, trap hi-hats]  # ジャンル特化
```

### 主要楽器

| カテゴリ | 楽器 | 修飾語例 |
|----------|------|----------|
| **ギター** | Acoustic guitar | fingerpicking, strumming |
| | Electric guitar | clean, distorted, overdriven |
| | Classical guitar | nylon |
| | Bass guitar | slap, fingerstyle |
| | Distorted guitar | riff, power chords |
| **鍵盤** | Piano | grand, upright, soft |
| | Electric piano | Rhodes, Wurlitzer |
| | Rhodes piano | warm, vintage |
| | Synthesizer | analog, digital, pad |
| | Moog synth | warm, fat bass |
| | Organ | Hammond B3, church |
| **弦楽器** | Strings | legato, pizzicato, tremolo |
| | Violin | solo |
| | Cello | warm, deep |
| | Orchestra | full, chamber |
| | Upright bass | jazz, walking |
| **管楽器** | Saxophone | alto, tenor, soprano, smooth |
| | Trumpet | muted, bright |
| | Flute | breathy |
| **打楽器** | Drums | acoustic, electronic, brushed |
| | Live drums | powerful, driving |
| | Drum machine | 808, 909, LinnDrum |
| | 808 drums | trap, hip-hop |
| | Percussion | congas, bongos, shaker |
| **特殊楽器** | Sitar | Indian |
| | Steel pan | Caribbean |
| | Kalimba | ambient |
| | Taiko drums | epic, Japanese |
| | Koto | 和風 |

### ジャンル別楽器組み合わせ例

| ジャンル | 組み合わせ |
|----------|-----------|
| Rock | Distorted electric guitar, driving bass guitar, powerful drum kit, occasional organ |
| Jazz | Smooth tenor saxophone, upright bass, brushed drums, warm piano |
| EDM | Pulsing synth bass, 808 drums, arpeggiated synths, atmospheric pads |
| Folk | Acoustic fingerstyle guitar, strings, gentle percussion |
| City Pop | Rhodes piano, slap bass, drum machine, analog synth pads |

---

## ダイナミクス・密度（Dynamics）

歌詞内またはStyle Promptで使用。

### 展開指示

| 表記 | 意味 | 用途 |
|------|------|------|
| `(building up)` | 盛り上がっていく | 高揚感 |
| `(building intensity)` | 強度が増す | 緊張感 |
| `(hold tension)` | 緊張維持 | ブリッジ |
| `(release)` | 解放 | サビ |
| `(explode)` | 爆発 | クライマックス |
| `(fade out)` | フェードアウト | 終了 |
| `(sudden stop)` | 急停止 | 効果的終了 |

### アレンジ密度

| 表記 | 意味 | 用途 |
|------|------|------|
| `(sparse arrangement)` | スカスカ | バース・静か |
| `(minimal)` | ミニマル | 控えめ |
| `(thick arrangement)` | 密度高い | サビ・盛り上がり |
| `(full arrangement)` | フルアレンジ | 全楽器 |
| `(layers building)` | レイヤー追加 | 徐々に厚く |

### 音量記号

| 表記 | 意味 |
|------|------|
| `(pp)` | ピアニッシモ（非常に弱く） |
| `(p)` | ピアノ（弱く） |
| `(mp)` | メゾピアノ（やや弱く） |
| `(mf)` | メゾフォルテ（やや強く） |
| `(f)` | フォルテ（強く） |
| `(ff)` | フォルティッシモ（非常に強く） |
| `(crescendo)` | クレッシェンド（徐々に強く） |
| `(decrescendo)` | デクレッシェンド（徐々に弱く） |

---

## 空間・音像表現（Spatial）

Style Promptで使用。

| 表記 | 意味 | 用途 |
|------|------|------|
| `(intimate close-mic)` | 近距離マイク | 親密感 |
| `(room sound)` | ルーム感 | 自然 |
| `(stereo wide)` | ステレオ広がり | 空間感 |
| `(mono center)` | モノラル中央 | フォーカス |
| `(dry)` | ドライ | エフェクトなし |
| `(wet)` | ウェット | エフェクト多め |
| `(reverb)` | リバーブ | 残響 |
| `(cavernous reverb 4s)` | 洞窟的残響4秒 | 壮大 |
| `(delay)` | ディレイ | 山びこ |
| `(tape saturation light)` | 軽いテープ飽和 | ローファイ感 |
| `(vinyl crackle)` | レコードノイズ | ノスタルジック |
| `(lo-fi processing)` | ローファイ処理 | 暖かい劣化感 |

---

## テンポ表現（Tempo）

Style Promptで使用。

| 表記 | BPM目安 | 用途 |
|------|---------|------|
| Very slow | 40-60 | バラード |
| Slow | 60-80 | スローバラード |
| Moderate | 80-100 | ミディアム |
| Medium tempo | 100-120 | 標準 |
| Upbeat | 120-140 | 明るい |
| Fast | 140-160 | 速い |
| Very fast | 160-180 | ハイテンポ |
| Driving | - | 推進力のある |
| Laid-back | - | ゆったり |
| Groovy | - | グルーヴィー |

---

## 特殊効果・終わり方

| 表記 | 意味 | 用途 |
|------|------|------|
| `[Fade Out]` | フェードアウト | 徐々に終わる |
| `[End]` | 終了 | 強制終了 |
| `(breath)` | 息を吸う音 | 終わりの余韻 |
| `(exhale)` | 息を吐く音 | 親密感 |
| `(vocal chop)` | ボーカルチョップ | EDM的効果 |
| `(glitch)` | グリッチ | エレクトロニック |
| `(reverse)` | リバース | 逆再生効果 |
| `(pitch bend)` | ピッチベンド | 音程変化 |

---

## 使用例

### Style Prompt例

```
Genre:
Japanese Pop, Modern City Pop, Synth-pop

Style:
Nostalgic and dreamy Japanese pop song.
Night drive atmosphere with warm synthesizers.

Tempo:
Medium tempo, laid-back groove.

Harmony:
Major key with jazzy extensions.
Smooth chord progressions.

Arrangement:
Synth-driven with slap bass and drum machine.
Warm analog synthesizer pads.
(intimate close-mic) vocals.

Vocals:
Female, breathy and soft.
(harmonies: third above) in chorus.
```

### Lyrics Modifier例

```
[Verse 1]
(softly, breathy)
夜の街を走る...

[Pre-Chorus]
(building up)
どこまでも続く道...

[Chorus]
(powerfully, harmonies)
この瞬間を忘れない...

[Outro]
(whisper, fade out)
(breath)
```

---

## 効果音・環境音タグ（Sound Effects）

Barkモデルベースの効果音。歌詞内で使用。

### 人声・反応

| タグ | 意味 |
|------|------|
| `[applause]` | 拍手 |
| `[audience laughing]` | 観客の笑い |
| `[cheering]` | 歓声 |
| `[clapping]` | 手拍子 |
| `[crowd sings]` | 観客が歌う |
| `[chuckles]` | くすくす笑い |
| `[giggles]` | 笑い声 |
| `[groaning]` | うめき声 |
| `[sighs]` | ため息 |
| `[whispers]` | ささやき |
| `[whistling]` | 口笛 |

### 環境音

| タグ | 意味 |
|------|------|
| `[barking]` | 犬の吠え声 |
| `[birds chirping]` | 鳥のさえずり |
| `[bell dings]` | ベルの音 |
| `[phone ringing]` | 電話の音 |
| `[beeping]` | ビープ音 |

### ナレーション

| タグ | 意味 |
|------|------|
| `[announcer]` | アナウンサー |
| `[female narrator]` | 女性ナレーター |
| `[male narrator]` | 男性ナレーター |
| `[reporter]` | レポーター |
| `[man]` | 男性の声 |
| `[woman]` | 女性の声 |
| `[boy]` | 少年の声 |
| `[girl]` | 少女の声 |

### その他

| タグ | 意味 |
|------|------|
| `[silence]` | 無音 |
| `[bleep]` | ピー音（検閲） |
| `[upbeat music]` | 明るい音楽 |

---

## 歌詞の書き方ベストプラクティス（v5）

### 基本ルール

1. **改行 = 息継ぎ**: 改行位置で音楽的な呼吸が入る
2. **句読点でフレージング**: カンマ、省略記号で間を示唆
3. **1文 = 1フレーズ**: 長い文は圧縮されるか強勢がずれる
4. **短い行**: 1行は短めに（長すぎると詰め込まれる）

### v5での改善点

- 音節アラインメントの向上
- マイクロダイナミクスの表現
- ビブラート制御の精度向上

### セクション内スタイル指定

```
[Verse 1]
[Vocal Style: Whisper]
最初の行...
次の行...

[Chorus]
[Vocal Style: Powerful, belting]
[Energy: High]
サビの行...
```

### 対比の演出

```
[Verse]
(whispered verse)
静かなパート...

[Chorus]
(explosive chorus)
爆発的なサビ...
```

### ブリッジでのテクスチャ変化

```
[Bridge]
[Texture: Tape-Saturated]
(whispered doubles)
(grainier tone)
ブリッジの歌詞...
```

---

## v5 成功の公式

```
Precise Meta Tags + High Style Influence + Moderate Weirdness + Strategic Exclude Styles = Professional custom music
```

### チェックリスト

- [ ] Style of Music は200文字以内
- [ ] 最初の20-30語でスタイル確定
- [ ] 楽器は2-4種類まで
- [ ] タグは1-2語で簡潔に
- [ ] 重要セクションでタグ再指定
- [ ] 改行位置で息継ぎを考慮
