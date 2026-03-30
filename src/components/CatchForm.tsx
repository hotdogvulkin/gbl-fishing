import { useState, type FormEvent } from 'react'
import type { Catch } from '../types'

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

export default function CatchForm({ onAdd, onCancel }: Props) {
  const [fields, setFields] = useState(empty)

  function set(key: keyof typeof empty, value: string) {
    setFields(f => ({ ...f, [key]: value }))
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
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent'

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3"
    >
      <p className="text-sm font-semibold text-gray-700">New Catch</p>

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
