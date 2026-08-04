import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, RotateCcw, Trophy, Zap, ArrowRight } from 'lucide-react';

const PUZZLES = [
  {
    id: 'p1',
    story: 'Little Red Riding Hood',
    icon: '🐺',
    scene: 'Red Riding Hood calls guest.bake_pastries() but the guest is a Wolf!',
    bugCode: `try:
    guest.bake_pastries()
        # Wolf has no bake_pastries method!
# ???: ??? as wolf_error:
#     woodcutter.alert_rescue()`,
    options: [
      { id: 'a', label: 'except AttributeError', correct: true,  color: 'opt-red'   },
      { id: 'b', label: 'except ZeroDivisionError', correct: false, color: 'opt-blue'  },
      { id: 'c', label: 'except IndexError',        correct: false, color: 'opt-green' },
      { id: 'd', label: 'except FileNotFoundError', correct: false, color: 'opt-purple'},
    ],
    fixedCode: `try:
    guest.bake_pastries()
except AttributeError as wolf_error:
    woodcutter.alert_rescue()
    print("🪓 Woodcutter: RESCUED!")`,
    explanation: '✅ AttributeError fires when an object lacks the called method. Wolf has no .bake_pastries() so we catch AttributeError.'
  },
  {
    id: 'p2',
    story: 'Tortoise & Hare',
    icon: '🐢',
    scene: 'The Hare fell asleep (speed = 0) — dividing distance by speed causes crash!',
    bugCode: `distance = 100
hare_speed = 0
# ???: ??? :
#     time = distance / hare_speed`,
    options: [
      { id: 'a', label: 'try:',              correct: true,  color: 'opt-red'   },
      { id: 'b', label: 'else:',             correct: false, color: 'opt-blue'  },
      { id: 'c', label: 'finally:',          correct: false, color: 'opt-green' },
      { id: 'd', label: 'except ValueError', correct: false, color: 'opt-purple'},
    ],
    fixedCode: `distance = 100
hare_speed = 0

try:
    time = distance / hare_speed
except ZeroDivisionError:
    print("🐢 Tortoise wins — Hare was sleeping!")`,
    explanation: '✅ try: wraps risky operations. Division by zero only happens inside try:, so we wrap it there first.'
  },
  {
    id: 'p3',
    story: 'Goldilocks & Three Bears',
    icon: '🐻',
    scene: 'Goldilocks picks porridge index 5, but the bowl list only has 3 items!',
    bugCode: `porridge = ["Hot","Cold","Just Right"]
index = 5
try:
    choice = porridge[index]
# ???: ???:
#     print("That bowl doesnt exist!")`,
    options: [
      { id: 'a', label: 'except IndexError',        correct: true,  color: 'opt-red'   },
      { id: 'b', label: 'except AttributeError',    correct: false, color: 'opt-blue'  },
      { id: 'c', label: 'except TypeError',         correct: false, color: 'opt-green' },
      { id: 'd', label: 'except OverflowError',     correct: false, color: 'opt-purple'},
    ],
    fixedCode: `porridge = ["Hot","Cold","Just Right"]
index = 5
try:
    choice = porridge[index]
except IndexError:
    print("🐻 That bowl doesn't exist — IndexError caught!")`,
    explanation: "✅ IndexError fires when you access a list index outside its length. porridge has only indices 0-2, so index 5 throws IndexError."
  },
  {
    id: 'p4',
    story: 'Three Little Pigs',
    icon: '🐷',
    scene: 'After building (success or failure), the pigs must ALWAYS lock the construction site.',
    bugCode: `material = "straw"
try:
    build_house(material)
except HuffError:
    call_for_help()
# The site lock MUST run even if exception occurs!
# ???:
#     lock_site()
#     cleanup_tools()`,
    options: [
      { id: 'a', label: 'finally:',          correct: true,  color: 'opt-red'   },
      { id: 'b', label: 'else:',             correct: false, color: 'opt-blue'  },
      { id: 'c', label: 'except Exception:', correct: false, color: 'opt-green' },
      { id: 'd', label: 'try:',              correct: false, color: 'opt-purple'},
    ],
    fixedCode: `material = "straw"
try:
    build_house(material)
except HuffError:
    call_for_help()
finally:
    lock_site()       # ALWAYS runs!
    cleanup_tools()   # ALWAYS runs!
    print("🔒 Site secured regardless!")`,
    explanation: "✅ finally: ALWAYS executes — whether or not an exception was raised. Perfect for resource cleanup (lock_site, close files, DB disconnect)."
  },
  {
    id: 'p5',
    story: 'Hansel & Gretel',
    icon: '🍞',
    scene: 'Hansel and Gretel open the breadcrumbs file — but birds ate it overnight!',
    bugCode: `trail_file = "breadcrumbs_trail.txt"
try:
    with open(trail_file) as f:
        path = f.read()
# ???: ???:
#     path = compass.navigate()`,
    options: [
      { id: 'a', label: 'except FileNotFoundError', correct: true,  color: 'opt-red'   },
      { id: 'b', label: 'except IOError',            correct: false, color: 'opt-blue'  },
      { id: 'c', label: 'except NameError',          correct: false, color: 'opt-green' },
      { id: 'd', label: 'except OSError',            correct: false, color: 'opt-purple'},
    ],
    fixedCode: `trail_file = "breadcrumbs_trail.txt"
try:
    with open(trail_file) as f:
        path = f.read()
except FileNotFoundError:
    path = compass.navigate()
    print("🧭 Using compass — breadcrumbs eaten!")`,
    explanation: "✅ FileNotFoundError is the specific error when open() can't find the file. Though OSError is the parent, catching the specific subclass is best practice."
  },
];

