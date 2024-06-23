import * as dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { FormEvent, useState } from "react"

interface NoteCardProps {
    onNoteDeleted: (id: string) => void
    note: {
    id: string;
    date: Date;
    content: string;
    }
  }

export function NoteCard({onNoteDeleted, note}: NoteCardProps) {

    const [open, setOpen] = useState(false)

        function handleDeleteNote (event: FormEvent) {
            setOpen(false)

            onNoteDeleted(note.id)
        }

    return (
        <dialog.Root open={open} onOpenChange={setOpen}>
            <dialog.Trigger className='rounded-md text-left outline-none flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:transition hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                    <span className='text-sm font-medium text-slate-300'>
                        {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})} 
                    </span>
                    <p className='text-sm leading-6 text-slate-400'>
                        {note.content}
                    </p>

                    <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' />
            </dialog.Trigger>

            <dialog.Portal>
                <dialog.Overlay className='inset-0 fixed bg-black/50' />
                <dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full bg-slate-700 h-[60vh] rounded-md flex flex-col outline-none'>
                    <dialog.Close className='bg-slate-800 absolute top-0 right-0 p-1.5 text-slate-400'>
                        <X className='size-5 hover:text-slate-100'/>
                    </dialog.Close>
                    <form onSubmit={handleDeleteNote} className='flex flex-1 flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-300'>
                                {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})} 
                            </span>
                            <p className='text-sm leading-6 text-slate-400'>
                                {note.content}
                            </p>
                        </div>

                        <button type="submit" className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group'>
                            Deseja <span className='text-red-500 group-hover:underline'> apagar esta nota </span>?
                        </button>
                    </form>
                </dialog.Content>
            </dialog.Portal>
        </dialog.Root>
    )
}