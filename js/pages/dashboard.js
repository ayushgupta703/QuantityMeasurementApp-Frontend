import { convert, add } from "../services/calculationService.js";

// Backend-aligned local mappings (Fallback before API)
const LENGTH = { feet: 1, inch: 1/12, yard: 3 };
const WEIGHT = { kilogram: 1, gram: 0.001, pound: 0.453592 };
const TEMPERATURE = { celsius: 1, fahrenheit: "complex"};
const VOLUME = { litre: 1, millilitre: 0.001, gallon: 3.78541 };
const MAPS = { LENGTH, WEIGHT, TEMPERATURE, VOLUME };

const unitsByType = {
  LENGTH: [
    { value: 'feet', label: 'Feet' },
    { value: 'inch', label: 'Inch' },
    { value: 'yard', label: 'Yard' }
  ],
  WEIGHT: [
    { value: 'kilogram', label: 'Kilogram' },
    { value: 'gram', label: 'Gram' },
    { value: 'pound', label: 'Pound' }
  ],
  TEMPERATURE: [
    { value: 'celsius', label: 'Celsius' },
    { value: 'fahrenheit', label: 'Fahrenheit' }
  ],
  VOLUME: [
    { value: 'litre', label: 'Litre' },
    { value: 'millilitre', label: 'Millilitre' },
    { value: 'gallon', label: 'Gallon' }
  ]
};

// State
let currentType = 'LENGTH';
let currentAction = 'CONVERSION';
// Selectors
const typeCards = document.querySelectorAll('.type-card');
const actionTabs = document.querySelectorAll('.action-tab');
const workspace = document.getElementById('workspace');

// Custom Logic Wrappers
function convertTemp(value, from, to) {
  if (from === to) return value;
  let c;
  if (from === 'celsius') c = value;
  else if (from === 'fahrenheit') c = (value - 32) * 5 / 9;
  
  if (to === 'celsius') return c;
  else if (to === 'fahrenheit') return (c * 9 / 5) + 32;
}

function unifiedConvert(val, from, to, type) {
  if (type === 'TEMPERATURE') {
     return convertTemp(val, from, to);
  }
  return convert(val, from, to, MAPS[type]);
}

// Initialization
function init() {
  attachListeners();
  renderWorkspace();
  setupUserAccount();
}

function setupUserAccount() {
  const userEmail = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  
  const storedEmail = localStorage.getItem('userEmail');
  if (storedEmail) {
    userEmail.innerText = storedEmail;
  } else {
    userEmail.innerText = 'ayush@example.com'; 
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('jwtToken');
      window.location.href = 'index.html';
    });
  }
}

function attachListeners() {
  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentType = card.dataset.type;
      renderWorkspace();
    });
  });

  actionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      actionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentAction = tab.dataset.action;
      renderWorkspace();
    });
  });
}

function getOptionsHTML(type) {
  const units = unitsByType[type] || unitsByType['LENGTH'];
  return units.map(u => `<option value="${u.value}">${u.label}</option>`).join('');
}

function createInputGroupHTML(label, valId, selectId, type, isReadonly = false) {
  return `
    <div class="input-group">
      <label>${label}</label>
      <div class="input-box">
        <input type="number" id="${valId}" ${isReadonly ? 'readonly placeholder="N/A"' : 'value="1"'} />
        <select id="${selectId}">${getOptionsHTML(type)}</select>
      </div>
    </div>
  `;
}


