import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, Play, RotateCcw, Check, X, BookOpen, Brain, TrendingUp, Github, Linkedin, Twitter, Mail, Globe, ExternalLink } from 'lucide-react';

const FlashcardSystem = () => {
  const [flashcards, setFlashcards] = useState([
    { id: 1, front: 'What is React?', back: 'A JavaScript library for building user interfaces', category: 'Programming', studied: false, correctCount: 0, incorrectCount: 0 },
    { id: 2, front: 'What is Node.js?', back: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine', category: 'Programming', studied: false, correctCount: 0, incorrectCount: 0 },
    { id: 3, front: 'What is useState?', back: 'A React Hook that lets you add state to functional components', category: 'React', studied: false, correctCount: 0, incorrectCount: 0 }
  ]);

  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingCard, setEditingCard] = useState(null);
  const [studyMode, setStudyMode] = useState({
    active: false,
    currentIndex: 0,
    showBack: false,
    cards: []
  });

  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    category: ''
  });

  // Handle URL parameters for PWA shortcuts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'study') {
      // Start study session directly
      const cardsToStudy = flashcards.length > 0 ? flashcards : [];
      if (cardsToStudy.length > 0) {
        setStudyMode({
          active: true,
          currentIndex: 0,
          showBack: false,
          cards: [...cardsToStudy].sort(() => Math.random() - 0.5)
        });
        setCurrentView('study');
      }
    } else if (action === 'add') {
      // Go to manage view for adding cards
      setCurrentView('manage');
    } else if (action === 'browse') {
      // Go to manage view for browsing
      setCurrentView('manage');
    }
    
    // Clean up URL after handling the action
    if (action) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [flashcards]);

  // Get unique categories
  const categories = ['All', ...new Set(flashcards.map(card => card.category))];

  // Filter flashcards
  const filteredCards = flashcards.filter(card => {
    const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.back.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add new flashcard
  const addFlashcard = () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      const card = {
        id: Date.now(),
        front: newCard.front.trim(),
        back: newCard.back.trim(),
        category: newCard.category.trim() || 'General',
        studied: false,
        correctCount: 0,
        incorrectCount: 0
      };
      setFlashcards([...flashcards, card]);
      setNewCard({ front: '', back: '', category: '' });
    }
  };

  // Edit flashcard
  const updateFlashcard = () => {
    if (editingCard && editingCard.front.trim() && editingCard.back.trim()) {
      setFlashcards(flashcards.map(card => 
        card.id === editingCard.id ? editingCard : card
      ));
      setEditingCard(null);
    }
  };

  // Delete flashcard
  const deleteFlashcard = (id) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  // Start study session
  const startStudySession = () => {
    const cardsToStudy = filteredCards.length > 0 ? filteredCards : flashcards;
    setStudyMode({
      active: true,
      currentIndex: 0,
      showBack: false,
      cards: [...cardsToStudy].sort(() => Math.random() - 0.5) // Shuffle cards
    });
    setCurrentView('study');
  };

  // Handle study response
  const handleStudyResponse = (correct) => {
    const currentCard = studyMode.cards[studyMode.currentIndex];
    const updatedCards = flashcards.map(card => {
      if (card.id === currentCard.id) {
        return {
          ...card,
          studied: true,
          correctCount: correct ? card.correctCount + 1 : card.correctCount,
          incorrectCount: correct ? card.incorrectCount : card.incorrectCount + 1
        };
      }
      return card;
    });
    setFlashcards(updatedCards);

    // Move to next card or end session
    if (studyMode.currentIndex < studyMode.cards.length - 1) {
      setStudyMode({
        ...studyMode,
        currentIndex: studyMode.currentIndex + 1,
        showBack: false
      });
    } else {
      // End study session
      setStudyMode({ active: false, currentIndex: 0, showBack: false, cards: [] });
      setCurrentView('dashboard');
    }
  };

  // Calculate statistics
  const totalCards = flashcards.length;
  const studiedCards = flashcards.filter(card => card.studied).length;
  const totalCorrect = flashcards.reduce((sum, card) => sum + card.correctCount, 0);
  const totalIncorrect = flashcards.reduce((sum, card) => sum + card.incorrectCount, 0);
  const accuracy = totalCorrect + totalIncorrect > 0 ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) : 0;

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Cards</p>
              <p className="text-3xl font-bold">{totalCards}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Studied</p>
              <p className="text-3xl font-bold">{studiedCards}</p>
            </div>
            <Brain className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Accuracy</p>
              <p className="text-3xl font-bold">{accuracy}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Categories</p>
              <p className="text-3xl font-bold">{categories.length - 1}</p>
            </div>
            <Search className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setCurrentView('manage')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Cards
        </button>
        <button
          onClick={startStudySession}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          disabled={totalCards === 0}
        >
          <Play className="w-5 h-5" />
          Start Study Session
        </button>
        <button
          onClick={() => setCurrentView('browse')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Search className="w-5 h-5" />
          Browse Cards
        </button>
      </div>

      {/* Recent Cards */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.slice(-6).reverse().map(card => (
            <div key={card.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{card.category}</span>
                {card.studied && <span className="text-green-500 text-xs">✓ Studied</span>}
              </div>
              <p className="font-medium text-gray-800 mb-2">{card.front}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{card.back}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Manage Cards View
  const ManageView = () => (
    <div className="space-y-6">
      {/* Add New Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Flashcard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Front (Question)</label>
            <textarea
              value={newCard.front}
              onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
              placeholder="Enter question or term..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Back (Answer)</label>
            <textarea
              value={newCard.back}
              onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
              placeholder="Enter answer or definition..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={newCard.category}
              onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
              placeholder="Enter category (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={addFlashcard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Manage Cards</h3>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flashcards..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4">
          {filteredCards.map(card => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {editingCard && editingCard.id === card.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      value={editingCard.front}
                      onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="2"
                    />
                    <textarea
                      value={editingCard.back}
                      onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingCard.category}
                      onChange={(e) => setEditingCard({ ...editingCard, category: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={updateFlashcard}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCard(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{card.category}</span>
                    <div className="flex items-center gap-2">
                      {card.studied && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          ✓ {card.correctCount}C/{card.incorrectCount}I
                        </span>
                      )}
                      <button
                        onClick={() => setEditingCard({ ...card })}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFlashcard(card.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Front:</p>
                      <p className="font-medium">{card.front}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Back:</p>
                      <p className="text-gray-700">{card.back}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No flashcards found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Study Mode View
  const StudyView = () => {
    if (!studyMode.active || studyMode.cards.length === 0) {
      return (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">No study session active</p>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    const currentCard = studyMode.cards[studyMode.currentIndex];
    const progress = ((studyMode.currentIndex + 1) / studyMode.cards.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Card {studyMode.currentIndex + 1} of {studyMode.cards.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 min-h-64 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition-shadow">
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-4">
              {currentCard.category}
            </span>
            
            <div className="w-full">
              {!studyMode.showBack ? (
                <div>
                  <h3 className="text-lg text-gray-600 mb-4">Question:</h3>
                  <p className="text-xl font-semibold text-gray-800">{currentCard.front}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg text-gray-600 mb-2">Question:</h3>
                  <p className="text-lg text-gray-700 mb-6">{currentCard.front}</p>
                  <h3 className="text-lg text-gray-600 mb-2">Answer:</h3>
                  <p className="text-xl font-semibold text-green-700">{currentCard.back}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!studyMode.showBack ? (
            <button
              onClick={() => setStudyMode({ ...studyMode, showBack: true })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Show Answer
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleStudyResponse(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <X className="w-5 h-5" />
                Incorrect
              </button>
              <button
                onClick={() => handleStudyResponse(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Check className="w-5 h-5" />
                Correct
              </button>
            </div>
          )}
        </div>

        {/* End Session */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setStudyMode({ active: false, currentIndex: 0, showBack: false, cards: [] });
              setCurrentView('dashboard');
            }}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            End Study Session
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">FlashCard Pro</h1>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('manage')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'manage'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manage Cards
              </button>
              <button
                onClick={() => setCurrentView('study')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'study'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Study
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'manage' && <ManageView />}
        {currentView === 'study' && <StudyView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © 2025 Amol Nimade. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Built with React & Node.js | Full Stack Developer
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <div className="text-gray-500 text-sm hidden sm:block">Connect with me:</div>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/amol1307"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/in/amol-nimde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/@amol27157594896"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:amolnimde2@gmail.com"
                  className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  title="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://amolnimade.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  title="Portfolio Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span>🚀 Portfolio Project</span>
                <span>•</span>
                <span>Made in Pune, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>View source code</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FlashcardSystem;