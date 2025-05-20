flowchart TD
    A[Identify Target Projects & Organizations] --> B[Extract Public Emails (e.g. grants@, support@)]
    B --> C[Research Key Contacts (LinkedIn, X.com, Websites)]
    C --> D[Match Contacts to Roles (e.g. DevRel, Marketing, BizDev)]
    D --> E[Create Contact Profiles (Name, Role, Email, Socials)]

    E --> F{Preferred Contact Path?}
    F -->|Known Individual| G[Send Personalized Email + BCC Team Email]
    F -->|Unknown Individual| H[DM on LinkedIn or X with Email Hook]
    H --> I[Prompt Contact to Reply or Initiate Email]
    I --> J[Response → Whitelisted from Spam]

    G --> K[Include Link to Google Form or Newsletter Signup]
    J --> K
    K --> L[Collect Contact Info + Consent to Email Updates]

    L --> M[Add to CRM & Segment (Sponsor, Grant, Hackathon, etc.)]
    M --> N[Send Targeted Campaigns with Updates, Offers, Alerts]

    style A fill:#e6f7ff,stroke:#007acc,stroke-width:2px
    style B fill:#fff2e6,stroke:#ff9900,stroke-width:2px
    style C fill:#e6ffe6,stroke:#33cc33,stroke-width:2px
    style D fill:#ccffcc,stroke:#009900,stroke-width:2px
    style E fill:#f0f0f0,stroke:#999999,stroke-width:1px
    style F fill:#ffffcc,stroke:#cccc00,stroke-width:2px
    style G fill:#e6e6ff,stroke:#6666cc,stroke-width:2px
    style H fill:#f9e6ff,stroke:#cc66cc,stroke-width:2px
    style I fill:#ffccff,stroke:#990099,stroke-width:2px
    style J fill:#ccf2ff,stroke:#0099cc,stroke-width:2px
    style K fill:#fff0f5,stroke:#cc3366,stroke-width:2px
    style L fill:#f2ffe6,stroke:#669900,stroke-width:2px
    style M fill:#e6ffe6,stroke:#00cc66,stroke-width:2px
    style N fill:#d9f2e6,stroke:#339966,stroke-width:2px
