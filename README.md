# DinosaurLab

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

- The soundscape starts when you click "Enter Lab" and can be muted from the sidebar.
