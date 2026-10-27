const MAX_MESSAGES = 10
const MAX_CHARS = 1000
const MAX_BODY = 20_000

/** Historique envoyé par l'assistant du site → messages OpenAI, ou null si la requête est invalide. */
export async function readMessages(request) {
    if (Number(request.headers.get("Content-Length")) > MAX_BODY) return null
    let body
    try {
        body = await request.json()
    } catch {
        return null
    }
    const list = Array.isArray(body?.messages) ? body.messages.slice(-MAX_MESSAGES) : []
    const messages = list
        .map(m => ({ role: m?.role === "user" ? "user" : "assistant", content: String(m?.text ?? "").slice(0, MAX_CHARS) }))
        .filter(m => m.content.trim())
    return messages.at(-1)?.role === "user" ? messages : null
}

/** Flux SSE d'OpenAI (chat completions) → texte brut, morceau par morceau. */
export function sseToText() {
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let buffer = ""
    return new TransformStream({
        transform(chunk, controller) {
            buffer += decoder.decode(chunk, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop()
            for (const raw of lines) {
                const line = raw.trim()
                if (!line.startsWith("data:") || line === "data: [DONE]") continue
                try {
                    const text = JSON.parse(line.slice(5)).choices?.[0]?.delta?.content
                    if (text) controller.enqueue(encoder.encode(text))
                } catch { /* ligne de service sans JSON : ignorée */ }
            }
        },
    })
}
