import * as dialog from "@radix-ui/react-dialog"
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {

  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)

  const [isRecording, setIsRecording] = useState(false)

  const [content, setContent] = useState('')

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleShowTextarea() {
      setShouldShowOnboarding(false) 
    }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)
    
    if(event.target.value === "") {
        setShouldShowOnboarding(true)
      }
  }

  console.log(content)

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()
    
    if (content === '') {
      return
    }

    onNoteCreated(content)

    setIsDialogOpen(false)

    setShouldShowOnboarding(true)

    setContent('')

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {

    setIsRecording(true)

    setShouldShowOnboarding(false)

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Infelizmente, seu navegador não suporta a API de gravação')
      return
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, "")

      setContent(transcription)

    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }
    
    speechRecognition.start()

  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
  <dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <dialog.Trigger className='rounded-md text-left outline-none flex flex-col bg-slate-700 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:transition hover:ring-slate-400 focus-visible:ring-2 focus-visible:ring-lime-400'>
      <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
      </span>
      <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
      </p>
    </dialog.Trigger>

    <dialog.Portal>
    <dialog.Overlay className='inset-0 fixed bg-black/50' />
    <dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-[640px] w-full bg-slate-700 md:h-[60vh] rounded-md flex flex-col outline-none'>

      <dialog.Close className='bg-slate-800 absolute top-0 right-0 p-1.5 text-slate-400'>
          <X className='size-5 hover:text-slate-100'/>
      </dialog.Close>

      <form className="flex-1 flex flex-col">
        <div className='flex flex-1 flex-col gap-3 p-8 md:p-5'>
          <span className='text-xl md:text-base font-medium text-slate-200'>
            Adicionar nota
          </span>

          {shouldShowOnboarding ? (
            <p className='leading-6 text-slate-300 md:text-slate-400'>
              Comece <button type='button' onClick={handleStartRecording} className="font-medium text-lime-400 md:hover:underline"> gravando uma nota </button> ou se preferir <button type="button" onClick={handleShowTextarea} className="font-medium text-lime-400 hover:underline"> utilize apenas texto </button>
              </p>
              ) : <textarea autoFocus spellCheck="false" className="leading-6 text-slate-300 bg-transparent resize-none outline-none flex-1"
              onChange={handleContentChanged} value={content}/> 
            }

          </div>
            {isRecording ? (
              <button type="button" onClick={handleStopRecording} className='w-full flex items-center justify-center gap-1 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none group font-semibold hover:text-slate-100 hover:transition '>
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique para interromper)
              </button>
            ) : (<button type="button" onClick={handleSaveNote} className='w-full bg-lime-500 py-4 text-center text-sm text-lime-950 outline-none font-medium group hover:bg-lime-600'>
              <span className="text-slate-800 font-semibold">
              Salvar nota </span>
              </button>)}
          </form>
        </dialog.Content>
      </dialog.Portal>
    </dialog.Root>
  )
}