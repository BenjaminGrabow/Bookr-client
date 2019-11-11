import axios from 'axios';
import { axiosWithAuth } from './axiosWithAuth';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const REGISTER = 'REGISTER';
export const FETCH_BOOKS = 'FETCH_BOOKS';
export const FETCH_BOOK = 'FETCH_BOOK';
export const CLOSE_BOOK = 'CLOSE_BOOK';
export const SEARCH_BOOK = 'SEARCH_BOOK';
export const SHOW_ALL_BOOKS_AGAIN = 'SHOW_ALL_BOOKS_AGAIN';
export const CHECK_USER_PREFERENCE = 'CHECK_USER_PREFERENCE';
export const SAFE_USER_PREFERENCE = 'SAFE_USER_PREFERENCE';
export const UPDATE_USER_PREFERENCE = 'UPDATE_USER_PREFERENCE';
export const DELETE_USER_PREFERENCE = 'DELETE_USER_PREFERENCE';
export const CALCULATE_RATING = 'CALCULATE_RATING';
export const SAVE_BOOK_ID = 'SAVE_BOOK_ID';

const adress = 'https://bookr-build-week.herokuapp.com/';

export const register = creds => dispatch => {
  return axios.post(`${adress}auth/register`, creds)
    .then(res => {
      debugger
      dispatch({ type: REGISTER });
    })
    .catch(err => {
      debugger
    })
};

export const login = creds => dispatch => {
  dispatch({ type: LOGIN_START });

  return axios.post(`${adress}auth/login`, creds)
    .then(res => {

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);

      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    })
    .catch(err => {
      debugger
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.message });
    });
};


export const fetchBooks = () => dispatch => {

  axiosWithAuth().get(adress)
    .then(res => {
      dispatch({ type: FETCH_BOOKS, fetchedBooks: res.data });
    })
    .catch(err => {
      debugger
    });
};

export const fetchBook = (id) => dispatch => {

  axiosWithAuth().get(`${adress}${id}`)
    .then(res => {

      dispatch({ type: FETCH_BOOK, fetchedBook: res.data });
    })
    .catch(err => {
      debugger
    });
};

export const closeBook = () => {
  return { type: CLOSE_BOOK }
};

export const addReview = (review, stars, book_id, photo, first_name) => dispatch => {

  const orangeStars = 'fa fa-star checked'.repeat(stars);

  const blackStars = 'fa fa-star'.repeat(5 - stars);

  const arrayOrange = orangeStars.match(/.{1,18}/g);
  const arrayBlack = blackStars.match(/.{1,10}/g);

  const mergeArrays = arrayOrange.concat(arrayBlack);

  const objectReview = {
    review: review,
    reviewer: first_name,
    book_id: book_id,
    photo: photo,
    star1: mergeArrays[0],
    star2: mergeArrays[1],
    star3: mergeArrays[2],
    star4: mergeArrays[3],
    star5: mergeArrays[4]
  }

  axios.post(`${adress}review`, objectReview)
    .then(res => {
      return axiosWithAuth().get(`${adress}${book_id}`)
        .then(res => {
          dispatch({ type: FETCH_BOOK, fetchedBook: res.data });
        })
    })
    .catch(err => {

    })
    .catch(err => {

    });
};

export const search = (searchResultAsArray) => {
  return { type: SEARCH_BOOK, search_result: searchResultAsArray };
};

export const showAllBooksAgain = () => {
  return { type: SHOW_ALL_BOOKS_AGAIN };
};

export const checkUserPreference = () => dispatch => {

  const userId = localStorage.getItem('user_id');

  return axios.get(`${adress}user/${userId}`)
    .then(res => {

      if (res.data.toString()) {
        dispatch({ type: CHECK_USER_PREFERENCE, user_preference: res.data });
      }
    })
    .catch(err => {
      debugger
    });
};

export const safeUserPreferences = (firstname, lastname, photo) => dispatch => {

  const userId = localStorage.getItem('user_id');

  const newUserPreference = {
    first_name: firstname,
    last_name: lastname,
    user_id: userId,
    photo: photo
  };


  axios.post(`${adress}user`, newUserPreference)
    .then(res => {

      return axios.get(`${adress}user/${userId}`)
        .then(res => {
          dispatch({ type: SAFE_USER_PREFERENCE, user_preference: res.data });
        });
    })
    .catch(err => {
      debugger
    });
};

export const updateUserPreference = (firstname, lastname, photo) => dispatch => {

  const userId = localStorage.getItem('user_id');

  const newUserPreference = {
    first_name: firstname,
    last_name: lastname,
    user_id: userId,
    photo: photo
  };

  axios.put(`${adress}user/${userId}`, newUserPreference)
    .then(res => {

      return axios.get(`${adress}user/${userId}`)
        .then(res => {

          dispatch({ type: UPDATE_USER_PREFERENCE, user_preference: res.data });
        });
    })
    .catch(err => {
      debugger
    });
};

export const deleteUserPreference = () => {
  return { type: DELETE_USER_PREFERENCE };
};

export const calculateRating = (id) => dispatch => {

  axiosWithAuth().get(`${adress}${id}`)
    .then(res => {

      dispatch({ type: CALCULATE_RATING, fetchedBook: res.data });
    })
    .catch(err => {
      debugger
    });
};

export const saveBookId = (book_id) => {
  return { type: SAVE_BOOK_ID, book_id: book_id };
};

export const addBook = (title, publisher, author, description, photo, price) => dispatch => {

  const newBook = {
    title,
    publisher,
    author,
    description,
    photo,
    price
  };

  axios.post(adress, newBook)
    .then(res => {

      return axios.get(adress)
      .then(res => {
        dispatch({ type: FETCH_BOOKS, fetchedBooks: res.data });
      })
    })
    .catch(err => {
      debugger
    });
};

export const updateBook = (book_id, title, publisher, author, description, photo, price) => dispatch => {

  const updatedBook = {
    title,
    publisher,
    author,
    description,
    photo,
    price
  };

  axios.put(`${adress}${book_id}`, updatedBook)
    .then(res => {

      return axios.get(adress)
      .then(res => {
        dispatch({ type: FETCH_BOOKS, fetchedBooks: res.data });
      })
    })
    .catch(err => {
      debugger
    });
};

export const deleteBook = (book_id) => dispatch => {

  axios.delete(`${adress}${book_id}`)
    .then(res => {

      return axios.get(adress)
      .then(res => {
        dispatch({ type: FETCH_BOOKS, fetchedBooks: res.data });
      })
    })
    .catch(err => {
      debugger
    });
};