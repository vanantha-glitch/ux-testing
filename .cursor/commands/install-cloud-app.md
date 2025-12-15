# install-cloud-app

Bootstrap a new Next.js + shadcn/ui app with the CuraCloud-style UI stack, ready for Vercel deployment.

## Instructions

When the user runs `/install-cloud-app`, you should:

1. **Ask for the target directory**
   - Ask the user whether to:
     - Create a new folder and app (recommended), or
     - Use the current workspace folder.
   - Confirm the final directory path before running any commands.

2. **Create a new Next.js app (if requested)**
   - If the user wants a fresh project, run:
     - `npx create-next-app@latest`
   - Use these options (or instruct the user to choose them if prompts appear):
     - TypeScript: Yes
     - ESLint: Yes
     - Tailwind CSS: Yes
     - App Router: Yes
     - Import alias: Use the default or the user’s preference
   - After creation, `cd` into the new project directory for all subsequent commands.

3. **Install core UI and utility libraries**
   - In the project directory, install the UI/libs that match the CuraCloud prototype:
   - Run:
     ```bash
     npm install \
       @carbon/icons-react \
       @hookform/resolvers \
       @radix-ui/react-accordion \
       @radix-ui/react-alert-dialog \
       @radix-ui/react-aspect-ratio \
       @radix-ui/react-avatar \
       @radix-ui/react-checkbox \
       @radix-ui/react-collapsible \
       @radix-ui/react-context-menu \
       @radix-ui/react-dialog \
       @radix-ui/react-dropdown-menu \
       @radix-ui/react-hover-card \
       @radix-ui/react-label \
       @radix-ui/react-menubar \
       @radix-ui/react-navigation-menu \
       @radix-ui/react-popover \
       @radix-ui/react-progress \
       @radix-ui/react-radio-group \
       @radix-ui/react-scroll-area \
       @radix-ui/react-select \
       @radix-ui/react-separator \
       @radix-ui/react-slider \
       @radix-ui/react-slot \
       @radix-ui/react-switch \
       @radix-ui/react-tabs \
       @radix-ui/react-toast \
       @radix-ui/react-toggle \
       @radix-ui/react-toggle-group \
       @radix-ui/react-tooltip \
       class-variance-authority \
       clsx \
       cmdk \
       date-fns \
       embla-carousel-react \
       input-otp \
       lucide-react \
       next-themes \
       react-day-picker \
       react-hook-form \
       react-resizable-panels \
       recharts \
       sonner \
       tailwind-merge \
       tailwindcss-animate \
       vaul \
       zod
     ```

4. **Ensure dev-tooling matches**
   - If the project was not created with `create-next-app`, or if the user asks to align tooling, run:
     ```bash
     npm install -D \
       typescript \
       @types/node \
       @types/react \
       @types/react-dom \
       eslint \
       eslint-config-next \
       tailwindcss \
       postcss \
       autoprefixer
     ```

5. **Initialize shadcn/ui**
   - In the project directory, run:
     ```bash
     npx shadcn-ui@latest init --yes
     ```
   - If prompts still occur, guide the user to:
     - Framework: Next.js
     - Styling: Tailwind CSS
     - Components directory: `src/components`
     - Base color: User’s preference (e.g. slate/zinc/neutral)

6. **Optionally scaffold a base set of components**
   - Ask if the user wants a starter set of common shadcn components.
   - If yes, run:
     ```bash
     npx shadcn-ui@latest add button card dialog form input textarea select tooltip toast
     ```

7. **Verify Tailwind configuration**
   - If Tailwind was not set up by `create-next-app` or if the user asks to reconfigure it:
     - Run `npx tailwindcss init -p` if `tailwind.config` does not exist.
     - Ensure the content paths include `src/app`, `src/components`, and `src/lib`.
     - Ensure `tailwindcss-animate` is added to the plugins array.
     - Ensure `@tailwind base; @tailwind components; @tailwind utilities;` are present in the main global CSS file (commonly `src/app/globals.css`).

8. **Provide a brief summary and next steps**
   - Confirm:
     - The project directory used or created.
     - The main libraries installed.
     - That shadcn/ui has been initialized.
   - Suggest next actions:
     - Run `npm run dev` to start the dev server.
     - Begin building UI using the installed components and utilities.


