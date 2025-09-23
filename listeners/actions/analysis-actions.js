// Complete thought process steps with approval requirements
const thoughtProcessSteps = [
  {
    step: 1,
    icon: '💡',
    type: 'Thought',
    title: 'Thought:',
    description: 'Determined I need to analyze the uploaded ad data to evaluate incrementality potential, based on the 125K records and 15 data columns provided.',
    details: 'Initial assessment shows comprehensive dataset with campaign performance, geographic data, and conversion metrics across multiple channels.',
    requiresApproval: false
  },
  {
    step: 2,
    icon: '🔍',
    type: 'Research',
    title: 'Research:',
    description: 'Discovered the dataset contains Facebook, Google, and TikTok ad performance data across 30 states, with sufficient sample sizes for reliable geo-lift analysis.',
    details: 'Data quality assessment: 98.5% completeness, low variance (0.15), only 3.2% outliers. Sample size of 125K provides 80% statistical power for detection.',
    requiresApproval: false
  },
  {
    step: 3,
    icon: '💡',
    type: 'Thought',
    title: 'Thought:',
    description: 'Recognized that Facebook ads show the highest potential for incrementality testing based on consistent performance patterns and geographic distribution.',
    details: 'Facebook campaigns show 15% higher engagement rates and more stable conversion patterns compared to other platforms in the dataset.',
    requiresApproval: false
  },
  {
    step: 4,
    icon: '🎯',
    type: 'ICP Knowledge',
    title: 'ICP Knowledge:',
    description: 'Confirmed Facebook geo-lift test is optimal for this B2C e-commerce brand, with sufficient traffic in 15+ states for reliable control/test group matching.',
    details: 'Target audience aligns with Facebook demographics: 25-45 age group, urban/suburban areas, $50K+ household income. Geographic distribution supports geo-lift methodology.',
    requiresApproval: true,
    approvalMessage: 'Should I proceed with Facebook geo-lift test methodology?'
  },
  {
    step: 5,
    icon: '💡',
    type: 'Thought',
    title: 'Thought:',
    description: 'Formulated hypothesis that Facebook traffic ads in eastern regions can drive +12% incremental conversions based on historical performance patterns.',
    details: 'Hypothesis grounded in: (1) 18% higher CTR in eastern states, (2) 22% lower cost per acquisition, (3) consistent lift patterns in similar campaigns.',
    requiresApproval: true,
    approvalMessage: 'Do you approve this hypothesis for the incrementality test?'
  },
  {
    step: 6,
    icon: '📚',
    type: 'Playbook',
    title: 'Playbook:',
    description: 'Designed comprehensive geo-lift test with 15 test states vs 15 control states, 4-week duration, $50K budget, targeting 8-15% expected lift.',
    details: 'Test design includes: Matched market selection, statistical power analysis, KPI definition (conversion rate, revenue per user, ROAS), and measurement framework.',
    requiresApproval: true,
    approvalMessage: 'Should I proceed with this test design and budget allocation?'
  },
  {
    step: 7,
    icon: '💡',
    type: 'Thought',
    title: 'Thought:',
    description: 'Selected Difference-in-Differences (DID) methodology as most appropriate for geo-lift analysis, providing robust causal inference with pre/post period controls.',
    details: 'DID chosen over alternatives: More reliable than Bayesian lift for this sample size, more interpretable than DAG-based models for business stakeholders.',
    requiresApproval: false
  },
  {
    step: 8,
    icon: '📊',
    type: 'Research',
    title: 'Research:',
    description: 'Executed analysis revealing 12.3% incremental conversion lift with 2.4x iROAS, statistically significant (p=0.023) and $147K incremental revenue impact.',
    details: 'Key metrics: 95% confidence interval (8.1%-16.5%), consistent across all test states, no significant seasonality effects detected.',
    requiresApproval: false
  },
  {
    step: 9,
    icon: '💡',
    type: 'Thought',
    title: 'Thought:',
    description: 'Concluded that Facebook ads demonstrate strong incrementality with clear business impact, warranting immediate scaling to additional regions.',
    details: 'Business case: 2.4x ROAS exceeds 2.0x threshold, 12.3% lift exceeds 8% minimum viable lift, revenue impact justifies $200K+ additional investment.',
    requiresApproval: true,
    approvalMessage: 'Do you approve scaling Facebook ads to additional regions based on these results?'
  },
  {
    step: 10,
    icon: '✅',
    type: 'Action',
    title: 'Action:',
    description: 'Generated executive summary with key findings, revenue projections, and scaling recommendations for immediate implementation.',
    details: 'Deliverables: Executive dashboard, statistical report, creative optimization guide, and automated monitoring setup for ongoing measurement.',
    requiresApproval: false
  }
];

