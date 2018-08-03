class Squares {
    constructor(rootEl, matrixEl, { rowsCount, colsCount }) {
        this.rootEl = rootEl;
        this.matrixEl = matrixEl;

        this.matrix = [];
        this.currentPosition = {
            col: 0,
            row: 0
        };
        
        this.run(rowsCount, colsCount);
    }
    
    run (rows, cols) {
        const matrix = this.generateMatrix(rows, cols);
        this.render(matrix);
        const controls = this.addControls();

        this.initEventListeners(controls);
        
        this.hideRemoveControls(controls.removeRowBtn, controls.removeColBtn);
    }
    
    generateMatrix(rows, cols) {
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
    
    render(matrix) {
        this.clearDomMatrix();
        this.matrix = matrix;
        for (let rowIndex = 0; rowIndex < this.matrix.length; ++rowIndex) {
            for (let colIndex = 0; colIndex < this.matrix[rowIndex].length; ++colIndex) {
                const item = this.matrix[rowIndex][colIndex];
                item.setAttribute('data-row', rowIndex);
                item.setAttribute('data-col', colIndex);
                this.matrixEl.appendChild(item);
            }
            const clearFix = document.createElement('div');
            clearFix.classList.add('clearfix');
            this.matrixEl.appendChild(clearFix);
        }
    }
    
    clearDomMatrix() {
        while (this.matrixEl.hasChildNodes()) {
            this.matrixEl.removeChild(matrixEl.lastChild);
        }
    }

    
    initEventListeners({ removeRowBtn, removeColBtn, addColBtn, addRowBtn }) {
        
        let timeout = null;
        
        removeRowBtn.addEventListener('mouseout', ({ target }) => {
            this.hideRemoveControls(removeRowBtn, removeColBtn);
            clearTimeout(timeout);
        });
        removeRowBtn.addEventListener('mouseover', () => clearTimeout(timeout));
        removeRowBtn.addEventListener('click', () => {
            this.wrapControl(this.onRemoveRow.bind(this), removeRowBtn)
        });
        
        removeColBtn.addEventListener('mouseout', ({ target }) => {
            this.hideRemoveControls(removeRowBtn, removeColBtn);
            clearTimeout(timeout);
        });
        removeColBtn.addEventListener('mouseover', () => clearTimeout(timeout));
        removeColBtn.addEventListener('click', () => {
            this.wrapControl(this.onRemoveCol.bind(this), removeColBtn)
        });
        
        addColBtn.addEventListener('click', () => {
            this.wrapControl(this.onAddColumn.bind(this))
        });
        
        addRowBtn.addEventListener('click', () => {
            this.wrapControl(this.onAddRow.bind(this))
        });
        
        this.matrixEl.addEventListener('mouseover', ({ target }) => {
            this.onTableHover(target, removeRowBtn, removeColBtn);
            clearTimeout(timeout);
        });

        this.matrixEl.addEventListener('mouseout', ({ relatedTarget }) => {
            if (relatedTarget && relatedTarget.matches('.control-remove')) {
                this.showRemoveControlsIfAvailable(removeRowBtn, removeColBtn);
            } else {
                timeout = setTimeout(() => {
                    this.hideRemoveControls(removeRowBtn, removeColBtn);
                    clearTimeout(timeout);
                }, 1500);
            }
        });   
    }
    
    onTableHover(target, removeRowBtn, removeColBtn) {
        const isMatchHoverEl = target.matches('.col')
                || target.matches('.clearfix')
                || target.matches('.control-remove');

            if (isMatchHoverEl) {
                this.showRemoveControlsIfAvailable(removeRowBtn, removeColBtn);

                if (target.matches('.col')) {
                    const {
                        top,
                        left
                    } = target.getBoundingClientRect();
                    removeRowBtn.style.transform = `translateY(${(top - 40)}px)`;
                    removeColBtn.style.transform = `translateX(${(left - 50)}px)`;

                    this.currentPosition.col = parseInt(target.getAttribute('data-col'));
                    this.currentPosition.row = parseInt(target.getAttribute('data-row'));
                }
            }
    }
    
    onAddColumn() {
        return this.generateMatrix(this.matrix.length, this.matrix[0].length + 1);
    }
    
    onAddRow() {
        return this.generateMatrix(this.matrix.length + 1, this.matrix[0].length);
    }
    
    onRemoveRow(rowBtn) {
        const { row } = this.currentPosition;
        this.matrix.splice(row, 1);
        
        const isLast = this.isLastRow(this.matrix, row);
            
        if (isLast) {
            const { top } = this.matrix[row - 1][0].getBoundingClientRect();
            rowBtn.style.transform = `translateY(${(top - 40)}px)`;
        }
        
        if (isLast || !this.isAvailableBtnRemoveRow()) {
            this.changeOpacity(rowBtn, 0);
            this.disablePointerEvent(rowBtn);
        }
        
        return this.matrix;
    }
    
    onRemoveCol(colBtn) {
        const { col } = this.currentPosition;
        for (let rowIndex = 0; rowIndex < this.matrix.length; ++rowIndex) {
            for (let colIndex = 0; colIndex < this.matrix[rowIndex].length; ++colIndex) {
            if (col === colIndex) {
                    this.matrix[rowIndex].splice(colIndex, 1);
                }
            }
        }
        const isLast = this.isLastCol(this.matrix, col);
            
        if (isLast) {
            const { left } = this.matrix[0][col - 1].getBoundingClientRect();
            colBtn.style.transform = `translateX(${(left - 50)}px)`;
        }
            
        if (isLast || !this.isAvailableBtnRemoveCol()) {
            this.changeOpacity(colBtn, 0);
            this.disablePointerEvent(colBtn);
        }
        
        return this.matrix;
    }
    
    makeControl({ text, classes, handler }) {
        const control = document.createElement('button');
        control.textContent = text;
        control.classList.add(...classes);

        return control;
    }
    
    addControls() {
        const textAdd = '+';
        const textRemove = '-';
        const baseClasses = ['control', 'el', 'el-size'];

        const addColBtn = this.makeControl({
            text: textAdd,
            classes: ['control-add-bg', 'control-add', 'margin'].concat(baseClasses),
        });

        const addRowBtn = this.makeControl({
            text: textAdd,
            classes: ['control-add-bg', 'control-row-add-clearfix', 'control-add'].concat(baseClasses),
        });


        const removeRowBtn = this.makeControl({
            text: textRemove,
            classes: ['control-remove', 'control-remove-row'].concat(baseClasses),
        });

        const removeColBtn = this.makeControl({
            text: textRemove,
            classes: ['control-remove', 'control-remove-col'].concat(baseClasses),
        });

        this.rootEl.appendChild(addColBtn);
        this.rootEl.appendChild(addRowBtn);

        this.rootEl.appendChild(removeRowBtn);
        this.rootEl.appendChild(removeColBtn);

        return {
            addColBtn,
            addRowBtn,
            removeRowBtn,
            removeColBtn
        };
    }
    
    isLastRow(matrix, rowIndex) {
        return matrix.length === rowIndex;
    }

    isLastCol(matrix, colIndex) {
        return matrix[0].length === colIndex;
    }

    isAvailableBtnRemoveCol() {
        return this.matrix[0].length > 1;
    }

    isAvailableBtnRemoveRow() {
        return this.matrix.length > 1;
    }

    
    genericDelay(fn, ms) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(fn.apply(null, args), ms || 500);
        }
    }
    
    wrapControl(fn, ...args) {
        const matrix = fn.apply(null, args);
        this.render(matrix);
    }
    
    changeOpacity(el, value) {
        el.style.opacity = value;
    }

    disablePointerEvent(el) {
        el.style.pointerEvents = 'none';
    }

    enablePointerEvent(el) {
        el.style.pointerEvents = 'auto';
    }

    hideRemoveControls(rowBtn, colBtn) {
        this.changeOpacity(rowBtn, 0);
        this.disablePointerEvent(rowBtn);
        
        this.changeOpacity(colBtn, 0);
        this.disablePointerEvent(colBtn);
    }

    showRemoveControlsIfAvailable(rowBtn, colBtn) {
        if (this.isAvailableBtnRemoveRow()) {
            this.changeOpacity(rowBtn, 1);
            this.enablePointerEvent(rowBtn);
        }
        if (this.isAvailableBtnRemoveCol()) {
            this.changeOpacity(colBtn, 1);
            this.enablePointerEvent(colBtn);
        }
    }
}


const matrixEl = document.querySelector('.matrix');
const rootEl = document.querySelector('.squares');
const INIT_ROWS = 4;
const INIT_COLS = 4;

const squares = new Squares( rootEl, matrixEl, { rowsCount: INIT_ROWS, colsCount: INIT_COLS } );
