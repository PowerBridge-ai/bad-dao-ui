import { PlatformDefinition, PlatformCategory, PriorityLevel, ScraperEngine } from '../types';

export const platforms: PlatformDefinition[] = [
  // Social Media Platforms
  {
    id: 'twitter',
    name: 'Twitter',
    category: PlatformCategory.SocialMedia,
    priority: PriorityLevel.High,
    url: 'https://twitter.com',
    loginUrl: 'https://twitter.com/login',
    forgotPasswordUrl: 'https://twitter.com/account/begin_password_reset',
    emailFieldSelector: 'input[name="text"]',
    submitButtonSelector: 'div[role="button"][data-testid="LoginForm_Login_Button"]',
    responseSelectors: {
      success: '[data-testid="LoginForm_Login_Button"]',
      notFound: '[data-testid="error-message"]'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: PlatformCategory.SocialMedia,
    priority: PriorityLevel.High,
    url: 'https://linkedin.com',
    loginUrl: 'https://www.linkedin.com/login',
    forgotPasswordUrl: 'https://www.linkedin.com/checkpoint/rp/request-password-reset',
    emailFieldSelector: '#username',
    submitButtonSelector: 'button[type="submit"]',
    responseSelectors: {
      success: '.password-reset-form',
      notFound: '.form__error--is-show'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: PlatformCategory.SocialMedia,
    priority: PriorityLevel.High,
    url: 'https://facebook.com',
    loginUrl: 'https://www.facebook.com/login',
    forgotPasswordUrl: 'https://www.facebook.com/login/identify',
    emailFieldSelector: '#identify_email',
    submitButtonSelector: '#did_submit',
    responseSelectors: {
      success: '#reset_password_form',
      notFound: '.pam.login_error_box'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: PlatformCategory.SocialMedia,
    priority: PriorityLevel.High,
    url: 'https://instagram.com',
    loginUrl: 'https://www.instagram.com/accounts/login',
    forgotPasswordUrl: 'https://www.instagram.com/accounts/password/reset',
    emailFieldSelector: 'input[name="cppEmailOrUsername"]',
    submitButtonSelector: 'button[type="submit"]',
    responseSelectors: {
      success: '.EBGLq',
      notFound: '.eiCW-'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  
  // Development Platforms
  {
    id: 'github',
    name: 'GitHub',
    category: PlatformCategory.Development,
    priority: PriorityLevel.Critical,
    url: 'https://github.com',
    loginUrl: 'https://github.com/login',
    forgotPasswordUrl: 'https://github.com/password_reset',
    emailFieldSelector: '#email_field',
    submitButtonSelector: '[type="submit"]',
    responseSelectors: {
      success: '.password-reset',
      notFound: '.js-flash-alert'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: PlatformCategory.Development,
    priority: PriorityLevel.Critical,
    url: 'https://gitlab.com',
    loginUrl: 'https://gitlab.com/users/sign_in',
    forgotPasswordUrl: 'https://gitlab.com/users/password/new',
    emailFieldSelector: '#user_email',
    submitButtonSelector: '[name="commit"]',
    responseSelectors: {
      success: '.flash-notice',
      notFound: '.flash-alert'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    category: PlatformCategory.Development,
    priority: PriorityLevel.Critical,
    url: 'https://bitbucket.org',
    loginUrl: 'https://bitbucket.org/account/signin',
    forgotPasswordUrl: 'https://bitbucket.org/account/password/reset',
    emailFieldSelector: '#id_email',
    submitButtonSelector: '[type="submit"]',
    responseSelectors: {
      success: '.aui-message-success',
      notFound: '.aui-message-error'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  
  // Web Infrastructure
  {
    id: 'namecheap',
    name: 'Namecheap',
    category: PlatformCategory.WebInfrastructure,
    priority: PriorityLevel.Critical,
    url: 'https://www.namecheap.com',
    loginUrl: 'https://www.namecheap.com/myaccount/login/',
    forgotPasswordUrl: 'https://www.namecheap.com/myaccount/forgot-password',
    emailFieldSelector: '#EmailAddress',
    submitButtonSelector: '[type="submit"]',
    responseSelectors: {
      success: '.forgot-password-success',
      notFound: '.field-validation-error'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'aws',
    name: 'AWS',
    category: PlatformCategory.WebInfrastructure,
    priority: PriorityLevel.Critical,
    url: 'https://aws.amazon.com',
    loginUrl: 'https://signin.aws.amazon.com',
    forgotPasswordUrl: 'https://signin.aws.amazon.com/forgotpassword',
    emailFieldSelector: '#aws-signin-general-user-email-input',
    submitButtonSelector: '#next_button',
    responseSelectors: {
      success: '.awsui-form-field-success',
      notFound: '.awsui-form-field-error'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  
  // Email & Communication
  {
    id: 'gmail',
    name: 'Gmail',
    category: PlatformCategory.EmailCommunication,
    priority: PriorityLevel.High,
    url: 'https://mail.google.com',
    loginUrl: 'https://accounts.google.com/signin',
    forgotPasswordUrl: 'https://accounts.google.com/signin/recovery',
    emailFieldSelector: '#identifierId',
    submitButtonSelector: '#identifierNext',
    responseSelectors: {
      success: '#passwordNext',
      notFound: '#view_container'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'discord',
    name: 'Discord',
    category: PlatformCategory.EmailCommunication,
    priority: PriorityLevel.High,
    url: 'https://discord.com',
    loginUrl: 'https://discord.com/login',
    forgotPasswordUrl: 'https://discord.com/login',
    emailFieldSelector: 'input[name="email"]',
    submitButtonSelector: 'button[type="submit"]',
    responseSelectors: {
      success: '.mainLoginContainer',
      notFound: '.errorMessage'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'slack',
    name: 'Slack',
    category: PlatformCategory.EmailCommunication,
    priority: PriorityLevel.High,
    url: 'https://slack.com',
    loginUrl: 'https://slack.com/signin',
    forgotPasswordUrl: 'https://slack.com/forgot',
    emailFieldSelector: '#email',
    submitButtonSelector: '#submit_btn',
    responseSelectors: {
      success: '.password_form',
      notFound: '.c-alert.c-alert--error'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  
  // Web3 Platforms
  {
    id: 'opensea',
    name: 'OpenSea',
    category: PlatformCategory.Web3Platforms,
    priority: PriorityLevel.Medium,
    url: 'https://opensea.io',
    loginUrl: 'https://opensea.io/login',
    forgotPasswordUrl: 'https://opensea.io/account/settings',
    emailFieldSelector: 'input[name="email"]',
    submitButtonSelector: 'button[type="submit"]',
    responseSelectors: {
      success: '.success-message',
      notFound: '.error-message'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  
  // Business Services
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: PlatformCategory.BusinessServices,
    priority: PriorityLevel.Medium,
    url: 'https://salesforce.com',
    loginUrl: 'https://login.salesforce.com',
    forgotPasswordUrl: 'https://login.salesforce.com/secur/forgotpassword.jsp',
    emailFieldSelector: '#un',
    submitButtonSelector: '#forgotPassForm input[type="submit"]',
    responseSelectors: {
      success: '.forgotSuccess',
      notFound: '.loginError'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: PlatformCategory.BusinessServices,
    priority: PriorityLevel.Medium,
    url: 'https://hubspot.com',
    loginUrl: 'https://app.hubspot.com/login',
    forgotPasswordUrl: 'https://app.hubspot.com/login/forgot',
    emailFieldSelector: '#email',
    submitButtonSelector: 'button[type="submit"]',
    responseSelectors: {
      success: '.password-reset-success',
      notFound: '.password-reset-error'
    },
    recommendedEngine: ScraperEngine.Playwright
  },
  {
    id: 'jira',
    name: 'Jira',
    category: PlatformCategory.BusinessServices,
    priority: PriorityLevel.Medium,
    url: 'https://www.atlassian.com/software/jira',
    loginUrl: 'https://id.atlassian.com/login',
    forgotPasswordUrl: 'https://id.atlassian.com/forgotpassword',
    emailFieldSelector: '#username',
    submitButtonSelector: '#login-submit',
    responseSelectors: {
      success: '.forgotpassword-confirmation',
      notFound: '.error-message'
    },
    recommendedEngine: ScraperEngine.Playwright
  }
];

export const getPlatformById = (id: string): PlatformDefinition | undefined => {
  return platforms.find(platform => platform.id === id);
};

export const getPlatformsByCategory = (category: PlatformCategory): PlatformDefinition[] => {
  return platforms.filter(platform => platform.category === category);
};

export const getPlatformsByPriority = (priority: PriorityLevel): PlatformDefinition[] => {
  return platforms.filter(platform => platform.priority === priority);
}; 