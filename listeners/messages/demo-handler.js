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
      
      // 不再发送主消息，直接发送测试建议卡片
      logger.info('开始发送测试建议卡片');
      
      // 发送4个独立的测试建议卡片
      const testSuggestions = [
        {
          title: "Whether Traffic campaigns add incremental conversions beyond Conversion-only campaigns",
          insight: "72% of your budget is on Traffic ads",
          suggestion: "Test whether Traffic campaigns add incremental conversions beyond Conversion-only campaigns",
          icon: "🎯",
          priority: "HIGH",
          hypothesis: "Traffic campaigns lift ≥ +15% conversions vs Conversion-only",
          testGroup: "Traffic + Conversion campaigns",
          controlGroup: "Conversion-only campaigns",
          duration: "45 days",
          budget: "$75k Test / $75k Control",
          metrics: "Incremental Conversions, Cost per Incremental Conversion, ROAS Lift"
        },
        {
          title: "Whether Meta ads drive incremental lift in Tier 1 but not Tier 2", 
          insight: "Your Meta spend is concentrated in Tier 1 cities",
          suggestion: "Test whether Meta ads drive incremental lift in Tier 1 but not Tier 2",
          icon: "🏙️",
          priority: "MEDIUM",
          hypothesis: "Tier 1 cities lift ≥ +12%, Tier 2 cities lift ≤ +3%",
          testGroup: "Tier 1 cities (NYC, SF, LA, Chicago)",
          controlGroup: "Tier 2 cities (Austin, Denver, Portland, Nashville)",
          duration: "35 days",
          budget: "$60k Test / $60k Control",
          metrics: "Incremental Conversions by Tier, Geographic Lift, Revenue per City"
        },
        {
          title: "Whether cross-channel synergy (TikTok + Meta vs Meta alone) drives incremental lift",
          insight: "You're active on TikTok + Meta",
          suggestion: "Test cross-channel synergy (TikTok + Meta vs Meta alone)",
          icon: "🔗",
          priority: "MEDIUM",
          hypothesis: "Cross-channel synergy lift ≥ +20% vs Meta-only",
          testGroup: "TikTok + Meta campaigns",
          controlGroup: "Meta-only campaigns",
          duration: "40 days",
          budget: "$80k Test / $40k Control",
          metrics: "Cross-channel Attribution, Synergy Lift, Combined ROAS"
        },
        {
          title: "Whether Brand ads indirectly lift search conversions",
          insight: "Brand ads account for 18% of your spend", 
          suggestion: "Test if Brand ads indirectly lift search conversions",
          icon: "🏷️",
          priority: "LOW",
          hypothesis: "Brand campaigns lift search conversions ≥ +8%",
          testGroup: "Brand + Search campaigns",
          controlGroup: "Search-only campaigns",
          duration: "30 days",
          budget: "$50k Test / $50k Control",
          metrics: "Search Conversion Lift, Brand Halo Effect, Total ROAS"
        }
      ];
      
      // 发送每个测试建议作为独立卡片
      for (let i = 0; i < testSuggestions.length; i++) {
        const suggestion = testSuggestions[i];
        // 设置优先级颜色和标签
        const priorityConfig = {
          "HIGH": { color: "🔴", label: "HIGH PRIORITY" },
          "MEDIUM": { color: "🟡", label: "MEDIUM PRIORITY" },
          "LOW": { color: "🟢", label: "LOW PRIORITY" }
        };
        
        const suggestionCard = {
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: `${suggestion.icon} Suggested Test:`
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${suggestion.title}*`
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Because we noticed:*\n${suggestion.insight}`
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `${priorityConfig[suggestion.priority].color} *${priorityConfig[suggestion.priority].label}*`
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
                  text: `🎯 *Hypothesis:* ${suggestion.hypothesis}`
                },
                {
                  type: "mrkdwn",
                  text: `📍 *Groups:*\n• Test = ${suggestion.testGroup}\n• Control = ${suggestion.controlGroup}`
                }
              ]
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `⏱ *Duration:* ${suggestion.duration}`
                },
                {
                  type: "mrkdwn",
                  text: `💰 *Budget:* ${suggestion.budget}`
                }
              ]
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `📈 *Metrics:* ${suggestion.metrics}`
              }
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
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "✅ Confirm & Launch"
                  },
                  action_id: `confirm_test_${i+1}`,
                  style: "primary"
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text", 
                    text: "🎯 Select/Modify Hypothesis"
                  },
                  action_id: `modify_hypothesis_${i+1}`
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text", 
                    text: "📖 View Full Design"
                  },
                  action_id: `view_design_${i+1}`
                }
              ]
            }
          ]
        };
        
        // 延迟发送每个卡片，避免消息堆叠
        setTimeout(async () => {
          try {
            // 发送卡片并获取时间戳
            const cardResult = await say(suggestionCard);
            logger.info(`发送了测试建议卡片 ${i+1}: ${suggestion.title}`);
            
            // 为每个卡片创建独立的thread
            const cardThreadMessage = {
              thread_ts: cardResult.ts,
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
                    text: `4. ❤️ Based on your data, we suggest running ${suggestion.title}:\n\`\`\`${suggestion.suggestion}\`\`\``
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
                }
              ]
            };
            
            // 延迟发送thread消息
            setTimeout(async () => {
              try {
                await say(cardThreadMessage);
                logger.info(`发送了卡片 ${i+1} 的thread消息`);
              } catch (threadError) {
                logger.error(`发送卡片 ${i+1} thread失败:`, threadError);
              }
            }, 500); // 卡片发送后0.5秒发送thread
            
          } catch (error) {
            logger.error(`发送测试建议卡片 ${i+1} 失败:`, error);
          }
        }, (i + 1) * 5000); // 每5秒发送一张卡片
      }
      
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
