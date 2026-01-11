# Salahaddin University-Erbil Research Center (SURC)

A modern, responsive website for the Salahaddin University-Erbil Research Center built with Hugo and the Bigspring Light theme.

## Overview

This website showcases the research activities, publications, projects, datasets, staff, and units of SURC. The site is built using Hugo static site generator with a custom implementation based on the Bigspring Light theme.

## Features

- **Modern Design**: Clean, professional interface with custom color scheme (red primary, grey navigation)
- **Responsive Layout**: Fully responsive design that works on all devices
- **Content Management**: Folder-based content structure with individual markdown files for each entry
- **ID-Based Linking**: Content entries are linked using unique IDs for easy cross-referencing
- **Advanced Filtering**: Dynamic filtering on Publications, Projects, Staff, and Events pages
- **Calendar View**: Events page with list and calendar view options
- **Multiple Sections**:
  - Homepage with featured content
  - About SURC
  - Research Units
  - Projects & Programs
  - Publications (Articles, Theses, Reports)
  - Research Data Catalog
  - Staff/Researchers
  - Events
  - Testimonials
  - Contact & Resources
  - Regulations & Guidelines
  - Forms & Templates

## Technology Stack

- **Static Site Generator**: Hugo (v0.148.2+)
- **Theme**: Bigspring Light Hugo Theme (customized)
- **CSS Framework**: Bootstrap 5 (via theme)
- **Styling**: SCSS/CSS
- **JavaScript**: Vanilla JS for interactions and filtering
- **Deployment**: Netlify/Vercel compatible

## Project Structure

```
bigspring-light/
├── content/                 # Content files
│   ├── _index.md          # Homepage content
│   ├── about.md           # About page
│   ├── contact.md         # Contact page
│   ├── publications/      # Publications section
│   │   ├── _index.md
│   │   └── *.md          # Individual publication files
│   ├── projects/          # Projects section
│   │   ├── _index.md
│   │   └── *.md          # Individual project files
│   ├── datasets/          # Datasets section
│   │   ├── _index.md
│   │   └── *.md          # Individual dataset files
│   ├── units/             # Research units section
│   │   ├── _index.md
│   │   └── *.md          # Individual unit files
│   ├── staff/             # Staff/Researchers section
│   │   ├── _index.md
│   │   └── *.md          # Individual staff files
│   ├── events/            # Events section
│   │   ├── _index.md
│   │   └── *.md          # Individual event files
│   ├── regulations/       # Regulations section
│   │   ├── _index.md
│   │   └── *.md          # Individual regulation files
│   └── templates/         # Templates section
│       ├── _index.md
│       └── *.md          # Individual template files
├── layouts/               # Custom layouts
│   ├── index.html        # Homepage template
│   ├── about/
│   ├── contact/
│   ├── publications/
│   ├── projects/
│   ├── units/
│   ├── staff/
│   ├── events/
│   └── services/
├── assets/                # Static assets
│   ├── scss/
│   │   └── custom.scss   # Custom styles
│   ├── js/
│   │   └── script.js     # Custom JavaScript
│   ├── images/           # Images
│   └── videos/           # Videos
├── config/                # Configuration
│   └── _default/
│       ├── params.toml
│       ├── menus.en.toml
│       └── languages.toml
├── themes/                # Theme files
├── hugo.toml             # Hugo configuration
└── README.md             # This file
```

## Content Structure

### ID-Based System

All content entries use unique IDs for cross-referencing:

- **Publications**: `pub-001`, `pub-002`, etc.
- **Projects**: `project-climate-change-impact`, etc.
- **Datasets**: `dataset-climate-data`, etc.
- **Units**: `unit-data-analysis`, `unit-environmental-studies`, etc.
- **Staff**: `staff-samir-bilal`, `staff-researcher-1`, etc.

### Linking Between Content

Entries can link to each other using ID references:

- Publications can link to: projects, datasets, staff, units
- Projects can link to: publications, staff, datasets, units
- Datasets can link to: projects, publications, staff, units
- Staff can link to: projects, publications, units

Example in front matter:
```yaml
---
title: "Example Publication"
id: "pub-001"
related_projects:
  - "project-climate-change-impact"
related_staff:
  - "staff-researcher-1"
unit: "unit-environmental-studies"
---
```

