// Configuration object
const defaultConfig = {
  platform_title: "CodeQuest Academy",
  hero_subtitle: "Master Web Development Through Interactive Adventures",
  welcome_message: "Begin Your Coding Journey",
  footer_company: "GlitchForge"
};

// Module definitions
const modules = [
  { id: 'html-basics', name: 'HTML Basics', prerequisite: null },
  { id: 'html-semantic', name: 'Semantic HTML', prerequisite: 'html-basics' },
  { id: 'html-forms', name: 'HTML Forms', prerequisite: 'html-semantic' },
  { id: 'css-basics', name: 'CSS Basics', prerequisite: 'html-forms' },
  { id: 'css-layouts', name: 'CSS Layouts', prerequisite: 'css-basics' },
  { id: 'css-responsive', name: 'Responsive Design', prerequisite: 'css-layouts' },
  { id: 'css-animations', name: 'CSS Animations', prerequisite: 'css-responsive' },
  { id: 'js-basics', name: 'JS Basics', prerequisite: 'css-animations' },
  { id: 'js-dom', name: 'DOM Manipulation', prerequisite: 'js-basics' },
  { id: 'js-async', name: 'Async JavaScript', prerequisite: 'js-dom' },
  { id: 'js-advanced', name: 'Advanced JS', prerequisite: 'js-async' },
  { id: 'certification-exam', name: 'Certification Exam', prerequisite: 'js-advanced' }
];

// Exam questions database
const examQuestions = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
    correct: 0
  },
  {
    question: "Which HTML element is used for the largest heading?",
    options: ["<h6>", "<h1>", "<header>", "<heading>"],
    correct: 1
  },
  {
    question: "What is the correct CSS syntax for making all paragraphs bold?",
    options: ["p {font-weight: bold;}", "<p style='bold'>", "p {text-size: bold;}", "p {font: bold;}"],
    correct: 0
  },
  {
    question: "Which CSS property is used to change the background color?",
    options: ["color", "bgcolor", "background-color", "bg-color"],
    correct: 2
  },
  {
    question: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correct: 1
  },
  {
    question: "Which JavaScript method is used to write HTML output?",
    options: ["document.write()", "document.output()", "document.print()", "document.html()"],
    correct: 0
  },
  {
    question: "How do you create a function in JavaScript?",
    options: ["function = myFunction() {}", "function myFunction() {}", "create myFunction() {}", "def myFunction() {}"],
    correct: 1
  },
  {
    question: "Which HTML attribute specifies an alternate text for an image?",
    options: ["title", "alt", "src", "longdesc"],
    correct: 1
  },
  {
    question: "What is the correct way to link an external CSS file?",
    options: ["<style src='style.css'>", "<link rel='stylesheet' href='style.css'>", "<css>style.css</css>", "<stylesheet>style.css</stylesheet>"],
    correct: 1
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    correct: 2
  },
  {
    question: "How do you select an element with id 'demo' in CSS?",
    options: [".demo", "#demo", "demo", "*demo"],
    correct: 1
  },
  {
    question: "Which JavaScript event occurs when the user clicks on an HTML element?",
    options: ["onchange", "onclick", "onmouseclick", "onmouseover"],
    correct: 1
  },
  {
    question: "What is the correct HTML for creating a hyperlink?",
    options: ["<a url='http://example.com'>Example</a>", "<a href='http://example.com'>Example</a>", "<a>http://example.com</a>", "<link>http://example.com</link>"],
    correct: 1
  },
  {
    question: "Which CSS property is used to make text italic?",
    options: ["font-style: italic", "text-style: italic", "font: italic", "text-decoration: italic"],
    correct: 0
  },
  {
    question: "How do you add a comment in JavaScript?",
    options: ["<!-- This is a comment -->", "// This is a comment", "' This is a comment", "* This is a comment *"],
    correct: 1
  }
];

// Exam state
let examState = {
  currentQuestion: 0,
  answers: [],
  timeRemaining: 1800, // 30 minutes
  timerInterval: null,
  isActive: false
};

