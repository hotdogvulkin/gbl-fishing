import { useState, useRef, type FormEvent } from 'react'
import type { Catch } from '../types'
import { identifyFish } from '../lib/claude'

interface Props {
  onAdd: (catch_: Catch) => void
  onCancel: () => void
}

const empty = {
  species: '',
  bait: '',
  weight: '',
  length: '',
  timeCaught: '',
  notes: '',
}

// Resize image to max 800px on longest side, encode as JPEG base64
async function compressImage(
  file: File
): Promise<{ base64: string; mediaType: 'image/jpeg' }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX = 800
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      // Remove the data: URI prefix — Claude expects raw base64
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
      resolve({ base64: dataUrl.split(',')[1], mediaType: 'image/jpeg' })
    }
    img.onerror = reject
    img.src = url
  })
}

type IdentifyState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; species: string; confidence: 'high' | 'medium' | 'low'; description: string }
  | { status: 'unidentified' }
  | { status: 'error'; message: string }

export default function CatchForm({ onAdd, onCancel }: Props) {
  const [fields, setFields] = useState(empty)
  const [identify, setIdentify] = useState<IdentifyState>({ status: 'idle' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  function set(key: keyof typeof empty, value: string) {
    setFields(f => ({ ...f, [key]: value }))
  }

  async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset the input so the same file can be re-selected after a dismiss
    e.target.value = ''

    setIdentify({ status: 'loading' })

    try {
      const { base64, mediaType } = await compressImage(file)
      const result = await identifyFish(base64, mediaType)

      if (!result.species) {
        setIdentify({ status: 'unidentified' })
        return
      }

      setIdentify({
        status: 'success',
        species: result.species,
        confidence: result.confidence,
        description: result.description,
      })
      // Pre-fill the species field
      setFields(f => ({ ...f, species: result.species }))
    } catch (err) {
      setIdentify({
        status: 'error',
        message: err instanceof Error ? err.message : 'Identification failed',
      })
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!fields.species.trim() || !fields.bait.trim()) return

    onAdd({
      id: crypto.randomUUID(),
      species: fields.species.trim(),
      bait: fields.bait.trim(),
      weight: fields.weight.trim() || undefined,
      length: fields.length.trim() || undefined,
      timeCaught: fields.timeCaught,
      notes: fields.notes.trim() || undefined,
    })

    setFields(empty)
    setIdentify({ status: 'idle' })
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent'

  const confidencePill = (confidence: 'high' | 'medium' | 'low') => {
    const map = {
      high:   'bg-green-50 text-green-700',
      medium: 'bg-yellow-50 text-yellow-700',
      low:    'bg-orange-50 text-orange-700',
    }
    return map[confidence]
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">New Catch</p>

        {/* Camera / identify button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={identify.status === 'loading'}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 disabled:opacity-50 px-2.5 py-1.5 rounded-md transition-colors"
          title="Identify fish from photo"
        >
          {identify.status === 'loading' ? (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          )}
          {identify.status === 'loading' ? 'Identifying…' : 'ID Fish'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelected}
        className="hidden"
        aria-label="Select fish photo"
      />

      {/* Identifier result banner */}
      {identify.status === 'success' && (
        <div className="bg-white border border-teal-100 rounded-xl px-3 py-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-gray-800">{identify.species}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${confidencePill(identify.confidence)}`}>
                {identify.confidence} confidence
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{identify.description}</p>
          </div>
          <button
            type="button"
            onClick={() => setIdentify({ status: 'idle' })}
            className="text-gray-300 hover:text-gray-500 flex-shrink-0"
            aria-label="Dismiss identification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      )}

      {identify.status === 'unidentified' && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-800">Could not identify — please enter species manually</p>
            <button
              type="button"
              onClick={() => setIdentify({ status: 'idle' })}
              className="text-xs text-amber-600 mt-0.5"
            >
              Try another photo
            </button>
          </div>
        </div>
      )}

      {identify.status === 'error' && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <p className="text-xs text-red-700 flex-1">{identify.message}</p>
          <button type="button" onClick={() => setIdentify({ status: 'idle' })} className="text-red-400 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      )}

      {/* Form fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Species *</label>
          <input
            type="text"
            value={fields.species}
            onChange={e => set('species', e.target.value)}
            placeholder="e.g. Largemouth Bass"
            className={inputClass}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Bait used *</label>
          <input
            type="text"
            value={fields.bait}
            onChange={e => set('bait', e.target.value)}
            placeholder="e.g. Chartreuse spinnerbait"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Weight</label>
          <input
            type="text"
            value={fields.weight}
            onChange={e => set('weight', e.target.value)}
            placeholder="e.g. 3.2 lbs"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Length</label>
          <input
            type="text"
            value={fields.length}
            onChange={e => set('length', e.target.value)}
            placeholder="e.g. 17 in"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Time caught</label>
          <input
            type="time"
            value={fields.timeCaught}
            onChange={e => set('timeCaught', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Notes</label>
        <textarea
          value={fields.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Structure, depth, conditions…"
          rows={2}
          className={inputClass + ' resize-none'}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-teal-600 text-sm font-semibold text-white disabled:opacity-50"
          disabled={!fields.species.trim() || !fields.bait.trim()}
        >
          Add to Trip
        </button>
      </div>
    </form>
  )
}