let analysisState = {
  isActive: false,
  showResults: false,
  currentStepIndex: 0,
  completedSteps: []
};

const uploadExcelFileCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    // Reset analysis state
    analysisState = {
      isActive: true,
      showResults: false,
      currentStepIndex: 0,
      completedSteps: []
    };

    // Start with first step
    await showCurrentStep(client, body.user.id);
  } catch (error) {
    logger.error(error);
  }
};

const approveStepCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    // Debug logging
    logger.info(`Approving step ${analysisState.currentStepIndex + 1}, current index: ${analysisState.currentStepIndex}`);
    
    // Mark current step as completed and move to next
    analysisState.completedSteps.push(analysisState.currentStepIndex);
    analysisState.currentStepIndex++;
    
    logger.info(`After approval - new index: ${analysisState.currentStepIndex}, total steps: ${thoughtProcessSteps.length}`);
    
    if (analysisState.currentStepIndex < thoughtProcessSteps.length) {
      await showCurrentStep(client, body.user.id);
    } else {
      // Analysis complete, show results
      await showFinalResults(client, body.user.id);
    }
  } catch (error) {
    logger.error(error);
  }
};

const rejectStepCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    const currentStep = thoughtProcessSteps[analysisState.currentStepIndex];
    
    // Get channel ID - try different sources
    const channelId = body.channel?.id || body.user?.id || 'general';
    
    // Post a message in the channel to create a thread
    const message = await client.chat.postMessage({
      channel: channelId,
      text: `🤔 Step ${analysisState.currentStepIndex + 1} Rejected - Let's discuss alternatives`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*❌ Step ${analysisState.currentStepIndex + 1} Rejected*\n\n*${currentStep.icon} ${currentStep.title}*\n\n${currentStep.description}\n\n_${currentStep.details}_`,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*🤔 What would you like me to do instead?*',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '🔄 Revise Approach',
              },
              action_id: 'revise_approach',
              style: 'primary',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📊 Different Analysis',
              },
              action_id: 'different_analysis',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '⏭️ Skip This Step',
              },
              action_id: 'skip_step',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '💬 Custom Feedback',
              },
              action_id: 'custom_feedback',
            },
          ],
        },
      ],
    });
    
    // Update home view to show rejection status
    await client.views.publish({
      user_id: body.user.id,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🚀 Ad Incrementality Analysis - Step ${analysisState.currentStepIndex + 1}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*❌ Step Rejected*\n\nI\'ve opened a discussion thread for this step. Please check the channel to provide feedback and choose how to proceed.',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Step ${currentStep.step}:*\n${currentStep.icon} *${currentStep.title}*\n\n${currentStep.description}\n\n_${currentStep.details}_`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Progress: ${analysisState.completedSteps.length}/${thoughtProcessSteps.length} steps completed`,
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }
};

const nextStepCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    // Mark current step as completed and move to next
    analysisState.completedSteps.push(analysisState.currentStepIndex);
    analysisState.currentStepIndex++;
    
    if (analysisState.currentStepIndex < thoughtProcessSteps.length) {
      await showCurrentStep(client, body.user.id);
    } else {
      // Analysis complete, show results
      await showFinalResults(client, body.user.id);
    }
  } catch (error) {
    logger.error(error);
  }
};

const showCurrentStep = async (client, userId) => {
  const currentStep = thoughtProcessSteps[analysisState.currentStepIndex];
  
  // Debug logging
  console.log(`Showing step - index: ${analysisState.currentStepIndex}, step number: ${currentStep?.step}, title: ${currentStep?.title}`);
  
  // Start with empty text for typewriter effect
  await client.views.publish({
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚀 Ad Incrementality Analysis - Step ${analysisState.currentStepIndex + 1}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*📁 Excel File Uploaded Successfully!*\n\nFile: `ad_data_2024.xlsx`\nSize: 2.3 MB\nRows: 125,000\nColumns: 15\n\n*AI is thinking...*',
          },
        },
        {
          type: 'divider',
        },
        ...generateInitialStepBlocks(currentStep),
      ],
    },
  });
  
  // Start typewriter effect
  await startTypewriterEffect(client, userId, currentStep);
};

const generateInitialStepBlocks = (currentStep) => {
  const blocks = [];
  
  // Show completed steps
  if (analysisState.completedSteps.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*✅ Completed Steps:*\n' + analysisState.completedSteps.map(stepIndex => {
          const step = thoughtProcessSteps[stepIndex];
          return `• Step ${step.step}: ${step.icon} ${step.title}\n  ${step.description}\n  _${step.details}_`;
        }).join('\n'),
      },
    });
    blocks.push({
      type: 'divider',
    });
  }
  
  // Show current step with typewriter effect
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Step ${currentStep.step}:*\n${currentStep.icon} *${currentStep.title}*\n\n*AI is thinking...*`,
    },
  });
  
  // Add progress indicator
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Progress: ${analysisState.completedSteps.length}/${thoughtProcessSteps.length} steps completed`,
      },
    ],
  });
  
  return blocks;
};

const startTypewriterEffect = async (client, userId, currentStep) => {
  const fullText = `${currentStep.description}\n\n_${currentStep.details}_`;
  const words = fullText.split(' ');
  let currentText = '';

  // Type out the text in chunks of 5 words for ultra-fast, smooth effect
  for (let i = 0; i < words.length; i += 5) {
    // Add 5 words at a time (or remaining words if less than 5 left)
    const wordsToAdd = words.slice(i, i + 5);
    currentText += (i === 0 ? '' : ' ') + wordsToAdd.join(' ');

    // Add blinking cursor effect
    const displayText = currentText + (i + 5 < words.length ? ' |' : '');

    await client.views.publish({
      user_id: userId,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🚀 Ad Incrementality Analysis - Step ${analysisState.currentStepIndex + 1}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*📁 Excel File Uploaded Successfully!*\n\nFile: `ad_data_2024.xlsx`\nSize: 2.3 MB\nRows: 125,000\nColumns: 15\n\n*AI is thinking...*',
            },
          },
          {
            type: 'divider',
          },
          ...generateCurrentStepBlocksWithTypewriter(currentStep, displayText),
        ],
      },
    });
    
    // Ultra-fast chunk typing: 40ms between 5-word chunks for very fast speed
    await new Promise(resolve => setTimeout(resolve, 40));
  }

  // After typing is complete, show the final step with appropriate actions
  await showFinalStepWithActions(client, userId, currentStep);
};

const generateCurrentStepBlocksWithTypewriter = (currentStep, currentText = '') => {
  const blocks = [];
  
  // Show completed steps
  if (analysisState.completedSteps.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*✅ Completed Steps:*\n' + analysisState.completedSteps.map(stepIndex => {
          const step = thoughtProcessSteps[stepIndex];
          return `• Step ${step.step}: ${step.icon} ${step.title}\n  ${step.description}\n  _${step.details}_`;
        }).join('\n'),
      },
    });
    blocks.push({
      type: 'divider',
    });
  }
  
  // Show current step with typewriter effect
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Step ${currentStep.step}:*\n${currentStep.icon} *${currentStep.title}*\n\n${currentText || '*AI is thinking...*'}`,
    },
  });
  
  // Add progress indicator
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Progress: ${analysisState.completedSteps.length}/${thoughtProcessSteps.length} steps completed`,
      },
    ],
  });
  
  return blocks;
};

const showFinalStepWithActions = async (client, userId, currentStep) => {
  const blocks = [];
  
  // Show completed steps
  if (analysisState.completedSteps.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*✅ Completed Steps:*\n' + analysisState.completedSteps.map(stepIndex => {
          const step = thoughtProcessSteps[stepIndex];
          return `• Step ${step.step}: ${step.icon} ${step.title}\n  ${step.description}\n  _${step.details}_`;
        }).join('\n'),
      },
    });
    blocks.push({
      type: 'divider',
    });
  }
  
  // Show current step
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Step ${currentStep.step}:*\n${currentStep.icon} *${currentStep.title}*\n\n${currentStep.description}\n\n_${currentStep.details}_`,
    },
  });
  
  // Add approval buttons if required
  if (currentStep.requiresApproval) {
    blocks.push({
      type: 'divider',
    });
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*🤔 ${currentStep.approvalMessage}*`,
      },
    });
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '✅ Approve & Continue',
          },
          action_id: 'approve_step',
          style: 'primary',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '❌ Reject & Revise',
          },
          action_id: 'reject_step',
          style: 'danger',
        },
      ],
    });
  } else {
    // Auto-advance after 3 seconds for non-approval steps
    blocks.push({
      type: 'divider',
    });
   
    
    
    // Auto-advance after 2 seconds for faster flow
    setTimeout(async () => {
      if (analysisState.currentStepIndex < thoughtProcessSteps.length) {
        analysisState.completedSteps.push(analysisState.currentStepIndex);
        analysisState.currentStepIndex++;
        if (analysisState.currentStepIndex < thoughtProcessSteps.length) {
          await showCurrentStep(client, userId);
        } else {
          await showFinalResults(client, userId);
        }
      }
    }, 2000);
  }
  
  // Add progress indicator
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Progress: ${analysisState.completedSteps.length}/${thoughtProcessSteps.length} steps completed`,
      },
    ],
  });
  
  await client.views.publish({
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚀 Ad Incrementality Analysis - Step ${analysisState.currentStepIndex + 1}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*📁 Excel File Uploaded Successfully!*\n\nFile: `ad_data_2024.xlsx`\nSize: 2.3 MB\nRows: 125,000\nColumns: 15\n\n*AI analysis complete*',
          },
        },
        {
          type: 'divider',
        },
        ...blocks,
      ],
    },
  });
};