let userProgress = [];
let isLoading = false;

// Data SDK handler
const dataHandler = {
  onDataChanged(data) {
    userProgress = data;
    updateUI();
  }
};

// Initialize particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Update UI based on progress data
function updateUI() {
  const completedModules = userProgress.filter(p => p.completed);
  const totalModules = modules.length;
  const completedCount = completedModules.length;
  const totalProgress = Math.round((completedCount / totalModules) * 100);

  // Update stats
  document.getElementById('completed-count').textContent = completedCount;
  document.getElementById('total-progress').textContent = totalProgress + '%';

  // Update module states
  let unlockedCount = 1; // HTML Basics is always unlocked
  modules.forEach(module => {
    const moduleElement = document.querySelector(`[data-module="${module.id}"]`);
    const progressData = userProgress.find(p => p.module_id === module.id);
    const isCompleted = progressData?.completed || false;
    const isUnlocked = isModuleUnlocked(module.id);

    if (isUnlocked && !isCompleted) unlockedCount++;

    // Update visual state
    moduleElement.classList.toggle('completed', isCompleted);
    moduleElement.classList.toggle('locked', !isUnlocked);

    // Update progress bar
    const progressFill = moduleElement.querySelector('.progress-fill');
    if (isCompleted) {
      progressFill.style.width = '100%';
    } else if (isUnlocked) {
      progressFill.style.width = '0%';
    } else {
      progressFill.style.width = '0%';
    }
  });

  document.getElementById('unlocked-count').textContent = unlockedCount;
}

// Check if module is unlocked
function isModuleUnlocked(moduleId) {
  if (moduleId === 'html-basics') return true;

  const module = modules.find(m => m.id === moduleId);
  if (!module.prerequisite) return true;

  const prerequisiteProgress = userProgress.find(p => p.module_id === module.prerequisite);
  return prerequisiteProgress?.completed || false;
}

// Handle module click
async function handleModuleClick(moduleId) {
  if (isLoading) return;

  // Special handling for certification exam
  if (moduleId === 'certification-exam') {
    const isUnlocked = isModuleUnlocked(moduleId);
    if (!isUnlocked) {
      showTooltip('Complete all modules first to unlock the certification exam!');
      return;
    }
    startExam();
    return;
  }

  const isUnlocked = isModuleUnlocked(moduleId);
  if (!isUnlocked) {
    showTooltip('Complete previous modules first!');
    return;
  }

  const existingProgress = userProgress.find(p => p.module_id === moduleId);
  if (existingProgress?.completed) {
    showTooltip('Module already completed!');
    return;
  }

  isLoading = true;
  const moduleElement = document.querySelector(`[data-module="${moduleId}"]`);
  moduleElement.style.opacity = '0.7';

  // Simulate module completion
  setTimeout(async () => {
    const result = await window.dataSdk.create({
      module_id: moduleId,
      completed: true,
      progress: 100,
      unlocked: true,
      type: 'module',
      completed_at: new Date().toISOString()
    });

    if (result.isOk) {
      showCelebration();
      moduleElement.style.opacity = '1';
    } else {
      showTooltip('Failed to save progress. Please try again.');
      moduleElement.style.opacity = '1';
    }

    isLoading = false;
  }, 2000);
}

// Exam functions
function startExam() {
  examState.currentQuestion = 0;
  examState.answers = new Array(examQuestions.length).fill(null);
  examState.timeRemaining = 1800;
  examState.isActive = true;

  document.getElementById('exam-modal').classList.add('active');
  document.getElementById('exam-body').style.display = 'block';
  document.getElementById('exam-results').style.display = 'none';

  displayQuestion();
  startTimer();
}

