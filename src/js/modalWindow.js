// import axios from 'axios';
import * as basicLightbox from 'basiclightbox';
import { renderModalMovieMarkup } from './models/modal-film-window';
import { getMovieDetails } from './API/get-from-server';

let instance;
const bodyElement = document.querySelector('body');

//============================================================================
function normalizeData(data) {
  const genre_ids = data.genres.map(el => el.id)
  data.genre_ids = genre_ids;
}

/*--------------отримує і відображає фільм в модальному вікні----------------*/
export async function getMovie(movie_id) {

  bodyElement.style.overflow = 'hidden';

  try {

    const data = await getMovieDetails(movie_id);
    normalizeData(data);

    const markup = renderModalMovieMarkup(data);

    instance = basicLightbox.create(markup, {
      closable: true,
      onShow: instance => {
        instance.element().querySelector('.modal-close-btn')
          .addEventListener('click', () => {
            instance.close();
            bodyElement.style.overflow = 'auto';
          });
        document.addEventListener('keydown', closeModalOnKeyPress);
      },
      onClose: instance => {
        instance.element().querySelector('.modal-close-btn')
          .removeEventListener('click', () => {
            instance.close();
            bodyElement.style.overflow = 'auto';
          });
        document.removeEventListener('keydown', closeModalOnKeyPress);
        bodyElement.style.overflow = 'auto';
        // add reload modal window
        if (document.title === 'My Library') location.reload();
      },
      onOverlayClick: () => {
        closeModal();
      },
    });
    instance.show();
    const libraryBtn = document.querySelector('.add-film-btn');
    libraryBtn.addEventListener('click', () => {
      toggleLibraryStatus(data);

    });
    updateLibraryButtonStatus(data.id);
  } catch (error) {
    console.log('Помилка отримання даних про фільм:', error);
  }
}

/*-------------закриває modal-window, натискаючи на backdrop та  відновлює scroll ------------*/
function closeModal() {
  instance.close();
  bodyElement.style.overflow = 'auto';
}
/*--------------перевірка чи натиснута клавіша Escape із закриття modal-window ------------*/
function closeModalOnKeyPress(e) {
  if (e.code !== 'Escape') return;

  instance.close();
  bodyElement.style.overflow = 'auto';
  document.removeEventListener('keydown', closeModalOnKeyPress);
}

/*--------------перевіряє чи є фільм у сховищі, записує та видаляє фільм зі сховища;----*/
function toggleLibraryStatus(movieData) {
  const libraryMovies = getLibraryMovies();
  const movieIndex = libraryMovies.findIndex(f => f.id === movieData.id);

  if (movieIndex === -1) libraryMovies.push(movieData);
  else libraryMovies.splice(movieIndex, 1);

  localStorage.setItem('myLibrary', JSON.stringify(libraryMovies));
  updateLibraryButtonStatus(movieData.id);
}

/*-------------- отримує фільми зі сховища бібліотеки--------*/
function getLibraryMovies() {
  const storedMovies = localStorage.getItem('myLibrary');
  return storedMovies ? JSON.parse(storedMovies) : [];
}

/*-------------- змінює статус кнопки відносно потреби додавання, або видалення зі сховища--------*/
function updateLibraryButtonStatus(movieId) {
  const libraryBtn = document.querySelector('.add-film-btn');
  const libraryMovies = getLibraryMovies();

  if (libraryMovies.some(movie => movie.id === movieId)) {
    libraryBtn.textContent = 'Remove from my library';
    // libraryBtn.classList.add('button-library-active');
  } else {
    libraryBtn.textContent = 'Add to my library';
    // libraryBtn.classList.remove('button-library-active');
  }
}
