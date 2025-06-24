#!/bin/bash

echo "🎮 Starting The Will to Fight TCG..."
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting the development server..."
    npm run dev
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi