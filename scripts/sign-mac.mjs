import { execSync } from 'child_process'
import { existsSync, mkdirSync, rmSync, symlinkSync, cpSync, readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { tmpdir } from 'os'

const root = resolve(import.meta.dirname, '..')
const ents = join(root, 'build', 'entitlements.mac.plist')

// 가능한 출력 디렉터리 순서대로 탐색
const candidateDirs = ['mac', 'mac-arm64', 'mac-universal']
let appDir = null
let appName = null

for (const dir of candidateDirs) {
  const full = join(root, 'dist', dir)
  if (!existsSync(full)) continue
  const found = readdirSync(full).find(f => f.endsWith('.app'))
  if (found) { appDir = full; appName = found; break }
}

if (!appDir) {
  console.error('❌ .app을 찾을 수 없습니다 (dist/mac, dist/mac-arm64, dist/mac-universal)')
  process.exit(1)
}

const appPath = join(appDir, appName)
const baseName = appName.replace(/\.app$/, '')
console.log(`✦ 앱 경로: ${appPath}`)

// 1) 네이티브 바이너리 서명
const nativeExts = ['.dylib', '.so', '.node']
function signNatives(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name)
    if (ent.isDirectory()) { signNatives(full) }
    else if (nativeExts.some(e => ent.name.endsWith(e))) {
      execSync(`codesign --force --sign - "${full}"`, { stdio: 'inherit' })
    }
  }
}
signNatives(appPath)

// 2) .app 전체를 entitlements 포함하여 ad-hoc 서명
execSync(
  `codesign --force --deep --sign - --entitlements "${ents}" --options runtime "${appPath}"`,
  { stdio: 'inherit' }
)
console.log('✅ 서명 완료')

// 3) DMG 재생성
const staging = join(tmpdir(), `dmg-staging-${Date.now()}`)
mkdirSync(staging)
cpSync(appPath, join(staging, appName), { recursive: true })
symlinkSync('/Applications', join(staging, 'Applications'))

const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version

const dmgOut = join(root, 'dist', `${baseName}-${version}.dmg`)
if (existsSync(dmgOut)) rmSync(dmgOut)

execSync(
  `hdiutil create -volname "${baseName} ${version}" -srcfolder "${staging}" -ov -format UDZO -fs APFS "${dmgOut}"`,
  { stdio: 'inherit' }
)
rmSync(staging, { recursive: true })
console.log('✅ DMG 생성:', dmgOut)