export function BugHunterGame({ onScoreUpdate, onActivityDone }) {
  const [pIdx,     setPIdx]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);

  const puzzle = PUZZLES[pIdx];

  const choose = (opt) => {
    if (answered) return;
    setSelected(opt.id);
    setAnswered(true);
    if (opt.correct) {
      const next = score + 1;
      setScore(next);
      onScoreUpdate && onScoreUpdate(next);
    }
  };

  const nextPuzzle = () => {
    if (pIdx < PUZZLES.length - 1) {
      setPIdx(p => p + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
      onActivityDone && onActivityDone(); // all puzzles answered
    }
  };

  const restartGame = () => {
    setPIdx(0); setSelected(null); setAnswered(false); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / PUZZLES.length) * 100);
    return (
      <div className="bug-done">
        <div className="bug-done-inner">
          <div className="bug-done-icon">
            {pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '🔁'}
          </div>
          <h3>{pct >= 80 ? 'Exception Master!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!'}</h3>
          <p>You caught <strong>{score}</strong> out of <strong>{PUZZLES.length}</strong> bugs correctly ({pct}%)</p>
          <div className="bug-progress-bar-wrap">
            <div className="bug-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <button className="bug-restart-btn" onClick={restartGame}>
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // Split lines of buggy code to render line numbers in pro IDE style
  const codeLines = puzzle.bugCode.split('\n');

  return (
    <div className="bug-root">
      {/* Top Header Section */}
      <div className="bug-header-panel">
        <div className="bug-header-left">
          <span className="bug-story-avatar">{puzzle.icon}</span>
          <div>
            <h4 className="bug-story-title">{puzzle.story}</h4>
            <span className="bug-pills-row">
              <span className="bug-p-badge">Puzzle {pIdx + 1} of {PUZZLES.length}</span>
              <span className="bug-status-indicator blink">⚡ DEBUGGING ACTIVE</span>
            </span>
          </div>
        </div>
        <div className="bug-header-score">
          <Trophy size={16} />
          <span>Score: <strong>{score} / {PUZZLES.length}</strong></span>
        </div>
      </div>

      {/* Futuristic Progress Strip */}
      <div className="bug-progress-track">
        {PUZZLES.map((_, i) => (
          <div 
            key={i} 
            className={`bug-track-seg ${i < pIdx ? 'seg-done' : i === pIdx ? 'seg-active' : 'seg-pending'}`} 
            title={`Puzzle ${i+1}`}
          />
        ))}
      </div>

      {/* Scene Mission Panel */}
      <div className="bug-scene-card">
        <div className="bug-scene-hdr">
          <ShieldAlert size={16} />
          <span>EXCEPTION SCENARIO</span>
        </div>
        <p className="bug-scene-desc">{puzzle.scene}</p>
      </div>

      {/* Cyberpunk Code Workspace (IDE Style) */}
      <div className="bug-ide-workspace">
        <div className="bug-ide-tab-bar">
          <div className="bug-ide-tab active">
            <span>{puzzle.story.toLowerCase().replace(/\s+/g, '_')}_bug.py</span>
            <span className="tab-dot" />
          </div>
          <div className="ide-actions-dummy">
            <span className="action-circle" />
            <span className="action-circle" />
            <span className="action-circle" />
          </div>
        </div>

        <div className="bug-ide-editor">
          <div className="line-numbers-gutter">
            {codeLines.map((_, idx) => (
              <span key={idx} className="ln-num">{idx + 1}</span>
            ))}
          </div>
          <pre className="bug-code-pre-ide">
            <code>
              {codeLines.map((line, idx) => (
                <div key={idx} className="editor-code-line">{line || ' '}</div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* Option Selectors Grid */}
      <div className="bug-options-title">
        <span>Select the correct statement to catch the exception safely:</span>
      </div>
      
      <div className="bug-options-grid">
        {puzzle.options.map(opt => {
          let extraClass = '';
          if (answered && opt.id === selected) extraClass = opt.correct ? ' opt-correct' : ' opt-wrong';
          if (answered && opt.correct && opt.id !== selected) extraClass = ' opt-reveal';
          return (
            <button
              key={opt.id}
              className={`bug-opt-btn-modern ${opt.color}${extraClass}`}
              onClick={() => choose(opt)}
              disabled={answered}
            >
              <div className="btn-inner-wrap">
                <span className="opt-key-badge">{opt.id.toUpperCase()}</span>
                <span className="opt-lbl-text">{opt.label}</span>
                {answered && opt.correct && <CheckCircle2 size={16} className="state-icon-green" />}
                {answered && !opt.correct && opt.id === selected && <Zap size={16} className="state-icon-red" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Result Traceback Output Panel */}
      {answered && (
        <div className={`bug-result-panel-modern ${puzzle.options.find(o => o.id === selected)?.correct ? 'result-success' : 'result-failure'}`}>
          <div className="panel-glow-overlay" />
          <div className="panel-header-strip">
            <div className="panel-status-light" />
            <span>{puzzle.options.find(o => o.id === selected)?.correct ? 'COMPILER STABLE — RESOLVED' : 'COMPILER ERROR — TRACEBACK'}</span>
          </div>

          <div className="panel-body">
            <div className="traceback-fixed-area">
              <div className="fixed-code-header">🔥 FIXED RUNTIME CODE:</div>
              <pre className="fixed-code-pre">{puzzle.fixedCode}</pre>
            </div>
            
            <div className="explanation-bubble">
              <span className="exp-icon">💡</span>
              <p className="explanation-p">{puzzle.explanation}</p>
            </div>

            <button className="bug-next-btn-modern" onClick={nextPuzzle}>
              <span>{pIdx < PUZZLES.length - 1 ? 'Execute Next Puzzle' : 'See Final Evaluation'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
