<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://links.rewake.org">
    <img src="public/icon.svg" alt="curated-topics logo" width="64" height="64">
  </a>

  <h3 align="center">curated-topics</h3>

  <p align="center">
    A minimal, high-performance link collection.
    <br />
    <a href="https://links.rewake.org"><strong>Visit the site »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Mozzo1000/curated-topics/issues/new">Report an issue</a>
  </p>
</div>

[![part of: re:wake](https://rewake.org/assets/badge.svg)](https://rewake.org)

This repository powers [links.rewake.org](https://links.rewake.org), a personal, curated collection of articles, blogposts and other interesting links.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#technical-architecture">Technical Architecture</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#build-for-production">Build for Production</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

The project is designed to be a fast, searchable, and organized place for everything from deep-dive articles and developer tools to fascinating media.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

* **Multi-View Layouts**: Switch between Grid, List, and a high-density Compact view for power browsing.
* **Search & Filtering**: Instant search across all collections with domain-specific filtering.
* **Keyboard First**: Navigate the entire collection using keyboard shortcuts (`J`, `K`, `Enter`).
* **Dynamic Health Badge**: A build-time status badge that indicates how fresh the collection is based on the last build date.
* **Dark Mode**: Native support for system preferences and manual toggles.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Technical Architecture

This is a **static site** built with a focus on speed and simplicity.

* **Framework**: [Preact](https://preactjs.com/) for a tiny footprint and fast hydration.
* **Bundler**: [Vite](https://vitejs.dev/) for lightning-fast builds and Hot Module Replacement.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first, responsive design.
* **Icons**: [Lucide-Preact](https://lucide.dev/) for a consistent, lightweight icon set.

Content is stored in static `.json` files within the repository.

* **Editor**: The site uses **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)**, an open-source, git-based CMS that allows for seamless editing of the collections without a database.
* **Data Structure**: Each collection is a JSON file, which is automatically globbed and parsed at build time using `import.meta.glob`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* **Node.js**: Version 22.12 or higher
* **npm**

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Mozzo1000/curated-topics.git
   cd curated-topics
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

The site will be available at `http://localhost:5173`.

### Build for Production

To generate the static files for deployment:

```sh
npm run build
```

The output will be located in the `/dist` folder.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions to the **codebase** are highly encouraged! Please feel free to open an issue or submit a pull request.

> [!IMPORTANT]
> **I do not accept requests or PRs for new links to add.**
> This is a strictly personal, curated collection. To maintain the integrity and focus of the "Curated Topics," the content remains at my sole discretion.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
</content>
</invoke>
