import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import pkg from '../package.json'

const writeFile = promisify(fs.writeFile)
const outputFolderName = 'dist'

async function createPackageFile() {
  const {
    main,
    module,
    scripts,
    devDependencies,
    husky,
    'lint-staged': lintStaged,
    ...packageDataOther
  } = pkg
  const newPackageData = {
    ...packageDataOther,
    main: main.replace(`${outputFolderName}/`, ''),
    module: module.replace(`${outputFolderName}/`, '')
  }
  const buildPath = path.resolve(__dirname, `../${outputFolderName}/package.json`)

  await writeFile(buildPath, JSON.stringify(newPackageData, null, 2), 'utf8')
  console.log(`Created package.json in ${buildPath}`)

  return newPackageData
}

createPackageFile()