function displayQuestion() {
  const question = examQuestions[examState.currentQuestion];
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const questionTextEl = document.getElementById('question-text');
  const questionOptionsEl = document.getElementById('question-options');

  currentQuestionEl.textContent = examState.currentQuestion + 1;
  totalQuestionsEl.textContent = examQuestions.length;
  questionTextEl.textContent = question.question;

  // Clear previous options
  questionOptionsEl.innerHTML = '';

  // Create option elements
  question.options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'option';
    optionEl.innerHTML = `
                    <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="option-text">${option}</div>
                `;

    // Check if this option was previously selected
    if (examState.answers[examState.currentQuestion] === index) {
      optionEl.classList.add('selected');
    }

    optionEl.addEventListener('click', () => selectOption(index));
    questionOptionsEl.appendChild(optionEl);
  });

  // Update navigation buttons
  document.getElementById('prev-btn').disabled = examState.currentQuestion === 0;
  document.getElementById('next-btn').style.display = examState.currentQuestion === examQuestions.length - 1 ? 'none' : 'inline-block';
  document.getElementById('submit-btn').style.display = examState.currentQuestion === examQuestions.length - 1 ? 'inline-block' : 'none';
}

function selectOption(optionIndex) {
  examState.answers[examState.currentQuestion] = optionIndex;

  // Update visual selection
  document.querySelectorAll('.option').forEach((option, index) => {
    option.classList.toggle('selected', index === optionIndex);
  });
}

function nextQuestion() {
  if (examState.currentQuestion < examQuestions.length - 1) {
    examState.currentQuestion++;
    displayQuestion();
  }
}

function prevQuestion() {
  if (examState.currentQuestion > 0) {
    examState.currentQuestion--;
    displayQuestion();
  }
}

