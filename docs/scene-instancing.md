# Repeated mesh submissions

Nanjing Road can submit thousands of draws when turning toward the underground
stations and the rest of the city. Available system RAM does not remove this
CPU/GPU submission cost. A full scene still remains in memory.

`createSceneInstances(scene)` groups existing opaque meshes with the same geometry,
material, layer, render order, shadow flags and software-renderer metadata. It
shares the original geometry, material and textures. Each group adds a reusable
instance matrix buffer; it does not remove inhabitants or lower texture quality.

Original objects remain in their hierarchy. Movement, limbs, seats, doors, stock,
collision, dialogue and save logic keep their existing references. The scene's
before-render hook gathers current world transforms and parent visibility and
uses the same per-source bounding sphere/frustum check as the original renderer.
The Canvas fallback also invokes that hook. Cinematics and immediate diagnostic
renders therefore use the same synchronization path as normal frames.

Transparent, skinned, morphing, custom-shader/callback, shadow-casting and
non-default-layer meshes retain their normal path. Material/geometry replacement,
transparency changes, removed objects, mirrored transforms or shear fall back to the original draw. Singletons remain
unchanged. `dispose()` restores layers and the previous scene callback, releases
instance buffers, and leaves shared geometry/materials/textures owned by the scene.

Verification:

- `tests/scene-instancing.test.mjs`: animated transforms, parent/part visibility,
  frustum culling, material replacement, mirrored/sheared transforms, exceptional
  layers/callbacks, disposal and software rendering.
- `tests/scene-instancing-city.test.mjs`: real city, Nanjing Road, both metro lines
  and Yuyuan, 24 camera views with identical visible triangle counts, followed by
  moving NPC/train poses with world matrices preserved to 0.1 mm.

The deterministic scene test estimates submissions; it is not a WebGL FPS
benchmark. Local browser timing and any GPU-context failures must be recorded
separately. Keep resolution, lighting, textures, crowds and save revisions stable
when comparing builds.
