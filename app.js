const matrixEl = document.querySelector('.matrix');
const squresEl = document.querySelector('.squares');
const INIT_ROWS = 4;
const INIT_COLS = 4;

const state = {
  matrix: [],
  currentPosition: {
    col: 0,
    row: 0
  }
};

function defaultMatrix(rows, cols) {
  const matrix = [];

  for (let rowIndex = 0; rowIndex < rows; ++rowIndex) {

    const columns = [];
    for (let colIndex = 0; colIndex < cols; ++colIndex) {
      const item = document.createElement('div');
      item.classList.add('el', 'col', 'el-size');
      columns.push(item);
    }

    matrix.push(columns);
  }

  return matrix;
}

function clearDomMatrix() {
  while (matrixEl.hasChildNodes()) {
    matrixEl.removeChild(matrixEl.lastChild);
  }
}

function render(matrix) {
  clearDomMatrix();
  state.matrix = matrix;
  for (let rowIndex = 0; rowIndex < matrix.length; ++rowIndex) {
    for (let colIndex = 0; colIndex < matrix[rowIndex].length; ++colIndex) {
    	const item = matrix[rowIndex][colIndex];
    	item.setAttribute('data-row', rowIndex);
      item.setAttribute('data-col', colIndex);
      matrixEl.appendChild(item);
    }
    const clearFix = document.createElement('div');
    clearFix.classList.add('clearfix');
    matrixEl.appendChild(clearFix);
  }
}

function addColumn(oldMatrix) {
  return defaultMatrix(oldMatrix.length, oldMatrix[0].length + 1);
}

function addRow(oldMatrix) {
  return defaultMatrix(oldMatrix.length + 1, oldMatrix[0].length);
}

function makeControl({
  text,
  classes,
  handler
}) {
  const control = document.createElement('button');
  control.textContent = text;
  control.classList.add(...classes);
  control.addEventListener('click', handler);

  return control;
}

function removeRow(rowBtn, matrix) {
  matrix.splice(state.currentPosition.row, 1);
  
  if (!isAvailableBtnRemoveRow()) {
  	changeOpacity(rowBtn, 0);
  }
  
  return matrix;
}

function removeCol(colBtn, matrix) {
  for (let rowIndex = 0; rowIndex < matrix.length; ++rowIndex) {
    for (let colIndex = 0; colIndex < matrix[rowIndex].length; ++colIndex) {
      if (state.currentPosition.col === colIndex) {
        matrix[rowIndex].splice(colIndex, 1);
      }
    }
  }
  
  if (!isAvailableBtnRemoveCol()) {
  	changeOpacity(colBtn, 0);
  }
  
  return matrix;
}

function wrapControl(fn) {
    return function (...arguments) {
        const matrix = fn.apply(null, arguments);
        render(matrix);
    }
}

function addControls() {
  const textAdd = '+';
  const textRemove = '-';
  const baseClasses = ['control', 'el', 'el-size'];

  const addColBtn = makeControl({
    text: textAdd,
    classes: ['control-add-bg', 'control-add', 'margin'].concat(baseClasses),
    handler: () => wrapControl(addColumn)(state.matrix)
  });

  const addRowBtn = makeControl({
    text: textAdd,
    classes: ['control-add-bg', 'control-row-add-clearfix', 'control-add'].concat(baseClasses),
    handler: () => wrapControl(addRow)(state.matrix)
  });


  const removeRowBtn = makeControl({
    text: textRemove,
    classes: ['control-remove', 'control-remove-row'].concat(baseClasses),
    handler: () => wrapControl(removeRow)(removeRowBtn, state.matrix)
  });

  const removeColBtn = makeControl({
    text: textRemove,
    classes: ['control-remove', 'control-remove-col'].concat(baseClasses),
    handler: () => wrapControl(removeCol)(removeColBtn, state.matrix)
  });

  squresEl.appendChild(addColBtn);
  squresEl.appendChild(addRowBtn);

  squresEl.appendChild(removeRowBtn);
  squresEl.appendChild(removeColBtn);

  return {
  	addColBtn,
  	addRowBtn,
    removeRowBtn,
    removeColBtn
  };
}

function changeOpacity(el, value) {
  el.style.opacity = value;
}

function hideRemoveControls(rowBtn, colBtn) {
	changeOpacity(rowBtn, 0);
  changeOpacity(colBtn, 0);
}

function isAvailableBtnRemoveCol() {
	return state.matrix[0].length > 1;
}

function isAvailableBtnRemoveRow() {
	return state.matrix.length > 1;
}

function showRemoveControlsIfAvailable(rowBtn, colBtn) {
	if (isAvailableBtnRemoveRow()) {
  	changeOpacity(rowBtn, 1);
  }
  if (isAvailableBtnRemoveCol()) {
  	changeOpacity(colBtn, 1);
  }
}

function genericDelay(fn, ms) {
   let timer;
   return function(event) {
      clearTimeout(timer);
      timer = setTimeout(fn.bind(null, event), ms || 500);
   }
}

function app() {
  const matrix = defaultMatrix(INIT_ROWS, INIT_COLS);
  render(matrix);
  const {
    removeRowBtn,
    removeColBtn
  } = addControls();

  hideRemoveControls(removeRowBtn, removeColBtn);

  matrixEl.addEventListener('mouseover', ({ target }) => {

    const isMatchHoverEl = target.matches('.col')
    	|| target.matches('.clearfix')
    	|| target.matches('.control-remove');

    if (isMatchHoverEl) {
      showRemoveControlsIfAvailable(removeRowBtn, removeColBtn);

      if (target.matches('.col')) {
        const {
          top,
          left
        } = target.getBoundingClientRect();
        removeRowBtn.style.transform = `translateY(${(top - 40)}px)`;
        removeColBtn.style.transform = `translateX(${(left - 50)}px)`;

        state.currentPosition.col = parseInt(target.getAttribute('data-col'));
        state.currentPosition.row = parseInt(target.getAttribute('data-row'));
      }
    }
  });
  matrixEl.addEventListener('mouseout', ({ relatedTarget }) => {
    if (relatedTarget && relatedTarget.matches('.control-remove')) {
      showRemoveControlsIfAvailable(removeRowBtn, removeColBtn);
    } else {
    	hideRemoveControls(removeRowBtn, removeColBtn);
    }
  });
}

app();

