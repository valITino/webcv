// "Evidence log" — asset attributions for the 3D models used in the scene.
// Update sources/authors as the real provenance of each .glb is confirmed.
export const credits = {
  intro:
    'Every object logged into this scene is catalogued below. 3D models were sourced as .glb assets and optimised (WebP textures + meshopt compression) for the web.',
  assets: [
    { ref: 'EX-DESK-01', name: 'Antique Desk', note: 'Primary surface — the investigator’s desk.' },
    { ref: 'EX-BOARD-02', name: 'Police Evidence Board', note: 'Backdrop — the pinned exhibits & strings.' },
    { ref: 'EX-FOLDER-03', name: 'Document File Folder', note: 'Case files — one per exhibit.' },
    { ref: 'EX-CUP-04', name: 'Coffee Cup', note: 'Fuel. Older than you’d think.' },
  ],
  thanks:
    'Concept & art direction inspired by cinematic, object-driven 3D portfolios. Built with React Three Fiber, drei, postprocessing and GSAP.',
  build: 'Interactive 3D résumé — engineered, not assumed.',
}
