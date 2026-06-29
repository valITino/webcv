// Optimize raw Sketchfab GLBs into web-ready assets.
// - Resizes + re-encodes textures to WebP
// - Applies meshopt geometry compression (decoded automatically by drei's useGLTF)
// - Preserves node hierarchy (desk drawers) and animations (folder open/close)
//
// Run: npm run optimize:models
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, resample, textureCompress, meshopt } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import sharp from 'sharp'
import { statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAW = path.join(root, 'raw-assets')
const OUT = path.join(root, 'public', 'models')

// per-model texture budget (px). The board is the focal backdrop → keep it sharp.
// Optional entries are skipped automatically until the raw .glb is dropped in.
const JOBS = [
  { in: 'desk.glb', out: 'desk.glb', tex: 1024 },
  { in: 'board.glb', out: 'board.glb', tex: 2048 },
  { in: 'folder.glb', out: 'folder.glb', tex: 1024 },
  { in: 'coffee.glb', out: 'coffee.glb', tex: 512 },
  // ── send these next; they'll be picked up here automatically ──
  { in: 'lamp.glb', out: 'lamp.glb', tex: 1024 },
  { in: 'phone.glb', out: 'phone.glb', tex: 1024 },
  { in: 'monitor.glb', out: 'monitor.glb', tex: 1024 },
  { in: 'magnifier.glb', out: 'magnifier.glb', tex: 1024 },
  { in: 'keys.glb', out: 'keys.glb', tex: 512 },
]

const kb = (p) => (statSync(p).size / 1024).toFixed(0) + ' KB'

await MeshoptDecoder.ready
await MeshoptEncoder.ready

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder })

for (const job of JOBS) {
  const input = path.join(RAW, job.in)
  const output = path.join(OUT, job.out)
  if (!existsSync(input)) {
    console.log(`· ${job.in.padEnd(12)} (not present — skipped)`)
    continue
  }
  try {
    const doc = await io.read(input)
    await doc.transform(
      dedup(),
      prune(),
      resample(),
      textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [job.tex, job.tex] }),
      meshopt({ encoder: MeshoptEncoder, level: 'high' }),
    )
    await io.write(output, doc)
    console.log(`✓ ${job.in.padEnd(12)} ${kb(input).padStart(9)}  →  ${job.out.padEnd(12)} ${kb(output).padStart(9)}`)
  } catch (err) {
    console.error(`✗ ${job.in}: ${err.message}`)
    process.exitCode = 1
  }
}
