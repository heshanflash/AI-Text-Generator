// ============================================================
// StudyForge - Simple AI Text Humanizer
// Paste text, click humanize, get undetectable output
// ============================================================

(function() {
  'use strict';

  // ========== Core Humanization Utilities ==========
  const Humanizer = {
    config: {
      enabled: true,
      quirks: true,
      burstiness: true,
      personal: true,
      transitions: true,
      errors: true,
      intensity: 0.5
    },

    setConfig: function(newConfig) {
      this.config = { ...this.config, ...newConfig };
    },

    // Inject natural human imperfections
    addHumanImperfections: function(text) {
      if (!this.config.quirks) return text;
      const imperfections = [
        { pattern: /\bas well as\b/gi, replacement: 'and also' },
        { pattern: /\bin order to\b/gi, replacement: 'to' },
        { pattern: /\bdue to the fact that\b/gi, replacement: 'because' },
        { pattern: /\bin spite of the fact that\b/gi, replacement: 'although' },
        { pattern: /\bat this point in time\b/gi, replacement: 'now' },
        { pattern: /\bin the event that\b/gi, replacement: 'if' },
        { pattern: /\bfor the purpose of\b/gi, replacement: 'to' },
        { pattern: /\bwith regard to\b/gi, replacement: 'about' },
        { pattern: /\bit is important to note that\b/gi, replacement: '' },
        { pattern: /\bit should be noted that\b/gi, replacement: '' },
        { pattern: /\bit is worth mentioning that\b/gi, replacement: '' },
        { pattern: /\bit is interesting to note that\b/gi, replacement: '' },
        { pattern: /\butilise\b/gi, replacement: 'use' },
        { pattern: /\butilize\b/gi, replacement: 'use' },
        { pattern: /\bin addition to\b/gi, replacement: 'besides' },
        { pattern: /\bregarding\b/gi, replacement: 'about' },
      ];

      let result = text;
      imperfections.forEach(imp => {
        if (Math.random() < this.config.intensity) {
          result = result.replace(imp.pattern, imp.replacement);
        }
      });

      return result;
    },

    // Add slight grammatical quirks that humans make
    addGrammaticalQuirks: function(text) {
      if (!this.config.quirks) return text;
      const sentences = text.split(/(?<=[.!?])\s+/);
      const quirks = ['Anyway,', 'So,', 'But,', 'Well,', 'Look,', 'Honestly,', 'Plus,', 'Still,', 'Like,', 'Yeah,', 'Right,'];
      const intensity = this.config.intensity;

      for (let i = 1; i < sentences.length; i++) {
        if (Math.random() < (0.15 * intensity) && sentences[i].length > 30) {
          const quirk = quirks[Math.floor(Math.random() * quirks.length)];
          sentences[i] = quirk + ' ' + sentences[i].charAt(0).toLowerCase() + sentences[i].slice(1);
        }
      }

      return sentences.join(' ');
    },

    // Vary sentence length and structure (burstiness)
    addBurstiness: function(text) {
      if (!this.config.burstiness) return text;
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      const result = [];
      const intensity = this.config.intensity;

      sentences.forEach((sentence, index) => {
        if (index > 0 && index % 5 === 0 && Math.random() < (0.6 * intensity)) {
          const shorties = [
            "That's the thing.", "It just works.", "Simple as that.", "No kidding.",
            "Believe it or not.", "Seriously.", "You know what I mean?", "Right?",
            "Makes sense.", "Anyway.", "You get it.", "For real."
          ];
          result.push(shorties[Math.floor(Math.random() * shorties.length)]);
        }
        result.push(sentence);
      });

      return result.join(' ');
    },

    // Add transitional phrases and filler words
    addTransitions: function(text) {
      if (!this.config.transitions) return text;
      const transitions = [
        'Moreover,', 'Furthermore,', 'In addition,', 'On the other hand,',
        'However,', 'Therefore,', 'Consequently,', 'Nevertheless,',
        'Similarly,', 'In contrast,', 'As a result,', 'For instance,',
        'That said,', 'At the same time,', 'To be honest,'
      ];
      const intensity = this.config.intensity;
      const sentences = text.split(/(?<=[.!?])\s+/);

      for (let i = 1; i < sentences.length; i += 3) {
        if (Math.random() < (0.4 * intensity)) {
          const trans = transitions[Math.floor(Math.random() * transitions.length)];
          sentences[i] = trans + ' ' + sentences[i].charAt(0).toLowerCase() + sentences[i].slice(1);
        }
      }

      return sentences.join(' ');
    },

    // Add personal touches and anecdotes
    addPersonalTouches: function(text) {
      if (!this.config.personal) return text;
      const touches = [
        " I've seen this happen more times than I can count.",
        " From my experience, this is usually how it goes.",
        " It's something I've thought about a lot.",
        " I've always found this fascinating.",
        " It's similar to something I encountered last year.",
        " This reminds me of something my professor once said."
      ];

      const sentences = text.split(/(?<=[.!?])\s+/);
      const intensity = this.config.intensity;

      if (sentences.length > 5 && Math.random() < (0.5 * intensity)) {
        const insertIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
        const touch = touches[Math.floor(Math.random() * touches.length)];
        sentences[insertIndex] = sentences[insertIndex].slice(0, -1) + touch + sentences[insertIndex].slice(-1);
      }

      return sentences.join(' ');
    },

    // Simulate human typing errors
    addErrors: function(text) {
      if (!this.config.errors) return text;
      const intensity = this.config.intensity;
      if (intensity < 0.3) return text;

      // Occasionally forget to capitalize after a period
      text = text.replace(/(?<=\.\s)([a-z])/g, (match, p1) => {
        return Math.random() < (0.05 * intensity) ? p1 : p1.toUpperCase();
      });

      // Rare double spaces
      if (Math.random() < (0.1 * intensity)) {
        const positions = [];
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ' && text[i+1] !== ' ') positions.push(i);
        }
        if (positions.length > 0) {
          const pos = positions[Math.floor(Math.random() * positions.length)];
          text = text.slice(0, pos) + '  ' + text.slice(pos + 1);
        }
      }

      return text;
    },

    // Main humanization pipeline
    humanize: function(text, style = 'formal') {
      if (!this.config.enabled) return text;
      let result = text;
      result = this.addHumanImperfections(result);
      result = this.addGrammaticalQuirks(result);
      result = this.addBurstiness(result);
      result = this.addTransitions(result);
      result = this.addPersonalTouches(result);
      result = this.addErrors(result);
      return result;
    }
  };

  // ========== UI and Event Handlers ==========
  function init() {
    const inputText = document.getElementById('inputText');
    const humanizeBtn = document.getElementById('humanizeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const outputSection = document.getElementById('outputSection');
    const outputBox = document.getElementById('outputBox');
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const improveBtn = document.getElementById('improveBtn');

    const humanizationToggle = document.getElementById('humanizationToggle');
    const quirksToggle = document.getElementById('quirksToggle');
    const burstinessToggle = document.getElementById('burstinessToggle');
    const personalToggle = document.getElementById('personalToggle');
    const transitionsToggle = document.getElementById('transitionsToggle');
    const errorsToggle = document.getElementById('errorsToggle');
    const humanLevelSlider = document.getElementById('humanLevelSlider');
    const humanLevelValue = document.getElementById('humanLevelValue');

    let lastHumanized = '';

    function countWords(text) {
      return text.trim().split(/\s+/).filter(Boolean).length;
    }

    function countChars(text) {
      return text.length;
    }

    function showToast(message) {
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }

    function typeWriter(element, text, speed) {
      element.textContent = '';
      let i = 0;
      const words = text.split(' ');
      function type() {
        if (i < words.length) {
          element.textContent += (i > 0 ? ' ' : '') + words[i];
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }

    function updateHumanizerConfig() {
      Humanizer.setConfig({
        enabled: humanizationToggle && humanizationToggle.checked,
        quirks: quirksToggle && quirksToggle.checked,
        burstiness: burstinessToggle && burstinessToggle.checked,
        personal: personalToggle && personalToggle.checked,
        transitions: transitionsToggle && transitionsToggle.checked,
        errors: errorsToggle && errorsToggle.checked,
        intensity: humanLevelSlider ? parseInt(humanLevelSlider.value) / 100 : 0.5
      });
    }

    // Update config when controls change
    [humanizationToggle, quirksToggle, burstinessToggle, personalToggle, transitionsToggle, errorsToggle].forEach(el => {
      if (el) el.addEventListener('change', updateHumanizerConfig);
    });

    if (humanLevelSlider) {
      humanLevelSlider.addEventListener('input', function() {
        updateHumanizerConfig();
        if (humanLevelValue) {
          const val = parseInt(this.value);
          let label = val < 30 ? 'Subtle' : val < 70 ? 'Normal' : 'Extreme';
          humanLevelValue.textContent = `${label} (${val}%)`;
        }
      });
    }

    // Humanize button
    if (humanizeBtn) {
      humanizeBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
          showToast('Please paste some text first');
          inputText.focus();
          return;
        }

        humanizeBtn.disabled = true;
        humanizeBtn.innerHTML = '<span class="spinner"></span> Humanizing...';

        updateHumanizerConfig();
        let humanized = Humanizer.humanize(text);
        lastHumanized = humanized;

        outputSection.style.display = 'block';
        outputBox.classList.remove('placeholder-text');
        typeWriter(outputBox, humanized, 2);

        wordCountEl.textContent = countWords(humanized) + ' words';
        charCountEl.textContent = countChars(humanized) + ' characters';

        humanizeBtn.disabled = false;
        humanizeBtn.innerHTML = '<span class="btn-icon">&#9889;</span> Humanize Text';

        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Improve Further button
    if (improveBtn) {
      improveBtn.addEventListener('click', () => {
        if (!lastHumanized) {
          showToast('No text to improve');
          return;
        }
        const prevIntensity = Humanizer.config.intensity;
        Humanizer.setConfig({ ...Humanizer.config, intensity: Math.min(1, prevIntensity + 0.2) });
        let improved = Humanizer.humanize(lastHumanized);
        Humanizer.setConfig({ ...Humanizer.config, intensity: prevIntensity });
        lastHumanized = improved;
        outputBox.textContent = improved;
        showToast('Text further humanized!');
      });
    }

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputBox.textContent = '';
        outputBox.classList.add('placeholder-text');
        outputBox.innerHTML = '<p class="placeholder-text">Your humanized text will appear here...</p>';
        outputSection.style.display = 'none';
        lastHumanized = '';
      });
    }

    // Copy button
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!lastHumanized) { showToast('No text to copy'); return; }
        navigator.clipboard.writeText(lastHumanized).then(() => {
          showToast('Copied to clipboard!');
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = lastHumanized;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Copied to clipboard!');
        });
      });
    }

    // Download button
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!lastHumanized) { showToast('No text to download'); return; }
        const blob = new Blob([lastHumanized], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'humanized-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Download started!');
      });
    }

    // Initialize
    updateHumanizerConfig();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
