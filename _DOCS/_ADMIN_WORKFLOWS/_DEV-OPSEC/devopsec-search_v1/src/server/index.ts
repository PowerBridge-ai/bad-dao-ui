import express, { Request, Response } from 'express';
import path from 'path';
import { ControllerService } from '../services/controller';
import { VerificationRequest, PlatformDefinition } from '../types';

const app = express();
const port = process.env.PORT || 3001;

// Create controller instance
const controller = new ControllerService();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../build')));

// Initialize controller when server starts
(async () => {
  try {
    await controller.initialize();
    console.log('Controller initialized successfully');
  } catch (error) {
    console.error('Failed to initialize controller:', error);
  }
})();

// API Routes

/**
 * Get all available platforms
 */
app.get('/api/platforms', (req: Request, res: Response) => {
  try {
    const platforms = controller.getAllPlatforms();
    res.json({ success: true, data: platforms });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: (error as Error).message 
    });
  }
});

/**
 * Verify email on specified platforms
 */
app.post('/api/verify', async (req: Request, res: Response) => {
  try {
    const verificationRequest: VerificationRequest = req.body;
    
    // Validate request
    if (!verificationRequest.email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    // Process verification
    const results = await controller.verifyEmail(verificationRequest);
    
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * Store a cookie for a platform
 */
app.post('/api/cookies', (req: Request, res: Response) => {
  try {
    const { platformId, cookie } = req.body;
    
    // Validate request
    if (!platformId || !cookie) {
      return res.status(400).json({
        success: false,
        error: 'Platform ID and cookie are required'
      });
    }
    
    // Store cookie
    controller.storeCookie(platformId, cookie);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * Generate report from results
 */
app.post('/api/report', (req: Request, res: Response) => {
  try {
    const { results, format, title } = req.body;
    
    // Validate request
    if (!results || !Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        error: 'Results array is required'
      });
    }
    
    // Update report format if specified
    if (format) {
      controller.updateSettings({ reportFormat: format });
    }
    
    // Generate report
    const report = controller.generateReport(results, title);
    
    if (format === 'excel' && report.excel) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=devopsec-search-report.xlsx');
      return res.send(report.excel);
    } else {
      res.json({ success: true, data: report });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * Update settings
 */
app.post('/api/settings', (req: Request, res: Response) => {
  try {
    const settings = req.body;
    
    // Update settings
    controller.updateSettings(settings);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle cleanup on shutdown
process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  await controller.cleanup();
  process.exit(0);
});

export default app; 