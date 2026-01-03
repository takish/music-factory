# music-factory

既存曲の構造分析を資産化し、Suno用プロンプト・note記事素材を生成するMCPサーバー

## 概要

- 既存曲の構造を抽象分析 → `analysis.yaml` として資産化
- `analysis.yaml` から再現可能なSunoプロンプトを生成
- 1000文字制限・セクション構成の自動検証
- 3分構成テンプレートによる一貫した出力
- note記事の下書き素材も生成

## フロー

```
analyze_reference_song_to_analysis_yaml
  │
  ↓
vault/analysis/<slug>.yaml
  │
  ├─→ generate_note_from_analysis
  │     ↓
  │   vault/notes/<slug>.md
  │
  └─→ generate_suno_pack
        ↓
      vault/outputs/<slug>/
        ├── title.txt
        ├── suno_style.txt
        ├── suno_lyrics.txt
        └── image_prompt.txt
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

| タイプ | 特徴 |
|--------|------|
| `yorushika` | 情景優先、抑制、余韻、ギター中心 |
| `illit` | 反復、ミニマル、耳残り、軽い感情 |
| `yoasobi` | 高密度言語、構造でフック、転換/Drop強め |
| `aimyon` | 素直な言葉、日常、盛り上げ過ぎない、アコギ中心 |
| `gurenka` | 意志、宣言、強いサビ、アニロック |
| `byoushin` | 内省/葛藤、言語密度、陰影、ロック |

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

`~/.claude.json` に以下を追加:

```json
{
  "mcpServers": {
    "music-factory": {
      "command": "bun",
      "args": ["run", "/path/to/music-factory/src/index.ts"],
      "env": {
        "VAULT_PATH": "/path/to/your/obsidian/vault"
      }
    }
  }
}
```

### Vault構造

```
vault/
├── analysis/           # 曲分析yaml（ASCII slugで命名）
├── notes/              # note記事下書き
└── outputs/<slug>/     # Suno出力
    ├── title.txt
    ├── suno_style.txt
    ├── suno_lyrics.txt
    └── image_prompt.txt
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
# → vault/analysis/aimyon_marigold.yaml

# 2. Sunoプロンプト生成
generate_suno_pack({
  analysis_path: "analysis/aimyon_marigold.yaml"
})
# → vault/outputs/aimyon_marigold/

# 3. note記事素材生成
generate_note_from_analysis({
  analysis_path: "analysis/aimyon_marigold.yaml"
})
# → vault/notes/aimyon_marigold.md
```

## 仕様

### slug命名規則

- **ASCII文字のみ**（`a-z0-9_`）
- 例: `aimyon_marigold`, `yorushika_tada_kimi_ni_hare`
- 日本語タイトル/アーティスト名は `source_song` 内に保持

### analysis.yaml必須フィールド

- `source_song.title` / `source_song.artist`
- `core_type`
- `music_structure.sections`
- `arrangement.genre_tags`
- `lyrics_design.language`

### 品質チェック

- `suno_style.txt`: 1000文字以内
- `suno_lyrics.txt`: 必須セクション（Verse1/2, Chorus, Instrumental, Bridge, FinalChorus）

## 開発

```bash
# pre-commit hookインストール
bunx lefthook install

# 開発サーバー起動（デバッグ用）
bun run src/index.ts
```

## ライセンス

MIT
