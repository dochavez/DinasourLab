# DinosaurLab

## How this project was built

Thinking about elementary school teachers and children, I asked myself the following question: Can we create a web application to teach about dinosaurs and add some gamification to make it more interactive? With that in mind, I decided to create a small, interactive website that would present organized information about dinosaurs.

The main objective is to showcase different types of dinosaurs that existed long ago, along with their skeletons, and allow users to easily assemble these different types of dinosaurs in the designated display area. I then selected a list of dinosaur names that have already been discovered to get an idea of ​​how many to include in the web application.

Therefore, the first step was to create a ChatGPT prompt on the website that says: Create a landing page divided into 3 columns. On the left side will be the different dinosaur names in a list of 10 items. In the main column will be a window displaying the 3D models, which will be the Media Placeholder. The right column will contain additional information such as diet, size, and year of discovery. Also, add interactive filter-style elements on the right side. Design the entire wireframe to determine the placement of the different elements. The resulting output is as follows.

<img width="1049" height="585" alt="image" src="https://github.com/user-attachments/assets/d13eff42-fd1e-4ee0-836b-53e6962f79ed" />


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
