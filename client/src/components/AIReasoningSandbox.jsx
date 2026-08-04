import React, { useState } from 'react';
import { Bot, Play, Sparkles, Terminal, Cpu, CheckCircle, RefreshCw, Send, Lock, Unlock } from 'lucide-react';

const PRESETS = [
  {
    id: 'p1',
    title: '🐺 Wolf Disguise Attack',
    prompt: 'Check if Grandma object has .bake_pastries() method. If not, catch AttributeError and alert Woodcutter rescue unit.',
  },
  {
    id: 'p2',
    title: '🐢 Hare Sleeping Zero Division',
    prompt: 'Calculate race completion time for distance=100 and hare_speed=0. Handle ZeroDivisionError safely, and use else block for clean finish.',
  },
  {
    id: 'p3',
    title: '🍞 Missing Breadcrumbs Trail File',
    prompt: 'Attempt to open "breadcrumbs.txt". Catch FileNotFoundError when forest birds eat the file and fall back to compass navigation.',
  },
  {
    id: 'p4',
    title: '🧞 Genie Wish Overload Limit',
    prompt: 'Check if requested_wishes > 3. Raise PermissionError with cosmic message if exceeded.',
  }
];

const buildCode = (text) => {
  const t = text.toLowerCase();
  if (t.includes('wolf') || t.includes('bake')) {
    return `# AI Generated Python Exception Logic:
try:
    guest = cottage.get_guest()
    guest.bake_pastries()
except AttributeError as err:
    print(f"🚨 AttributeError detected: {err}")
    woodcutter.alert_rescue()
finally:
    cottage.lock_door()
    print("🔒 Door locked securely!")`;
  }
  if (t.includes('hare') || t.includes('division')) {
    return `# AI Generated Python Exception Logic:
distance = 100
hare_speed = 0
try:
    finish_time = distance / hare_speed
except ZeroDivisionError:
    print("⚡ ZeroDivisionError! Hare is asleep mid-race!")
    finish_time = 999.0
else:
    print(f"🏃 Race finished in {finish_time}s!")`;
  }
  if (t.includes('file') || t.includes('breadcrumbs')) {
    return `# AI Generated Python Exception Logic:
try:
    with open("breadcrumbs.txt", "r") as f:
        path = f.read()
except FileNotFoundError:
    print("🐦 FileNotFoundError: Birds ate the breadcrumbs!")
    path = compass.get_coordinates()
finally:
    print("🧭 Navigation system active!")`;
  }
  return `# AI Generated Python Exception Logic:
def validate_action(requested_wishes):
    try:
        if requested_wishes > 3:
            raise PermissionError("🧞 Cosmic Law: Max 3 wishes allowed!")
        print("✨ Wish granted!")
    except PermissionError as e:
        print(f"🚨 {e}")
    finally:
        lamp.seal()

validate_action(5)`;
};

export function AIReasoningSandbox({ onActivityDone }) {
  const [promptText, setPromptText] = useState(PRESETS[0].prompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [generatedResult, setGeneratedResult] = useState(null);

  const runAIReasoning = (customPrompt) => {
    const textToUse = customPrompt || promptText;
    setIsAnalyzing(true);
    setReasoningSteps([]);
    setGeneratedResult(null);

    const steps = [
      { num: 1, title: 'Parsing Prompt Instructions', desc: `Scanning user intent: "${textToUse.slice(0, 60)}..."` },
      { num: 2, title: 'Identifying Exception Types', desc: 'Detecting potential runtime errors & risk boundaries in input parameters.' },
      { num: 3, title: 'Structuring Try-Except-Else-Finally Architecture', desc: 'Ensuring safe action attempt in try: and emergency handler in except:.' },
      { num: 4, title: 'Synthesizing Python Code & Verification', desc: 'Building clean Python syntax and verifying exception recovery paths.' }
    ];

    steps.forEach((st, idx) => {
      setTimeout(() => {
        setReasoningSteps(prev => [...prev, st]);
        if (idx === steps.length - 1) {
          setIsAnalyzing(false);
          const codeOutput = buildCode(textToUse);
          setGeneratedResult({
            code: codeOutput,
            confidence: '98.5%',
            tokensUsed: 142,
            reasoningTime: '1.2s'
          });
          onActivityDone && onActivityDone(); // stage 8 activity complete
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="air-root">
      {/* Header */}
      <div className="air-header">
        <div className="air-header-title">
          <Bot size={24} className="air-bot-icon" />
          <div>
            <h3>🤖 AI Reasoning Sandbox & Logic Trace</h3>
            <p>Test how an AI agent reasons step-by-step through custom coding scenarios and exception handling rules.</p>
          </div>
        </div>

        <div className="air-presets">
          <span className="preset-lbl">Quick Prompts:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className="preset-btn"
              onClick={() => { setPromptText(p.prompt); runAIReasoning(p.prompt); }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="air-grid">
        {/* Left: Prompt Input & Step-by-Step AI Thinking Trace */}
        <div className="air-left">
          <div className="air-card">
            <div className="air-card-hdr">
              <Sparkles size={16} />
              <span>Prompt AI Reasoning Engine</span>
            </div>

            <div className="air-input-wrap">
              <textarea
                className="air-textarea"
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe your story or code scenario here (e.g. Try reading a file, handle FileNotFoundError)..."
              />
              <button
                className="air-run-btn"
                onClick={() => runAIReasoning()}
                disabled={isAnalyzing || !promptText.trim()}
              >
                {isAnalyzing ? <RefreshCw className="spin" size={15} /> : <Send size={15} />}
                {isAnalyzing ? 'Reasoning...' : 'Run AI Reasoning'}
              </button>
            </div>
          </div>

          {/* AI Thinking Trace Panel */}
          <div className="air-card">
            <div className="air-card-hdr">
              <Cpu size={16} />
              <span>Live AI Logic & Reasoning Trace</span>
            </div>

            <div className="air-trace-list">
              {reasoningSteps.length === 0 ? (
                <div className="air-idle-msg">
                  <Bot size={24} />
                  <p>Click <strong>"Run AI Reasoning"</strong> to view real-time step-by-step AI thought traces...</p>
                </div>
              ) : (
                reasoningSteps.map((st) => (
                  <div key={st.num} className="air-trace-step">
                    <div className="trace-step-badge">Step {st.num}</div>
                    <div className="trace-step-body">
                      <strong>{st.title}</strong>
                      <p>{st.desc}</p>
                    </div>
                    <CheckCircle size={16} className="trace-check-ic" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Generated Python Code Output & Sandbox Stats */}
        <div className="air-right">
          <div className="air-card result-card">
            <div className="air-card-hdr dark">
              <Terminal size={16} />
              <span>Synthesized Python Exception Code</span>
            </div>

            {generatedResult ? (
              <div className="air-result-body">
                <div className="air-stats-strip">
                  <span>🎯 Confidence: <strong>{generatedResult.confidence}</strong></span>
                  <span>⚡ Latency: <strong>{generatedResult.reasoningTime}</strong></span>
                  <span>🔤 Tokens: <strong>{generatedResult.tokensUsed}</strong></span>
                </div>

                <pre className="air-code-box">{generatedResult.code}</pre>

                <div className="air-explanation-callout">
                  <strong>💡 AI Reasoning Summary:</strong>
                  <p>The AI successfully isolated the risky operation inside a <code>try:</code> block and constructed an emergency <code>except:</code> handler to recover without crashing.</p>
                </div>
              </div>
            ) : (
              <div className="air-empty-result">
                <Terminal size={32} />
                <p>Waiting for AI reasoning synthesis output...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
