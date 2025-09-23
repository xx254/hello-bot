import { generateReply, shouldRespond } from '../../utils/conversation-utils.js';

/**
 * 处理英文对话的回调函数
 * @param {Object} param0 - Slack 事件参数
 * @param {Object} param0.message - 消息对象
 * @param {Function} param0.say - 回复函数
 * @param {Object} param0.logger - 日志记录器
 */
const conversationCallback = async ({ message, say, logger }) => {
  try {
    const userMessage = message.text;
    
    // 检查是否需要回复
    if (!shouldRespond(userMessage)) {
      return;
    }
    
    // 记录收到的消息
    logger.info(`收到用户消息: "${userMessage}"`);
    
    // 生成回复
    const reply = generateReply(userMessage);
    
    // 发送回复
    await say(reply);
    
    // 记录发送的回复
    logger.info(`发送回复: "${reply}"`);
    
  } catch (error) {
    logger.error('对话处理出错:', error);
    
    // 发送错误回复
    try {
      await say('Sorry, I encountered an error. Please try again!');
    } catch (sayError) {
      logger.error('发送错误回复失败:', sayError);
    }
  }
};

export { conversationCallback };
