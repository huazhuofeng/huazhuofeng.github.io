---
title: "Cursor Remote-SSH Server 手动部署工具"
excerpt: "解决 Cursor Remote-SSH Server 下载失败/缓慢的问题，支持代理下载、版本管理和自动回滚。"
tags:
  - cursor
  - remote-ssh
  - deployment
  - proxy
---

## 项目简介

Cursor 是一款基于 AI 的代码编辑器，但在 Remote-SSH 连接远程服务器时，常常遇到 Cursor Server 下载失败或速度极慢的问题。本工具提供自动部署脚本，支持代理下载、版本管理和自动回滚。

---

## 快速开始

```bash
# 复制脚本到可执行位置
cp ~/Documents/cursor-server-deploy/scripts/deploy-cursor-server.sh ~/.local/bin/cursor-deploy
chmod +x ~/.local/bin/cursor-deploy

# 运行（交互式）
cursor-deploy
```

---

## 功能特性

| 功能 | 说明 |
|------|------|
| 🚀 自动部署 | 交互式或命令行模式 |
| 🌐 代理支持 | 自动使用 mihomo 代理 |
| 📦 版本管理 | 列表、切换、回滚 |
| 💾 自动备份 | 部署前备份旧版本 |
| 🔄 下载缓存 | 避免重复下载 |
| 📋 架构支持 | x64, arm64 |

---

## 获取版本信息

在 Windows Cursor 中：

1. **Help → About**
2. 或按 `Ctrl+Shift+P` → 输入 `About`

**示例：**
```
Version: 2.3.41
Commit: 2ca326e0d1ce10956aea33d54c0e2d8c13c58a30
```

---

## 使用场景

### 场景 1: 首次部署（交互式）

```bash
cursor-deploy
# 按提示输入版本和 commit
```

### 场景 2: 命令行部署

```bash
cursor-deploy -v 2.3.41 -c 2ca326e0d1ce10956aea33d54c0e2d8c13c58a30
```

### 场景 3: 版本更新

```bash
# 获取新版本信息后在 Cursor -> Help -> About
cursor-deploy -v 2.3.42 -c 新commit哈希
```

### 场景 4: 回滚版本

```bash
cursor-deploy --rollback
```

### 场景 5: 查看已安装版本

```bash
cursor-deploy --list
```

---

## 命令参考

```bash
cursor-deploy [选项] [操作]

选项:
  -v, --version <版本>       Cursor 版本号
  -c, --commit <hash>        Commit 哈希
  -p, --proxy <URL>          代理地址 (默认: http://127.0.0.1:7899)
  -a, --arch <架构>          x64 或 arm64 (默认: x64)
  --no-proxy                 禁用代理
  --no-backup                不备份旧版本

操作:
  --list                     列出已安装版本
  --current                  显示当前版本
  --rollback                 回滚到上一版本
  --clean                    清理缓存
  -h, --help                 显示帮助
```

---

## 与 Mihomo 集成

如果服务器已配置 mihomo（参考 [Mihomo 代理配置教程](/blog/2026/01/22/mihomo-proxy-setup/)）：

```bash
# 确保 mihomo 运行
mihomo-start
proxy-on

# 部署 (自动使用代理)
cursor-deploy -v 2.3.41 -c 2ca326e0d1ce10956aea33d54c0e2d8c13c58a30
```

---

## 故障排除

### 下载失败

```bash
# 检查代理
export https_proxy=http://127.0.0.1:7899
curl -I https://www.google.com

# 检查 mihomo
mihomo-status
```

### Cursor 连接失败

```bash
# 检查版本
cursor-deploy --list

# 查看文件
ls -la ~/.cursor-server/cli/servers/Stable-*/server/
```

---

## 目录结构

```
cursor-server-deploy/
├── README.md                          # 项目说明
├── scripts/
│   └── deploy-cursor-server.sh        # 自动部署脚本
├── guides/
│   └── USAGE_GUIDE.md                 # 详细使用指南
└── logs/
    └── SESSION_LOG_2026-01-21.md      # 问题解决记录
```

---

## 参考资料

- **Cursor Forum:** https://forum.cursor.com/t/how-to-download-cursor-remote-ssh-server-manually/30455/6
- **Arthals 博客:** https://arthals.ink/blog/cursor-remote-ssh-solution

---

**创建时间:** 2026-01-21
**版本:** 1.0
