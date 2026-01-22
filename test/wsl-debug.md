# WSL-Ubuntu 本地调试指南

1. 打开 WSL 终端并进入仓库：
   ```bash
   cd /home/joe/web-server/huazhuofeng.github.io
   ```

2. 安装 Ruby 与系统依赖（如果还未安装）：
   ```bash
   sudo apt update
   sudo apt install ruby-full build-essential zlib1g-dev
   gem install bundler
   ```

3. 配置 Bunder 使用项目本地路径（避免权限问题）：
   ```bash
   bundle config set --local path 'vendor/bundle'
   ```

   如果之前配置过国内镜像导致无法访问，先清理：
   ```bash
   rm -f .bundle/config
   ```

4. 安装依赖：
   ```bash
   bundle install
   ```

   **注意**：Gemfile 中使用 Jekyll 4.x（而非 5.0，因该版本尚未发布），且移除了 `github-pages` gem 以避免版本冲突。

5. 启动 Jekyll 预览：
   ```bash
   bundle exec jekyll serve --livereload
   ```
   若 4000 端口占用，可用 `--port 4001` 指定其他端口。

6. 在 Windows 浏览器访问 `http://127.0.0.1:4000/`（或指定端口）查看首页和 `/blog/`。修改 `_posts/`、`_data/`、`assets/` 等文件会触发自动重建与刷新。

## 常见问题

### 权限错误 (Bundler::PermissionError)
如果遇到权限错误，说明 bundler 是通过 sudo 安装的。解决方法：
```bash
bundle config set --local path 'vendor/bundle'
bundle install
```

### 网络错误 (Could not reach host gems.ruby-china.org)
如果使用国内镜像源导致无法访问，清理配置：
```bash
rm -f .bundle/config
bundle install
```

### 版本冲突 (Could not find gem 'jekyll ~> 5.0')
Jekyll 5.0 尚未发布，Gemfile 已更新为 `~> 4.3`。如遇到此错误，确认 Gemfile 内容正确。

## 调试建议

- 使用浏览器控制台查看 `localStorage` 中的 `preferred-theme` / `preferred-language` 以确认切换状态。
- 若 RSS/feed 插件报错，运行 `bundle exec jekyll doctor` 检查配置。
- 通过 `bundle exec jekyll build` 验证构建成功并检查 `_site/` 输出。
- Gems 安装在 `vendor/bundle/` 目录，如需重装可删除该目录后重新运行 `bundle install`。