function renderWorkspace() {
  workspace.innerHTML = ''; 

  if (currentAction === 'CONVERSION') {
    workspace.innerHTML = `
      <div class="workspace-wrapper">
        <div class="input-row">
          ${createInputGroupHTML('FROM', 'v1', 'u1', currentType)}
          ${createInputGroupHTML('TO', 'v2', 'u2', currentType, true)}
        </div>
      </div>
    `;

    const v1 = document.getElementById('v1');
    const u1 = document.getElementById('u1');
    const u2 = document.getElementById('u2');
    const v2 = document.getElementById('v2');
    
    if (u2.options.length > 1) {
      u2.selectedIndex = 1;
    }

    const doConvert = () => {
      const val = parseFloat(v1.value) || 0;
      let res = unifiedConvert(val, u1.value, u2.value, currentType);
      
      if (isNaN(res)) {
        v2.value = "";
      } else {
        v2.value = Number.isInteger(res) ? res : res.toFixed(3);
      }
    };

    v1.addEventListener('input', doConvert);
    [u1, u2].forEach(el => el.addEventListener('change', doConvert));
    
    doConvert();

  } else if (currentAction === 'ARITHMETIC') {
    if (currentType === 'TEMPERATURE') {
      workspace.innerHTML = `
        <div class="workspace-wrapper">
          <div style="background: white; padding: 30px; text-align: center; border-radius: 8px; color: #a03037; font-weight: 600;">
            Arithmetic operations are strictly restricted for Temperature.
          </div>
        </div>
      `;
      return;
    }

    workspace.innerHTML = `
      <div class="workspace-wrapper">
        <div class="input-row">
          ${createInputGroupHTML('VALUE 1', 'v1', 'u1', currentType)}
          <select id="arithmeticOp" class="action-symbol" style="border:1px solid #ccc; cursor:pointer;">
            <option value="add">+</option>
            <option value="subtract">-</option>
            <option value="divide">/</option>
          </select>
          ${createInputGroupHTML('VALUE 2', 'v2', 'u2', currentType)}
        </div>
        <div class="result-box">
          <div>
            <div class="res-label">RESULT</div>
            <div class="res-value" id="result-val">0</div>
          </div>
          <select id="u3" class="res-dropdown">${getOptionsHTML(currentType)}</select>
        </div>
      </div>
    `;

    const v1 = document.getElementById('v1');
    const u1 = document.getElementById('u1');
    const op = document.getElementById('arithmeticOp');
    const v2 = document.getElementById('v2');
    const u2 = document.getElementById('u2');
    const u3 = document.getElementById('u3');
    const resVal = document.getElementById('result-val');

    const doArithmetic = () => {
      const val1 = parseFloat(v1.value) || 0;
      const val2 = parseFloat(v2.value) || 0;
      
      let base1 = val1 * MAPS[currentType][u1.value];
      let base2 = val2 * MAPS[currentType][u2.value];
      let baseRes;

      if (op.value === 'add') baseRes = base1 + base2;
      else if (op.value === 'subtract') baseRes = base1 - base2;
      else if (op.value === 'divide') baseRes = base1 / (base2 || 1);

      let res = baseRes / MAPS[currentType][u3.value];
      
      if (isNaN(res)) {
         resVal.innerText = "N/A";
      } else {
         resVal.innerText = Number.isInteger(res) ? res : res.toFixed(3);
      }
    };

    [v1, v2].forEach(el => el.addEventListener('input', doArithmetic));
    [u1, u2, u3, op].forEach(el => el.addEventListener('change', doArithmetic));
    
    doArithmetic();

  } else if (currentAction === 'COMPARISON') {
    workspace.innerHTML = `
      <div class="workspace-wrapper">
        <div class="input-row">
          ${createInputGroupHTML('VALUE 1', 'v1', 'u1', currentType)}
          <div class="action-symbol">VS</div>
          ${createInputGroupHTML('VALUE 2', 'v2', 'u2', currentType)}
        </div>
        <div class="result-box" style="justify-content: center; text-align: center;">
          <div>
            <div class="res-label">COMPARISON</div>
            <div class="res-value" id="result-val">Equal</div>
          </div>
        </div>
      </div>
    `;

    const v1 = document.getElementById('v1');
    const u1 = document.getElementById('u1');
    const v2 = document.getElementById('v2');
    const u2 = document.getElementById('u2');
    const resVal = document.getElementById('result-val');

    const doCompare = () => {
      const val1 = parseFloat(v1.value) || 0;
      const val2Base = unifiedConvert(parseFloat(v2.value) || 0, u2.value, u1.value, currentType);
      
      if (isNaN(val2Base)) {
         resVal.innerHTML = "N/A";
         return;
      }

      if (Math.abs(val1 - val2Base) < 0.0001) {
        resVal.innerHTML = "= Equal";
      } else {
        resVal.innerHTML = "≠ Not Equal";
      }
    };

    [v1, v2].forEach(el => el.addEventListener('input', doCompare));
    [u1, u2].forEach(el => el.addEventListener('change', doCompare));
    
    doCompare();
  }
}

init();