function startTimer() {
  examState.timerInterval = setInterval(() => {
    examState.timeRemaining--;
    updateTimerDisplay();

    if (examState.timeRemaining <= 0) {
      submitExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(examState.timeRemaining / 60);
  const seconds = examState.timeRemaining % 60;
  document.getElementById('time-remaining').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function submitExam() {
  if (examState.timerInterval) {
    clearInterval(examState.timerInterval);
  }

  examState.isActive = false;

  // Calculate score
  let correctAnswers = 0;
  examState.answers.forEach((answer, index) => {
    if (answer === examQuestions[index].correct) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / examQuestions.length) * 100);
  const passed = score >= 80;

  // Show results
  document.getElementById('exam-body').style.display = 'none';
  document.getElementById('exam-results').style.display = 'block';

  // Animate score circle
  const scoreCircle = document.querySelector('.score-circle');
  const scoreAngle = (score / 100) * 360;
  scoreCircle.style.setProperty('--score-angle', scoreAngle + 'deg');

  document.getElementById('final-score').textContent = score + '%';
  document.getElementById('results-title').textContent = passed ? '🎉 Congratulations!' : '📚 Keep Learning!';
  document.getElementById('results-message').textContent = passed ? 
    'You have successfully passed the certification exam!' : 
  'You need 80% or higher to pass. Review the modules and try again.';

  // Show certificate if passed
  if (passed) {
    document.getElementById('certificate-preview').style.display = 'block';
    document.getElementById('download-cert').style.display = 'inline-block';

    // Update certificate details
    document.getElementById('cert-score').textContent = score + '%';
    document.getElementById('cert-date').textContent = new Date().toLocaleDateString();

    // Save certification to database
    const result = await window.dataSdk.create({
      module_id: 'certification-exam',
      completed: true,
      progress: 100,
      unlocked: true,
      type: 'certification',
      exam_score: score,
      certification_earned: true,
      exam_attempts: 1,
      completed_at: new Date().toISOString()
    });

    if (result.isOk) {
      showCelebration();
    }
  } else {
    document.getElementById('certificate-preview').style.display = 'none';
    document.getElementById('download-cert').style.display = 'none';
  }
}

function closeExam() {
  document.getElementById('exam-modal').classList.remove('active');
  if (examState.timerInterval) {
    clearInterval(examState.timerInterval);
  }
  examState.isActive = false;
}

function downloadCertificate() {
  // Create a canvas to render the certificate
  const certificate = document.querySelector('.certificate');

  // Simple download simulation - in a real app, you'd use html2canvas or similar
  const certificateText = `
CERTIFICATE OF COMPLETION

${document.getElementById('cert-title').textContent}

This certifies that CodeQuest Graduate has successfully completed 
the Web Development Learning Path with a final score of ${document.getElementById('cert-score').textContent}

Completed: ${document.getElementById('cert-date').textContent}
Issued by: ${document.getElementById('cert-company').textContent}
            `;

  const blob = new Blob([certificateText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'web-developer-certificate.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showTooltip('Certificate downloaded! 🎉');
}

// Show celebration animation
function showCelebration() {
  const celebration = document.getElementById('celebration');
  celebration.innerHTML = '<div class="celebration-text">🎉 Module Completed! 🎉</div>';

  // Add sparkles
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = (Math.random() * 200 - 100) + 'px';
    sparkle.style.top = (Math.random() * 200 - 100) + 'px';
    sparkle.style.animationDelay = (Math.random() * 0.5) + 's';
    celebration.appendChild(sparkle);
  }

  setTimeout(() => {
    celebration.innerHTML = '';
  }, 2000);
}

// Show tooltip message
function showTooltip(message) {
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-size: 1rem;
                z-index: 1000;
                animation: fadeInOut 3s ease-out forwards;
            `;
  tooltip.textContent = message;
  document.body.appendChild(tooltip);

  setTimeout(() => {
    document.body.removeChild(tooltip);
  }, 3000);
}

// Element SDK implementation
const element = {
  defaultConfig: {
    ...defaultConfig,
    certification_title: "Certified Web Developer"
  },
  render: async (config) => {
    document.getElementById('platform-title').textContent = config.platform_title || defaultConfig.platform_title;
    document.getElementById('hero-subtitle').textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
    document.getElementById('welcome-message').textContent = config.welcome_message || defaultConfig.welcome_message;
    document.getElementById('footer-company').textContent = config.footer_company || defaultConfig.footer_company;
    document.getElementById('cert-title').textContent = config.certification_title || "Certified Web Developer";
    document.getElementById('cert-company').textContent = (config.footer_company || defaultConfig.footer_company) + " Academy";
  },
  mapToCapabilities: (config) => ({
    recolorables: [],
    borderables: [],
    fontEditable: undefined,
    fontSizeable: undefined
  }),
  mapToEditPanelValues: (config) => new Map([
    ['platform_title', config.platform_title || defaultConfig.platform_title],
    ['hero_subtitle', config.hero_subtitle || defaultConfig.hero_subtitle],
    ['welcome_message', config.welcome_message || defaultConfig.welcome_message],
    ['footer_company', config.footer_company || defaultConfig.footer_company],
    ['certification_title', config.certification_title || "Certified Web Developer"]
  ])
};

// Initialize application
async function init() {
  // Initialize Element SDK
  if (window.elementSdk) {
    await window.elementSdk.init(element);
  }

  // Initialize Data SDK
  if (window.dataSdk) {
    const initResult = await window.dataSdk.init(dataHandler);
    if (!initResult.isOk) {
      console.error('Failed to initialize data SDK');
    }
  }

  // Create particles
  createParticles();

  // Add event listeners
  document.querySelectorAll('.module-node').forEach(node => {
    node.addEventListener('click', (e) => {
      const moduleId = e.currentTarget.dataset.module;
      handleModuleClick(moduleId);
    });
  });

  document.getElementById('welcome-btn').addEventListener('click', () => {
    document.querySelector('.learning-map').scrollIntoView({ 
      behavior: 'smooth' 
    });
  });

  // Exam event listeners
  document.getElementById('prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('submit-btn').addEventListener('click', submitExam);
  document.getElementById('close-modal').addEventListener('click', closeExam);
  document.getElementById('close-exam').addEventListener('click', closeExam);
  document.getElementById('retake-exam').addEventListener('click', startExam);
  document.getElementById('download-cert').addEventListener('click', downloadCertificate);

  // Initial UI update
  updateUI();
}

// Add CSS animation for fadeInOut
const style = document.createElement('style');
style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
document.head.appendChild(style);

// Start the application
init();
