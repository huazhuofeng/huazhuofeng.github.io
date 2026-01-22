---
title: "Mihomo 代理配置与 Shell 集成指南"
excerpt: "在 WSL/Linux 环境下配置 Mihomo 代理，实现一键切换节点、自动代理等便捷功能。"
tags:
  - proxy
  - mihomo
  - shell
  - wsl
---

## 项目简介

Mihomo 是一个功能强大的代理工具，通过 Shell 集成可以实现便捷的命令行代理管理。本教程介绍如何在 WSL/Linux 环境下配置 Mihomo，并提供完整的 Shell 函数实现。

---

## 核心功能

| 功能 | 命令 | 说明 |
|------|------|------|
| 启动/停止 | `mihomo-start` / `mihomo-stop` | 控制守护进程 |
| 代理开关 | `proxy-on` / `proxy-off` | 启用/禁用系统代理 |
| 状态查看 | `proxy-status` | 显示当前代理状态 |
| 节点切换 | `proxy-select jp` | 切换到指定国家节点 |
| 节点列表 | `proxy-list` | 列出所有可用节点 |

---

## 快速开始

```bash
# 启动 mihomo
mihomo-start

# 启用代理
proxy-on

# 切换到日本节点
proxy-select jp

# 查看状态
proxy-status
```

---

## 节点代码映射

| 代码 | 国家 | 节点 |
|------|------|------|
| `jp` | 日本 | 🇯🇵6日本-集群-专线, 🇯🇵7日本-专线, 🇯🇵10日本-专线 |
| `us` | 美国 | 🇺🇸11美国西集群-专线, 🇺🇸12美国旧金山-专线 |
| `hk` | 香港 | 🇭🇰1香港-专线, 🇭🇰2香港-专线, 🇭🇰3香港-专线 |
| `sg` | 新加坡 | 🇸🇬15新加坡-专线, 🇸🇬24新加坡-专线 |
| `kr` | 韩国 | 🇰🇷25韩国-专线 |
| `tw` | 台湾 | 4台湾-专线, 5台湾-专线 |
| `au` | 澳洲 | 🇦🇺19澳洲-专线 |

---

## 端口配置

| 端口 | 类型 | 用途 |
|------|------|------|
| 7899 | Mixed | 默认代理端口 |
| 7892 | HTTP | HTTP 代理 |
| 7898 | SOCKS | SOCKS5 代理 |
| 1235 | API | Mihomo REST API |
| 5336 | DNS | Mihomo DNS 服务器 |

---

## 关键修复：API 代理循环问题

### 问题描述

执行 `proxy-on` 或 `proxy-select` 后，Mihomo API 变得无响应（502 错误）。

### 根本原因

当设置 `http_proxy` 环境变量后，对 localhost 的 API 调用被路由到代理本身，形成循环。

### 解决方案

在所有 curl 命令中添加 `--noproxy "127.0.0.1"` 参数：

```bash
# 修改前
curl -s http://127.0.0.1:1235/proxies

# 修改后
curl -s --noproxy "127.0.0.1" http://127.0.0.1:1235/proxies
```

---

## 目录结构

```
~/.config/zsh/functions/
├── mihomo-api.zsh         # API 交互层（已修复）
├── mihomo-functions.zsh   # 用户命令
└── mihomo-nodes.zsh       # 节点映射

~/.config/mihomo/
└── config.yaml            # Mihomo 配置文件
```

---

## 测试代理

```bash
# 启用代理
proxy-on

# 测试 1: 检查出口 IP
curl https://api.ipify.org?format=json

# 测试 2: 检查 Google
curl -I https://www.google.com

# 测试 3: 检查状态
proxy-status
```

---

## 故障排除

### API 返回 502 或连接错误

```bash
# 检查修复是否应用
grep -n "noproxy" ~/.config/zsh/functions/mihomo-api.zsh

# 应该在 curl 命令中看到 --noproxy
```

### 代理启用但无网络

```bash
# 检查节点状态
proxy-current

# 查看 mihomo 日志
mihomo-log

# 尝试其他节点
proxy-select us
```

### 函数未找到

```bash
# 重新加载 zshrc
source ~/.zshrc

# 检查文件是否存在
ls -la ~/.config/zsh/functions/
```

---

**创建时间:** 2026-01-21
**状态:** ✅ 生产环境可用
