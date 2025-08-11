import React, { useState } from 'react';
import { useRawgGameSearch, useImportFromRawg } from '../helpers/useRawgApi';
import { useQueryClient } from '@tanstack/react-query';
import { gamesQueryKeys } from '../helpers/useGames';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './Dialog';
import { Input } from './Input';
import { Button } from './Button';
import { Badge } from './Badge';
import { Spinner } from './Spinner';
import { Skeleton } from './Skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { toast } from 'sonner';
import { Search, Calendar, Star, Monitor } from 'lucide-react';
import type { OutputType as RawgSearchResults } from '../endpoints/games/rawg_search_POST.schema';
import { GameStatusArrayValues, type GameStatus } from '../helpers/schema';

// Extract the individual game type from the array type
type RawgGameResult = RawgSearchResults[number];
import styles from './AddGameDialog.module.css';

interface AddGameDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const statusLabels: Record<GameStatus, string> = {
  'backlog': 'Backlog',
  'in_progress': 'In Progress', 
  'completed': 'Completed',
  'abandoned': 'Abandoned'
};

export function AddGameDialog({ isOpen, onOpenChange }: AddGameDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RawgSearchResults>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [gameStatuses, setGameStatuses] = useState<Record<number, GameStatus>>({});

  const queryClient = useQueryClient();
  const searchMutation = useRawgGameSearch();
  const importMutation = useImportFromRawg();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    searchMutation.mutate(
      { searchQuery: searchQuery.trim() },
      {
        onSuccess: (results) => {
          setSearchResults(results);
          // Initialize default status for each game
          const initialStatuses: Record<number, GameStatus> = {};
          results.forEach(game => {
            initialStatuses[game.id] = 'backlog';
          });
          setGameStatuses(initialStatuses);
        },
        onError: (error) => {
          toast.error(`Search failed: ${error.message}`);
          setSearchResults([]);
          setGameStatuses({});
        },
      }
    );
  };

  const handleStatusChange = (gameId: number, status: GameStatus) => {
    setGameStatuses(prev => ({
      ...prev,
      [gameId]: status
    }));
  };

  const handleImportGame = async (game: RawgGameResult) => {
    const selectedStatus = gameStatuses[game.id] || 'backlog';
    importMutation.mutate(
      { rawgId: game.id, status: selectedStatus },
      {
        onSuccess: (importedGame) => {
          toast.success(`"${importedGame.name}" added to ${statusLabels[selectedStatus].toLowerCase()}!`);
          queryClient.invalidateQueries({ queryKey: gamesQueryKeys.all });
          onOpenChange(false);
          // Reset state
          setSearchQuery('');
          setSearchResults([]);
          setHasSearched(false);
          setGameStatuses({});
        },
        onError: (error) => {
          toast.error(`Failed to import game: ${error.message}`);
        },
      }
    );
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset state when dialog closes
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      setGameStatuses({});
    }
    onOpenChange(open);
  };

  const formatReleaseDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'Unknown';
    }
  };

  const formatRating = (rating: number | null) => {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Add a New Game</DialogTitle>
          <DialogDescription>
            Search for games from RAWG.io database and import them to start tracking.
          </DialogDescription>
        </DialogHeader>

        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <Input
                placeholder="Search for games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              disabled={!searchQuery.trim() || searchMutation.isPending}
              className={styles.searchButton}
            >
              {searchMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </form>
        </div>

        <div className={styles.resultsSection}>
          {searchMutation.isPending && (
            <div className={styles.loadingResults}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.resultSkeleton}>
                  <Skeleton style={{ width: '4rem', height: '4rem', borderRadius: 'var(--radius)' }} />
                  <div className={styles.skeletonContent}>
                    <Skeleton style={{ width: '60%', height: '1.25rem' }} />
                    <Skeleton style={{ width: '40%', height: '1rem' }} />
                    <Skeleton style={{ width: '80%', height: '1rem' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searchMutation.isPending && hasSearched && searchResults.length === 0 && (
            <div className={styles.noResults}>
              <p>No games found for "{searchQuery}". Try a different search term.</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              <p className={styles.resultsCount}>
                Found {searchResults.length} game{searchResults.length !== 1 ? 's' : ''}
              </p>
              <div className={styles.resultsList}>
                {searchResults.map((game) => (
                  <div key={game.id} className={styles.gameResult}>
                    <div className={styles.gameImage}>
                      {game.backgroundImage ? (
                        <img 
                          src={game.backgroundImage} 
                          alt={game.name}
                          className={styles.gameCover}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <Monitor size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.gameInfo}>
                      <h3 className={styles.gameName}>{game.name}</h3>
                      
                      <div className={styles.gameMetadata}>
                        {game.released && (
                          <div className={styles.metadataItem}>
                            <Calendar size={14} />
                            <span>{formatReleaseDate(game.released)}</span>
                          </div>
                        )}
                        
                        {game.rating && (
                          <div className={styles.metadataItem}>
                            <Star size={14} />
                            <span>{formatRating(game.rating)}</span>
                          </div>
                        )}
                      </div>
                      
                      {game.platforms.length > 0 && (
                        <div className={styles.platforms}>
                          {game.platforms.slice(0, 3).map((platform: string) => (
                            <Badge key={platform} variant="outline" className={styles.platformBadge}>
                              {platform}
                            </Badge>
                          ))}
                          {game.platforms.length > 3 && (
                            <Badge variant="outline" className={styles.platformBadge}>
                              +{game.platforms.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {game.genres.length > 0 && (
                        <div className={styles.genres}>
                          {game.genres.slice(0, 2).map((genre: string) => (
                            <Badge key={genre} variant="secondary" className={styles.genreBadge}>
                              {genre}
                            </Badge>
                          ))}
                          {game.genres.length > 2 && (
                            <Badge variant="secondary" className={styles.genreBadge}>
                              +{game.genres.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.gameActions}>
                      <div className={styles.statusSelector}>
                        <label className={styles.statusLabel}>Initial Status:</label>
                        <Select 
                          value={gameStatuses[game.id] || 'backlog'}
                          onValueChange={(value) => handleStatusChange(game.id, value as GameStatus)}
                        >
                          <SelectTrigger className={styles.statusTrigger}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GameStatusArrayValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {statusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button
                        onClick={() => handleImportGame(game)}
                        disabled={importMutation.isPending}
                        size="sm"
                      >
                        {importMutation.isPending ? (
                          <>
                            <Spinner size="sm" />
                            Importing...
                          </>
                        ) : (
                          'Import Game'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}