import React, { useState } from 'react';
import { Sparkles, Code2, RotateCcw, Copy, CheckCheck, ChevronLeft, Wand2, BookOpen, ArrowRight, RefreshCw } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'adventure',
    emoji: '⚔️',
    label: '1. Adventure Quest',
    fields: ['Hero Name', 'Monster Name', 'Magic Item'],
    defaults: ['Aria', 'Dragon', 'Sword'],
    fn: (f0, f1, f2) => {
      const hero = f0 || 'Aria';
      const monster = f1 || 'Dragon';
      const item = f2 || 'Sword';
      const heroVar = hero.toLowerCase().replace(/\s+/g, '_');
      const errName = monster.replace(/\s+/g, '') + 'Error';
      const itemVar = item.toLowerCase().replace(/\s+/g, '_');
      return `# 🏰 ${hero}'s Adventure Quest — Python Exception Story
class ${errName}(Exception):
    """Raised when ${hero} encounters a wild ${monster} without preparation."""
    pass

${heroVar}_inventory = ["map", "${itemVar}"]
dungeon_boss = "${monster}"

try:
    print(f"⚔️ {hero} enters the dangerous dungeon of {dungeon_boss}...")
    if "${itemVar}" not in ${heroVar}_inventory:
        raise ${errName}(f"Cannot defeat {dungeon_boss} without ${item}!")
    
    print(f"✨ {hero} draws the ${item} and strikes!")
    loot_coins = 500

except ${errName} as e:
    print(f"🚨 {monster} Danger: {e}")
    print(f"💡 Hint: Find the ${item} before entering!")
    loot_coins = 0

else:
    print(f"🎉 Victory! {hero} collected {loot_coins} gold coins!")

finally:
    print(f"🔒 Dungeon entrance sealed safely behind {hero}.")`;
    }
  },
  {
    id: 'school',
    emoji: '📚',
    label: '2. School Exam',
    fields: ['Student Name', 'Subject', 'Exam Score'],
    defaults: ['Mia', 'Mathematics', '75'],
    fn: (f0, f1, f2) => {
      const student = f0 || 'Mia';
      const subject = f1 || 'Mathematics';
      const score = parseInt(f2) || 75;
      return `# 📚 ${student}'s ${subject} Exam — Python Exception Story
class LowScoreError(Exception):
    """Raised when test score falls below the required pass threshold."""
    pass

PASS_MARK = 40

try:
    print(f"📝 {student} submits the {subject} examination paper...")
    submitted_score = ${score}
    
    if submitted_score < PASS_MARK:
        raise LowScoreError(f"Score {submitted_score} is below pass mark of {PASS_MARK}!")
    
    grade = "A" if submitted_score >= 85 else "B" if submitted_score >= 65 else "C"

except LowScoreError as err:
    print(f"📉 {student} did not pass: {err}")
    print("💡 Advice: Schedule additional tutoring sessions!")

else:
    print(f"🎉 Success! {student} passed {subject} with Grade {grade}!")

finally:
    print(f"📋 Exam attendance recorded in official academy register for {student}.");`;
    }
  },
  {
    id: 'recipe',
    emoji: '🍕',
    label: '3. Cooking Recipe',
    fields: ['Chef Name', 'Dish Name', 'Missing Ingredient'],
    defaults: ['Gordon', 'Gourmet Pizza', 'Mozzarella Cheese'],
    fn: (f0, f1, f2) => {
      const chef = f0 || 'Gordon';
      const dish = f1 || 'Gourmet Pizza';
      const ingredient = f2 || 'Mozzarella Cheese';
      const ingVar = ingredient.toLowerCase().replace(/\s+/g, '_');
      return `# 🍕 Chef ${chef}'s ${dish} Recipe — Python Exception Story
class MissingIngredientError(Exception):
    """Raised when critical kitchen ingredient is missing from pantry."""
    pass

pantry = {"flour_grams": 500, "yeast_grams": 10, "${ingVar}_grams": 0}

try:
    print(f"👨‍🍳 Chef {chef} starts preparing {dish}...")
    needed_grams = 200
    available = pantry.get("${ingVar}_grams", 0)
    
    if available < needed_grams:
        raise MissingIngredientError(
            f"Not enough {ingredient}! Required: {needed_grams}g, Available: {available}g"
        )
    
    print(f"🔥 Baking {dish} at 220°C for 20 minutes...")

except MissingIngredientError as err:
    print(f"🚨 Kitchen Halted: {err}")
    print(f"💡 Substitute: Use extra olive oil or alternative ingredients!")

else:
    print(f"✅ Delicious! {dish} cooked to perfection by Chef {chef}!")

finally:
    print(f"🧹 Kitchen oven turned off and work surface sanitized by Chef {chef}.");`;
    }
  },
  {
    id: 'space',
    emoji: '🚀',
    label: '4. Space Mission',
    fields: ['Astronaut Name', 'Planet', 'Mission Item'],
    defaults: ['Nova', 'Mars', 'Oxygen Tank'],
    fn: (f0, f1, f2) => {
      const astronaut = f0 || 'Nova';
      const planet = f1 || 'Mars';
      const item = f2 || 'Oxygen Tank';
      const itemVar = item.toLowerCase().replace(/\s+/g, '_');
      return `# 🚀 Astronaut ${astronaut}'s Expedition to ${planet} — Python Exception Story
class MissionCriticalError(Exception):
    """Raised when life support or vital mission gear fails."""
    pass

spacecraft_status = {"fuel_percent": 95, "${itemVar}_status": "OPERATIONAL"}

try:
    print(f"🚀 Astronaut {astronaut} initiates landing procedure on {planet}...")
    
    if spacecraft_status.get("${itemVar}_status") != "OPERATIONAL":
        raise MissionCriticalError(f"Emergency! {item} is non-functional!")
    
    print(f"📡 Transmitting telemetry signal back to Earth Ground Control...")

except MissionCriticalError as err:
    print(f"🆘 CRITICAL FAILURE: {err}")
    print(f"💡 Emergency Protocol: Switch {astronaut}'s suit to secondary reserve!")

else:
    print(f"🌍 Landing Successful! Astronaut {astronaut} is safely exploring {planet}!")

finally:
    print(f"🔒 Life support telemetry logged safely for Astronaut {astronaut}.");`;
    }
  },
];

