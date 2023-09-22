document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const websiteUrl = document.getElementById('websiteUrl').value;

    if (websiteUrl.includes('github.io')) {
        // Handle GitHub Pages hosted URLs
        fetch(websiteUrl)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const metaTags = doc.querySelectorAll('meta');
                const metaAnalyzer = document.getElementById('metaAnalyzer');
                metaAnalyzer.innerHTML = '';

                if (metaTags.length === 0) {
                    metaAnalyzer.innerHTML = '<p>No meta tags found on the page.</p>';
                    return;
                }

                const table = document.createElement('table');
                const tableHeader = table.createTHead();
                const headerRow = tableHeader.insertRow();
                const cell1 = headerRow.insertCell(0);
                const cell2 = headerRow.insertCell(1);
                cell1.innerHTML = '<b>Name</b>';
                cell2.innerHTML = '<b>Content</b>';

                const tableBody = table.createTBody();
                metaTags.forEach((tag, index) => {
                    const name = tag.getAttribute('name') || tag.getAttribute('property') || tag.getAttribute('itemprop') || '';
                    const content = tag.getAttribute('content') || '';
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = name;
                    row.insertCell(1).textContent = content;
                });

                metaAnalyzer.appendChild(table);
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred while fetching and analyzing the website. Please try again.');
            });
    } else {
        // Handle external URLs using the server
        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: websiteUrl }),
        })
            .then(response => response.json())
            .then(data => {
                const metaAnalyzer = document.getElementById('metaAnalyzer');
                metaAnalyzer.innerHTML = '';

                if (data.length === 0) {
                    metaAnalyzer.innerHTML = '<p>No meta tags found on the page.</p>';
                    return;
                }

                const table = document.createElement('table');
                const tableHeader = table.createTHead();
                const headerRow = tableHeader.insertRow();
                const cell1 = headerRow.insertCell(0);
                const cell2 = headerRow.insertCell(1);
                cell1.innerHTML = '<b>Name</b>';
                cell2.innerHTML = '<b>Content</b>';

                const tableBody = table.createTBody();
                data.forEach(tag => {
                    const name = tag.name;
                    const content = tag.content;
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = name;
                    row.insertCell(1).textContent = content;
                });

                metaAnalyzer.appendChild(table);
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred while fetching and analyzing the website. Please try again.');
            });
    }
});
