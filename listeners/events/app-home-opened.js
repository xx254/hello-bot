const appHomeOpenedCallback = async ({ client, event, logger }) => {
  // Ignore the `app_home_opened` event for anything but the Home tab
  if (event.tab !== 'home') return;

  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🚀 Ad Incrementality Analysis Demo',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Welcome, <@${event.user}>!*\n\nThis demo simulates an AI-powered ad incrementality analysis process. Upload an Excel file to see the complete thought process analysis.`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*📊 What This Demo Shows:*\n\n• Complete AI thought process for ad incrementality analysis\n• Step-by-step reasoning with realistic data\n• Business insights and recommendations\n• Interactive approval workflow for each step',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*📁 Upload Excel File to Start Analysis*',
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Upload Excel File',
              },
              action_id: 'upload_excel_file',
              style: 'primary',
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: '💡 This is a demo - no actual file upload required. Click the button to see the complete analysis.',
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

export { appHomeOpenedCallback };
