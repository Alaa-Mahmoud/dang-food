import axios from 'axios';
import purifiy from 'dompurify';

function searchResultHtml(stores) {
    return stores.map(store => {
        return `
         <a href ="/store/${store.slug}" class="search__result">
         <strong>${store.name}</strong>
         </a>
         `;
    }).join('');
}

function typeAhead(search) {
    if (!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResult = search.querySelector('.search__results');

    searchInput.on('input', function() {
        if (!this.value) {
            searchResult.style.display = 'none';
            return;
        }
        searchResult.style.display = 'block';
        axios
            .get(`/api/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResult.innerHTML = purifiy.sanitize(searchResultHtml(res.data));
                    return;
                }
                searchResult.innerHTML = purifiy.sanitize(`
                    <div class='search__result'>
                    No result for ${this.value} found.
                    </div>
                `);
            });
    });

    // handle keyboard input 
    searchInput.on('keyup', (e) => {
        if (![38, 40, 13].includes(e.keyCode)) {
            return;
        } else {
            const active = 'search__result--active';
            const current = search.querySelector(`.${active}`);
            const items = search.querySelectorAll('.search__result');
            let next;
            if (e.keyCode === 40 && current) {
                next = current.nextElementSibling || items[0];
            } else if (e.keyCode == 40) {
                next = items[0];
            } else if (e.keyCode === 38 && current) {
                next = current.previousElementSibling || items[items.length - 1];
            } else if (e.keyCode === 38) {
                next = items[items.length - 1];
            } else if (e.keyCode === 13 && current.href) {
                window.location = current.href;
                return;
            }

            if (current) {
                current.classList.remove(active);
            }

            next.classList.add(active);
        }
    });
};

export default typeAhead;