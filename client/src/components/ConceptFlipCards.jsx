import React, { useState } from 'react';
import { Code2, HelpCircle, RotateCcw, Sparkles } from 'lucide-react';

const CARDS = [
  {
    id: 'try',
    keyword: 'try:',
    badge: 'ACTION ATTEMPT',
    frontIcon: '🛡️',
    colorVar: 'try',
    storyTitle: '🐺 Like knocking on Grandma\'s door',
    storyText: 'Red Riding Hood knocks without knowing if Grandma or the Wolf is inside. You wrap risky code in try: — the same way you attempt an action that might have hidden danger.',
    codeSnippet: `try:
    # Attempt risky action safely
    guest = cottage.get_guest()
    guest.bake_pastries()
    print("Safe! Action succeeded.")`,
    backNote: 'The try: block contains code that might throw an exception. If no error occurs, it completes normally.'
  },
  {
    id: 'except',
    keyword: 'except:',
    badge: 'SAFETY NET',
    frontIcon: '🚨',
    colorVar: 'except',
    storyTitle: '🪓 The Woodcutter\'s rescue',
    storyText: 'When the Wolf is revealed (AttributeError), the Woodcutter rushes in to save Red Riding Hood. Similarly, except: catches the specific error type and handles it before the program crashes.',
    codeSnippet: `except AttributeError as e:
    # Handle the "Wolf" disguise error
    print(f"Error caught: {e}")
    woodcutter.alert_rescue()`,
    backNote: 'except: runs ONLY when the try: block throws the specified error type. You can chain multiple except blocks.'
  },
  {
    id: 'else',
    keyword: 'else:',
    badge: 'SUCCESS PATH',
    frontIcon: '✨',
    colorVar: 'else',
    storyTitle: '🏃 Tortoise celebrates crossing finish',
    storyText: 'When the Hare runs at full speed with no nap (no ZeroDivisionError), the else: block celebrates the clean race finish. It only runs when the try: block completed without any exceptions.',
    codeSnippet: `else:
    # Executes ONLY if NO errors occurred
    print("🏃 Race finished cleanly!")
    print(f"Time: {finish_time}s")`,
    backNote: 'else: runs only when try: succeeds. Great for code that should run after a successful try — keeps it separate from exception handlers.'
  },
  {
    id: 'finally',
    keyword: 'finally:',
    badge: 'GUARANTEED CLEANUP',
    frontIcon: '🔒',
    colorVar: 'finally',
    storyTitle: '🐷 Pigs always lock the tools',
    storyText: 'Whether the straw house collapses (exception) or the brick house stands firm (no error), the Three Little Pigs ALWAYS lock their construction tools afterward. finally: runs in BOTH cases.',
    codeSnippet: `finally:
    # ALWAYS executes — no matter what!
    site_locked = True
    tools.cleanup()
    print("🔒 Site secured!")`,
    backNote: 'finally: is guaranteed to run — even if an unhandled exception occurs or a return statement is hit. Perfect for resource cleanup (files, DB connections).'
  },
  {
    id: 'raise',
    keyword: 'raise',
    badge: 'SOUND THE ALARM',
    frontIcon: '📯',
    colorVar: 'raise',
    storyTitle: '📯 Shepherd Boy blows the horn',
    storyText: 'When the Shepherd Boy spots a real wolf, he deliberately blows the alarm horn. raise is exactly that — you deliberately trigger an exception when a rule is broken or danger is real.',
    codeSnippet: `class WolfAlarmError(Exception):
    pass

if alarm == "real_wolf":
    # Deliberately trigger custom error
    raise WolfAlarmError("WOLF SPOTTED!")`,
    backNote: 'raise manually throws an exception — either a built-in one (ValueError, TypeError) or your own custom Exception subclass.'
  }
];

export function ConceptFlipCards({ onActivityDone }) {
  const [flipped, setFlipped] = useState({});
  const activityFiredRef = React.useRef(false);

  const toggle = (id) => {
    setFlipped(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const flippedCount = Object.values(next).filter(Boolean).length;
      if (flippedCount >= 3 && !activityFiredRef.current) {
        activityFiredRef.current = true;
        onActivityDone && onActivityDone();
      }
      return next;
    });
  };

  return (
    <div className="flip-section">
      <div className="flip-section-header">
        <div className="flip-header-text">
          <span className="section-label"><Sparkles size={14} /> Core Python Exception Keywords</span>
          <h2>Interactive Concept Cards</h2>
          <p>Click any card to flip between its <strong>Fairytale Story Analogy</strong> and <strong>Live Python Code Snippet</strong></p>
        </div>
        <button className="reset-btn" onClick={() => setFlipped({})}>
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      <div className="flip-grid">
        {CARDS.map(card => {
          const isFlipped = !!flipped[card.id];
          return (
            <div
              key={card.id}
              className={`flip-card-root fc-${card.colorVar}${isFlipped ? ' is-flipped' : ''}`}
              onClick={() => toggle(card.id)}
            >
              <div className="flip-card-scene">
                {/* FRONT */}
                <div className="flip-face flip-front">
                  <div className="fc-badge-row">
                    <span className="fc-icon">{card.frontIcon}</span>
                    <span className="fc-badge">{card.badge}</span>
                  </div>
                  <div className="fc-keyword">{card.keyword}</div>
                  <div className="fc-story-title">{card.storyTitle}</div>
                  <p className="fc-story-text">{card.storyText}</p>
                  <div className="fc-flip-hint">
                    <Code2 size={13} /> Click to see Python code
                  </div>
                </div>

                {/* BACK */}
                <div className="flip-face flip-back">
                  <div className="fc-badge-row">
                    <span className="fc-badge python-badge">Python Code</span>
                    <span className="fc-icon">{card.frontIcon}</span>
                  </div>
                  <div className="fc-keyword back-keyword">{card.keyword}</div>
                  <pre className="fc-code-pre">{card.codeSnippet}</pre>
                  <p className="fc-back-note">{card.backNote}</p>
                  <div className="fc-flip-hint">
                    <HelpCircle size={13} /> Click for story analogy
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
