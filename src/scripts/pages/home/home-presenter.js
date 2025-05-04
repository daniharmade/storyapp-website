export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  // Hapus showReportsListMap karena tidak ada lagi map
  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      // Panggil API untuk mendapatkan story
      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateStoriesListError(response.message); // Tampilkan error jika response gagal
        return;
      }

      this.#view.populateStoriesList(response.message, response.listStory); // Tampilkan daftar story
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStoriesListError(error.message); // Tampilkan error jika terjadi kesalahan
    } finally {
      this.#view.hideLoading(); // Sembunyikan loading
    }
  }  
}
