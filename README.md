# DinosaurLab

# Live Demo visit: ([https://your-project-name.vercel.app](https://dinosaurlab.vercel.app/))

## How this project was built

Thinking about elementary school teachers and children, I asked myself the following question: Can we create a web application to teach about dinosaurs and add some gamification to make it more interactive? With that in mind, I decided to create a small, interactive website that would present organized information about dinosaurs.

The main objective is to showcase different types of dinosaurs that existed long ago, along with their skeletons, and allow users to easily assemble these different types of dinosaurs in the designated display area. I then selected a list of dinosaur names that have already been discovered to get an idea of ​​how many to include in the web application.

Therefore, the first step was to create a ChatGPT prompt on the website that says: `Create a landing page divided into 3 columns. On the left side will be the different dinosaur names in a list of 10 items. In the main column will be a window displaying the 3D models, which will be the Media Placeholder. The right column will contain additional information such as diet, size, and year of discovery. Also, add interactive filter-style elements on the right side. Design the entire wireframe to determine the placement of the different elements.` The resulting output is as follows.

<img width="1049" height="585" alt="image" src="https://github.com/user-attachments/assets/d13eff42-fd1e-4ee0-836b-53e6962f79ed" />

After installing Codex, the first prompt I asked was: `We're going to create an interactive website called DinasourLab. The structure of this interactive site is as shown in the image DinasourLab.png. Replace all the content in the image with dinosaur-related content. Then add an option that says "Skeletal Structure," and the 3D model SpinoFossil1.glb will load. The view for the 3D model should be 360 ​​degrees so the user can rotate it. Also, add an option so that when the user wants to see the skeleton's skeletal structure, it appears overlaid on the textured 3D model. Add a dinosaur-themed welcome window and background sound that plays when the user enters the site. Below the 3D model, I want you to add a timeline showing the period in which the dinosaur lived. Include descriptive information such as its diet, its size compared to a real-world reference point, where it was discovered, and which museum houses it can be visited. Use Three.js with WebGL to render the 3D models in the browser.`

<img width="920" height="813" alt="image" src="https://github.com/user-attachments/assets/6978af9d-92e2-4731-aa5e-78e8dc7c564c" />

Then I asked Codex to add the following dinosaur names to the list on the left: `Spinosaurus, Tyrannosaurus, Triceratops, Velociraptor. On the right, add tags related to each species selected by the user. Add a section on the right with the option to display the model with its texture and another option to display only the skeletal part of the model. Incorporate soft tones, with green colors,` and the result Codex provided was the following:

<img width="1011" height="625" alt="image" src="https://github.com/user-attachments/assets/908074fe-42c6-43a8-8931-c6afa6684b17" />

Then I told Codex that the `3D model couldn't be displayed`, so he responded by performing the following actions:

<img width="1027" height="818" alt="image" src="https://github.com/user-attachments/assets/e596b815-0db5-44f2-ac13-a90f28891c76" />

I told Codex again via prompt: `It's not working, the model isn't displayed`, and it returned the following response:

<img width="1051" height="705" alt="image" src="https://github.com/user-attachments/assets/f50ec711-2e3b-4ef4-ad00-e3c4fe47ca59" />

And after Codex made the necessary adjustments described in the previous image, I was finally able to see the 3D model loaded into the scene, as shown in the following image. However, the problem was that the dinosaur model looked very dark. So I wrote a prompt that says: Now the 3D model is visible. Please adjust the lighting in the 3D model so that the true colors of the texture are fully visible.

<img width="1043" height="605" alt="image" src="https://github.com/user-attachments/assets/4ff5ab23-e190-405b-ac76-c897ea12667e" />

<img width="1055" height="622" alt="image" src="https://github.com/user-attachments/assets/96bb2abf-401a-4676-900b-49f7268ade48" />

Finally, once the lighting adjustment on the model was complete, the next step was to repeat the prompt used when Codex was asked to add the first four names to the menu, but this time to ask it to add four more names. The same process was used to design new models from reference images created using ChatGPT, as shown in the image.

