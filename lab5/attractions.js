function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function showError(message) {
    const error = document.getElementById('error-message');
    error.textContent = message;
    error.style.display = 'block';
}

function hideError() {
    const error = document.getElementById('error-message');
    error.style.display = 'none';
}

function showLoading() {
    document.getElementById('loading-message').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-message').style.display = 'none';
}

function updateTable(data) {
    const tbody = document.getElementById('attractions-tbody');
    tbody.innerHTML = '';

    data.forEach(attraction => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="center-align">${attraction.name}</td>
            <td class="left-align">${attraction.state}</td>
            <td class="right-align">${attraction.type}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateLastTime() {
    const lastUpdate = document.getElementById('last-update');
    const now = new Date();
    lastUpdate.textContent = `Последнее обновление: ${formatDateTime(now)}`;
}

async function fetchData() {
    hideError();
    showLoading();
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const response = await fetch('http://localhost:8000/attractions');

        if (!response.ok) {
            throw new Error(response.status.toString());
        }

        const result = await response.json();

        if (!result || !result.data) {
            throw new Error('Ошибка чтения данных!');
        }

        updateTable(result.data);
        updateLastTime();
        hideLoading();

    } catch (error) {
        hideLoading();

        let errorMessage = '';

        switch (error.message) {
            case '400':
                errorMessage = 'Ошибка 400!';
                break;
            case '401':
                errorMessage = 'Ошибка 401!';
                break;
            case '403':
                errorMessage = 'Ошибка 403!';
                break;
            case '404':
                errorMessage = 'Ошибка 404!';
                break;
            case '500':
                errorMessage = 'Ошибка 500!';
                break;
            default:
                errorMessage = 'Сервер недоступен!';
        }

        showError(errorMessage);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchData();
    
    const interval = 0.1 * 60 * 1000;
    
    setInterval(function() { fetchData(); }, interval);
});