## Getting Started

### Prerequisites

- Hugo Extended (v0.148.2 or later)
- Node.js and npm (for SCSS compilation)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bigspring-light
```

2. Install Hugo modules (if needed):
```bash
hugo mod get
```

3. Install npm dependencies:
```bash
npm install
```

### Development

1. Start the Hugo development server:
```bash
hugo server
```

2. The site will be available at `http://localhost:1313`

3. Make changes to content files in `content/` directory
4. Customize styles in `assets/scss/custom.scss`
5. Modify layouts in `layouts/` directory

### Building

Build the site for production:
```bash
hugo
```

The generated site will be in the `public/` directory.

## Configuration

### Main Configuration

- `hugo.toml`: Main Hugo configuration file
- `config/_default/params.toml`: Site parameters and custom variables
- `config/_default/menus.en.toml`: Navigation menu configuration
- `config/_default/languages.toml`: Language settings

### Customization

#### Colors

Colors are defined in `hugo.toml`:
```toml
[params.variables]
color_primary = "#C41E3A"      # Red
color_secondary = "#E8E8E8"    # Light grey
light = "#E8F4F8"              # Cool blue-grey
```

#### Logo

Logo is configured in `hugo.toml`:
```toml
[params]
logo = "images/surc-logo.png"
logo_text = "SURC"
```

## Adding Content

### Adding a Publication

1. Create a new file in `content/publications/`:
```bash
content/publications/my-publication.md
```

2. Add front matter:
```yaml
---
title: "My Publication"
id: "pub-XXX"
type: "article"
authors:
  - "staff-researcher-1"
year: "2024"
unit: "unit-data-analysis"
related_projects:
  - "project-data-platform"
description: "Description here"
pdf: "/pdfs/my-publication.pdf"
---
```

3. Add content below the front matter

### Adding a Project

1. Create a new file in `content/projects/`:
```bash
content/projects/my-project.md
```

2. Add front matter:
```yaml
---
title: "My Project"
id: "project-my-project"
status: "ongoing"
unit: "unit-data-analysis"
year: "2024"
related_publications:
  - "pub-001"
related_staff:
  - "staff-researcher-1"
description: "Description here"
image: "images/projects/my-project.jpg"
---
```

### Adding a Staff Member

1. Create a new file in `content/staff/`:
```bash
content/staff/my-researcher.md
```

2. Add front matter:
```yaml
---
title: "Dr. Researcher Name"
id: "staff-my-researcher"
unit: "unit-data-analysis"
email: "researcher@su.edu.krd"
research_areas:
  - "Data Science"
  - "Machine Learning"
related_projects:
  - "project-data-platform"
related_publications:
  - "pub-001"
---
```

### Adding a Dataset

1. Create a new file in `content/datasets/`:
```bash
content/datasets/my-dataset.md
```

2. Add front matter:
```yaml
---
title: "My Dataset"
id: "dataset-my-dataset"
unit: "unit-data-analysis"
year: "2024"
access: "Open"
format: "CSV"
related_projects:
  - "project-data-platform"
related_publications:
  - "pub-001"
---
```

## Deployment

### Netlify

The site includes `netlify.toml` for Netlify deployment. Simply connect your Git repository to Netlify.

### Vercel

The site includes `vercel.json` and `vercel-build.sh` for Vercel deployment.

### Manual Deployment

1. Build the site:
```bash
hugo
```

2. Upload the `public/` directory to your web server

## Customization

### Styles

Custom styles are in `assets/scss/custom.scss`. This file overrides theme defaults and adds custom styling.

### Layouts

Custom layouts are in `layouts/` directory. These override theme templates for specific sections.

### JavaScript

Custom JavaScript is in `assets/js/script.js`. This includes filtering functionality and other interactive features.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[Add your license information here]

## Contact

For questions or support regarding this website:
- **Email**: surc@su.edu.krd
- **Website**: [Add website URL]

## Credits

- **Theme**: Bigspring Light Hugo Theme
- **Built with**: Hugo Static Site Generator
- **Icons**: Font Awesome
- **CSS Framework**: Bootstrap 5

---

**Salahaddin University-Erbil Research Center (SURC)**

*Transforming rigorous, ethical research into measurable benefit for Kurdistan and beyond.*
