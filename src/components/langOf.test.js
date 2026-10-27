// node --test src/components/langOf.test.js
import test from "node:test"
import assert from "node:assert/strict"
import { langOf } from "./langOf.js"

test("langOf suit la langue du message et retombe sur celle du site quand rien ne tranche", () => {
    for (const text of ["What are your skills?", "Where are you based and are you available?", "hello", "what are your exeperiences ?"]) assert.equal(langOf(text, "fr"), "en", text)
    for (const text of ["Quelles sont tes compétences ?", "Où es-tu basé ?", "salut", "pourquoi tes stages se chevauchent ?"]) assert.equal(langOf(text, "en"), "fr", text)
    for (const text of ["React ?", "ok", ""]) assert.equal(langOf(text, "fr"), "fr", text)
})
