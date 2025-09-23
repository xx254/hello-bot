# Ad Incrementality Analysis Demo

This Slack app demonstrates an AI-powered ad incrementality analysis process with step-by-step user approval workflow.

## Features

### 🚀 Interactive Analysis Flow
- **8-step analysis process** based on the thought process diagram
- **Real-time user approval** for each analysis step
- **Mock data generation** for realistic demo experience
- **Interactive buttons** for approve/reject/skip actions

### 📊 Analysis Steps

1. **Data Audit** - Check data completeness, sample size, variance, and outliers
2. **Fit Check** - Analyze feasibility of different experimental designs (geo-lift, holdout, synthetic control)
3. **Hypothesis Framing** - Generate incrementality hypothesis in both Chinese and English
4. **Experiment Mapping** - Select appropriate test design based on platform capabilities
5. **Experiment Design** - Create detailed test plan with control/test groups, duration, and KPIs
6. **Measurement Strategy** - Choose causal inference method (DID, Bayesian lift, DAG-based)
7. **Run Analysis** - Generate incremental results with iROAS, p-value, and lift percentage
8. **Output** - Create executive summary, visualizations, and recommendations

### 🎯 Demo Capabilities

- **No backend required** - Pure frontend simulation
- **Realistic mock data** - Sample sizes, statistical metrics, revenue impact
- **User control** - Approve, reject, or skip any step
- **Progress tracking** - Visual progress indicator
- **Final report** - Comprehensive results summary

## How to Use

1. **Start the app** - Run `npm start` to launch the Slack app
2. **Open App Home** - Navigate to the app's home tab in Slack
3. **Upload Excel** - Click "Upload Excel File" to start the simulation
4. **Review Steps** - Go through each analysis step and review the details
5. **Make Decisions** - Approve, reject, or skip each step as needed
6. **View Results** - See the final analysis report and recommendations

## Technical Implementation

- **Slack Bolt Framework** - Built with @slack/bolt for easy Slack integration
- **Modular Architecture** - Clean separation of concerns with reusable components
- **State Management** - Tracks analysis progress and user decisions
- **Mock Data** - Realistic data generation for demo purposes
- **Error Handling** - Robust error handling and user feedback

## File Structure

```
listeners/
├── actions/
│   ├── analysis-actions.js    # Main analysis flow logic
│   └── index.js               # Action handlers registration
├── events/
│   └── app-home-opened.js     # Home tab UI
└── ...
```

## Customization

The demo can be easily customized by:
- Modifying the `analysisSteps` array in `analysis-actions.js`
- Adding new analysis steps or modifying existing ones
- Changing mock data values for different scenarios
- Customizing the UI blocks and messaging

## Next Steps

This demo can be extended to:
- Connect to real data sources
- Implement actual file upload functionality
- Add more sophisticated analysis algorithms
- Integrate with external analytics platforms
- Create automated report generation
