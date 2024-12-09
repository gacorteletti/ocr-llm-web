# ocr-llm-web

### Author: Gabriel Corteletti

This repository contains the implementation of an application that allows users to:

- Upload images to a webpage.
- Extract text from the images using OCR (Optical Character Recognition).
- Interact with the extracted data using a Large Language Model (LLM).
  This project was developed as a solution to a case study.

## Setup Instruction

As requested, this section contains step by step instructions for setting up and running the solution locally.

#### $\rightarrow$ 1. Download the Source Code

The first step, is to download or clone the code presented here. To do so, access the desired directory in your machine and run:

```
git clone https://github.com/gacorteletti/ocr-llm-web.git
cd ocr-llm-web
```

#### $\rightarrow$ 2. Install Backend Requirements

To install the dependencies of this project, run:

```
cd backend
npm install
```

#### $\rightarrow$ 3. Setup Local Database

To run this locally, you will need to setup a local database. To facilitate this process, a `docker-compose.yml` file is included in the root. Thus:

- If not already installed, download Docker (available [here](https://www.docker.com/)) and follow the installation instructions.
- Open it and run:

```
cd ocr-llm-web
docker compose up dev-db -d
```

- Once it completes, run the following line to check if the database was setup properly. You should see the new container (its name should be something like `ocr-llm-web-dev-db-1`).

```
cd ocr-llm-web
docker ps
```

> [!WARNING]
> Since it is not possible to upload a valid API key for the OpenAI model used here, the one present in `ocr-llm-web\backend\.env` as `OPENAI_API_KEY` is just a placeholder. The real one has been sent to the hiring team when this project was submited. Copy and paste it on the field `OPENAI_API_KEY` at `ocr-llm-web\backend\.env` before proceeding.

> NOTE 1: If you prefer, you can use another platform for setting up the local database. In that case, be sure to setup it using the proper configurations and credentials as shown in the file `docker-compose.yml`.

#### $\rightarrow$ 4. Backend Setup

Once the local database is running, you need to initialize the backend. So keep in mind that all commands on this sections are supposed to be run on the `backend` folder.

```
cd backend
```

- First, setup Prisma by running:

```
npx prisma migrate deploy
```

- Then you can check it by running:

```
npx prisma studio
```

- You will be redirected to a local host (probably `http://localhost:5555/`), where you can visualize the tables and models of our database.
- Then, you can build and initialize the backend server through:

```
npm run build
npm run start:dev
```

#### $\rightarrow$ 5. Install Frontend Requirements

Similar to what was done before, you need to install the dependencies of the frontend. To do so:

```
cd frontend
npm install
```

#### $\rightarrow$ 6. Frontend Setup

Finally, you can start the frontend through:

```
cd frontend
npm run dev
```

Once it finishes compiling, you should be redirected to the local host with the working application (default is `http://localhost:3000/` if you didn't change anything).

## Application Presentation

Below, you find a brief descriptions of the interfaces and features of this application.

#### $\rightarrow$ 1. Landing Page

When you access `http://localhost:3000/` you will see the `landing page`. On it, you find a quick introduction.

On this page you can either:

- **Create an Account** if you are a new user.
- **Sign In** if you already have an account.

#### $\rightarrow$ 2. Sign Up

Here you can fill the registration forms to create a new account to begin using the application. If you entered this section by mistake, there is a link for the `sign in` page.

Once you complete your registration, you will be redirected to the `sign in` page to access the application.

#### $\rightarrow$ 3. Sign In

In this page, you can join your account. As before, if you accessed here by accident, there is a link to redirect you to the `sign up` page.

Once you complete logging in, you will be redirected to the `documents dashboard` page.

#### $\rightarrow$ 4. Documents Dashboard

This is the main page of the application, it is here where you can manage your files.

To begin with, on the top, you have access to the upload page so you can **add more files to your dashboard**.

Below that, you can see a **grid of all documents** you have uploaded so far. For each document you can:

- Click on its card to access the `AI interaction` page (where you can **ask an AI about the text**)
- Click on the red X to **delete** it.
- Click the blue arrow to **download** it.
  - This will download a `.zip` with two files:
  - 1 - the **original image** you uploaded.
  - 2 - a `.txt` file with the **text extracted** from your image and the **message history** between you and the AI about that document (including all queries and replies).

#### $\rightarrow$ 5. File Upload

Here you can select an image (its name you will shown so your can check it) and upload it.

Once you select upload, it will show a processing message and, on completion, you will return to the dashboard, where you can see and manage you new file. There is also a button to return to the dashboard at any time.

#### $\rightarrow$ 6. AI Interaction

This is the core of the application. Here, you can see:

- On the left, the image you uploaded.
  - You can **pinch to pan the image** as well as use your **scroll to zoom in and out**.
  - You can once again **delete** or **download** it.
  - You can **upload a new document** or go back to the **dashboard**.
- On the top right, the **text that was extracted** from your image.
- On the bottom right, the chat area where you can **type in your questions about the document and click `Send` to get the AI reply**. You can also **visualize the previous questions (in gray) and respective answers (in blue)**.

## Testing

To test the application, a couple of example images are provided in the folder `test_images`. So you can use them to get around the application.
