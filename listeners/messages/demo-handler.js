import { getRandomDemoMessage, generateDemoMessages } from '../../utils/demo-data.js';

/**
 * 处理演示数据命令的回调函数
 * 当用户输入演示命令时，发送示例消息展示bot功能
 */
const demoCallback = async ({ message, say, logger }) => {
  try {
    const userMessage = message.text.toLowerCase();
    
    // 检查是否是演示命令
    if (!isDemoCommand(userMessage)) {
      return;
    }
    
    logger.info(`收到演示命令: "${userMessage}"`);
    
    // 根据命令类型发送不同的演示数据
    if (userMessage.includes('demo') || userMessage.includes('example') || userMessage.includes('show me')) {
      // 优先发送 Incrementality Test 演示消息
      const { incrementalityTests } = await import('../../utils/demo-data.js');
      const formatIncrementalityTest = (await import('../../utils/demo-data.js')).formatIncrementalityTest;
      
      // 选择第一个 Incrementality Test 作为主要演示
      const testData = incrementalityTests[0]; // 使用 Geo-Lift Test 作为主要演示
      const demoMessage = {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🔔 Incrementality Test"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `🚀 *${testData.title.replace('🚀 ', '')}*`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Experiment Objective*\n${testData.objective}`
            }
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Experiment Setup*"
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `🎯 *Hypothesis:* ${testData.hypothesis}`
              },
              {
                type: "mrkdwn",
                text: `📍 *Groups:*\n• Test = ${testData.testGroup}\n• Control = ${testData.controlGroup}`
              }
            ]
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `⏱ *Duration:* ${testData.duration}`
              },
              {
                type: "mrkdwn",
                text: `💰 *Budget:* ${testData.budget}`
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `📈 *Metrics:* ${testData.metrics}`
            }
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Next Steps*"
            }
          },
          {
            type: "actions",
            elements: testData.actions.map(action => ({
              type: "button",
              text: {
                type: "plain_text",
                text: action
              },
              action_id: `test_action_${action.replace(/[^a-zA-Z0-9]/g, '_')}`
            }))
          }
        ]
      };
      
      // 发送主消息并获取时间戳
      const mainMessageResult = await say(demoMessage);
      logger.info('发送了 Incrementality Test 演示消息');
      
      // 发送 thread 消息，包含详细的工作流程
      const threadMessage = {
        thread_ts: mainMessageResult.ts, // 使用主消息的时间戳作为thread
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Steps taken (8):*"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "1. 💡 Thought:\n```An incrementality test is needed, with the goal of verifying whether ads generate true incremental users.```"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "2. 🔍 Research/Input:\n```Data sources are already connected automatically (ad spend, conversions, geographic / audience splits).```"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "3. 💡 Thought:\n```Choose the experiment design method (e.g., geo-split holdout).```"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "4. ❤️ Hypothesis Generation:\n```The system generates a set of candidate hypotheses for the user to choose from:\n• Traffic campaigns add incremental conversions beyond conversions-only campaigns\n• Meta ads drive incremental lift in Tier 1 cities but not Tier 2\n• Cross-channel synergy: TikTok + Meta > Meta alone\n• Brand ads indirectly lift search conversions```"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "5. 💡 Thought:\n```Based on the selected hypothesis, the system automatically generates the experiment design.```"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "6. 📋 Playbook:\n```List out execution steps (grouping, experiment duration, data collection frequency, quality checks).```"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "7. 💡 Thought:\n```Automatically calculate sample size, statistical power, and minimum detectable effect (MDE).```"
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "8. 🔍 Research:\n```Continuous monitoring and analysis of test results to ensure statistical significance and actionable insights.```"
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "🎯 Select Hypothesis"
                },
                action_id: "open_hypothesis_modal"
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "➕ Suggest More"
                },
                action_id: "generate_more_hypotheses"
              }
            ]
          }
        ]
      };
      
      // 发送thread消息
      setTimeout(async () => {
        try {
          await say(threadMessage);
          logger.info('发送了 Incrementality Test workflow thread');
        } catch (error) {
          logger.error('发送thread消息失败:', error);
        }
      }, 1000); // 延迟1秒发送thread
      
    }
    
  } catch (error) {
    logger.error('演示数据处理出错:', error);
    
    try {
      await say('Sorry, I encountered an error while showing demo data. Please try again!');
    } catch (sayError) {
      logger.error('发送错误消息失败:', sayError);
    }
  }
};

/**
 * 检查是否是演示命令
 * @param {string} message - 用户消息
 * @returns {boolean} 是否是演示命令
 */
const isDemoCommand = (message) => {
  const demoKeywords = [
    'demo',
    'example',
    'show me what you can do',
    'what can you do'
  ];
  
  return demoKeywords.some(keyword => message.includes(keyword));
};

export { demoCallback };
