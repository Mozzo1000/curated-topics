## 👉 About the project
A minimal, high-performance link collection. This repository powers [links.rewake.org](https://links.rewake.org), a personal, curated collection of articles, blogpost and other interesting links.

The project is designed to be a fast, searchable, and organized place for everything from deep-dive articles and developer tools to fascinating media.

---

## ✨ Features

* **Multi-View Layouts**: Switch between Grid, List, and a high-density Compact view for power browsing.
* **Search & Filtering**: Instant search across all collections with domain-specific filtering.
* **Keyboard First**: Navigate the entire collection using keyboard shortcuts (`J`, `K`, `Enter`).
* **Dynamic Health Badge**: A build-time status badge that indicates how fresh the collection is based on the last build date.
* **Dark Mode**: Native support for system preferences and manual toggles.
---

## 🛠 Technical Architecture

This is a **static site** built with a focus on speed and simplicity.

### Core Stack

* **Framework**: [Preact](https://preactjs.com/) for a tiny footprint and fast hydration.
* **Bundler**: [Vite](https://vitejs.dev/) for lightning-fast builds and Hot Module Replacement.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first, responsive design.
* **Icons**: [Lucide-Preact](https://lucide.dev/) for a consistent, lightweight icon set.

### Content Management

The data is stored in static `.json` files within the repository.

* **Editor**: The site uses **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)**, an open-source, git-based CMS that allows for seamless editing of the collections without a database.
* **Data Structure**: Each collection is a JSON file, which is automatically globbed and parsed at build time using `import.meta.glob`.

---

## Run locally
Follow these steps to run this project on your local machine.

### Prerequisites

* **Node.js**: Version 18.0 or higher
* **npm**

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/mozzo1000/curated-topics.git
cd curated-topics
```


2. **Install dependencies:**
```bash
npm install
```


3. **Start the development server:**
```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### Build for Production

To generate the static files for deployment:

```bash
npm run build
```

The output will be located in the `/dist` folder.

---

## 🙌 Contributing

### Code Improvements

Contributions to the **codebase** are highly encouraged!
Please feel free to open an Issue or submit a Pull Request.

> [!IMPORTANT]
> **I do not accept requests or PRs for new links to add.**
> This is a strictly personal, curated collection. To maintain the integrity and focus of the "Curated Topics," the content remains at my sole discretion.

---

## 🧾 License

This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

---

**Built with ❤️ by [Andreas Backström**](https://andreasbackstrom.se)**