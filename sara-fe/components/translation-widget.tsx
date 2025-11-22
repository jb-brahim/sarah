"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"
import { Globe, Copy, Loader2 } from "lucide-react"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
]

export default function TranslationWidget() {
  const [text, setText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [translatedText, setTranslatedText] = useState("")
  const [note, setNote] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.translation.translate(text, targetLanguage)
      setTranslatedText(result.translatedText || result.text || "")
      setNote(result.note || null)
    } catch (err) {
      setError("Translation failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Translation Helper</h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Text to Translate</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Target Language</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          onClick={handleTranslate}
          disabled={!text.trim() || loading}
          className="w-full"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Translate
        </Button>

        {translatedText && (
          <div className="space-y-2 p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Translation</label>
              <button
                onClick={copyToClipboard}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <p className="text-foreground text-sm break-words">{translatedText}</p>
            {note && <p className="text-xs text-muted-foreground mt-2">{note}</p>}
          </div>
        )}
      </div>
    </Card>
  )
}
