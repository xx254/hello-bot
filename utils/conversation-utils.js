// 对话工具函数 - 处理基础英文对话逻辑

/**
 * 获取随机回复
 * @param {Array} replies - 回复数组
 * @returns {string} 随机选择的回复
 */
const getRandomReply = (replies) => {
  return replies[Math.floor(Math.random() * replies.length)];
};

/**
 * 检查消息是否包含特定关键词
 * @param {string} message - 用户消息
 * @param {Array} keywords - 关键词数组
 * @returns {boolean} 是否包含关键词
 */
const containsKeywords = (message, keywords) => {
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
};

/**
 * 预定义的对话模式和回复
 */
const conversationPatterns = {
  // 问候语
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    replies: [
      'Hello! How can I help you today?',
      'Hi there! What can I do for you?',
      'Hey! Nice to meet you!',
      'Hello! I\'m here to chat with you.',
      'Hi! How are you doing today?'
    ]
  },

  // 询问状态
  howAreYou: {
    keywords: ['how are you', 'how do you do', 'what\'s up', 'how\'s it going'],
    replies: [
      'I\'m doing great, thank you for asking! How about you?',
      'I\'m fantastic! Thanks for checking in. How are you?',
      'I\'m doing well! What about yourself?',
      'All good here! How has your day been?',
      'I\'m excellent! How are things with you?'
    ]
  },

  // 感谢
  thanks: {
    keywords: ['thank you', 'thanks', 'appreciate', 'grateful'],
    replies: [
      'You\'re very welcome!',
      'Happy to help!',
      'No problem at all!',
      'Glad I could assist!',
      'Anytime! Feel free to ask if you need anything else.'
    ]
  },

  // 道别
  goodbye: {
    keywords: ['bye', 'goodbye', 'see you', 'farewell', 'take care'],
    replies: [
      'Goodbye! Have a wonderful day!',
      'See you later! Take care!',
      'Bye! It was nice chatting with you!',
      'Farewell! Hope to talk again soon!',
      'Take care! Have a great day ahead!'
    ]
  },

  // 询问名字
  name: {
    keywords: ['what\'s your name', 'who are you', 'your name'],
    replies: [
      'I\'m your friendly Slack bot! You can just call me Bot.',
      'I\'m a helpful bot here to chat with you!',
      'I\'m your assistant bot. How can I help you today?',
      'I\'m just a friendly bot ready to have a conversation!'
    ]
  },

  // 询问能力
  capabilities: {
    keywords: ['what can you do', 'help me', 'your abilities', 'what do you know'],
    replies: [
      'I can have basic conversations with you in English! Feel free to ask me anything or just chat.',
      'I\'m here to chat! You can greet me, ask how I\'m doing, or just have a friendly conversation.',
      'I love having conversations! Try asking me questions or just say hello.',
      'I can chat about various topics and respond to your messages. What would you like to talk about?'
    ]
  },

  // 天气相关
  weather: {
    keywords: ['weather', 'sunny', 'rainy', 'cold', 'hot', 'temperature'],
    replies: [
      'I wish I could check the weather for you! What\'s it like where you are?',
      'Weather talk is always interesting! How\'s the weather treating you today?',
      'I don\'t have access to weather data, but I\'d love to hear about your local weather!',
      'Weather can really affect our mood, can\'t it? What\'s your favorite type of weather?'
    ]
  },

  // 时间相关
  time: {
    keywords: ['time', 'date', 'today', 'now', 'current'],
    replies: [
      'Time flies when you\'re having a good conversation! What are you up to today?',
      'I don\'t track time, but I hope you\'re having a productive day!',
      'Every moment is a good time for a chat! How has your day been so far?',
      'Time is precious - thanks for spending some of it chatting with me!'
    ]
  }
};

/**
 * 获取默认回复（当没有匹配到特定模式时）
 */
const defaultReplies = [
  'That\'s interesting! Tell me more about that.',
  'I see! What else would you like to chat about?',
  'Thanks for sharing that with me! Anything else on your mind?',
  'That sounds great! What else is happening with you?',
  'I appreciate you telling me that! What would you like to talk about next?',
  'Interesting perspective! I\'d love to hear more of your thoughts.',
  'That\'s cool! What else would you like to discuss?',
  'I hear you! Is there anything specific you\'d like to chat about?'
];

/**
 * 分析消息并生成合适的回复
 * @param {string} message - 用户消息
 * @returns {string} 生成的回复
 */
const generateReply = (message) => {
  // 遍历所有对话模式
  for (const [patternName, pattern] of Object.entries(conversationPatterns)) {
    if (containsKeywords(message, pattern.keywords)) {
      return getRandomReply(pattern.replies);
    }
  }
  
  // 如果没有匹配到特定模式，返回默认回复
  return getRandomReply(defaultReplies);
};

/**
 * 检查消息是否需要对话回复
 * @param {string} message - 用户消息
 * @returns {boolean} 是否需要回复
 */
const shouldRespond = (message) => {
  // 过滤掉太短的消息（可能是误触）
  if (message.trim().length < 2) {
    return false;
  }
  
  // 过滤掉明显的命令（以 / 开头）
  if (message.trim().startsWith('/')) {
    return false;
  }
  
  return true;
};

export {
  getRandomReply,
  containsKeywords,
  conversationPatterns,
  defaultReplies,
  generateReply,
  shouldRespond
};
