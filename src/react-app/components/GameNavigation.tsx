import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, Swords, Package, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameNavigationProps {
  showBackButton?: boolean;
}

export const GameNavigation: React.FC<GameNavigationProps> = ({ showBackButton = true }) => {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBackButton && location !== '/' && (
              <Button asChild variant="ghost" size="icon" className="mr-2">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
            )}
            
            <nav className="flex items-center gap-1">
              <Button
                asChild
                variant={isActive('/') ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'gap-2',
                  isActive('/') && 'bg-gray-700'
                )}
              >
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </Button>
              
              <Button
                asChild
                variant={isActive('/game') ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'gap-2',
                  isActive('/game') && 'bg-gray-700'
                )}
              >
                <Link href="/game">
                  <Swords className="w-4 h-4" />
                  Battle
                </Link>
              </Button>
              
              <Button
                asChild
                variant={isActive('/deck-builder') ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'gap-2',
                  isActive('/deck-builder') && 'bg-gray-700'
                )}
              >
                <Link href="/deck-builder">
                  <Package className="w-4 h-4" />
                  Deck Builder
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};