<img width="363" height="226" alt="image" src="https://github.com/user-attachments/assets/1a507acd-c967-4e9e-81b2-63af8e600846" />
<img width="350" height="219" alt="image" src="https://github.com/user-attachments/assets/621129cb-f865-4d7c-894a-a62e47ce6ed3" />
<img width="401" height="299" alt="image" src="https://github.com/user-attachments/assets/3ead8e76-9b87-4848-b418-e0cb0dd9a12e" />
<img width="448" height="299" alt="image" src="https://github.com/user-attachments/assets/b6e73177-f663-4ee0-8d33-9bcff333346d" />
<img width="573" height="342" alt="image" src="https://github.com/user-attachments/assets/108653b1-eea7-4c64-b185-f96f73d16428" />
<img width="710" height="348" alt="image" src="https://github.com/user-attachments/assets/5446da8f-c97d-49f8-a264-7b63cccf0268" />

## Adding the functionality of playing puzzle-style games

To provide a user experience similar to assembling a puzzle, I used Blender to literally break the 3D model into several parts. The reason I chose this approach is that I need Codex to be able to manipulate the floating points attached to the 3D model so that the assembly is seamless. Therefore, once I had the models separated into their parts, I used a prompt in Codex telling it that I had a file subdivided into parts.

<img width="1013" height="445" alt="image" src="https://github.com/user-attachments/assets/164016b8-6d9c-4dbb-9fde-3e36bbbe406f" />

<img width="809" height="447" alt="image" src="https://github.com/user-attachments/assets/fcaf983d-d1d1-4edb-8006-10ded2d20f11" />

<img width="821" height="402" alt="image" src="https://github.com/user-attachments/assets/69e7e10e-3018-4f58-94b3-84c405007460" />

<img width="975" height="568" alt="image" src="https://github.com/user-attachments/assets/2af43647-019a-4200-9683-8065690f27a7" />

One of the things I enjoyed about this part of the puzzle was that Codex had the brilliant idea of ​​adding a kind of rendered gradient shadow to the 3D scene without me even asking. This serves as a guide for the user, helping them know which part of the piece they're picking up, which part of the 3D model it belongs to, and where it should be placed. It was a great idea that it suggested this detail. On the other hand, Codex perfectly manipulated the floating points placed on each of the pieces that make up the 3D model, ensuring they can only be placed in a single position without allowing the user to make mistakes, thus adhering to the fundamental gameplay rule of this type of puzzle. I want to emphasize that the reason the 3D models in the puzzle section don't appear textured is because, in the future, an option could be added to allow these models to be 3D printed for fans who want to have a pre-assembled dinosaur generated by AI.

## Welcome Interface

<img width="975" height="563" alt="image" src="https://github.com/user-attachments/assets/d0968eb9-1c8e-411b-872b-78e7bea5e6ba" />

## DinasourLab Main Interface

<img width="975" height="555" alt="image" src="https://github.com/user-attachments/assets/333bddcb-ceda-4cca-9e97-d037d32ff372" />

## Skeleton view of one of the models

<img width="973" height="523" alt="image" src="https://github.com/user-attachments/assets/36d89bfc-fbb5-4615-baf2-e6d7acc1b0b4" />

## How to play the puzzle section.

First, the user must register where it says "Sign in to Play," then create an account by entering a valid email address. They will receive an email confirmation request by clicking the link in their inbox. Afterward, they will be able to enter their credentials.

<img width="975" height="542" alt="image" src="https://github.com/user-attachments/assets/b63b34b2-32dc-45c4-97e2-fa0d7253f073" />


<img width="1003" height="491" alt="image" src="https://github.com/user-attachments/assets/7c39956e-cadc-4544-a21f-033d7385792d" />

Once the user has created their account or has already registered, they can log in and a screen will appear saying they only have two and a half minutes to solve the puzzle.

