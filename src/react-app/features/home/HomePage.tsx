import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Package, Trophy, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
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
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                  <Link href="/game">Start Battle</Link>
                </Button>
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

          {/* Coming Soon - Multiplayer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700 opacity-60 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-500">Multiplayer</CardTitle>
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <CardDescription className="text-gray-600">
                  Coming Soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Challenge players from around the world in ranked matches and tournaments.
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
    </div>
  );
};