import React from 'react';
import { connect } from 'react-redux';
import { fetchBooks, fetchBook, closeBook, addReview, search, showAllBooksAgain, checkUserPreference } from '../../../Store/actions';
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from 'react-router-dom';
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';

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
    if(this.props.userData) {
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
    if(this.props.copyOfBooks) {
      this.props.showAllBooksAgain()
    }
  };

  logout = () => {
   localStorage.clear();
  };

  render() {
    if (this.props.book) {
      return (
        <div
          className="single-book">
          <div className="pic-next-to-main-data">
            <img src={this.props.book.book.photo} alt="book" />
            <div className="main-data">
              <div className="close">
                <i className="fa fa-window-close"
                  onClick={ this.props.closeBook} />
              </div>
              <p>{this.props.book.book.title}</p>
              <p>Author: {this.props.book.book.author}</p>
              <p>Publisher: {this.props.book.book.publisher}</p>
            </div>
          </div>
          <p>{this.props.book.book.description}</p>
          <p>{this.props.book.book.price} $</p>
          <StripeCheckout
            stripeKey="pk_test_Grqfk8uqKNCJYpAQS2t89UB700wHJklrMa"
            token={(token) =>
              this.handleToken(token,
                this.props.book.book.title,
                this.props.book.book.price)}
            amount={this.props.book.book.price * 100}
            name="Tesla Roadster"
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
                    <i className={review.star1}></i>
                    <i className={review.star2}></i>
                    <i className={review.star3}></i>
                    <i className={review.star4}></i>
                    <i className={review.star5}></i>
                  </div>
                <div className="review-text">
                  <p>{review.review}</p>
                </div>
              </div>
            })}
          </div>
          <div className="add-review">
            <i
              onClick={() => this.addReview(this.props.book.book.id)}
              className="fa fa-plus-square" />
            <input
              type="text"
              value={this.state.review}
              onChange={this.handleChange}
              placeholder="review"
              name="review" />
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
      <div className="bookr">
      <nav>
      <NavLink
      to="/user"
      className="navLink">
      <p>User</p>
    </NavLink>
    <NavLink
      to="/bookr"
      className="navLink">
      <p>Home</p>
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
        <Slider
            className="slider">
          {this.props.books ? (this.props.books.map((book, index) => {
            return <div
              key={index}
              className="single-book">
              <img
              onClick={() =>
                 this.props.fetchBook(book.id)}
               src={book.photo} alt="book" />
              <p>{book.title}</p>
            </div>
          })) : null}
        </Slider>
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
    userData: state.userData
  };
};

export default connect(mapStateToProps, { fetchBooks, fetchBook, closeBook, addReview, search, showAllBooksAgain, checkUserPreference })(Bookr);