// Langue d'un message, pour répondre localement dans celle du visiteur et non dans celle du site :
// le plus de mots-outils reconnus l'emporte (un accent compte pour le français), sinon `fallback`.
const EN = /\b(what|where|when|who|how|why|which|are|is|do|does|can|could|you|your|the|and|of|for|with|hello|hi|hey|skills?|experiences?|projects?|available|based)\b/g
const FR = /\b(quel|quelle|quels|quelles|ou|quand|comment|pourquoi|est|es|tu|tes|ton|ta|vous|vos|le|la|les|des|du|un|une|et|de|pour|avec|bonjour|salut|competences?|projets?|disponible)\b/g

export function langOf(text, fallback) {
    const plain = text.toLowerCase().normalize("NFD")
    const accents = (plain.match(/\p{M}/gu) ?? []).length
    const words = plain.replace(/\p{M}/gu, "")
    const en = (words.match(EN) ?? []).length
    const fr = (words.match(FR) ?? []).length + accents
    return en > fr ? "en" : fr > en ? "fr" : fallback
}
