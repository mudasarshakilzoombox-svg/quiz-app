import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'questions.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return new Response(data, {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Could not load questions' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
