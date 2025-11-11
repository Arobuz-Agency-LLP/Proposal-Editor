export interface Template {
  id: string
  name: string
  description: string
  content: string
}

export const templates: Template[] = [
  {
    id: "seo",
    name: "SEO Strategy Proposal",
    description: "Comprehensive SEO strategy template",
    content: `<h1>SEO Strategy Proposal</h1>
<p><strong>Client:</strong> {{client.name}}</p>
<p><strong>Project:</strong> {{project.title}}</p>
<p><strong>Budget:</strong> {{budget}}</p>
<p><strong>Timeline:</strong> {{timeline}}</p>

<h2>Executive Summary</h2>
<p>This proposal outlines our comprehensive SEO strategy to improve your online visibility and drive organic traffic to your website.</p>

<h2>Objectives</h2>
<ul>
  <li>Increase organic search traffic by 150%</li>
  <li>Improve keyword rankings for target keywords</li>
  <li>Enhance user experience and site performance</li>
</ul>

<h2>Deliverables</h2>
<ul>
  <li>{{deliverables}}</li>
  <li>Technical SEO audit and optimization</li>
  <li>Content strategy and creation</li>
  <li>Link building and outreach</li>
  <li>Monthly performance reporting</li>
</ul>

<h2>Timeline</h2>
<p>{{timeline}} engagement with monthly milestones and reviews.</p>

<h2>Investment</h2>
<p>Total project investment: {{budget}}</p>`,
  },
  {
    id: "web-design",
    name: "Web Design Proposal",
    description: "Website design and development template",
    content: `<h1>Web Design &amp; Development Proposal</h1>
<p><strong>Client:</strong> {{client.name}}</p>
<p><strong>Project:</strong> {{project.title}}</p>
<p><strong>Timeline:</strong> {{timeline}}</p>

<h2>Overview</h2>
<p>We propose to design and develop a modern, responsive website for {{client.name}} that will elevate your brand and drive business growth.</p>

<h2>Project Scope</h2>
<ul>
  <li>Responsive web design</li>
  <li>User experience optimization</li>
  <li>Content management system integration</li>
  <li>SEO optimization</li>
  <li>Performance optimization</li>
</ul>

<h2>Deliverables</h2>
<p>{{deliverables}}</p>

<h2>Timeline</h2>
<p>Project timeline: {{timeline}}</p>

<h2>Investment</h2>
<p>Total investment: {{budget}}</p>`,
  },
  {
    id: "marketing",
    name: "Marketing Campaign Proposal",
    description: "Digital marketing campaign template",
    content: `<h1>Digital Marketing Campaign Proposal</h1>
<p><strong>Client:</strong> {{client.name}}</p>
<p><strong>Campaign:</strong> {{project.title}}</p>

<h2>Executive Summary</h2>
<p>This proposal outlines a comprehensive digital marketing campaign designed to increase brand awareness and drive conversions for {{client.name}}.</p>

<h2>Campaign Strategy</h2>
<ul>
  <li>Social media marketing</li>
  <li>Email marketing</li>
  <li>Content marketing</li>
  <li>Paid advertising (PPC)</li>
  <li>Analytics and reporting</li>
</ul>

<h2>Key Metrics</h2>
<ul>
  <li>Increase brand awareness by 200%</li>
  <li>Generate {{deliverables}}</li>
  <li>Achieve 5%+ conversion rate</li>
</ul>

<h2>Investment</h2>
<p>Campaign budget: {{budget}}</p>
<p>Duration: {{timeline}}</p>`,
  },
  {
    id: "consulting",
    name: "Business Consulting Proposal",
    description: "General business consulting template",
    content: `<h1>Business Consulting Proposal</h1>
<p><strong>Client:</strong> {{client.name}}</p>
<p><strong>Project:</strong> {{project.title}}</p>

<h2>Introduction</h2>
<p>We are honored to propose our consulting services to {{client.name}}. Our team brings {{deliverables}} of industry expertise and a proven track record of success.</p>

<h2>Scope of Work</h2>
<p>Our engagement will include:</p>
<ul>
  <li>Initial assessment and analysis</li>
  <li>Strategy development</li>
  <li>Implementation support</li>
  <li>Training and knowledge transfer</li>
  <li>Ongoing support and optimization</li>
</ul>

<h2>Timeline</h2>
<p>Engagement duration: {{timeline}}</p>

<h2>Investment</h2>
<p>Consulting fee: {{budget}}</p>`,
  },
]

export const sampleTemplate = templates[0].content
