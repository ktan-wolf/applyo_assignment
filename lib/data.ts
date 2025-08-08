// @ts-nocheck
import fs from 'fs'
import path from 'path'

// Path to store data
const dataFile = path.join(process.cwd(), 'data.json')

// Load data from file or initialize
function loadData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [], boards: [] }, null, 2))
  }
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'))
}

// Save data to file
export function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
}

const { users, boards } = loadData()

export { users, boards }
