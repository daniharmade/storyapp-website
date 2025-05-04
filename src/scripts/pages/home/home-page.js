import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as CeritaKuyAPI from '../../data/api';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="reports-list__map__container">
          <div id="map" class="reports-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Cerita</h1>

        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.initialMap(); // ← panggil inisialisasi map dulu
  
    this.#presenter = new HomePresenter({
      view: this,
      model: CeritaKuyAPI,
    });
  
    await this.#presenter.initialGalleryAndMap();
  }

  async populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }
  
    const html = stories.reduce((accumulator, story) => {
      // Periksa apakah story memiliki data lokasi (lat, lon)
      if (story.lat && story.lon) {
        const coordinate = [story.lat, story.lon];
        // Menambahkan marker dengan popup berisi title atau deskripsi story
        this.#map.addMarker(coordinate, { alt: story.title }, { content: `<strong>${story.name}</strong><br>${story.description}` });
      } else {
        console.error('Data lokasi hilang untuk story:', story);
        const defaultCoordinate = [0, 0];  // Lokasi default jika tidak ada
        this.#map.addMarker(defaultCoordinate, { alt: 'Tidak ada lokasi' }, { content: 'Tidak ada lokasi' });
      }      
  
      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          userName: story.name,
          description: story.description,
          evidenceImages: [story.photoUrl],
          createdAt: story.createdAt,
          location: { lat: story.lat, lon: story.lon } || { lat: null, lon: null }, // Menangani story yang tidak memiliki lokasi
        })
      );
    }, '');
  
    document.getElementById('reports-list').innerHTML = `
      <div class="reports-list">${html}</div>
    `;
  }
  
  
  populateStoriesListEmpty() {
    document.getElementById('reports-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('reports-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('reports-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('reports-list-loading-container').innerHTML = '';
  }
}
