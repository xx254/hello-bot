import { sampleActionCallback } from './sample-action.js';
import { 
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
} from './analysis-actions.js';

export const register = (app) => {
  app.action('sample_action_id', sampleActionCallback);
  app.action('upload_excel_file', uploadExcelFileCallback);
  app.action('approve_step', approveStepCallback);
  app.action('reject_step', rejectStepCallback);
  app.action('next_step', nextStepCallback);
  app.action('view_results', viewResultsCallback);
  app.action('download_report', downloadReportCallback);
  app.action('revise_approach', reviseApproachCallback);
  app.action('different_analysis', differentAnalysisCallback);
  app.action('skip_step', skipStepCallback);
  app.action('custom_feedback', customFeedbackCallback);
};
