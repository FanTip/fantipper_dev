'use strict'
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetch_fans_list } from '../actions/action_set_fanlist.js';
import { fetch_logged_in_user } from '../actions/get_logged_in.js';
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Button

} from 'reactstrap';

const _ = require('lodash');

class AddPaymentMethod extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stripePublicKey: '',
      toggle: false,
      is_card_saved: false,
      enterCardDetailsCompleted: false,
      cardError: '',
      isCardError: true,
      saved_card: {},
      payment_intent: ''
    }

    this.toggle = this.toggle.bind(this);
    this.stripeElementChange = this.stripeElementChange.bind(this);
    this.submit = this.submit.bind(this);
  };

  componentDidMount() {
    fetch('/payment/pub', {
      method: 'GET',
      headers: {
        'CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        'Content-type': 'application/json'
      }
    }).then(res => res.json())
      .then((result) => {
        this.setState({
          stripePublicKey: result
        });
      });


    fetch('/payment/is_card', {
      method: 'GET',
      headers: {
        'CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        'Content-type': 'application/json'
      }
    }).then(res => res.json())
      .then((result) => {
        this.setState({
          is_card_saved: result
        });
        if (this.state.is_card_saved) {
          fetch('/payment/saved-card', {
            method: 'GET',
            headers: {
              'CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
              'Content-type': 'application/json'
            }
          }).then(res => res.json())
            .then((result) => {
              this.setState({
                saved_card: result
              })
            })
        }
      });
  }

  submit = async (stripe, elements) => {
    console.log(stripe);
    console.log(elements);
  }


  stripeElementChange(element) {
    this.setState({
      enterCardDetailsCompleted: element.complete
    });
    console.log(element);
    if (!_.isEmpty(element.error)) {
      this.setState({
        cardError: element.error.message,
        isCardError: true
      });
    } else {
      this.setState({
        cardError: '',
        isCardError: false
      });
    }
  }

  toggle() {
    this.setState(prevState => ({
      toggle: !prevState.toggle
    }));

    fetch('/payment/intents', {
      method: 'POST',
      crossDomain: false,
      headers: {
        "Content-Type": "application/json",
        'CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      }
    }).then(res => res.json())
      .then((result) => {
        console.log(result);
      });
  }



  render() {

    const CARD_ELEMENT_OPTIONS = {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
      hidePostalCode: true,
    };

    let card;
    if (this.state.is_card_saved && !_.isEmpty(this.state.saved_card)) {
      card =
        <div>
          {this.state.saved_card.card_data.card.brand}
        </div>
    }

    let card_element;
    card_element =
      <div className='form-group'>
        <CardElement onChange={(elements) => this.stripeElementChange(elements)} options={CARD_ELEMENT_OPTIONS}></CardElement>
      </div>


    let addCardButton;

    if (this.state.is_card_saved) {
      addCardButton =
        <div>
          <p>{card}</p>
        </div>
    } else {
      addCardButton =
        <div>
          <p> <button className="btn btn-success float-sm-right form-control" onClick={this.toggle.bind(this)}><i class="fas fa-credit-card"></i>Add a new card</button> </p>
        </div>

    }


    let card_errors;
    if (!_.isEmpty(this.state.cardError)) {
      card_errors =
        <div>
          <p className="text-center" >
            <small className="text-center" style={{ color: 'red' }}>{this.state.cardError}</small>
          </p>
        </div>
    } else {
      card_errors = <small></small>
    }


    return (

      <div>
        <div>
          <Modal isOpen={this.state.toggle} toggle={() => (this.toggle())} className={this.props.className}>
            <ModalHeader toggle={() => (this.toggle())}>Add Your Card</ModalHeader>
            <ModalBody>
              <div class="sr-form-row">
                <label>
                  Account details
               </label>
                <input type="text" id="cust_email" className="form-control" placeholder="Email address" />
              </div>
              <div className="sr-form-row">
                <label>
                  Billing information
               </label>
                <input type="text" id="address" className="form-control" placeholder="Address Line 1" />
                <input type="text" id="address2" className="form-control" placeholder="Address Line 2 (Optional)" />
                <input type="text" id="city" className="form-control" placeholder="City" />
                <input type="text" id="state" className="form-control" placeholder="State" />
                <input type="text" id="postcode" className="form-control" placeholder="Postcode" />
              </div>
              <div className='form-group'>
                <label>
                  Payment details
                </label>
                {card_element}
              </div>
              <ElementsConsumer>
                {({ stripe, elements }) => (
                  <FormGroup>
                    <button id="sendTipButton" onClick={this.submit.bind(this, stripe, elements)} className="btn btn-lg btn-block" type="button">Link your card to your account</button>
                  </FormGroup>
                )}
              </ElementsConsumer>
              <br />
              {card_errors}
            </ModalBody>
          </Modal>
        </div>

        {addCardButton}

      </div>
    )
  }
}

export default connect()(AddPaymentMethod);