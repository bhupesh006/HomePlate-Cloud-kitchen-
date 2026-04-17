const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'App.js');
const source = fs.readFileSync(appFile, 'utf8');

const lines = source.split('\n');
let currentFile = null;
let currentBuffer = [];

const importsForComponents = `import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, LogOut, TrendingUp, Package, DollarSign, Star, X, Clock, MapPin, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import { authAPI, dishAPI, orderAPI, sellerAPI, reviewAPI, recommendationAPI } from '../services/api';

`;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('// --- 1. UI FIX: FoodTypeIndicator')) {
      if (currentFile) fs.writeFileSync(currentFile, currentBuffer.join('\n'));
      currentFile = path.join(__dirname, 'components', 'FoodTypeIndicator.js');
      currentBuffer = [importsForComponents];
  } else if (line.match(/\/\/ --- COMPONENT: (.+) ---/)) {
      if (currentFile) fs.writeFileSync(currentFile, currentBuffer.join('\n'));
      const match = line.match(/\/\/ --- COMPONENT: (.+?) (?:.*)?---/);
      const name = match[1].trim().split(' ')[0]; // E.g., "HomePage"
      
      const isPage = name.includes('Page') || name.includes('Dashboard');
      const folder = isPage ? 'pages' : 'components';
      currentFile = path.join(__dirname, folder, name + '.js');
      currentBuffer = [importsForComponents];
  } else if (line.includes('// --- MAIN APP COMPONENT ---')) {
      if (currentFile) {
          fs.writeFileSync(currentFile, currentBuffer.join('\n'));
          currentFile = null;
          currentBuffer = [];
      }
      break; 
  }
  
  if (currentFile) {
      currentBuffer.push(line);
      // Wait, let's also append export default at the end of the file automatically?
      // No, they are declared as `const Name = ...`. We can export them later.
  }
}

console.log('Splitting finished. Please modify components to export default manually.');
