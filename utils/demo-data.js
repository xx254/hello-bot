// 演示数据生成器 - 展示bot功能的示例消息

/**
 * 生成随机演示数据来展示bot功能
 */

// Incrementality Test 示例数据
const incrementalityTests = [
  {
    title: "🚀 Geo-Lift Test Design Ready",
    objective: "Verify if Meta Ads brings true incremental conversions in Test regions",
    hypothesis: "Test group lift ≥ +8% conversions",
    testGroup: "NYC, Chicago, LA, SF",
    controlGroup: "Boston, Dallas, Houston, Miami",
    duration: "30 days",
    budget: "$50k Test / $50k Control",
    metrics: "Incremental Conversions, Revenue, iROAS",
    actions: ["✅ Confirm & Launch", "🎯 Select/Modify Hypothesis", "📖 View Full Design"]
  },
  {
    title: "📱 Mobile App Incrementality Test",
    objective: "Measure true incremental impact of Meta mobile campaigns",
    hypothesis: "Meta ads drive +12% incremental app installs",
    testGroup: "iOS users in CA, NY, TX",
    controlGroup: "iOS users in FL, WA, IL",
    duration: "21 days",
    budget: "$75k Test / $75k Control",
    metrics: "Incremental Installs, Cost Per Incremental Install, LTV",
    actions: ["🚀 Launch Test", "📊 View Analytics", "⚙️ Modify Settings"]
  },
  {
    title: "🛒 E-commerce Lift Test",
    objective: "Validate incremental revenue from retargeting campaigns",
    hypothesis: "Retargeting drives +15% incremental revenue",
    testGroup: "Retargeting enabled regions",
    controlGroup: "Retargeting holdout regions", 
    duration: "28 days",
    budget: "$100k Test / $100k Control",
    metrics: "Incremental Revenue, iROAS, Conversion Lift",
    actions: ["✅ 确认并启动", "🎯 选择/修改假设", "📖 查看完整设计"]
  }
];

// 业务分析示例数据
const businessAnalytics = [
  {
    title: "📈 Q4 Performance Dashboard",
    revenue: "$2.4M (+23% vs Q3)",
    conversions: "45,678 (+18% vs Q3)",
    topChannels: ["Meta Ads: 35%", "Google Ads: 28%", "Email: 22%", "Organic: 15%"],
    insights: ["Mobile traffic increased 40%", "Video ads outperform static by 25%", "Weekend conversions up 30%"]
  },
  {
    title: "🎯 Campaign Performance Alert",
    campaign: "Holiday Sale 2024",
    status: "⚠️ Needs Attention",
    spend: "$15,240 (85% of budget)",
    conversions: "342 (-12% vs target)",
    ctr: "2.8% (+0.5% vs avg)",
    recommendations: ["Increase budget by 20%", "Test new ad creative", "Expand to similar audiences"]
  }
];

// 项目更新示例数据
const projectUpdates = [
  {
    title: "🔧 Website Redesign Project",
    status: "In Progress (Week 3/8)",
    completed: ["✅ User research", "✅ Wireframes", "✅ Design mockups"],
    inProgress: ["🔄 Frontend development", "🔄 Content migration"],
    upcoming: ["📋 QA testing", "📋 Performance optimization", "📋 Launch preparation"],
    blockers: "Waiting for final brand assets from design team"
  }
];

// 会议和任务提醒
const meetingReminders = [
  {
    title: "📅 Upcoming Meeting Reminder",
    meeting: "Marketing Strategy Review",
    time: "Today at 2:00 PM",
    attendees: ["Sarah", "Mike", "Jennifer", "David"],
    agenda: ["Q4 campaign results", "2024 budget planning", "New channel opportunities"],
    location: "Conference Room B / Zoom"
  }
];

/**
 * 获取随机演示消息
 */
const getRandomDemoMessage = () => {
  const messageTypes = [
    () => formatIncrementalityTest(getRandomItem(incrementalityTests)),
    () => formatBusinessAnalytics(getRandomItem(businessAnalytics)),
    () => formatProjectUpdate(getRandomItem(projectUpdates)),
    () => formatMeetingReminder(getRandomItem(meetingReminders))
  ];
  
  const randomType = getRandomItem(messageTypes);
  return randomType();
};

/**
 * 格式化 Incrementality Test 消息 - 使用 Slack Block Kit 格式
 */
