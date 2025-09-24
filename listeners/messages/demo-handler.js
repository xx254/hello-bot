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
                    text: "✅ Confirm & Continue"
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
            
              // 为每个卡片创建独立的thread - 使用新的详细内容
              const threadContents = [
                // 卡片 1 - Traffic Campaign Test
                [
                  "💡 Thought\n```Traffic campaigns drive clicks, but in the post-ATT era many advertisers report inflated volumes with little incremental value.```",
                  "🔍 Research/Input\n```We noticed 72% of your budget is on Traffic campaigns. Regulators are also pressing platforms to prove true incremental value.``` <https://www.theverge.com/2023/9/12/23871444/google-antitrust-trial-doj-ad-tech|The Verge: Google DOJ ad-tech trial>",
                  "❤️ Based on your data + industry signals\n```👉 Hypothesis: Traffic + Conversion campaigns deliver ≥ +15% incremental conversions compared to Conversion-only.\nMeta recently leaned into AI-driven campaign automation, but Reddit's r/adops community is warning that Traffic campaigns act like \"cheap awareness.\"``` <https://www.reddit.com/r/adops/|Reddit r/adops>",
                  "💡 Thought\n```This test tells you if your largest budget line is truly incremental — or ripe for reallocation.```",
                  "📋 Playbook\n```Geo split Test = Traffic+Conversion vs Control = Conversion-only\n45-day run\nTrack Incremental Conversions, CPIC, ROAS Lift```",
                  "💡 Thought\n```$75k/$75k budget → Power ~80%, MDE ~8%.```",
                  "🔍 Research\n```If lift is weak, you'd mirror the trend of advertisers cutting \"vanity spend.\"``` <https://www.wsj.com/articles/the-ad-revolution-11234567890|WSJ: The Ad Revolution>"
                ],
                // 卡片 2 - Tier 1 vs Tier 2
                [
                  "💡 Thought\n```Tier 1 CPMs hit record highs. Adweek/Digiday report advertisers shifting into Tier 2/3 for efficiency.```",
                  "🔍 Research/Input\n```Your Meta spend is concentrated in Tier 1s. r/adtech discussions highlight \"Tier 1 saturation.\"```",
                  "❤️ Based on your data + market events\n```👉 Hypothesis: Tier 1 incremental lift ≥ +12%, Tier 2 ≤ +3%.\nThis echoes macro pressure: WPP's CEO stepped down under AI cost pressures and demand for efficiency.``` <https://www.theguardian.com/media/2023/sep/11/wpp-ceo-mark-read-steps-down|Guardian>",
                  "💡 Thought\n```This test tells you if you're overspending in costly Tier 1s.```",
                  "📋 Playbook\n```Tier 1 = Test, Tier 2 = Control\n35 days\nMetrics: Incremental conversions by tier, geo-ROAS```",
                  "💡 Thought\n```$60k/$60k → MDE ~10%.```",
                  "🔍 Research\n```If Tier 2 performs better, you'll follow brands diversifying spend under macroeconomic stress.```"
                ],
                // 卡片 3 - Cross-channel synergy
                [
                  "💡 Thought\n```TikTok faces political/regulatory uncertainty. Trump & Xi recently blessed a U.S. spin-off deal.``` <https://www.washingtonpost.com/technology/2023/09/15/tiktok-deal-trump-xi|Washington Post>",
                  "🔍 Research/Input\n```You're running TikTok + Meta, creating overlap for synergy testing.```",
                  "❤️ Based on your data + context\n```👉 Hypothesis: TikTok + Meta together deliver ≥ +20% incremental lift vs Meta-only.\nMeta is consolidating market share, even funding lobbying against regulation.``` <https://www.axios.com/2023/09/10/meta-super-pac-lobbying|Axios: Meta Super PAC>",
                  "💡 Thought\n```This test decides if TikTok is additive or just redundant amid policy risks.```",
                  "📋 Playbook\n```Test = TikTok+Meta; Control = Meta-only\n40 days\nMetrics: Synergy lift, combined ROAS```",
                  "💡 Thought\n```$80k/$40k → Power ~85%, MDE ~10%.```",
                  "🔍 Research\n```If synergy is weak, reallocating to Meta aligns with its regulatory strategy.```"
                ],
                // 卡片 4 - Brand Halo
                [
                  "💡 Thought\n```Google's attribution model updates & rising brand keyword CPCs have reignited halo debates.```",
                  "🔍 Research/Input\n```18% of your spend is Brand ads alongside Search. Many advertisers ask if this is just \"paying for your own traffic.\"```",
                  "❤️ Based on your data + industry chatter\n```👉 Hypothesis: Brand ads indirectly increase Search conversions ≥ +8%.\nThis is timely: Amazon is automating ad creation to grow ad sales, and Google faces DOJ scrutiny over ad-tech dominance. Both trends put pressure on proving brand-to-search value.``` <https://www.wsj.com/articles/amazon-ad-automation-11234567890|WSJ> | <https://www.theverge.com/2023/9/12/23871444/google-doj-antitrust-ad-tech|The Verge>",
                  "💡 Thought\n```The result will show if Brand spend expands funnel or just cannibalizes Search.```",
                  "📋 Playbook\n```Test = Brand+Search; Control = Search-only\n30 days\nMetrics: Search lift, halo effect, blended ROAS```",
                  "💡 Thought\n```$50k/$50k → MDE ~12%.```",
                  "🔍 Research\n```If halo is weak, you echo Adweek/StackAdapt commentary on reallocating Brand budgets.```"
                ]
              ];

              const cardThreadMessage = {
                thread_ts: cardResult.ts,
                blocks: threadContents[i].map(content => ({
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: content
                  }
                }))
              };
            
            // 延迟发送thread消息
            setTimeout(async () => {
              try {
                await say(cardThreadMessage);
                logger.info(`发送了卡片 ${i+1} 的thread消息`);
                
                // 获取测试类型信息
                const testTypes = [
                  "Traffic Campaign Test",
                  "Geographic Lift Test", 
                  "Cross-Channel Synergy Test",
                  "Brand Halo Effect Test"
                ];
                
                // 发送测试计划选择消息
                const testPlanMessage = {
                  thread_ts: cardResult.ts,
                  blocks: [
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `*Choose your testing plan (auto-generated):*\n*${testTypes[i]}*`
                      }
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: "🔹 *Conservative* → $25k / 25k, ROI ≥ 1.1x, MDE 15%, Power 70%"
                      },
                      accessory: {
                        type: "button",
                        text: {
                          type: "plain_text",
                          text: "Select"
                        },
                        action_id: `select_conservative_${i+1}`,
                        style: "primary"
                      }
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: "🔸 *Balanced* → $50k / 50k, ROI ≥ 1.2x, MDE 10%, Power 80%"
                      },
                      accessory: {
                        type: "button",
                        text: {
                          type: "plain_text",
                          text: "Select"
                        },
                        action_id: `select_balanced_${i+1}`,
                        style: "primary"
                      }
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: "🔺 *Aggressive* → $100k / 100k, ROI ≥ 1.3x, MDE 5%, Power 90%"
                      },
                      accessory: {
                        type: "button",
                        text: {
                          type: "plain_text",
                          text: "Select"
                        },
                        action_id: `select_aggressive_${i+1}`,
                        style: "primary"
                      }
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: "✏️ *Customize*"
                      },
                      accessory: {
                        type: "button",
                        text: {
                          type: "plain_text",
                          text: "Select"
                        },
                        action_id: `customize_plan_${i+1}`,
                        style: "primary"
                      }
                    }
                  ]
                };
                
                // 延迟发送测试计划消息
                setTimeout(async () => {
                  try {
                    await say(testPlanMessage);
                    logger.info(`发送了卡片 ${i+1} 的测试计划选择消息`);
                  } catch (planError) {
                    logger.error(`发送卡片 ${i+1} 测试计划失败:`, planError);
                  }
                }, 1000); // thread消息发送后1秒发送测试计划
                
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
    'what test should I run next',
    'example',
    'show me what you can do',
    'what can you do'
  ];
  
  return demoKeywords.some(keyword => message.includes(keyword));
};

