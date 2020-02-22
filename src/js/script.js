import {Modal} from './modal.js';

class Shop {
    constructor() {
        this.url = 'http://localhost:3000/api';
        this.modal = new Modal({
            htmlContent: document.querySelector('#edit-modal')
        });
        this.table = document.querySelector('#user-table > tbody');
        const sendButton = document.querySelector('#send-item-button');
        sendButton.addEventListener('click', this.submitItemData.bind(this));
    }

    apiHeaders() {
        const headers = new Headers();
        headers.append('Authorization', 'authorization-token');
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    async getShopData() {
        const items = await this.getData();
        console.log(items);
        this.clearTableBody();
        items.forEach((item) => {
            const row = this.createRow(item);
            this.table.appendChild(row);
        });
    }

    getData = () => fetch(`${this.url}/items`, {headers: this.apiHeaders()})
        .then(response => response.json())
        .then(response => response.items);

    createCell(value) {
        const td = document.createElement('td');
        td.innerText = value;
        return td;
    }

    clearTableBody() {
        this.table.innerHTML = '';
    }

    createRow(item) {
        const tr = document.createElement('tr');
        ['name', 'price', 'count'].forEach(key => {
            tr.appendChild(this.createCell(item[key]));
        });
        tr.appendChild(this.deleteButton(item._id, item._rev));
        return tr;
    }

    deleteButton(id, rev) {
        const button = document.createElement('button');
        button.innerText = 'Usuń';
        button.dataset.docId = id;
        button.dataset.docRev = rev;
        button.addEventListener('click', this.removeItemHandler.bind(this));
        const cell = document.createElement('td');
        cell.appendChild(button);
        return cell;
    }

    removeItemHandler(event) {
        const id = event.target.dataset.docId;
        const rev = event.target.dataset.docRev;
        const url = `${this.url}/items/${id}/${rev}`;
        fetch(url, {method: 'DELETE', headers: this.apiHeaders()}).then(() => this.getShopData());
    }

    submitItemData() {
        const url = `${this.url}/items`;
        let request;
        try {
            request = {
                method: 'POST',
                headers: this.apiHeaders(),
                body: JSON.stringify(this.getFormData())
            };
        } catch (err) {
            console.log(err);
        }
        if (request) {
            fetch(url, request)
                .then(response => response.json())
                .then(() => this.getShopData());
        }
    }

    getFormData() {
        return {
            name: document.querySelector('#name').value,
            price: document.querySelector('#price').value,
            count: document.querySelector('#count').value,
        };
    }
}

const shop = new Shop();
shop.getShopData();
document.querySelector('#add-item').addEventListener('click', () => {
    shop.modal.open();
});
