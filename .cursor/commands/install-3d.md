# install-3d

Install and wire up the 3D / three.js stack in the current Next.js app, similar to the CuraCloud prototype.

## Instructions

When the user runs `/install-3d`, you should:

1. **Confirm project context**
   - Verify with the user that the current workspace is a Next.js/React app.
   - Confirm which package manager to use; default to `npm` unless the user specifies otherwise.

2. **Install core 3D libraries**
   - In the project directory, install `three` and its TypeScript types:
     ```bash
     npm install three @types/three
     ```

3. **Install React bindings for three.js**
   - Install the recommended React ecosystem libraries:
     ```bash
     npm install @react-three/fiber @react-three/drei
     ```
   - Explain briefly:
     - `@react-three/fiber`: React renderer for three.js.
     - `@react-three/drei`: Utility components, loaders, cameras, controls, and helpers.

4. **(Optional) Install additional helper tooling**
   - Ask the user if they want extra tools for interactive tuning and camera control.
   - If yes, run:
     ```bash
     npm install leva camera-controls
     ```
   - Clarify that these are optional and can be skipped for simpler scenes.

5. **Create a basic 3D viewport component**
   - If the project does not already have a 3D viewport, create a new file at `src/components/three-viewport.tsx`.
   - Insert a minimal example 3D scene using React Three Fiber:
     ```tsx
     "use client";

     import { Canvas } from "@react-three/fiber";
     import { OrbitControls } from "@react-three/drei";

     export function ThreeViewport() {
       return (
         <div className="w-full h-full">
           <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
             <color attach="background" args={["#0b1120"]} />
             <ambientLight intensity={0.5} />
             <directionalLight position={[5, 5, 5]} intensity={1} />
             <mesh>
               <boxGeometry args={[1, 1, 1]} />
               <meshStandardMaterial color="#22d3ee" />
             </mesh>
             <OrbitControls makeDefault />
           </Canvas>
         </div>
       );
     }
     ```
   - Ensure the file is treated as a client component by keeping the `"use client";` directive at the top.

6. **Create a demo route for the viewport**
   - If using the Next.js App Router, create a page at `src/app/three/page.tsx`:
     ```tsx
     import { ThreeViewport } from "@/components/three-viewport";

     export default function ThreePage() {
       return (
         <main className="w-screen h-screen">
           <ThreeViewport />
         </main>
       );
     }
     ```
   - If the project uses the Pages Router instead, create or update `pages/three.tsx` with an equivalent component.
   - Confirm with the user which routing system they are using if unsure.

7. **Explain 3D-specific considerations**
   - Remind the user:
     - All React Three Fiber canvases must live in client components.
     - 3D performance can be sensitive; prefer optimized models and simple materials where possible.
     - They can store 3D models under `public/models` (or a similar directory) and load them with `@react-three/drei` loaders (`useGLTF`, etc.) when ready.

8. **Verify and summarize**
   - Suggest that the user run:
     ```bash
     npm run dev
     ```
   - Instruct them to open `/three` in the browser and confirm:
     - A 3D cube is visible.
     - Orbit controls are functional (drag with the mouse to rotate the camera).
   - Provide a brief summary of what was installed and which files were created or modified.


