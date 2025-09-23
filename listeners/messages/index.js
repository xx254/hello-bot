import { sampleMessageCallback } from './sample-message.js';
import { conversationCallback } from './conversation-handler.js';

export const register = (app) => {
  // 原有的问候语处理（保留作为示例）
  app.message(/^(hi|hello|hey).*/, sampleMessageCallback);
  
  // 新的对话处理器 - 处理所有直接消息（DM）和提及bot的消息
  app.message(conversationCallback);
};