<img width="973" height="531" alt="image" src="https://github.com/user-attachments/assets/1588f8fe-3898-4261-b151-da9c841cc37e" />

The user will see the pieces floating in the air and must bring them closer to complete the model. The timer appears in the upper left corner, along with a progress bar indicating how many pieces are needed and how many have already been placed. If the user fails to assemble the entire model within the time limit, they will receive an "incomplete" message. If the user successfully assembles the model within the allotted time, they will be added to the participant registration list, and confetti and balloons will appear on the screen.

<img width="1057" height="622" alt="image" src="https://github.com/user-attachments/assets/e7d0a7bd-1222-4f55-b6ba-dca53856e859" />

Full Screen view in puzzle assembly mode.

<img width="975" height="609" alt="image" src="https://github.com/user-attachments/assets/e5a2fbd4-d0f0-4764-a104-10ef57c78c0d" />

## View from a mobile device

<img width="258" height="561" alt="image" src="https://github.com/user-attachments/assets/5adabeae-2ebe-4832-ade3-b3e8f8cf8cfb" />
<img width="274" height="558" alt="image" src="https://github.com/user-attachments/assets/790a489d-56a5-4949-b400-e5a8bca63e76" />
<img width="271" height="556" alt="image" src="https://github.com/user-attachments/assets/2763c158-26d1-462f-9e91-9e34eb36edbf" />
<img width="812" height="375" alt="image" src="https://github.com/user-attachments/assets/2ed533ac-6749-4fc4-8b6a-07527c260268" />

## Run Locally

From this folder, start any static server, for example:

```powershell
node server.mjs
```

Then open `http://localhost:4173`. The server is necessary for the browser to load the `.glb` files.

## Controls

- Drag the specimen to rotate it and use the wheel to zoom in or out.

- Switch between **Textured Model** and **Skeleton Structure**.

- In the textured model, enable **Overlay Skeleton Structure** to see both at the same time.

## The following information is for statistical purposes, generated and obtained directly by Codex.

```
# DinasourLab - project statistics

Generated: 2026-07-21, 10:41 (America/Guatemala)

## Measurement scope

This snapshot measures the implementation contents of the project before this archive was added. It excludes Git metadata (`.git`), Vercel build output (`.vercel`), and the generated `project-archive` folder itself, so the code statistics remain useful rather than counting this documentation recursively.

## Summary

| Metric | Value |
| --- | ---: |
| Total project implementation files | 47 |
| Total size | 726,787,265 bytes (about 693 MiB) |
| Code/configuration/document files counted | 12 |
| Lines in code/configuration/document files | 1,431 |
| GLB 3D model files | 24 |
| PNG image files | 5 |

The line count includes files with these extensions: `.js`, `.mjs`, `.html`, `.css`, `.sql`, `.ts`, `.json`, and `.md`. It is a physical line count, not a complexity metric, and includes configuration and documentation as stated above.

## File-type breakdown

| Extension | Files | Total bytes |
| --- | ---: | ---: |
| `.glb` | 24 | 708,782,220 |
| `.png` | 5 | 17,883,946 |
| `.js` | 3 | 51,578 |
| `.css` | 1 | 34,203 |
| `.html` | 1 | 17,499 |
| `.md` | 1 | 6,079 |
| `.ts` | 1 | 4,472 |
| `.svg` | 4 | 3,653 |
| `.sql` | 1 | 1,989 |
| `.mjs` | 1 | 1,071 |
| `.json` | 3 | 386 |
| `.bat` | 1 | 160 |

## Largest text/code files by line count

| File | Lines | Role |
| --- | ---: | --- |
| `public/app.js` | 919 | Main viewer, puzzle, UI, and authentication logic |
| `public/index.html` | 167 | App structure and UI markup |
| `public/styles.css` | 151 | Presentation and responsive layout |
| `supabase/functions/puzzle-score/index.ts` | 68 | Server-side score submission |
| `README.md` | 35 | Project documentation |
| `supabase/migrations/20260720170000_create_puzzle_leaderboard.sql` | 33 | Leaderboard database schema and policies |
| `scripts/local-server.mjs` | 19 | Local server for port 4173 |
| `public/welcome.js` | 12 | Welcome-screen interaction |
| `package-lock.json` | 12 | Dependency lock data |
| `package.json` | 8 | Package metadata/scripts |
| `public/supabase-config.js` | 4 | Browser-side Supabase configuration |
| `vercel.json` | 3 | Vercel deployment configuration |

## Structure

```text
DinasourLab/
|- public/                         Static browser app, UI, Three.js assets and GLB models
|  |- app.js                        Main interactive application logic
|  |- index.html                    Page markup
|  |- styles.css                    Desktop/mobile styling
|  |- welcome.js                    Welcome entry behavior
|  `- *.glb, *.png, *.svg           Dinosaur models and visual assets
|- scripts/
|  `- local-server.mjs              Local development server (port 4173)
|- supabase/
|  |- migrations/                   Leaderboard schema and RLS policies
|  `- functions/puzzle-score/       Validated score-submission edge function
|- package.json                     Local command metadata
|- vercel.json                      Static deployment configuration
`- README.md                        Project documentation
```

## Interpretation

The project is asset-heavy: GLB dinosaur models account for the overwhelming majority of storage. The executable browser application itself is compact and concentrated in `public/app.js`, while the Supabase folder contains the persistence and validation layer for the competitive puzzle features.

```
# DinasourLab - reconstructed work log

