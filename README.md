# music-factory

既存曲の構造分析を資産化し、Suno用プロンプトを生成するMCPサーバー

## 概要

- 曲分析（`analysis.yaml`）から再現可能なSunoプロンプトを生成
- 1000文字制限・セクション構成の自動検証
- 3分構成テンプレートによる一貫した出力

## MCPツール

| ツール | 説明 |
|--------|------|
| `generate_suno_pack` | analysis.yaml → Suno4ファイル生成 |
| `validate_suno_pack` | 1000文字制限・セクション検証 |

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
├── analysis/           # 曲分析yaml
├── notes/              # note記事下書き
└── outputs/<slug>/     # Suno出力
    ├── title.txt
    ├── suno_style.txt
    ├── suno_lyrics.txt
    └── image_prompt.txt
```

## 開発

```bash
# pre-commit hookインストール
bunx lefthook install

# 開発サーバー起動（デバッグ用）
bun run src/index.ts
```

## ライセンス

MIT