/**
 * 处理测试确认按钮点击
 * @param {Object} param0 - Slack事件参数
 */
const handleTestConfirmation = async ({ ack, say, action, body }) => {
  await ack();
  
  try {
    // 从action_id中提取测试编号
    const testNumber = action.action_id.replace('confirm_test_', '');
    
    // 获取对应的测试信息
    const testSuggestions = [
      {
        title: "Whether Traffic campaigns add incremental conversions beyond Conversion-only campaigns",
        testType: "Traffic Campaign Test"
      },
      {
        title: "Whether Meta ads drive incremental lift in Tier 1 but not Tier 2", 
        testType: "Geographic Lift Test"
      },
      {
        title: "Whether cross-channel synergy (TikTok + Meta vs Meta alone) drives incremental lift",
        testType: "Cross-Channel Synergy Test"
      },
      {
        title: "Whether Brand ads indirectly lift search conversions",
        testType: "Brand Halo Effect Test"
      }
    ];
    
    const selectedTest = testSuggestions[parseInt(testNumber) - 1];
    
    // 在thread中发送测试计划选择消息
    const testPlanMessage = {
      thread_ts: body.message.ts, // 回复到原卡片的thread
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Choose your testing plan (auto-generated):*\n\n*${selectedTest.testType}*`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🔹 *Conservative* → $25k / 25k, ROI ≥ 1.1x, MDE 15%, Power 70%"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Conservative"
            },
            action_id: `select_conservative_${testNumber}`,
            style: "primary"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🔸 *Balanced* → $50k / 50k, ROI ≥ 1.2x, MDE 10%, Power 80%"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Balanced"
            },
            action_id: `select_balanced_${testNumber}`,
            style: "primary"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🔺 *Aggressive* → $100k / 100k, ROI ≥ 1.3x, MDE 5%, Power 90%"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Aggressive"
            },
            action_id: `select_aggressive_${testNumber}`,
            style: "primary"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "✏️ *Customize*"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Customize Plan"
            },
            action_id: `customize_plan_${testNumber}`
          }
        }
      ]
    };
    
    await say(testPlanMessage);
    logger.info(`发送了测试 ${testNumber} 的计划选择消息`);
    
  } catch (error) {
    logger.error('处理测试确认失败:', error);
    await say({
      thread_ts: body.message.ts,
      text: 'Sorry, there was an error processing your request. Please try again!'
    });
  }
};

/**
 * 处理thread中的确认按钮点击
 * @param {Object} param0 - Slack事件参数
 */
const handleThreadConfirmation = async ({ ack, say, action, body }) => {
  await ack();
  
  try {
    // 从action_id中提取测试编号
    const testNumber = action.action_id.replace('thread_confirm_test_', '');
    
    // 获取对应的测试信息
    const testSuggestions = [
      {
        title: "Whether Traffic campaigns add incremental conversions beyond Conversion-only campaigns",
        testType: "Traffic Campaign Test"
      },
      {
        title: "Whether Meta ads drive incremental lift in Tier 1 but not Tier 2", 
        testType: "Geographic Lift Test"
      },
      {
        title: "Whether cross-channel synergy (TikTok + Meta vs Meta alone) drives incremental lift",
        testType: "Cross-Channel Synergy Test"
      },
      {
        title: "Whether Brand ads indirectly lift search conversions",
        testType: "Brand Halo Effect Test"
      }
    ];
    
    const selectedTest = testSuggestions[parseInt(testNumber) - 1];
    
    // 在thread中发送测试计划选择消息
    const testPlanMessage = {
      thread_ts: body.message.thread_ts, // 保持在同一个thread中
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Choose your testing plan (auto-generated):*\n\n*${selectedTest.testType}*`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🔹 *Conservative* → $25k / 25k, ROI ≥ 1.1x, MDE 15%, Power 70%"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Conservative"
            },
            action_id: `select_conservative_${testNumber}`,
            style: "primary"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🔸 *Balanced* → $50k / 50k, ROI ≥ 1.2x, MDE 10%, Power 80%"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Balanced"
            },
            action_id: `select_balanced_${testNumber}`,
            style: "primary"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🔺 *Aggressive* → $100k / 100k, ROI ≥ 1.3x, MDE 5%, Power 90%"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Select Aggressive"
            },
            action_id: `select_aggressive_${testNumber}`,
            style: "primary"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "✏️ *Customize*"
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Customize Plan"
            },
            action_id: `customize_plan_${testNumber}`
          }
        }
      ]
    };
    
    await say(testPlanMessage);
    logger.info(`发送了测试 ${testNumber} 的thread计划选择消息`);
    
  } catch (error) {
    logger.error('处理thread确认失败:', error);
    await say({
      thread_ts: body.message.thread_ts,
      text: 'Sorry, there was an error processing your request. Please try again!'
    });
  }
};

export { demoCallback, handleTestConfirmation, handleThreadConfirmation };
