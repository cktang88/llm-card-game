import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Package, Trophy, Users, Bot, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export const HomePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [showGameModeDialog, setShowGameModeDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const handleCreateGame = async (gameMode: 'vs_ai' | 'multiplayer') => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsCreatingGame(true);
    try {
      const response = await fetch('/api/games/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: playerName.trim(), gameMode })
      });

      const data = await response.json();
      if (data.success) {
        // Store game info in session storage
        sessionStorage.setItem('gameRoomCode', data.roomCode);
        sessionStorage.setItem('gamePlayerId', data.playerId);
        sessionStorage.setItem('gameMode', gameMode);
        
        if (gameMode === 'multiplayer') {
          toast.success(`Room created! Code: ${data.roomCode}`);
        }
        
        setLocation(`/game?room=${data.roomCode}`);
      } else {
        toast.error(data.error || 'Failed to create game');
      }
    } catch {
      toast.error('Failed to connect to server');
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!roomCode.trim() || roomCode.length !== 6) {
      toast.error('Please enter a valid 6-character room code');
      return;
    }

    setIsJoiningGame(true);
    try {
      const response = await fetch(`/api/games/room/${roomCode.toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: playerName.trim() })
      });

      const data = await response.json();
      if (data.success) {
        // Store game info in session storage
        sessionStorage.setItem('gameRoomCode', data.roomCode);
        sessionStorage.setItem('gamePlayerId', data.playerId);
        sessionStorage.setItem('gameMode', 'multiplayer');
        
        toast.success('Joined game successfully!');
        setLocation(`/game?room=${data.roomCode}`);
      } else {
        toast.error(data.error || 'Failed to join game');
      }
    } catch {
      toast.error('Failed to connect to server');
    } finally {
      setIsJoiningGame(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            The Will to Fight
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            A strategic card battle game of tactics and resource management
          </p>
        </motion.div>

        {/* Game Modes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Battle Mode */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Battle Mode</CardTitle>
                  <Swords className="w-6 h-6 text-orange-500" />
                </div>
                <CardDescription className="text-gray-400">
                  Jump into tactical combat against AI or other players
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Test your strategic skills in intense card battles. Deploy units, manage resources, and outmaneuver your opponent.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setShowGameModeDialog(true)}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Play vs AI
                  </Button>
                  <Button 
                    onClick={() => setShowJoinDialog(true)}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Play Multiplayer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Deck Builder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Deck Builder</CardTitle>
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
                <CardDescription className="text-gray-400">
                  Create and customize your battle deck
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Build powerful decks from various factions. Experiment with different strategies and card combinations.
                </p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/deck-builder">Build Deck</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaderboard - Coming Soon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700 opacity-60 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-500">Leaderboard</CardTitle>
                  <Trophy className="w-6 h-6 text-gray-600" />
                </div>
                <CardDescription className="text-gray-600">
                  Coming Soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Compete for the top ranks and earn rewards in seasonal competitions.
                </p>
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2 list-disc list-inside">
                <li>Each player starts with 40 Morale points</li>
                <li>Draw cards and deploy units to your reinforcement row</li>
                <li>Move units to the front line to engage in combat</li>
                <li>Reduce your opponent's Morale to 0 to win</li>
                <li>Use commander abilities and unit special powers strategically</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Game Mode Dialog (Name Entry) */}
      <Dialog open={showGameModeDialog} onOpenChange={setShowGameModeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start New Game</DialogTitle>
            <DialogDescription>
              Enter your name to start playing
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="player-name" className="text-right">
                Name
              </Label>
              <Input
                id="player-name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
                maxLength={20}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleCreateGame('vs_ai')}
              disabled={isCreatingGame || !playerName.trim()}
            >
              <Bot className="w-4 h-4 mr-2" />
              Play vs AI
            </Button>
            <Button
              onClick={() => handleCreateGame('multiplayer')}
              disabled={isCreatingGame || !playerName.trim()}
              variant="secondary"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Room Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Multiplayer Game</DialogTitle>
            <DialogDescription>
              Enter your name and the room code to join a game
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="join-player-name" className="text-right">
                Name
              </Label>
              <Input
                id="join-player-name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
                maxLength={20}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-code" className="text-right">
                Room Code
              </Label>
              <Input
                id="room-code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="col-span-3"
                placeholder="6-letter code (e.g., ABCDEF)"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleJoinGame}
              disabled={isJoiningGame || !playerName.trim() || roomCode.length !== 6}
            >
              {isJoiningGame ? 'Joining...' : 'Join Game'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};