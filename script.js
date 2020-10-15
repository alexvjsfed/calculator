class Calculator {
    constructor() {
        this.bindClicks();
        this.currentOperandElement = document.querySelector('[data-current-operand]');
        this.currentOperationElement = document.querySelector('[data-current-operation]');
        this.newOperandElement = document.querySelector('[data-new-operand]');
        this.newInputWillAppend = true;
    }

    bindClicks() {
        const map = new Map();
        map.set('[data-number]', this.onNumberClick);
        map.set('[data-operation]', this.onOpClick);
        map.set('[data-equals]', this.onEqualsClick);
        map.set('[data-delete]', this.onDeleteClick);
        map.set('[data-clear]', this.onClearClick);
        map.set('[data-all-clear]', this.onClearAllClick);
        map.set('[data-sign]', this.onSignClick);
        map.set('[data-dot]', this.onDotClick);
        for (let [selector, callback] of map) {
            document.querySelectorAll(selector).forEach((btn) => {
                btn.addEventListener('click', () => callback.bind(this)(btn));
            });
        }
    }

    onSignClick() {
        if (this.newOperandElement.innerText !== '0') {
            const hasMinus = '-' === this.newOperandElement.innerText[0];
            if (hasMinus)
                this.newOperandElement.innerText = this.newOperandElement.innerText.slice(1);
            else
                this.newOperandElement.innerText = '-' + this.newOperandElement.innerText;
        }
    }

    onClearAllClick() {
        this.currentOperandElement.innerText = '';
        this.currentOperationElement.innerText = '';
        this.onClearClick();
    }

    onClearClick() {
        this.newOperandElement.innerText = '0';
    }

    onDeleteClick(btn) {
        console.log('onDeleteClick', btn);
        let curVal = this.newOperandElement.innerText;
        if (curVal.length > 1)
            this.newOperandElement.innerText = this.newOperandElement.innerText.slice(0, -1);
        else if (curVal.length === 1)
            this.newOperandElement.innerText = '0';
    }

    calculate() {
        let
            sa = this.currentOperandElement.innerText,
            sb = this.newOperandElement.innerText,
            op = this.currentOperationElement.innerText;
        const arra = sa.split('.');
        const arrb = sb.split('.');
        const na = arra.length === 2 ? arra[1].length : 0;
        const nb = arrb.length === 2 ? arrb[1].length : 0;
        let denom = Math.max(na, nb);
        let a = parseInt(sa.replace('.', '') + '0'.repeat(denom - na));
        let b = parseInt(sb.replace('.', '') + '0'.repeat(denom - nb));
        denom = Math.pow(10, denom);

        console.log(`calculate: ${a} ${op} ${b}, /${denom}`);

        switch (this.currentOperationElement.innerText) {
            case '-':
                this.showResult((a - b) / denom);
                break;
            case '+':
                this.showResult((a + b) / denom);
                break;
            case '*':
                this.showResult((a * b) / denom / denom);
                break;
            case '/':
                if (b !== 0)
                    this.showResult(a / b);
                else
                    this.showResult('Zero division Error');
                break;
            case '^':
                this.showResult(Math.pow(a / denom, b / denom));
                break;
            case '√':
                const n = parseFloat(sa.length > 0 ? sa : sb);
                if (n >= 0) {
                    this.newOperandElement.innerText = Math.sqrt(n);
                    this.showResult(Math.sqrt(n));
                } else {
                    this.showResult("Neg. nums don't have root");
                }
                break;
        }
        this.newInputWillAppend = false;
    }

    onEqualsClick() {
        this.calculate();
    }

    showResult(s) {
        this.onClearAllClick();
        this.newOperandElement.innerText = s;
        this.newInputWillAppend = false;
    }

    onOpClick(btn) {
        let curVal = this.currentOperandElement.innerText;
        console.log('btn.dataset.operation', curVal, this.newOperandElement.innerText, btn)
        if (curVal.length > 0
            && this.currentOperationElement.innerText.length > 0) {
            this.calculate();
            // curVal = '';
        }

        this.newInputWillAppend = false;

        /*if (btn.dataset.operation === 'sqr') {
            const n = parseFloat(curVal.length > 0 ? curVal : this.newOperandElement.innerText);
            this.showResult(n * n);
        } else if (btn.dataset.operation === 'sqrt') {
            const n = parseFloat(curVal.length > 0 ? curVal : this.newOperandElement.innerText);
            if (n >= 0)
                this.newOperandElement.innerText = Math.sqrt(n);
            else {
                this.showResult("Neg. nums don't have root");
            }
        } else */
        {
            this.currentOperationElement.innerText = /*btn.dataset.operation ||*/ btn.innerText;
            this.currentOperandElement.innerText = this.newOperandElement.innerText;
            this.onClearClick()
            if (btn.dataset.operation === 'sqrt')
                this.newOperandElement.innerText = '';
            if (btn.dataset.operation === '^')
                this.currentOperationElement.innerText = '^';
        }
    }

    onDotClick() {
        if (this.newInputWillAppend && !this.newOperandElement.innerText.includes('.'))
            this.newOperandElement.innerText += '.';
        if (!this.newInputWillAppend) {
            this.newOperandElement.innerText = '0.';
            this.newInputWillAppend = true;
        }
    }

    onNumberClick(btn) {
        const numClicked = btn.innerText;
        if (!this.newInputWillAppend) {
            this.newOperandElement.innerText = numClicked;
            this.newInputWillAppend = true;
            return;
        }
        let curVal = this.newOperandElement.innerText;
        if (curVal === '0') {
            if (numClicked === '0')
                return;
            else
                curVal = '';
        }
        this.newOperandElement.innerText = curVal + btn.innerText;
    }
}

new Calculator();