class Modal {
    static ACCEPT = 'ACCEPT';
    static CANCEL = 'CANCEL';

    constructor(config) {
        this.config = {
            hasBackground: true,
            message: null,
            htmlContent: null,
            ...config,
        };
        this.modalBackgroundElement = this.createDiv('modal-background');
        document.body.appendChild(this.modalBackgroundElement);
        this.modalBackgroundElement.addEventListener('click', () => {
            this.cancel();
        });
        this.modalElement = this.createDiv('modal');
        this.modalHeader = this.createDiv('modal-header');
        this.modalFooter = this.createFooter();
        this.modalContent = this.createDiv('modal-content');
        if (this.config.message !== null) {
            this.modalContent.innerHTML = this.config.message;
        } else if (this.config.htmlContent) {
            const content = this.config.htmlContent.cloneNode(true);
            content.style.display = 'block';
            this.modalContent.appendChild(content);
        } else {
            throw new Error('Modal has no content');
        }
        this.modalElement.appendChild(this.modalHeader);
        this.modalElement.appendChild(this.modalContent);
        this.modalElement.appendChild(this.modalFooter);
        document.body.appendChild(this.modalElement);
    }

    open() {
        this.modalBackgroundElement.classList.add('open');
        this.modalElement.classList.add('open');

        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    _closeModal() {
        this.modalBackgroundElement.classList.remove('open');
        this.modalElement.classList.remove('open');
    }

    close(closeType) {
        this._closeModal();
        this.resolve(closeType || Modal.CANCEL);
    }

    cancel() {
        this.closeModal();
        this.resolve(Modal.CANCEL);
    }

    createDiv(className) {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    createFooter() {
        const footer = this.createDiv('modal-footer');
        const accept = document.createElement('button');
        accept.innerText = 'OK';
        accept.addEventListener('click', () => {
            this.close(Modal.ACCEPT);
        });
        const cancel = document.createElement('button');
        cancel.innerText = 'Anuluj';
        cancel.addEventListener('click', () => {
            this.close(Modal.CANCEL);
        });
        footer.appendChild(accept);
        footer.appendChild(cancel);
        return footer;
    }
}

const modal = new Modal({htmlContent: document.querySelector('#example-modal-content')});
document.querySelector('#test').addEventListener('click', () => {
    modal.open().then(closeType => {
        console.log(closeType);
    });
});
