# TCG game app with Cloudflare Stack

See [./game-rules.md], this is a card game based on morale and reinforcement instead of killing minions directly. There are currently (as of 7/8/2025) some issues with units balancing and attack power vs morale power.


[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. This version has been extended into a full-stack game application to showcase a broader range of Cloudflare technologies and modern frontend practices.

## Project Overview & Technologies Used

This project demonstrates a complete full-stack application built solely on the Cloudflare Developer Platform, complemented by a modern React frontend:

- **Cloudflare Workers:** Hosts the backend API and serves the frontend application.
- **Cloudflare D1:** A serverless SQL database.
- **Drizzle ORM:** A TypeScript ORM used for database interactions with Cloudflare D1, providing type safety and a query builder.
- **Hono.js:** A small, simple, and ultrafast web framework for the Cloudflare Workers backend API.
- **Vite:** Frontend build tooling and development server, integrated with Cloudflare Workers via the `@cloudflare/vite-plugin` for a seamless local development experience that mirrors production.
- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** For static typing in both frontend and backend code.
- **Tailwind CSS:** A utility-first CSS framework for styling the application.
- **shadcn/ui:** Beautifully designed, accessible UI components built with Radix UI and Tailwind CSS.
- **Wouter:** A minimalist routing library for React.
- **TanStack Query (React Query):** For data fetching, caching, and state management on the frontend, interacting with the Hono API.

## Application Functionality

See `./game-rules.md` for the game rules.
See `./game-overview.md` for the game overview.
See `./TECHNICAL_DESIGN.md` for the technical design.

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npx wrangler deploy
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
