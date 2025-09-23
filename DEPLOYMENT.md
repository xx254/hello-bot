# Slack Bot 部署说明

## 🚀 部署步骤

### 1. 配置环境变量

创建 `.env` 文件并添加以下配置：

```bash
# Slack Bot Token (以 xoxb- 开头)
SLACK_BOT_TOKEN=xoxb-your-bot-token-here

# Slack App Token (以 xapp- 开头，用于 Socket Mode)
SLACK_APP_TOKEN=xapp-your-app-token-here
```

### 2. 获取 Slack Tokens

#### 获取 Bot Token (SLACK_BOT_TOKEN):
1. 访问 [Slack API Apps](https://api.slack.com/apps)
2. 选择你的 app 或创建新的 app
3. 进入 "OAuth & Permissions" 页面
4. 复制 "Bot User OAuth Token" (以 `xoxb-` 开头)

#### 获取 App Token (SLACK_APP_TOKEN):
1. 在同一个 app 页面，进入 "Basic Information"
2. 滚动到 "App-Level Tokens" 部分
3. 点击 "Generate Token and Scopes"
4. 添加 `connections:write` scope
5. 复制生成的 token (以 `xapp-` 开头)

### 3. 配置 Socket Mode
1. 在 app 设置中，进入 "Socket Mode"
2. 启用 Socket Mode

### 4. 配置 Bot 权限
确保你的 bot 具有以下权限（在 "OAuth & Permissions" > "Scopes" 中设置）：
- `app_mentions:read` - 读取提及
- `channels:history` - 读取频道历史
- `chat:write` - 发送消息
- `im:history` - 读取直接消息历史
- `im:write` - 发送直接消息

### 5. 启动 Bot

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

## ✨ 功能说明

这个 bot 现在支持基础的英文对话功能：

### 支持的对话类型：
- **问候语**: hello, hi, hey, good morning 等
- **状态询问**: how are you, what's up, how's it going 等  
- **感谢**: thank you, thanks, appreciate 等
- **道别**: bye, goodbye, see you, take care 等
- **询问身份**: what's your name, who are you 等
- **询问能力**: what can you do, help me 等
- **天气话题**: weather, sunny, rainy 等
- **时间话题**: time, date, today 等

### 使用方式：
1. **直接消息 (DM)**: 直接给 bot 发送任何英文消息
2. **频道中提及**: 在频道中 @bot 并发送消息

### 示例对话：
```
用户: Hello!
Bot: Hi there! What can I do for you?

用户: How are you doing?
Bot: I'm doing great, thank you for asking! How about you?

用户: What can you do?
Bot: I can have basic conversations with you in English! Feel free to ask me anything or just chat.
```

## 🔧 故障排除

如果 bot 无法启动，请检查：
1. `.env` 文件是否存在且包含正确的 tokens
2. Socket Mode 是否已启用
3. Bot 权限是否正确配置
4. App token 是否包含 `connections:write` scope
