# Portfolio Backend

This repository contains the backend API for the portfolio project.

## Features

- Express server
- CORS support
- Environment variable support via `.env`
- API routes under `/api`
- Root health route at `/`

## Requirements

- Node.js 18+ recommended

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The server listens on `PORT` from `.env` or defaults to `5000`.

## API

- `GET /` - serves the portfolio index page (`public/index.html`)
- `/api/*` - custom API routes defined in `routes/api.js`

Projects API (CRUD):

- `GET /api/projects` - list all projects
- `POST /api/projects` - add a project; JSON body: `{ title, description, tech, link }` where `tech` is an array or comma-separated string
- `PUT /api/projects/:id` - update project by id; JSON body same as POST
- `DELETE /api/projects/:id` - delete project by id

The index page (`/`) now includes live controls to add, edit, and delete projects which persist to `data/projects.json`.