const showFinalResults = async (client, userId) => {
  await client.views.publish({
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎉 Analysis Complete!',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*📊 Final Results*\n\n✅ All 10 steps completed successfully!\n\n*Key Findings:*\n• 12.3% incremental conversion lift\n• 2.4x iROAS (Incremental Return on Ad Spend)\n• Statistically significant (p=0.023)\n• $147,000 incremental revenue\n\n*Recommendation:* Scale Facebook ads to additional regions with similar targeting.',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*📈 Generated Reports:*\n• Executive Summary\n• Statistical Analysis Report\n• Revenue Impact Analysis\n• Recommendations for Scaling',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📊 View Detailed Results',
              },
              action_id: 'view_results',
              style: 'primary',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '🔄 Run New Analysis',
              },
              action_id: 'upload_excel_file',
            },
          ],
        },
      ],
    },
  });
};

const viewResultsCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    analysisState.showResults = true;
    
    await client.views.publish({
      user_id: body.user.id,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📊 Detailed Analysis Results',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*🎯 Executive Summary*\n\nFacebook geo-lift test demonstrates **12.3% incremental conversion lift** with **2.4x iROAS**, generating **$147,000 incremental revenue** over 4 weeks.',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*📈 Key Metrics*\n\n• **Incremental Lift:** 12.3% (95% CI: 8.1% - 16.5%)\n• **iROAS:** 2.4x (exceeds 2.0x threshold)\n• **Statistical Significance:** p = 0.023 (< 0.05)\n• **Revenue Impact:** $147,000 incremental\n• **Test Duration:** 28 days\n• **Sample Size:** 125,000 users per group',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*🎯 Test Design*\n\n• **Methodology:** Geo-lift test with Difference-in-Differences analysis\n• **Test Group:** 15 states with Facebook ads\n• **Control Group:** 15 matched states without ads\n• **Budget:** $50,000\n• **Platform:** Facebook (traffic campaigns)\n• **Targeting:** Eastern region, 25-45 age group',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*💡 Key Insights*\n\n• Facebook ads show consistent incrementality across all test states\n• Eastern region targeting outperforms other regions by 18%\n• No significant seasonality effects detected\n• Creative performance varies by state (optimization opportunity)\n• Cost per acquisition 22% lower in test states',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*🚀 Recommendations*\n\n1. **Immediate Scaling:** Expand to 10 additional states\n2. **Budget Increase:** Allocate $200K+ for next quarter\n3. **Creative Optimization:** Focus on top-performing creative formats\n4. **Automation:** Set up real-time monitoring dashboard\n5. **Testing:** Run similar tests on Google and TikTok',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '📋 Download Full Report',
                },
                action_id: 'download_report',
                style: 'primary',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '🔄 Run New Analysis',
                },
                action_id: 'upload_excel_file',
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }
};

const downloadReportCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    await client.views.publish({
      user_id: body.user.id,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📋 Report Generated Successfully',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*📊 Your analysis report is ready!*\n\n**Generated Files:**\n• Executive Summary (PDF)\n• Statistical Analysis Report (Excel)\n• Revenue Impact Dashboard (PowerBI)\n• Creative Performance Guide (PDF)\n• Implementation Roadmap (Word)',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*📧 Next Steps:*\n\n1. Reports have been sent to your email\n2. Schedule a meeting with the marketing team\n3. Set up automated monitoring dashboard\n4. Begin scaling to additional regions',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '🔄 Run New Analysis',
                },
                action_id: 'upload_excel_file',
                style: 'primary',
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }
};

// Thread action callbacks
const reviseApproachCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    // Mark current step as completed and move to next
    analysisState.completedSteps.push(analysisState.currentStepIndex);
    analysisState.currentStepIndex++;
    
    if (analysisState.currentStepIndex < thoughtProcessSteps.length) {
      await showCurrentStep(client, body.user.id);
    } else {
      await showFinalResults(client, body.user.id);
    }
    
    // Update the thread message
    const channelId = body.channel?.id || body.user?.id || 'general';
    await client.chat.postMessage({
      channel: channelId,
      thread_ts: body.message.ts,
      text: '✅ Approach revised and proceeding to next step!',
    });
  } catch (error) {
    logger.error(error);
  }
};

const differentAnalysisCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    // Mark current step as completed and move to next
    analysisState.completedSteps.push(analysisState.currentStepIndex);
    analysisState.currentStepIndex++;
    
    if (analysisState.currentStepIndex < thoughtProcessSteps.length) {
      await showCurrentStep(client, body.user.id);
    } else {
      await showFinalResults(client, body.user.id);
    }
    
    // Update the thread message
    const channelId = body.channel?.id || body.user?.id || 'general';
    await client.chat.postMessage({
      channel: channelId,
      thread_ts: body.message.ts,
      text: '📊 Switching to different analysis approach and proceeding to next step!',
    });
  } catch (error) {
    logger.error(error);
  }
};

const skipStepCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    // Mark current step as completed and move to next
    analysisState.completedSteps.push(analysisState.currentStepIndex);
    analysisState.currentStepIndex++;
    
    if (analysisState.currentStepIndex < thoughtProcessSteps.length) {
      await showCurrentStep(client, body.user.id);
    } else {
      await showFinalResults(client, body.user.id);
    }
    
    // Update the thread message
    const channelId = body.channel?.id || body.user?.id || 'general';
    await client.chat.postMessage({
      channel: channelId,
      thread_ts: body.message.ts,
      text: '⏭️ Step skipped and proceeding to next step!',
    });
  } catch (error) {
    logger.error(error);
  }
};

const customFeedbackCallback = async ({ ack, client, body, logger }) => {
  await ack();
  
  try {
    // Update the thread message to ask for custom feedback
    const channelId = body.channel?.id || body.user?.id || 'general';
    await client.chat.postMessage({
      channel: channelId,
      thread_ts: body.message.ts,
      text: '💬 Please provide your custom feedback in this thread. I\'ll incorporate your suggestions and proceed to the next step.',
    });
  } catch (error) {
    logger.error(error);
  }
};

export { 
  uploadExcelFileCallback, 
  approveStepCallback, 
  rejectStepCallback, 
  nextStepCallback, 
  viewResultsCallback, 
  downloadReportCallback,
  reviseApproachCallback,
  differentAnalysisCallback,
  skipStepCallback,
  customFeedbackCallback
};