export function CustomStoryPlayground({ onReturnToStudio, onRedirectToPage1 }) {
  const [templateIdx, setTemplateIdx] = useState(0);
  const [fields, setFields] = useState(['', '', '']);
  const [generated, setGenerated] = useState('');
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const template = TEMPLATES[templateIdx];

  const switchToTemplate = (idx) => {
    setTemplateIdx(idx);
    setFields(['', '', '']);
    setGenerated('');
    setStep(0);
    setCopied(false);
  };

  const nextStory = () => {
    const nextIdx = (templateIdx + 1) % TEMPLATES.length;
    switchToTemplate(nextIdx);
  };

  const prevStory = () => {
    const nextIdx = (templateIdx - 1 + TEMPLATES.length) % TEMPLATES.length;
    switchToTemplate(nextIdx);
  };

  const generate = () => {
    const [f0, f1, f2] = fields.map((f, i) => f.trim() || template.defaults[i]);
    setGenerated(template.fn(f0, f1, f2));
    setStep(1);
    setCopied(false);
  };

  const reset = () => {
    setStep(0);
    setFields(['', '', '']);
    setGenerated('');
    setCopied(false);
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(generated); } catch (e) { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="csp-root">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="csp-hero">
        <span className="csp-hero-badge">🏆 Stage 9: Custom Story Generator Playground</span>
        <div className="csp-hero-icon">🎭</div>
        <h2 className="csp-hero-title">Custom Fairytale Story to Code Generator</h2>
        <p className="csp-hero-sub">
          Design custom character scenarios and automatically synthesize executable Python exception handling code!
        </p>
      </div>

      {/* ── Template Selection Strip ───────────────────────────────────── */}
      <div className="csp-template-strip">
        <span className="csp-template-label">Select Story Theme:</span>
        {TEMPLATES.map((t, i) => (
          <button
            key={t.id}
            className={`csp-tmpl-chip ${i === templateIdx ? 'csp-tmpl-active' : ''}`}
            onClick={() => switchToTemplate(i)}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ── Main Interactive Workspace ───────────────────────────────────────── */}
      <div className="csp-workspace">

        {/* LEFT: Input Form */}
        <div className="csp-panel csp-form-panel">
          <div className="csp-panel-hdr">
            <Sparkles size={16} />
            <span>{template.emoji} {template.label} — Custom Story Inputs</span>
          </div>

          {step === 0 ? (
            <>
              <div className="csp-fields">
                {template.fields.map((label, i) => (
                  <label key={i} className="csp-field-label">
                    <span className="csp-field-name">{label}</span>
                    <input
                      type="text"
                      className="csp-field-input"
                      placeholder={`Default: ${template.defaults[i]}`}
                      value={fields[i]}
                      onChange={e => {
                        const next = [...fields];
                        next[i] = e.target.value;
                        setFields(next);
                      }}
                    />
                  </label>
                ))}
              </div>
              <button className="csp-generate-btn" onClick={generate}>
                <Code2 size={16} /> Generate Python Exception Code!
              </button>
            </>
          ) : (
            <div className="csp-result-meta">
              <div className="csp-result-badge">✅ Python Code Generated!</div>
              <p className="csp-result-hint">
                This script uses <code>try</code>, <code>except</code>, <code>else</code>, and <code>finally</code> blocks.
              </p>
              <button className="csp-reset-btn" onClick={reset}>
                <RotateCcw size={13} /> Edit Story Inputs
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Code Output */}
        <div className="csp-panel csp-output-panel">
          <div className="csp-panel-hdr csp-panel-dark">
            <Code2 size={16} />
            <span>python_story.py</span>
            {generated && (
              <button className="csp-copy-btn" onClick={copyCode}>
                {copied
                  ? <><CheckCheck size={13} /> Copied!</>
                  : <><Copy size={13} /> Copy Code</>}
              </button>
            )}
          </div>
          {generated ? (
            <div className="csp-editor-container">
              <div className="csp-editor-gutter">
                {generated.split('\n').map((_, i) => (
                  <span key={i} className="csp-ln">{i + 1}</span>
                ))}
              </div>
              <pre className="csp-code-output-modern">
                <code>
                  {generated.split('\n').map((line, i) => (
                    <div key={i} className="csp-code-line">{line || ' '}</div>
                  ))}
                </code>
              </pre>
            </div>
          ) : (
            <div className="csp-code-placeholder">
              <Code2 size={42} className="csp-placeholder-icon" />
              <p>Fill in character names on the left and click <strong>"Generate Python Exception Code!"</strong></p>
            </div>
          )}
        </div>
      </div>

      {/* ── Story Navigation & Toggle Bar Below ────────────────────────────────────── */}
      <div className="csp-toggle-nav-below">
        <button className="csp-nav-toggle-btn" onClick={prevStory}>
          <ChevronLeft size={16} /> Theme: {TEMPLATES[(templateIdx - 1 + TEMPLATES.length) % TEMPLATES.length].label}
        </button>

        <div className="csp-current-indicator">
          <span>Current Theme: <strong>{template.emoji} {template.label}</strong></span>
        </div>

        <button className="csp-nav-toggle-btn next-story-highlight" onClick={onRedirectToPage1}>
          <BookOpen size={16} />
          <span>Redirect to Page 1 (Next Story 📖)</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Footer Actions ─────────────────────────────────────────── */}
      <div className="csp-footer">
        <button className="csp-return-btn" onClick={onReturnToStudio}>
          <ChevronLeft size={15} /> Return to AI Sandbox (Stage 8)
        </button>
        <div className="csp-footer-note">
          <BookOpen size={14} />
          <span>Click <strong>"Next Story Redirect"</strong> to toggle between all 4 story themes!</span>
        </div>
      </div>
    </div>
  );
}
