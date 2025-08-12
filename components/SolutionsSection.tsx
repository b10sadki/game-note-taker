import React from 'react';
import { z } from 'zod';
import { useGameSolutions, useCreateGameSolution, useDeleteGameSolution } from '../helpers/useGameSolutions';
import { useGenerateSolution } from '../helpers/useGenerateSolution';
import { schema as createSolutionSchema } from '../endpoints/games/solutions_POST.schema';
import { schema as generateSolutionSchema } from '../endpoints/games/solutions/generate_POST.schema';

// Create the omitted schema type for the form
const solutionFormSchema = createSolutionSchema.omit({ gameId: true, aiGenerated: true });
type SolutionFormData = z.infer<typeof solutionFormSchema>;

// Create schema type for AI generation form
const aiGenerationFormSchema = generateSolutionSchema.omit({ gameId: true });
type AiGenerationFormData = z.infer<typeof aiGenerationFormSchema>;
import { useForm, Form, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Textarea } from './Textarea';
import { Button } from './Button';
import { Skeleton } from './Skeleton';
import { Badge } from './Badge';
import { toast } from 'sonner';
import { Lightbulb, Plus, Sparkles, Trash2 } from 'lucide-react';
import styles from './SolutionsSection.module.css';

interface SolutionsSectionProps {
  gameId: number;
}

const AiSolutionForm = ({ gameId }: { gameId: number }) => {
  const form = useForm({
    schema: aiGenerationFormSchema,
    defaultValues: {
      problem: '',
    },
  });

  const generateSolutionMutation = useGenerateSolution();

  const onSubmit = (values: AiGenerationFormData) => {
    generateSolutionMutation.mutate({ ...values, gameId }, {
      onSuccess: () => {
        form.setValues({
          problem: "",
        });
      },
      onError: (error) => {
        toast.error(`Failed to generate AI solution: ${error.message}`);
      },
    });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>
        <Sparkles size={20} />
        Generate AI Solution
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="problem">
            <FormLabel>Problem Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the problem you need help with..."
                rows={4}
                value={form.values.problem}
                onChange={(e) => form.setValues((prev) => ({ ...prev, problem: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button type="submit" disabled={generateSolutionMutation.isPending} className={styles.submitButton}>
            <Sparkles size={16} />
            {generateSolutionMutation.isPending ? 'Generating...' : 'Generate with AI'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const SolutionForm = ({ gameId }: { gameId: number }) => {
  const form = useForm({
    schema: solutionFormSchema,
    defaultValues: {
      problem: '',
      solution: '',
    },
  });

  const createSolutionMutation = useCreateGameSolution();

  const onSubmit = (values: SolutionFormData) => {
    createSolutionMutation.mutate({ ...values, gameId, aiGenerated: false }, {
      onSuccess: () => {
        toast.success('Solution added successfully!');
                form.setValues({
          problem: "",
          solution: "",
        });
      },
      onError: (error) => {
        toast.error(`Failed to add solution: ${error.message}`);
      },
    });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Add a New Solution</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="problem">
            <FormLabel>Problem</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the problem or puzzle..."
                rows={3}
                value={form.values.problem}
                onChange={(e) => form.setValues((prev) => ({ ...prev, problem: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="solution">
            <FormLabel>Solution</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide the solution..."
                rows={5}
                value={form.values.solution}
                onChange={(e) => form.setValues((prev) => ({ ...prev, solution: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button type="submit" disabled={createSolutionMutation.isPending} className={styles.submitButton}>
            <Plus size={16} />
            {createSolutionMutation.isPending ? 'Adding Solution...' : 'Add Solution'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const SolutionsListSkeleton = () => (
  <div className={styles.list}>
    {Array.from({ length: 1 }).map((_, i) => (
      <div key={i} className={styles.solutionItem}>
        <Skeleton style={{ height: '24px', width: '50%', marginBottom: 'var(--spacing-4)' }} />
        <Skeleton style={{ height: '16px', width: '90%' }} />
        <Skeleton style={{ height: '16px', width: '80%', marginTop: 'var(--spacing-1)' }} />
        <Skeleton style={{ height: '24px', width: '30%', marginTop: 'var(--spacing-4)' }} />
        <Skeleton style={{ height: '16px', width: '95%', marginTop: 'var(--spacing-2)' }} />
        <Skeleton style={{ height: '16px', width: '85%', marginTop: 'var(--spacing-1)' }} />
      </div>
    ))}
  </div>
);

export function SolutionsSection({ gameId }: SolutionsSectionProps) {
  const { data: solutions, isFetching, error } = useGameSolutions(gameId);
  const deleteSolutionMutation = useDeleteGameSolution();

  const handleDeleteSolution = async (solutionId: number) => {
    console.log('handleDeleteSolution called with solutionId:', solutionId);
    if (window.confirm('Are you sure you want to delete this solution?')) {
      console.log('User confirmed deletion, calling mutation');
      try {
        await deleteSolutionMutation.mutateAsync({ solutionId });
        console.log('Delete mutation successful');
        toast.success('Solution deleted successfully!');
      } catch (error) {
        console.log('Delete mutation error:', error);
        toast.error('Failed to delete solution');
      }
    } else {
      console.log('User cancelled deletion');
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.listContainer}>
        {isFetching && <SolutionsListSkeleton />}
        {error && <p className={styles.error}>Failed to load solutions.</p>}
        {!isFetching && solutions && (
          <>
            {solutions.length === 0 ? (
              <div className={styles.emptyState}>
                <Lightbulb size={48} className={styles.emptyIcon} />
                <h4>No Solutions Yet</h4>
                <p>Add your first solution using the form.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {solutions.map((solution) => (
                  <div key={solution.id} className={styles.solutionItem}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.problemTitle}>Problem</h4>
                      <div className={styles.headerActions}>
                        {solution.aiGenerated && <Badge variant="secondary">AI Generated</Badge>}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log('Delete button clicked for solution:', solution.id);
                            handleDeleteSolution(solution.id);
                          }}
                          className={styles.deleteButton}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className={styles.problemText}>{solution.problem}</p>
                    <h4 className={styles.solutionTitle}>Solution</h4>
                    <p className={styles.solutionText}>{solution.solution}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.formsContainer}>
        <AiSolutionForm gameId={gameId} />
        <SolutionForm gameId={gameId} />
      </div>
    </div>
  );
}