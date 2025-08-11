import React from 'react';
import { z } from 'zod';
import { useGameNotes, useCreateGameNote } from '../helpers/useGameNotes';
import { schema as createNoteSchema } from '../endpoints/games/notes_POST.schema';

// Create the omitted schema type for the form
const noteFormSchema = createNoteSchema.omit({ gameId: true });
type NoteFormData = z.infer<typeof noteFormSchema>;
import { useForm, Form, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Button } from './Button';
import { Skeleton } from './Skeleton';
import { toast } from 'sonner';
import { BookText, Plus } from 'lucide-react';
import styles from './NotesSection.module.css';

interface NotesSectionProps {
  gameId: number;
}

const NoteForm = ({ gameId }: { gameId: number }) => {
  const form = useForm({
    schema: noteFormSchema,
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const createNoteMutation = useCreateGameNote();

  const onSubmit = (values: NoteFormData) => {
    createNoteMutation.mutate({ ...values, gameId }, {
      onSuccess: () => {
        toast.success('Note added successfully!');
                form.setValues({
          title: "",
          content: "",
        });
      },
      onError: (error) => {
        toast.error(`Failed to add note: ${error.message}`);
      },
    });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Add a New Note</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="title">
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Main Quest Walkthrough"
                value={form.values.title}
                onChange={(e) => form.setValues((prev) => ({ ...prev, title: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="content">
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Your notes here..."
                rows={5}
                value={form.values.content}
                onChange={(e) => form.setValues((prev) => ({ ...prev, content: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button type="submit" disabled={createNoteMutation.isPending} className={styles.submitButton}>
            <Plus size={16} />
            {createNoteMutation.isPending ? 'Adding Note...' : 'Add Note'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const NotesListSkeleton = () => (
  <div className={styles.list}>
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className={styles.noteItem}>
        <Skeleton style={{ height: '24px', width: '40%', marginBottom: 'var(--spacing-2)' }} />
        <Skeleton style={{ height: '16px', width: '90%' }} />
        <Skeleton style={{ height: '16px', width: '80%', marginTop: 'var(--spacing-1)' }} />
      </div>
    ))}
  </div>
);

export function NotesSection({ gameId }: NotesSectionProps) {
  const { data: notes, isFetching, error } = useGameNotes(gameId);

  return (
    <div className={styles.section}>
      <div className={styles.listContainer}>
        {isFetching && <NotesListSkeleton />}
        {error && <p className={styles.error}>Failed to load notes.</p>}
        {!isFetching && notes && (
          <>
            {notes.length === 0 ? (
              <div className={styles.emptyState}>
                <BookText size={48} className={styles.emptyIcon} />
                <h4>No Notes Yet</h4>
                <p>Add your first note using the form.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {notes.map((note) => (
                  <div key={note.id} className={styles.noteItem}>
                    <h4 className={styles.noteTitle}>{note.title}</h4>
                    <p className={styles.noteContent}>{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <NoteForm gameId={gameId} />
    </div>
  );
}