'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const FORM_STATUS = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS]

interface FormData {
  nombre: string
  email: string
  telefono: string
  asunto: string
  mensaje: string
}

const INITIAL_FORM_DATA: FormData = {
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  mensaje: '',
}

const INPUT_CLASSES =
  'w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 transition-shadow focus:border-transparent focus:ring-2 focus:ring-pradera-500 focus:outline-none'

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [status, setStatus] = useState<FormStatus>(FORM_STATUS.IDLE)
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus(FORM_STATUS.SUBMITTING)
    setErrorMessage('')

    try {
      const response = await fetch('/api/mensajes-contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje. Intenta nuevamente.')
      }

      setStatus(FORM_STATUS.SUCCESS)
      setFormData(INITIAL_FORM_DATA)
    } catch (err) {
      setStatus(FORM_STATUS.ERROR)
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Ocurrio un error inesperado.',
      )
    }
  }

  if (status === FORM_STATUS.SUCCESS) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-gray-50 p-12 text-center">
        <CheckCircle className="mb-4 h-12 w-12 text-pradera-600" />
        <h3 className="font-display text-xl font-medium text-gray-900">
          Mensaje enviado
        </h3>
        <p className="mt-2 text-gray-500">
          Gracias por comunicarte con nosotros. Te responderemos a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => setStatus(FORM_STATUS.IDLE)}
          className="mt-6 rounded-full bg-pradera-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pradera-700"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-gray-500">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          value={formData.nombre}
          onChange={handleChange}
          className={INPUT_CLASSES}
          placeholder="Tu nombre completo"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-500">
          Correo electronico <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={INPUT_CLASSES}
          placeholder="tu@email.com"
        />
      </div>

      {/* Telefono */}
      <div>
        <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium text-gray-500">
          Telefono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          className={INPUT_CLASSES}
          placeholder="+51 999 999 999"
        />
      </div>

      {/* Asunto */}
      <div>
        <label htmlFor="asunto" className="mb-1.5 block text-sm font-medium text-gray-500">
          Asunto <span className="text-red-500">*</span>
        </label>
        <input
          id="asunto"
          name="asunto"
          type="text"
          required
          value={formData.asunto}
          onChange={handleChange}
          className={INPUT_CLASSES}
          placeholder="Motivo de tu consulta"
        />
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium text-gray-500">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          value={formData.mensaje}
          onChange={handleChange}
          className={INPUT_CLASSES + ' resize-none'}
          placeholder="Escribe tu mensaje aqui..."
        />
      </div>

      {/* Error */}
      {status === FORM_STATUS.ERROR && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === FORM_STATUS.SUBMITTING}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-pradera-600 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-pradera-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === FORM_STATUS.SUBMITTING ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Enviar mensaje
          </>
        )}
      </button>
    </form>
  )
}