const formatIncrementalityTest = (test) => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🔔 Slack Message Example (Main Message Card)"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🚀 *${test.title.replace('🚀 ', '')}*`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*实验目标*\n${test.objective}`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*实验设置*"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `🎯 *假设:* ${test.hypothesis}`
          },
          {
            type: "mrkdwn",
            text: `📍 *分组:*\n• Test = ${test.testGroup}\n• Control = ${test.controlGroup}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `⏱ *周期:* ${test.duration}`
          },
          {
            type: "mrkdwn",
            text: `💰 *预算:* ${test.budget}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `📈 *指标:* ${test.metrics}`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*下一步*"
        }
      },
      {
        type: "actions",
        elements: test.actions.map(action => ({
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
};

/**
 * 格式化业务分析消息 - 使用 Slack Block Kit 格式
 */
const formatBusinessAnalytics = (analytics) => {
  if (analytics.revenue) {
    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📊 Business Analytics Dashboard"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${analytics.title}*`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Key Metrics*"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `💰 *Revenue:*\n${analytics.revenue}`
            },
            {
              type: "mrkdwn",
              text: `🎯 *Conversions:*\n${analytics.conversions}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Top Channels*\n${analytics.topChannels.map(channel => `• ${channel}`).join('\n')}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Key Insights*\n${analytics.insights.map(insight => `💡 ${insight}`).join('\n')}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "📈 View Full Report"
              },
              action_id: "view_report"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "📋 Export Data"
              },
              action_id: "export_data"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "⚙️ Customize Dashboard"
              },
              action_id: "customize_dashboard"
            }
          ]
        }
      ]
    };
  } else {
    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚨 Campaign Performance Alert"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${analytics.title}*\n\n*Campaign:* ${analytics.campaign}\n*Status:* ${analytics.status}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Current Performance*"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `💸 *Spend:*\n${analytics.spend}`
            },
            {
              type: "mrkdwn",
              text: `🎯 *Conversions:*\n${analytics.conversions}`
            },
            {
              type: "mrkdwn",
              text: `📈 *CTR:*\n${analytics.ctr}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Recommendations*\n${analytics.recommendations.map(rec => `• ${rec}`).join('\n')}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "🔧 Optimize Campaign"
              },
              action_id: "optimize_campaign"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "📊 View Details"
              },
              action_id: "view_details"
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "⏰ Set Alerts"
              },
              action_id: "set_alerts"
            }
          ]
        }
      ]
    };
  }
};

/**
 * 格式化项目更新消息 - 使用 Slack Block Kit 格式
 */
const formatProjectUpdate = (project) => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚧 Project Status Update"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${project.title}*\n*Status:* ${project.status}`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*✅ Completed Tasks*\n${project.completed.join('\n')}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🔄 In Progress*\n${project.inProgress.join('\n')}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📋 Upcoming*\n${project.upcoming.join('\n')}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*⚠️ Blockers*\n${project.blockers}`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "📅 Update Timeline"
            },
            action_id: "update_timeline"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "👥 Assign Tasks"
            },
            action_id: "assign_tasks"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "💬 Team Discussion"
            },
            action_id: "team_discussion"
          }
        ]
      }
    ]
  };
};

/**
 * 格式化会议提醒消息 - 使用 Slack Block Kit 格式
 */
const formatMeetingReminder = (meeting) => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📅 Meeting Reminder"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${meeting.meeting}*\n*Time:* ${meeting.time}\n*Location:* ${meeting.location}`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Attendees*\n${meeting.attendees.map(attendee => `• ${attendee}`).join('\n')}`
          },
          {
            type: "mrkdwn",
            text: `*Agenda*\n${meeting.agenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}`
          }
        ]
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "✅ Confirm Attendance"
            },
            action_id: "confirm_attendance"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "📋 Add Agenda Item"
            },
            action_id: "add_agenda"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "🔗 Join Meeting"
            },
            action_id: "join_meeting"
          }
        ]
      }
    ]
  };
};

/**
 * 获取随机数组项
 */
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 生成多条演示消息
 */
const generateDemoMessages = (count = 5) => {
  const messages = [];
  for (let i = 0; i < count; i++) {
    messages.push(getRandomDemoMessage());
  }
  return messages;
};

export {
  getRandomDemoMessage,
  generateDemoMessages,
  incrementalityTests,
  businessAnalytics,
  projectUpdates,
  meetingReminders
};
