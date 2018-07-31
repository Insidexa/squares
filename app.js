kconst matrixEl = document.querySelector('.matrix');
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
  clearDomMatrix();
  const matrix = defaultMatrix(oldMatrix.length, oldMatrix[0].length + 1);
  render(matrix);
}

function addRow(oldMatrix) {
  clearDomMatrix();
  const matrix = defaultMatrix(oldMatrix.length + 1, oldMatrix[0].length);
  render(matrix);
}

function makeControl({
  text,
  classes,
  handler
}) {
  const control = document.createElement('div');
  control.textContent = text;
  control.classList.add(...classes);
  control.addEventListener('click', handler);

  return control;
}

function removeRow(matrix) {
  clearDomMatrix();
  console.log('remove row by index', state.currentPosition.row)
  matrix.splice(state.currentPosition.row, 1);
  render(matrix);
}

function removeCol(matrix) {
  clearDomMatrix();
  console.log('remove row by index', state.currentPosition.col)
  for (let rowIndex = 0; rowIndex < matrix.length; ++rowIndex) {
    for (let colIndex = 0; colIndex < matrix[rowIndex].length; ++colIndex) {
      if (state.currentPosition.col === colIndex) {
        matrix[rowIndex].splice(colIndex, 1);
      }
    }
  }
  render(matrix);
}

function addControls() {
  const textAdd = '+';
  const textRemove = '-';
  const baseClasses = ['control', 'el', 'el-size'];

  const addColBtn = makeControl({
    text: textAdd,
    classes: ['control-add-bg', 'control-add', 'margin'].concat(baseClasses),
    handler: () => addColumn(state.matrix)
  });

  const addRowBtn = makeControl({
    text: textAdd,
    classes: ['control-add-bg', 'control-row-add-clearfix', 'control-add'].concat(baseClasses),
    handler: () => addRow(state.matrix)
  });



  const removeRowBtn = makeControl({
    text: textRemove,
    classes: ['control-remove', 'control-remove-row'].concat(baseClasses),
    handler: () => removeRow(state.matrix)
  });

  const removeColBtn = makeControl({
    text: textRemove,
    classes: ['control-remove', 'control-remove-col'].concat(baseClasses),
    handler: () => removeCol(state.matrix)
  });

  squresEl.appendChild(addColBtn);
  squresEl.appendChild(addRowBtn);

  squresEl.appendChild(removeRowBtn);
  squresEl.appendChild(removeColBtn);

  return {
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

function showRemoveControls(rowBtn, colBtn) {
	if (isAvailableBtnRemoveRow()) {
  	changeOpacity(rowBtn, 1);
  }
  if (isAvailableBtnRemoveCol()) {
  	changeOpacity(colBtn, 1);
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

  matrixEl.addEventListener('mouseover', ({
    target
  }) => {

    const isMatch = target.matches('.col')
    	|| target.matches('.clearfix')
    	|| target.matches('.control-remove');

    if (isMatch) {
      showRemoveControls(removeRowBtn, removeColBtn);

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
  matrixEl.addEventListener('mouseout', ({
    relatedTarget
  }) => {
    if (relatedTarget.matches('.control-remove')) {
      showRemoveControls(removeRowBtn, removeColBtn);
    } else {
    	hideRemoveControls(removeRowBtn, removeColBtn);
    }
  });
}

app();

