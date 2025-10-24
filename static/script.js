document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const suburbInput = document.getElementById('suburbInput');
    const sortSelect = document.getElementById('sort-select');
    const resultsContainer = document.getElementById('results-container');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const resultsHeader = document.getElementById('results-header');

    // Store the fetched properties to allow for sorting without re-fetching
    let currentProperties = [];

    const searchProperties = async () => {
        const suburb = suburbInput.value.trim();
        if (!suburb) {
            showError('Please enter a suburb.');
            return;
        }

        loadingDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        resultsContainer.innerHTML = '';
        resultsHeader.textContent = '';
        sortSelect.value = 'default'; // Reset sort dropdown

        try {
            const response = await fetch(`/api/properties/${encodeURIComponent(suburb)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An unknown error occurred.');
            }
            
            // Store the original results
            currentProperties = data.results;
            renderProperties(currentProperties);

        } catch (err) {
            showError(err.message);
        } finally {
            loadingDiv.classList.add('hidden');
        }
    };

    // This function renders the property cards to the page
    function renderProperties(properties) {
        resultsContainer.innerHTML = ''; // Clear previous results

        if (properties.length === 0) {
            resultsHeader.textContent = 'No properties found.';
            return;
        }

        resultsHeader.textContent = `Showing ${properties.length} properties in ${suburbInput.value.trim()}`;

        properties.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';

            const price = prop.price ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(prop.price) : 'Price on request';
            const beds = prop.attributes.bedrooms || 'N/A';
            const baths = prop.attributes.bathrooms || 'N/A';
            const garages = prop.attributes.garage_spaces || 'N/A';
            const landSize = prop.attributes.land_size && prop.attributes.land_size.toLowerCase() !== 'none' ? prop.attributes.land_size : '';
            const propertyType = prop.property_type || 'Property';

            const lat = prop.coordinates.latitude;
            const lon = prop.coordinates.longitude;
            const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
            
            const fullDescription = prop.attributes.description;
            const shortDescription = fullDescription.substring(0, 150);

            card.innerHTML = `
                <div class="card-header">
                    <h2>${price}</h2>
                    <p>${prop.area_name}</p>
                </div>
                <div class="card-body">
                    <div class="meta-info">
                        <span class="property-type">${propertyType}</span>
                        ${landSize ? `<span class="land-size"><i class="fas fa-ruler-combined"></i> ${landSize}</span>` : ''}
                    </div>
                    <div class="attributes">
                        <span class="attribute"><i class="fas fa-bed"></i> ${beds}</span>
                        <span class="attribute"><i class="fas fa-bath"></i> ${baths}</span>
                        <span class="attribute"><i class="fas fa-car"></i> ${garages}</span>
                    </div>
                    <p class="description">
                        ${shortDescription}${fullDescription.length > 150 ? '...' : ''}
                        ${fullDescription.length > 150 ? `<span class="read-more" data-fulltext="${fullDescription.replace(/"/g, '&quot;')}"> Read More</span>` : ''}
                    </p>
                </div>
                <div class="card-footer">
                    <a href="${mapLink}" target="_blank" class="map-link">View on Map</a>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    function sortProperties() {
        const sortBy = sortSelect.value;
        let sortedProperties = [...currentProperties]; // Create a copy to sort

        if (sortBy === 'price-asc') {
            sortedProperties.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'price-desc') {
            sortedProperties.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        renderProperties(sortedProperties);
    }
    
    function showError(message) {
        currentProperties = [];
        resultsContainer.innerHTML = '';
        resultsHeader.textContent = '';
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    // Event Listeners
    searchBtn.addEventListener('click', searchProperties);
    suburbInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') searchProperties();
    });
    sortSelect.addEventListener('change', sortProperties);
    
    // "Read More" functionality using event delegation
    resultsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('read-more')) {
            const descriptionP = event.target.parentElement;
            descriptionP.innerHTML = event.target.dataset.fulltext;
        }
    });

    // Perform an initial search on page load
    searchProperties();
});