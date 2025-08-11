import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useGames } from '../helpers/useGames';
import { useUpdateGameStatus } from '../helpers/useUpdateGameStatus';
import { AppHeader } from '../components/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
import { Skeleton } from '../components/Skeleton';
import { StatusBadge } from '../components/StatusBadge';
import { Badge } from '../components/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Select';
import { Gamepad2, ArrowLeft, Star, Calendar, Users, Building, Activity } from 'lucide-react';
import type { GameStatus } from '../helpers/schema';
import { NotesSection } from '../components/NotesSection';
import { SolutionsSection } from '../components/SolutionsSection';
import styles from './games.$gameId.module.css';

const GameDetailSkeleton = () => (
  <div className={styles.pageWrapper}>
    <AppHeader />
    <div className={styles.container}>
      <Skeleton style={{ width: '120px', height: '24px', marginBottom: 'var(--spacing-4)' }} />
      <div className={styles.gameHeaderCard}>
        <div className={styles.gameImageContainer}>
          <Skeleton className={styles.backgroundImage} />
        </div>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Skeleton style={{ width: '60%', height: '40px', marginBottom: 'var(--spacing-2)' }} />
            <div className={styles.metaInfo}>
              <Skeleton style={{ width: '120px', height: '20px' }} />
              <Skeleton style={{ width: '100px', height: '20px' }} />
            </div>
          </div>
          <Skeleton style={{ width: '90%', height: '20px', marginBottom: 'var(--spacing-3)' }} />
          <Skeleton style={{ width: '80%', height: '20px', marginBottom: 'var(--spacing-4)' }} />
          <div className={styles.badgeGroup}>
            <Skeleton style={{ width: '80px', height: '28px' }} />
            <Skeleton style={{ width: '100px', height: '28px' }} />
            <Skeleton style={{ width: '60px', height: '28px' }} />
          </div>
        </div>
      </div>
      <div className={styles.tabsContainer}>
        <Skeleton style={{ width: '100%', height: '49px', marginBottom: 'var(--spacing-6)' }} />
        <Skeleton style={{ width: '100%', height: '300px' }} />
      </div>
    </div>
  </div>
);

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className={styles.starRating}>
      {Array(fullStars).fill(null).map((_, i) => (
        <Star key={`full-${i}`} size={16} className={styles.starFilled} />
      ))}
      {hasHalfStar && <Star key="half" size={16} className={styles.starHalf} />}
      {Array(emptyStars).fill(null).map((_, i) => (
        <Star key={`empty-${i}`} size={16} className={styles.starEmpty} />
      ))}
      <span className={styles.ratingText}>{rating.toFixed(1)}</span>
    </div>
  );
};

export default function GameDetailPage() {
  const { gameId } = useParams();
  const numericGameId = Number(gameId);

  const { data: games, isFetching, error } = useGames();
  const updateGameStatus = useUpdateGameStatus();

  const game = games?.find((g) => g.id === numericGameId);

  if (isFetching) {
    return <GameDetailSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <AppHeader />
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorCard}>
              <h2>Failed to Load Game</h2>
              <p>We encountered an error while loading the game data.</p>
              <pre>{error instanceof Error ? error.message : 'An unknown error occurred'}</pre>
              <Link to="/" className={styles.primaryButton}>
                <ArrowLeft size={16} /> Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={styles.pageWrapper}>
        <AppHeader />
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorCard}>
              <h2>Game Not Found</h2>
              <p>The game you are looking for does not exist or has been removed.</p>
              <Link to="/" className={styles.primaryButton}>
                <ArrowLeft size={16} /> Browse All Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: Date | string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  const formatArrayToText = (arr: string[] | null) => {
    if (!arr || arr.length === 0) return null;
    return arr.join(', ');
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "__empty" || !game) return;
    
    try {
      await updateGameStatus.mutateAsync({
        gameId: game.id,
        status: newStatus as GameStatus,
      });
    } catch (error) {
      console.log('Failed to update game status:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${game.name} | GameNotes`}</title>
        <meta name="description" content={`Notes and solutions for ${game.name}. Track your gaming progress with AI-powered assistance.`} />
      </Helmet>
      <div className={styles.pageWrapper}>
        <AppHeader />
        <div className={styles.container}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            All Games
          </Link>
          
          <div className={styles.gameHeaderCard}>
            <div className={styles.gameImageContainer}>
              {game.backgroundImage ? (
                <img src={game.backgroundImage} alt={game.name} className={styles.backgroundImage} />
              ) : (
                <div className={`${styles.backgroundImage} ${styles.imagePlaceholder}`}>
                  <Gamepad2 size={64} />
                </div>
              )}
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.headerContent}>
              <div className={styles.titleSection}>
                <h1 className={styles.gameTitle}>{game.name}</h1>
                <div className={styles.metaInfo}>
                  {game.rating && Number(game.rating) > 0 && (
                    <StarRating rating={Number(game.rating)} />
                  )}
                  {game.released && (
                    <div className={styles.releaseDate}>
                      <Calendar size={16} />
                      <span>{formatDate(game.released)}</span>
                    </div>
                  )}
                  <div className={styles.statusSection}>
                    <Activity size={16} />
                    <StatusBadge status={game.status} />
                    <Select
                      value={game.status}
                      onValueChange={handleStatusChange}
                      disabled={updateGameStatus.isPending}
                    >
                      <SelectTrigger className={styles.statusSelect}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="abandoned">Abandoned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {game.description && (
                <p className={styles.gameDescription}>{game.description}</p>
              )}
              
              <div className={styles.gameDetails}>
                {game.genres && game.genres.length > 0 && (
                  <div className={styles.detailGroup}>
                    <h3>Genres</h3>
                    <div className={styles.badgeGroup}>
                      {game.genres.map((genre) => (
                        <Badge key={genre} variant="secondary">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {game.platforms && game.platforms.length > 0 && (
                  <div className={styles.detailGroup}>
                    <h3>Platforms</h3>
                    <div className={styles.badgeGroup}>
                      {game.platforms.map((platform) => (
                        <Badge key={platform} variant="outline">{platform}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {game.developers && game.developers.length > 0 && (
                  <div className={styles.detailGroup}>
                    <h3>
                      <Users size={16} />
                      Developers
                    </h3>
                    <p className={styles.detailText}>{formatArrayToText(game.developers)}</p>
                  </div>
                )}
                
                {game.publishers && game.publishers.length > 0 && (
                  <div className={styles.detailGroup}>
                    <h3>
                      <Building size={16} />
                      Publishers
                    </h3>
                    <p className={styles.detailText}>{formatArrayToText(game.publishers)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.contentCard}>
            <Tabs defaultValue="notes" className={styles.tabsContainer}>
              <TabsList className={styles.customTabsList}>
                <TabsTrigger value="notes" className={styles.customTabsTrigger}>Notes</TabsTrigger>
                <TabsTrigger value="solutions" className={styles.customTabsTrigger}>Solutions</TabsTrigger>
              </TabsList>
              <TabsContent value="notes" className={styles.tabContent}>
                <NotesSection gameId={numericGameId} />
              </TabsContent>
              <TabsContent value="solutions" className={styles.tabContent}>
                <SolutionsSection gameId={numericGameId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}