Generated: 2026-07-21

## Preservation scope

This is a reconstruction of the work completed in this Codex task based on the available user requests, workspace files, Git commits, and deployment record. It is not a verbatim export of the Codex desktop conversation, private reasoning, authentication tokens, or hidden tool output.

## Project purpose

DinasourLab is a browser-based dinosaur exploration lab. It presents textured and skeletal GLB models in an interactive Three.js/WebGL viewer, provides dinosaur information, and includes timed assembly puzzles with a cross-user leaderboard.

## Conversation and implementation timeline

### 1. Initial dinosaur laboratory

- Built the DinosaurLab/DinasourLab experience from the supplied visual direction.
- Replaced the earlier bee-oriented content with dinosaur content, centered on Spinosaurus.
- Added a welcome screen, a textured Spinosaurus model, a skeletal model option, a skeletal overlay option, 360-degree inspection, descriptive facts, and a geological timeline.
- The initial request included welcome audio; it was later removed at the user's request.

### 2. Viewer troubleshooting and local development

- Repaired the welcome-screen entry action when the **Enter the laboratory** button did not advance.
- Investigated missing GLB rendering and made the viewer load models in the browser through Three.js and WebGL.
- Clarified that models must be tested through the local web server rather than opening `index.html` as a `file:///` URL.
- Standardized local development on port `4173` using `node scripts/local-server.mjs`.
- Resolved the `EADDRINUSE` issue by recognizing that it means another process is already using port 4173.

### 3. Viewer visual quality and English content

- Adjusted scene lighting/exposure so the textured model is visible with more faithful colors.
- Converted presentation text, including the welcome screen, to English.
- Retained browser controls for rotating, framing, fullscreen viewing, and model scale.

### 4. Dinosaur collection expansion

- Added support for additional textured and skeletal GLB pairs, preserving the same viewer flow used for Spinosaurus.
- Corrected the Triceratops textured/skeletal model selection mapping after it was reversed.
- Added Parasaurus, then expanded the menu/models with later supplied dinosaurs such as Pteranodon, Brachiosaurus, Ankylosaurus, and Mammoth where matching assets were available.
- Removed Velociraptor from the collection in the latest content-cleanup pass.
- Replaced generic collection symbols with dinosaur-shaped visual representations where the available UI assets supported them.

### 5. Interaction controls and presentation design

