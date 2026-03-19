import { mkdir, writeFile } from 'node:fs/promises'

const OPENAPI_URL = process.env.OPENAPI_URL ?? 'http://localhost:3000/static/docs/openapi.json'
const OUTPUT_PATH = process.env.OPENAPI_OUTPUT ?? './openapi.sanitized.json'

function sanitizeSchemaNode(node) {
  if (Array.isArray(node)) {
    return node.map(sanitizeSchemaNode)
  }

  if (!node || typeof node !== 'object') {
    return node
  }

  const current = { ...node }

  // Not supported by OpenAPI 3.0 validators used by Orval.
  delete current.propertyNames

  // Convert JSON-Schema style numeric exclusives to OpenAPI 3.0 format.
  if (typeof current.exclusiveMinimum === 'number') {
    if (typeof current.minimum !== 'number') {
      current.minimum = current.exclusiveMinimum
    }
    current.exclusiveMinimum = true
  }

  if (typeof current.exclusiveMaximum === 'number') {
    if (typeof current.maximum !== 'number') {
      current.maximum = current.exclusiveMaximum
    }
    current.exclusiveMaximum = true
  }

  for (const key of Object.keys(current)) {
    current[key] = sanitizeSchemaNode(current[key])
  }

  return current
}

async function prepareOpenApi() {
  const response = await fetch(OPENAPI_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI: ${response.status} ${response.statusText}`)
  }

  const spec = await response.json()
  const sanitized = sanitizeSchemaNode(spec)

  const outputDir = OUTPUT_PATH.split('/').slice(0, -1).join('/')
  if (outputDir) {
    await mkdir(outputDir, { recursive: true })
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(sanitized, null, 2)}\n`, 'utf-8')
  console.log(`OpenAPI sanitized and saved to ${OUTPUT_PATH}`)
}

prepareOpenApi().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
