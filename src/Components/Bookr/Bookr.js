import React from 'react';
import Navigation from "./Navigation/Navigation";
import { connect } from 'react-redux';
import { fetchBooks, fetchBook, closeBook, addReview, search, showAllBooksAgain, checkUserPreference, deleteUserPreference, calculateRating, saveBookId, deleteBook } from '../../Store/actions';
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from 'react-router-dom';
import './bookr.scss';

toast.configure();

class Bookr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      review: '',
      search_book: '',
      starRating: ''
    }
  }

  componentDidMount = () => {
    this.props.fetchBooks();

    this.props.checkUserPreference();
  };

  handleChange = (e) => {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addReview = (book_id) => {
    if (this.props.userData) {

      if (this.state.review &&
         this.state.starRating > 0 &&
          this.state.starRating < 6) {

        this.props.addReview(this.state.review,
          this.state.starRating,
          book_id,
          this.props.userData[0].photo,
          this.props.userData[0].first_name);

        this.setState({
          review: '',
          starRating: ''
        });

      } else {

        alert('You must provide a review and give a star rating.')
      }
    } else {
      alert('You must provide information about yourself in User settings to be able to write reviews.')
    }
  };

  async handleToken(token, title, price) {
    const product = {
      name: title, price: price
    }
    console.log(token, product)
    const response = await axios.post(
      "https://bookr-build-week.herokuapp.com/payment",
      { token, product }
    );
    const { status } = response.data;
    console.log("Response:", response.data);
    if (status === "success") {
      toast("Success! Check email for details", { type: "success" });
    } else {
      toast("Something went wrong", { type: "error" });
    }
  };

  searchBook = () => {
    this.props.search(this.props.books.filter(book =>
      book.title.toLowerCase().startsWith(this.state.search_book)));

    this.setState({
      search_book: '',
    });
  };

  closeSearchView = () => {
    if (this.props.copyOfBooks) {

      this.props.showAllBooksAgain()
    }
  };

  logout = () => {
    localStorage.clear();

    this.props.deleteUserPreference();
  };

  rotate = (e, id) => {

    const card = document.querySelector(`.${e.currentTarget.className}`);

    if (card.style.transform === 'rotateY(180deg)') {
      card.style.transform = 'rotateY(0deg)';

    } else {
      card.style.transform = 'rotateY(180deg)';
    }

    this.props.calculateRating(id);
  };

  updateBook = (book_id) => {
    const nav = document.querySelector(".navigation__checkbox");

    nav.checked = true;

    this.props.saveBookId(book_id);
  };

  render() {

    const styleTextSection = {
      transformStyle: "preserve-3d",
      transition: "all 1s ease",
      width: "30%",
      height: "30rem",
      position: "relative",
      margin: "1rem"
    };

    if (this.props.book) {
      return (
        <div
          className="single-book">
          <div className="pic-next-to-main-data">
            <img src={this.props.book.book.photo} alt="book" />
            <div className="main-data">
              <div className="close">
                <i className="fa fa-window-close"
                  onClick={this.props.closeBook} />
              </div>
              <p>{this.props.book.book.title}</p>
              <p>Author: {this.props.book.book.author}</p>
              <p>Publisher: {this.props.book.book.publisher}</p>
            </div>
          </div>
          <p>{this.props.book.book.description}</p>
          <div className="average-rating-and-price">
            {this.props.averageRating ? (<div className="star">
              <i className={this.props.averageRating[0]}></i>
              <i className={this.props.averageRating[1]}></i>
              <i className={this.props.averageRating[2]}></i>
              <i className={this.props.averageRating[3]}></i>
              <i className={this.props.averageRating[4]}></i>
            </div>) : <p>There are no reviews</p>}
            <p>{this.props.book.book.price} $</p>
          </div>
          <StripeCheckout
            stripeKey="pk_test_Grqfk8uqKNCJYpAQS2t89UB700wHJklrMa"
            token={(token) =>
              this.handleToken(token,
                this.props.book.book.title,
                this.props.book.book.price)}
            amount={this.props.book.book.price * 100}
            name={this.props.book.book.title}
            billingAddress
            shippingAddress
          />
          <div className="reviews">
            {this.props.book.reviews.map((review, index) => {
              return <div
                className="review"
                key={index}>
                <div className="pic-name">
                  <img src={review.photo} alt="user" />
                  <p>{review.reviewer}</p>
                </div>
                <div className="star">
                  <i className={review.star1} />
                  <i className={review.star2} />
                  <i className={review.star3} />
                  <i className={review.star4} />
                  <i className={review.star5} />
                </div>
                <div className="review-text">
                  <p>{review.review}</p>
                </div>
              </div>
            })}
          </div>
          <div className="add-review">
            <input
              type="text"
              value={this.state.review}
              onChange={this.handleChange}
              placeholder="review"
              name="review" />
            <i
              onClick={() =>
                this.addReview(this.props.book.book.id)}
              className="fa fa-plus-square" />
            <input
              name="starRating"
              type="number"
              min="1"
              max="5"
              value={this.state.starRating}
              onChange={this.handleChange}
              placeholder="Stars"
            />
          </div>
        </div>
      )
    }
    return (
      <div>
        <Navigation/>
      <div className="bookr">
        <nav>
          <NavLink
            to="/user"
            className="navLink">
            <p>User</p>
          </NavLink>
          <NavLink
            to="/slider"
            className="navLink">
            <p>Slider</p>
          </NavLink>
          <NavLink
            to="/log_reg"
            className="navLink">
            <p onClick={this.logout}
              className="logout">Logout</p>
          </NavLink>
        </nav>
        <div className="search-bar">
          <i className="fa fa-window-close"
            onClick={this.closeSearchView} />
          <input
            placeholder="Search"
            className="search-input"
            name="search_book"
            onChange={this.handleChange}
            value={this.state.search_book}
            type="text"
          />
          <i className="fa fa-search"
            onClick={this.searchBook}
          />
        </div>
        <div
          className="books">
          {this.props.books ? (this.props.books.map((book, index) => {
            return <div
              style={styleTextSection}
              key={index}
              onClick={(event) => this.rotate(event, book.id)}
              className={`card${index}`}>
              <div className="front">

                <img
                  onClick={() =>
                    this.props.fetchBook(book.id)}
                  src={book.photo} alt="book" />
                <p>{book.title}</p>

              </div>
              <div className="back" >
                <p>{book.author}</p>
                {this.props.averageRating ? (<div className="star">
                  <i className={this.props.averageRating[0]}></i>
                  <i className={this.props.averageRating[1]}></i>
                  <i className={this.props.averageRating[2]}></i>
                  <i className={this.props.averageRating[3]}></i>
                  <i className={this.props.averageRating[4]}></i>
                </div>) : <p>There are no reviews</p>}
                <p>{book.price} $</p>
                <div className="icons">
                <i
                onClick={() => this.props.deleteBook(book.id)} 
                className="fa fa-user-times btn btn--white" />
                <i 
                onClick={() => this.updateBook(book.id)}
                className="fa fa-wrench btn btn--white" />
              </div>
              </div>
            </div>
          })) : null}
        </div>
      </div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    books: state.books,
    book: state.book,
    copyOfBooks: state.copyOfBooks,
    userData: state.userData,
    averageRating: state.averageRating
  };
};

export default connect(mapStateToProps, { fetchBooks, fetchBook, closeBook, addReview, search, showAllBooksAgain, checkUserPreference, deleteUserPreference, calculateRating, saveBookId, deleteBook })(Bookr);