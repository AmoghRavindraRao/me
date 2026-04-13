import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  type?: string;
  robots?: string;
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSEO({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'https://amogh-portfolio.pages.dev';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.svg`;

export function SEO({
  title = 'Amogh Ravindra Rao - ML Engineer & Data Scientist',
  description = 'Personal portfolio of Amogh Ravindra Rao - ML Engineer and Data Scientist. ASU Master\'s student. Showcasing ML projects, skills, and experience.',
  pathname = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index, follow',
  article
}: SEOProps) {
  const canonicalUrl = `${BASE_URL}${pathname}`;
  const isNoIndex = robots.includes('noindex');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {!isNoIndex && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Amogh Ravindra Rao Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={image !== DEFAULT_IMAGE ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@amoghrrao" />

      {/* Article-specific OG tags */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.tags?.map((tag, index) => <meta key={`tag-${index}-${tag}`} property="article:tag" content={tag} />)}

      {/* Additional SEO */}
      <meta name="author" content="Amogh Ravindra Rao" />
      <meta name="robots" content={robots} />
      {!isNoIndex && <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />}
    </Helmet>
  );
}

// Pre-configured SEO for specific routes
export const HomeSEO = () => (
  <>
    <SEO
      title="Amogh Ravindra Rao - ML Engineer & Data Scientist | ASU"
      description="ML Engineer and Data Scientist with ASU Master's degree. Experience with machine learning, data science, and AI projects. Building intelligent systems."
      pathname="/"
    />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Amogh Ravindra Rao",
        "url": "https://amogh-portfolio.pages.dev",
        "email": "amoghravindrarao@gmail.com",
        "image": "https://amogh-portfolio.pages.dev/og-image.png",
        "jobTitle": "ML Engineer / Data Scientist",
        "worksFor": { "@type": "Organization", "name": "DP World" },
        "affiliation": { "@type": "EducationalOrganization", "name": "Arizona State University", "sameAs": "https://www.asu.edu" },
        "alumniOf": { "@type": "EducationalOrganization", "name": "Arizona State University", "sameAs": "https://www.asu.edu" },
        "sameAs": [
          "https://github.com/AmoghRavindraRao",
          "https://linkedin.com/in/amoghrrao03"
        ],
        "knowsAbout": ["Machine Learning", "Data Science", "Python", "PyTorch", "React", "FastAPI", "Data Analysis", "AI", "Deep Learning", "Computer Vision"],
        "description": "ML Engineer and Data Scientist with ASU Master's degree. Experience in machine learning, predictive modeling, and data-driven solutions."
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Amogh Ravindra Rao Portfolio",
        "url": "https://amogh-portfolio.pages.dev",
        "description": "Personal portfolio of Amogh Ravindra Rao - ML Engineer and Data Scientist",
        "author": { "@type": "Person", "name": "Amogh Ravindra Rao" }
      })}</script>
    </Helmet>
  </>
);

export const AboutSEO = () => (
  <SEO
    title="About Amogh Ravindra Rao — ML Engineer & Data Scientist"
    description="About Amogh Ravindra Rao, ASU Master's student and ML Engineer. Passionate about machine learning, data science, and building intelligent systems."
    pathname="/about"
  />
);

export const SkillSEO = () => (
  <SEO
    title="Skills & Tech Stack | Amogh Ravindra Rao"
    description="ML Engineer and Data Scientist skilled in Python, PyTorch, FastAPI, React, and more. View my complete technical toolkit."
    pathname="/skill"
  />
);

export const BlogSEO = () => (
  <>
    <SEO
      title="Blog | Amogh Ravindra Rao"
      description="Technical articles and insights on machine learning, data science, and AI."
      pathname="/blog"
    />
    <BreadcrumbSEO items={[
      { name: "Home", url: BASE_URL },
      { name: "Blog", url: `${BASE_URL}/blog` }
    ]} />
  </>
);

export interface BlogPostSEOProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
}

export const BlogPostSEO = ({ title, description, slug, publishedAt, coverImage, tags }: BlogPostSEOProps) => (
  <>
    <SEO
      title={`${title} | Amogh Ravindra Rao`}
      description={description}
      pathname={`/blog/${slug}`}
      image={coverImage}
      type="article"
      article={{
        publishedTime: publishedAt,
        author: 'Amogh Ravindra Rao',
        tags
      }}
    />
    <BreadcrumbSEO items={[
      { name: "Home", url: BASE_URL },
      { name: "Blog", url: `${BASE_URL}/blog` },
      { name: title, url: `${BASE_URL}/blog/${slug}` }
    ]} />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "url": `${BASE_URL}/blog/${slug}`,
        "datePublished": publishedAt,
        "author": { "@type": "Person", "name": "Amogh Ravindra Rao", "url": BASE_URL },
        ...(coverImage && { "image": coverImage }),
        "publisher": {
          "@type": "Person",
          "name": "Amogh Ravindra Rao",
          "url": BASE_URL
        }
      })}</script>
    </Helmet>
  </>
);

export const ToolboxSEO = () => (
  <SEO
    title="My Toolbox | Amogh Ravindra Rao"
    description="The software, hardware, and tools I use for machine learning and development."
    pathname="/toolbox"
  />
);

export const TimelineSEO = () => (
  <SEO
    title="Journey & Timeline | Amogh Ravindra Rao"
    description="A chronological log of my journey - from ASU Master's student to ML Engineer."
    pathname="/timeline"
  />
);

export const BooksSEO = () => (
  <SEO
    title="Reading List | Amogh Ravindra Rao"
    description="Books and resources on machine learning, data science, and AI."
    pathname="/books"
  />
);

export const SnippetsSEO = () => (
  <SEO
    title="Code Snippets | Amogh Ravindra Rao"
    description="Useful code snippets and templates for machine learning and data science."
    pathname="/snippets"
  />
);

export const ChatSEO = () => (
  <SEO
    title="Chat with AI Amogh | Amogh Ravindra Rao"
    description="Chat with an AI version of me. Ask about my machine learning projects, skills, or just say hi!"
    pathname="/chat"
    robots="noindex, nofollow"
  />
);

export const NotFoundSEO = () => (
  <SEO
    title="404 - Page Not Found | Amogh Ravindra Rao"
    description="The page you're looking for doesn't exist."
    pathname=""
    robots="noindex, follow"
  />
);
