const profileData = {
  work_experience: [
    {
      company: "AKT Web",
      title: "Freelance Web Developer",
      location: "Bangalore, India",
      dates: "January 2024 - February 2024",
      bullets: [
        "Revamped a legacy frontend for a retail client using React.js, delivering a responsive and user-centric interface that enhanced overall user experience and increased client engagement by 35%",
        "Improved site performance by implementing lazy loading and other optimization techniques, resulting in a 40% reduction in page load time",
        "Delivered timely maintenance and support, resolving 80% of reported issues within 24 hours to ensure consistent user experience and system stability"
      ]
    },
    {
      name: "Semiconductor Wafer Defect Detection",
      title: "Research / ML Project",
      company: "Independent / Research",
      dates: "January 2026 - May 2026",
      bullets: [
        "Designed a dual-model ensemble combining SmallViT and ResNet-18 trained under a hybrid Cross-Entropy and Supervised Contrastive Learning (SupCon) loss, achieving 0.9749 macro F1 and 97.50% accuracy on a 118,595-sample held-out test set across nine defect categories",
        "Developed a multi-criteria semi-supervised pseudo-labeling pipeline using five-signal acceptance gating to assign high-quality labels to 638,507 unlabeled wafer maps",
        "Conducted a comparative study between lightweight and full-capacity configurations, analyzing effects on class imbalance and representation collapse"
      ]
    },
    {
      name: "Healthcare Utilization and Diabetes Outcomes",
      title: "Data Visualization / Analyst",
      company: "Research Project",
      dates: "August 2025 - December 2025",
      bullets: [
        "Analyzed and visualized 101,766 inpatient encounters with 50 demographic, clinical, and medication attributes",
        "Designed 15 interconnected Tableau views with parameterized filters and calculated fields to identify readmission patterns",
        "Implemented interactive filters and dynamic drill-downs to support multi-stakeholder exploration for intervention targeting"
      ]
    },
    {
      name: "LLM Council with Similarity Analysis",
      title: "AI / Backend",
      company: "Personal / Research",
      dates: "January 2026 - February 2026",
      bullets: [
        "Built a multi-LLM council system that queried models in parallel with a chairman model to synthesize higher-quality final responses",
        "Applied sentence embeddings and cosine similarity to evaluate response relevance and quantify agreement",
        "Developed a FastAPI and React interface with streaming stages, heatmaps, and relevance charts"
      ]
    },
    {
      name: "F1 Race Prediction with Feedback Loop",
      title: "ML / Data",
      company: "Research",
      dates: "December 2025 - January 2026",
      bullets: [
        "Built an F1 race prediction pipeline integrating FastF1 telemetry and engineered performance features",
        "Trained models with uncertainty quantification (MC Dropout) to predict race times with confidence intervals",
        "Implemented a post-race feedback loop for incremental retraining via an experience replay buffer"
      ]
    },
    {
      name: "Hybrid Inpainting Data Analysis for 3D Meshes",
      title: "Research",
      company: "Personal / Research",
      dates: "January 2025 - May 2025",
      bullets: [
        "Developed a hybrid 3D inpainting system integrating diffusion models with NeRFs",
        "Generated corrupt mesh datasets and evaluated repair methods using Mean Surface Error and Hausdorff Distance",
        "Implemented reconstruction and evaluation pipelines for large-scale mesh datasets"
      ]
    },
    {
      name: "Modeling the S&P 500 with Linear Regression",
      title: "Data Science",
      company: "Personal",
      dates: "January 2025 - May 2025",
      bullets: [
        "Built predictive regression models on macroeconomic indicators to detect risk patterns",
        "Evaluated model accuracy via R-squared and RMSE and recommended non-linear approaches when necessary"
      ]
    },
    {
      name: "Distributed Online Gaming Platform",
      title: "Full-Stack",
      company: "Project",
      dates: "September 2024 - January 2025",
      bullets: [
        "Built and deployed a Dockerized service stack using Flask and MongoDB",
        "Processed BSON gameplay datasets to support data science use cases",
        "Standardized naming conventions and optimized schema design for better query performance"
      ]
    },
    {
      name: "Automatic Number Plate Detection",
      title: "Computer Vision",
      company: "Project",
      dates: "September 2023 - March 2024",
      bullets: [
        "Built an ANPR system using YOLOv8 and EasyOCR",
        "Integrated real-time video processing and OpenCV preprocessing for improved detection accuracy"
      ]
    },
    {
      name: "Catching Ball Game",
      title: "Computer Vision",
      company: "Project",
      dates: "March 2023 - June 2023",
      bullets: [
        "Developed interactive game with structured data logging from 100+ users",
        "Optimized rendering and scoring algorithms to improve engagement and frame rate"
      ]
    },
    {
      name: "Railway Reservation System",
      title: "Full-Stack",
      company: "Project",
      dates: "September 2022 - December 2022",
      bullets: [
        "Built a full-stack railway booking system with booking, cancellation, and admin role-based access",
        "Designed a normalized MySQL schema and secure authentication"
      ]
    }
  ]
};

export default profileData;
