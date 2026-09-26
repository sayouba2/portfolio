import * as THREE from "three"

// Des extraits dans les langages de tes projets : c'est littéralement ce qu'il
// y a « sous la surface » de tes interfaces.
const SNIPPETS = [
    `# smartattend/api/attendance.py
@router.post("/sessions/{session_id}/attendance")
async def mark_attendance(session_id: int, frame: UploadFile,
                          db: AsyncSession = Depends(get_db)):
    faces = detector.get(await read_image(frame))
    for face in faces:
        match = await index.search(face.normed_embedding, k=1)
        if match.score > THRESHOLD:
            await record(db, session_id, match.student_id)
    return {"present": len(faces)}`,

    `// smart-recruit/hooks/useInterview.ts
export function useInterview(offerId: string) {
  const [turns, setTurns] = useState<Turn[]>([])
  useEffect(() => {
    const ws = new WebSocket(\`\${WS_URL}/interview/\${offerId}\`)
    ws.onmessage = (e) => setTurns((t) => [...t, JSON.parse(e.data)])
    return () => ws.close()
  }, [offerId])
  return turns
}`,

    `// smartattend/ModuleController.java
@RestController
@RequestMapping("/api/modules")
public class ModuleController {
    private final ModuleService service;

    @GetMapping("/{id}/stats")
    public AttendanceStats stats(@PathVariable Long id) {
        return service.computeStats(id);
    }
}`,

    `# glaucoma/explain.py
def gradcam(model, image, layer="out_relu"):
    with tf.GradientTape() as tape:
        conv, preds = grad_model(image[None])
        loss = preds[:, 1]
    grads = tape.gradient(loss, conv)
    weights = tf.reduce_mean(grads, axis=(0, 1, 2))
    heatmap = tf.nn.relu(conv[0] @ weights[..., None])
    return heatmap / tf.reduce_max(heatmap)`,

    `-- rapport de présence par séance
SELECT s.name, COUNT(a.id) AS presences
FROM students s
LEFT JOIN attendance a ON a.student_id = s.id
WHERE a.session_id = :session
GROUP BY s.name
ORDER BY presences DESC;`,

    `# rag-agent/chain.py
retriever = store.as_retriever(search_kwargs={"k": 4})
chain = prompt | llm | StrOutputParser()
answer = chain.invoke({"context": retriever.invoke(q), "question": q})`,
]

const KEYWORDS = new Set(("async await def return for if in with as from import public private final class " +
    "new const let export function useState useEffect SELECT FROM LEFT JOIN ON WHERE GROUP BY ORDER DESC AS COUNT").split(" "))

// Coloration de la proposition A : verre-de-mer, lanterne, violet de diff.
const INK = {
    text: "#9DB6B0",
    keyword: "#86E3CE",
    string: "#F3B27A",
    comment: "#56706B",
    deco: "#B9A4F0",
    number: "#F7D08A",
    call: "#D7ECE6",
}

/** Découpe une ligne en jetons colorés — une coloration syntaxique minimale. */
function tokens(line) {
    const out = []
    const re = /(\/\/.*|#.*|--.*)|("[^"]*"|'[^']*'|`[^`]*`)|(@\w+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)(?=\s*\()|(\b[A-Za-z_]\w*\b)|(\s+|.)/g
    let m
    while ((m = re.exec(line))) {
        const [t, com, str, deco, num, call, word] = m
        const color = com ? INK.comment : str ? INK.string : deco ? INK.deco : num ? INK.number
            : call ? INK.call : word && KEYWORDS.has(word) ? INK.keyword : INK.text
        out.push([t, color])
    }
    return out
}

/**
 * Une texture de code 2048², en deux colonnes comme deux panneaux d'éditeur,
 * sur fond transparent : le shader la compose avec le courant des abysses.
 * Elle boucle dans les deux sens, donc elle peut défiler indéfiniment.
 */
export async function makeCodeTexture() {
    await document.fonts.load('400 26px "Geist Mono"')
    const S = 2048
    const c = document.createElement("canvas")
    c.width = S
    c.height = S
    const g = c.getContext("2d")
    g.font = '400 26px "Geist Mono", ui-monospace, monospace'
    g.textBaseline = "top"
    const LH = 40
    const rows = Math.floor(S / LH)

    // Chaque colonne enchaîne les extraits, décalés, jusqu'à remplir la hauteur.
    const lines = SNIPPETS.flatMap((s) => [...s.split("\n"), ""])
    ;[{ x: 56, from: 0 }, { x: 1080, from: 23 }].forEach(({ x, from }) => {
        for (let r = 0; r < rows; r++) {
            const line = lines[(from + r) % lines.length]
            let cx = x
            for (const [t, color] of tokens(line)) {
                g.fillStyle = color
                g.fillText(t, cx, r * LH + 6)
                cx += g.measureText(t).width
            }
        }
    })

    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.generateMipmaps = true
    tex.minFilter = THREE.LinearMipmapLinearFilter
    return tex
}
