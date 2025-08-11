import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useGames, useDeleteGame } from '../helpers/useGames';
import { useUpdateGameStatus } from '../helpers/useUpdateGameStatus';
import { AppHeader } from '../components/AppHeader';
import { FeatureCards } from '../components/FeatureCards';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatusBadge } from '../components/StatusBadge';
import { Skeleton } from '../components/Skeleton';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Select';
import { PlusCircle, Gamepad2, Star, Calendar, Trash2 } from 'lucide-react';
import { AddGameDialog } from '../components/AddGameDialog';
import { toast } from 'sonner';
import type { Selectable } from 'kysely';
import type { Games, GameStatus } from '../helpers/schema';
import styles from './_index.module.css';

const GameCard = ({ game }: { game: Selectable<Games> }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteGameMutation = useDeleteGame();
  const updateStatusMutation = useUpdateGameStatus();

  const formatReleaseDate = (dateString: string | Date | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return null;
    }
  };

  const formatRating = (rating: string | number | null) => {
    if (!rating) return null;
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? null : numRating.toFixed(1);
  };

  const handleDeleteGame = async () => {
    try {
      await deleteGameMutation.mutateAsync({ gameId: game.id });
      toast.success(`"${game.name}" has been deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete game:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete game';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleStatusChange = async (newStatus: GameStatus) => {
    if (newStatus === game.status) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        gameId: game.id,
        status: newStatus,
      });
    } catch (error) {
      console.error('Failed to update game status:', error);
      // Error toast is handled by the mutation hook
    }
  };

  const handleStatusSelectChange = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const releaseYear = formatReleaseDate(game.released);
  const formattedRating = formatRating(game.rating);

  return (
    <>
      <Link to={`/games/${game.id}`} className={styles.gameCard}>
        <div className={styles.imageWrapper}>
          {game.imageUrl ? (
            <img src={game.imageUrl} alt={game.name} className={styles.gameImage} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <Gamepad2 size={48} />
            </div>
          )}
          {formattedRating && (
            <div className={styles.ratingBadge}>
              <Star size={14} />
              <span>{formattedRating}</span>
            </div>
          )}
          <Button
            variant="destructive"
            size="icon-sm"
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            disabled={deleteGameMutation.isPending}
          >
            <Trash2 size={14} />
          </Button>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{game.name}</h3>
            {releaseYear && (
              <div className={styles.releaseDate}>
                <Calendar size={14} />
                <span>{releaseYear}</span>
              </div>
            )}
          </div>

          <div className={styles.statusSection}>
            <StatusBadge status={game.status} className={styles.statusBadge} />
            <div className={styles.statusSelect} onClick={handleStatusSelectChange}>
              <Select
                value={game.status}
                onValueChange={handleStatusChange}
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger className={styles.statusSelectTrigger}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">
                    <StatusBadge status="not_started" size="small" />
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <StatusBadge status="in_progress" size="small" />
                  </SelectItem>
                  <SelectItem value="completed">
                    <StatusBadge status="completed" size="small" />
                  </SelectItem>
                  <SelectItem value="on_hold">
                    <StatusBadge status="on_hold" size="small" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {game.description && (
            <p className={styles.cardDescription}>{game.description}</p>
          )}
          
          {game.platforms && game.platforms.length > 0 && (
            <div className={styles.platforms}>
              {game.platforms.slice(0, 3).map((platform) => (
                <Badge key={platform} variant="outline" className={styles.platformBadge}>
                  {platform}
                </Badge>
              ))}
              {game.platforms.length > 3 && (
                <Badge variant="outline" className={styles.platformBadge}>
                  +{game.platforms.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {game.genres && game.genres.length > 0 && (
            <div className={styles.genres}>
              {game.genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className={styles.genreBadge}>
                  {genre}
                </Badge>
              ))}
              {game.genres.length > 2 && (
                <Badge variant="secondary" className={styles.genreBadge}>
                  +{game.genres.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteGame}
        isDeleting={deleteGameMutation.isPending}
        gameName={game.name}
      />
    </>
  );
};

const GameGridSkeleton = () => (
  <div className={styles.gameGrid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={styles.skeletonCard}>
        <div className={styles.skeletonImageWrapper}>
          <Skeleton className={styles.skeletonImage} />
        </div>
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonHeader}>
            <Skeleton style={{ height: '1.5rem', width: '70%' }} />
            <Skeleton style={{ height: '1rem', width: '3rem' }} />
          </div>
          <Skeleton style={{ height: '1rem', width: '100%', margin: 'var(--spacing-2) 0' }} />
          <Skeleton style={{ height: '1rem', width: '85%', marginBottom: 'var(--spacing-3)' }} />
          <div className={styles.skeletonBadges}>
            <Skeleton style={{ height: '1.5rem', width: '4rem' }} />
            <Skeleton style={{ height: '1.5rem', width: '3.5rem' }} />
            <Skeleton style={{ height: '1.5rem', width: '2.5rem' }} />
          </div>
          <div className={styles.skeletonBadges}>
            <Skeleton style={{ height: '1.5rem', width: '3rem' }} />
            <Skeleton style={{ height: '1.5rem', width: '4.5rem' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function HomePage() {
  const { data: games, isFetching, error } = useGames();
  const [isAddGameDialogOpen, setAddGameDialogOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>My Games | GameNotes - AI-Powered Gaming Assistant</title>
        <meta name="description" content="Track, organize, and enhance your gaming experience with AI-powered notes and solutions." />
      </Helmet>
      
      <div className={styles.pageWrapper}>
        <AppHeader />
        
        <main className={styles.container}>
          <div className={styles.heroSection}>
            <header className={styles.header}>
              <div className={styles.headerContent}>
                <h1 className={styles.title}>Games Notes</h1>
                <p className={styles.subtitle}>
                  Track your progress, capture strategies, and unlock AI-powered gaming insights
                </p>
              </div>
              <Button 
                onClick={() => setAddGameDialogOpen(true)}
                className={styles.addGameButton}
                size="lg"
              >
                <PlusCircle size={20} />
                Add New Game
              </Button>
            </header>
          </div>

          <div className={styles.contentSection}>
            {isFetching && <GameGridSkeleton />}

            {error && (
              <div className={styles.errorState}>
                <Gamepad2 size={64} className={styles.errorIcon} />
                <h2>Failed to Load Games</h2>
                <p>We couldn't retrieve your game library. Please check your connection and try again.</p>
                <pre>{error instanceof Error ? error.message : 'An unknown error occurred'}</pre>
              </div>
            )}

            {!isFetching && games && (
              <>
                {games.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateContent}>
                      <Gamepad2 size={80} className={styles.emptyIcon} />
                      <h2>Ready to Start Your Gaming Journey?</h2>
                      <p>
                        Begin building your gaming library and unlock the power of AI-assisted note-taking and strategy generation.
                      </p>
                      <Button 
                        onClick={() => setAddGameDialogOpen(true)}
                        className={styles.emptyStateButton}
                        size="lg"
                      >
                        <PlusCircle size={20} />
                        Add Your First Game
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.gamesHeader}>
                      <h2 className={styles.gamesTitle}>Your Games ({games.length})</h2>
                    </div>
                    <div className={styles.gameGrid}>
                      {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className={styles.featuresSection}>
            <div className={styles.featuresHeader}>
              <h2 className={styles.featuresTitle}>Enhance Your Gaming Experience</h2>
              <p className={styles.featuresSubtitle}>
                Discover powerful features designed to elevate your gaming sessions
              </p>
            </div>
            <FeatureCards />
          </div>
        </main>
      </div>
      
      <AddGameDialog
        isOpen={isAddGameDialogOpen}
        onOpenChange={setAddGameDialogOpen}
      />
    </>
  );
}