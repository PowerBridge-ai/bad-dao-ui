import * as XLSX from 'xlsx';
import json2md from 'json2md';
import { VerificationResult, VerificationStatus, GroupedResults } from '../types';

export class ReportGenerator {
  /**
   * Group verification results by status
   */
  groupResults(results: VerificationResult[]): GroupedResults {
    const grouped: GroupedResults = {
      confirmed: [],
      manualCheck: [],
      notFound: []
    };

    for (const result of results) {
      switch (result.status) {
        case VerificationStatus.Confirmed:
          grouped.confirmed.push(result);
          break;
        case VerificationStatus.ManualCheckRequired:
        case VerificationStatus.InProgress:
        case VerificationStatus.Error:
          grouped.manualCheck.push(result);
          break;
        case VerificationStatus.NotFound:
          grouped.notFound.push(result);
          break;
      }
    }

    return grouped;
  }

  /**
   * Generate Excel report
   */
  generateExcelReport(results: VerificationResult[]): Buffer {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet from JSON data
    const worksheet = XLSX.utils.json_to_sheet(
      results.map(result => ({
        Email: result.email,
        Platform: result.platform,
        Category: result.category,
        Status: result.status,
        Method: result.method || 'N/A',
        Timestamp: result.timestamp,
        Retries: result.retryCount,
        Flags: result.flags?.join(', ') || 'None',
        Notes: result.notes || ''
      }))
    );
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Verification Results');
    
    // Generate buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(results: VerificationResult[], title: string = 'DevOpSec Search Report'): string {
    // Get current date
    const date = new Date().toISOString().split('T')[0];
    
    // Group results by status
    const grouped = this.groupResults(results);
    
    // Organize first by email, then by status
    const emailGroups: { [email: string]: GroupedResults } = {};
    
    for (const result of results) {
      if (!emailGroups[result.email]) {
        emailGroups[result.email] = {
          confirmed: [],
          manualCheck: [],
          notFound: []
        };
      }
      
      switch (result.status) {
        case VerificationStatus.Confirmed:
          emailGroups[result.email].confirmed.push(result);
          break;
        case VerificationStatus.ManualCheckRequired:
        case VerificationStatus.InProgress:
        case VerificationStatus.Error:
          emailGroups[result.email].manualCheck.push(result);
          break;
        case VerificationStatus.NotFound:
          emailGroups[result.email].notFound.push(result);
          break;
      }
    }
    
    // Start building the markdown structure
    const mdContent: any[] = [
      { h1: `📊 ${title} - ${date}` }
    ];
    
    // Add section for each email
    for (const email in emailGroups) {
      mdContent.push({ h2: `📧 Email: ${email}` });
      
      // Add confirmed accounts
      if (emailGroups[email].confirmed.length > 0) {
        mdContent.push({ h3: '✅ Confirmed Accounts' });
        mdContent.push({
          table: {
            headers: ['Platform', 'Category', 'Method', 'Timestamp', 'Retries', 'Notes'],
            rows: emailGroups[email].confirmed.map(result => [
              result.platform,
              result.category,
              result.method || 'N/A',
              result.timestamp,
              result.retryCount.toString(),
              result.notes || '-'
            ])
          }
        });
      }
      
      // Add manual verification required
      if (emailGroups[email].manualCheck.length > 0) {
        mdContent.push({ h3: '❓ Manual Verification Required' });
        mdContent.push({
          table: {
            headers: ['Platform', 'Category', 'Timestamp', 'Retries', 'Flags', 'Notes'],
            rows: emailGroups[email].manualCheck.map(result => [
              result.platform,
              result.category,
              result.timestamp,
              result.retryCount.toString(),
              result.flags?.join(', ') || 'None',
              result.notes || '-'
            ])
          }
        });
      }
      
      // Add not found
      if (emailGroups[email].notFound.length > 0) {
        mdContent.push({ h3: '❌ Not Found' });
        mdContent.push({
          table: {
            headers: ['Platform', 'Category', 'Method', 'Timestamp', 'Retries', 'Notes'],
            rows: emailGroups[email].notFound.map(result => [
              result.platform,
              result.category,
              result.method || 'N/A',
              result.timestamp,
              result.retryCount.toString(),
              result.notes || '-'
            ])
          }
        });
      }
    }
    
    // Add summary
    mdContent.push({ h2: '📊 Summary' });
    
    const stats = Object.values(emailGroups).reduce(
      (acc, group) => {
        acc.total += group.confirmed.length + group.manualCheck.length + group.notFound.length;
        acc.confirmed += group.confirmed.length;
        acc.manualCheck += group.manualCheck.length;
        acc.notFound += group.notFound.length;
        return acc;
      },
      { total: 0, confirmed: 0, manualCheck: 0, notFound: 0 }
    );
    
    mdContent.push({
      ul: [
        `Total Platforms Checked: ${stats.total}`,
        `Confirmed Accounts: ${stats.confirmed}`,
        `Manual Verification Required: ${stats.manualCheck}`,
        `Not Found: ${stats.notFound}`
      ]
    });
    
    // Add signature
    mdContent.push({ p: '---' });
    mdContent.push({ p: 'Made with Power, Love, and AI • ⚡️❤️🤖 • POWERBRIDGE.AI' });
    
    // Convert to markdown string
    return json2md(mdContent);
  }
}

export default ReportGenerator; 