- Added directional lighting controls around the current model.
- Added independent X, Y, and Z scaling controls.
- Added dinosaur-specific environmental backgrounds/skybox behavior, then replaced generated scenery with supplied imagery when requested.
- A proposed Brachiosaurus interactive-video feature was created conceptually and then fully removed by request; its normal model, skeleton, and puzzle support were retained.
- Simplified navigation by removing Museums, Notes, and Back to collection.
- Replaced Notebook, Compare, and Share controls with social sharing controls that share: “Hey, I visited the DinasourLab and completed the puzzles”.
- Updated the welcome description to describe exploring different dinosaurs, 360-degree rotation, fullscreen viewing, and the puzzle game.
- Removed the right-side Field Notes panel and icon; updated the Discovery of the Day content.

### 6. Assembly puzzle game

- Added puzzle mode for internally subdivided GLB models so users can manipulate floating pieces and rebuild the dinosaur in the viewer area.
- Added puzzle support for Parasaurus, Triceratops, Spinosaurus, T-Rex, Brachiosaurus, and subsequent supplied subdivided assets when present.
- Added larger **Assemble** and **Exit Assembly** controls.
- Added instructional prompts before a run and a Continue action that begins the clock.
- Iterated the time limit from 3 minutes, then 1 minute, and finally to the current 2 minutes 30 seconds.
- Added a persistent upper-left countdown and a top progress bar that remain visible in fullscreen mode.
- Added final-success feedback with balloons/confetti and a failed-run view with **Assembly not completed** and **Try Again**.

### 7. Responsive/mobile work

- Adapted the layout for phones and tablets in portrait and landscape orientations.
- Made the collection/menu reachable on compact screens, kept puzzle controls accessible, and made dinosaur information and leaderboards usable in mobile layouts.
- Preserved desktop presentation while allowing viewer, timer, progress, and panels to reflow at mobile breakpoints.

### 8. GitHub and Vercel publication

- Published source to `dochavez/DinasourLab` on GitHub.
- Configured static deployment output for Vercel and deployed production at `https://dinosaurlab.vercel.app`.
- Diagnosed an earlier Vercel 500 error as a serverless-function/static-deployment mismatch and deployed the app as a static site.
- Confirmed production returned HTTP 200 after the corrected deployment.

### 9. Supabase leaderboard and authentication

- Added Supabase-backed player profiles and puzzle runs so users can compare fast completions.
- Added a server-side score-submission function, database migration, and row-level security rules.
- Added the sign-up/sign-in flow for puzzle players.
- Added password visibility controls and password-reset/update flow.
- Corrected email-confirmation redirect handling to use the production site rather than a non-running `localhost:3000` address.
- Recorded the recommended Supabase authentication URL configuration:
  - Site URL: `https://dinosaurlab.vercel.app`
  - Redirect URLs: `https://dinosaurlab.vercel.app/**`, `http://localhost:4173/**`, and `http://127.0.0.1:4173/**`

## Current technical map

| Area | Location | Responsibility |
| --- | --- | --- |
| Browser application | `public/` | HTML/CSS/JavaScript, Three.js viewer, assets, responsive UI |
| Main interaction logic | `public/app.js` | Models, model modes, controls, puzzles, authentication UI, leaderboard UI |
| Welcome interaction | `public/welcome.js` | Welcome screen entry behavior |
| Local server | `scripts/local-server.mjs` | Serves the application on port 4173 |
| Supabase schema | `supabase/migrations/` | Profiles, puzzle-run data, policies |
| Supabase function | `supabase/functions/puzzle-score/` | Validated puzzle-score submission |
| Hosting config | `vercel.json` / `.vercel` output during deployment | Static deployment routing/output |

## Security notes

- Never store Supabase service-role keys, email confirmation tokens, password reset tokens, or GitHub tokens in this archive or the public client files.
- The Supabase publishable/anon client key is intended to be public, but database access remains governed by Supabase Row Level Security and the score function.
- For confirmation and recovery emails to work in production, Supabase URL Configuration must remain aligned with the production URL listed above.


