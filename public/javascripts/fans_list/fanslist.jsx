'use strict'
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetch_fans_list } from '../actions/action_set_fanlist.js';
import { fetch_logged_in_user } from '../actions/get_logged_in.js';
import { fetch_csrf } from '../actions/csrf.js'
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

} from 'reactstrap';

const _ = require('lodash');
const axios = require('axios');

class FansList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csrf: '',
      tipModal: false,
      name: '',
      imgUrl: '',
      creatorEmail: '',
      tipAmount: 0,
      toggleStripe: false, // this decides whether saved card or new card to use
      error: '',
      isloading: false,
      tipMessage: '',
      payersEmail: '',
      isSamePerson: false,
      selectedUserId: '',
      tipSendersEmail: ''
    };

    this.toggle = this.toggle.bind(this);
    this.toggleStripe = this.toggleStripe.bind(this);
    this.toggleSaved = this.toggleSaved.bind(this);
    this.handleChangeTipAmount = this.handleChangeTipAmount.bind(this);
    this.setTipAMount = this.setTipAMount.bind(this);
    this.setTipMessage = this.setTipMessage.bind(this);
    this.setTipSendersEmail = this.setTipSendersEmail.bind(this);

    this.submit = this.submit.bind(this);
    this.sendTip = this.sendTip.bind(this);
    this.tipFromNewCard = this.tipFromNewCard.bind(this);
  }

  componentDidMount() {
    this.props.fetch_logged_in_user();
    this.props.fetch_fans_list();
    // this.props.fetch_csrf();
    fetch('/csrf')
    .then(res => res.json())
    .then((result) => {
      console.log(result);
    })
  }

  setTipAMount(amount) {
    this.setState(prevState => ({
      tipAmount: amount
    }));
  }
  setTipMessage(event) {
    this.setState({ tipMessage: event.target.value });
  }

  setTipSendersEmail(event) {
    console.log(event);
    this.setState({ tipSendersEmail: event.target.value });
  }


  tipFromNewCard = async (token) => {
    let data = {
      _stripeID: token,
      _amount: this.state.tipAmount,
      _description: this.state.tipMessage,
      _email: this.state.payersEmail,
      _creatorEmail: this.state.tipSendersEmail,
      _receiver_id: this.state.selectedUserId,
      _saved_card: false,
      _csrf: this.state.csrf
    }

    axios.post('/tipping/sendtip', {
      crossDomain: false,
      data: data
    })
      .then(function (response) {
        console.log("Done");
        console.log(response);
        this.setState({ isloading: false });
      })
      .catch(function (response) {
        console.log("Error occured");
      })
  }

  sendTip = async (token) => {
    console.log(token);


    if (this.state.toggleStripe) {
      console.log('truenb ieie');
    } else {
      console.log('falsooooo');
      this.tipFromNewCard(token);
      // if (!_.isEmpty(csrf)) {

      // }

    }
  }

  submit(stripe, elements) {
    //Start loading icon
    this.setState({ isloading: true })

    let card = elements.getElement(CardElement);
    console.log(card);
    let token = stripe.createToken(card).then((value) => {
      if (value.error) {
        this.setState({
          error: value.error
        })
      }
      else {
        this.sendTip(value.token.id);
      }
    });
    console.log(token);
  }

  handleChangeTipAmount(event) {
    this.setState({ tipAmount: event.target.value });
  }

  toggle(fan) {
    this.setState(prevState => ({
      tipModal: !prevState.tipModal,
      isloading: false,
      name: fan.creatorName,
      imgUrl: fan.image,
      creatorEmail: fan.creatorEmail,
      tipAmount: 0,
      selectedUserId: fan.user_id
    }));
    if (this.props.user) {
      if (fan.creatorEmail === this.props.user.creator.creatorEmail) {
        this.setState(prevState => ({
          isSamePerson: true
        }));
      } else {
        this.setState({
          isSamePerson: false
        })
      }
    }
  }

  toggleStripe() {
    this.setState(prevState => ({
      toggleStripe: !prevState.toggleStripe
    }));
  }
  toggleSaved() {
    this.setState({
      toggleStripe: false
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

    // Array of fans to display 
    let fans_list;

    if (this.props.fans.length > 0) {
      fans_list = this.props.fans.map(fan => {
        return (
          <>
            <div key={fan._id} className="col-md-4 col-xs-6">
              <div className="clearfix listing">
                <a href={fan.creatorURL}>
                  <img src={fan.image} loadin="lazy" className="card-img-top" alt="Profile Pic" />
                </a>
                <div className="listing-content">
                  <a href={fan.creatorURL}>
                    <h3 className="one-line" title={fan.creatorName}>{fan.creatorName}</h3>
                    <div className="listing-location one-line"> {fan.creatorLocation}</div>
                    <br />
                    <div className="clearfix listing-short">{fan.creatorDescription}</div>
                    <hr />
                  </a>
                  <div className="listing-tip-count pull-left">
                    <button onClick={this.toggle.bind(this, fan)} className="btn-tip-listing" ></button>
                  </div>
                  <div className="pull-right" ></div>
                </div>
              </div>
            </div>
          </>
        )
      });
    } else {
      <div>
        <p></p>
      </div>
    }


    let payment_options;
    if (this.props.user) {
      let saved_card;
      if (!_.isEmpty(this.props.user.card)) {
        let card_data = this.props.user.card;
        saved_card =
          <div>
            <Label id="radio" >
              <input type="radio" name="optradio" onClick={this.toggleSaved.bind(this)} />
              <i class="far fa-credit-card"></i> Pay with saved card <small>**** **** **** {card_data.card_data.card.last4}</small>
              <span className="checkmark" checked="checked"></span>
              <span className="checkmark"></span>
            </Label>
          </div>
      } else {
        saved_card =
          <div>
            <p>No saved card </p>
          </div>
      }

      payment_options =
        <div>
          <div>
            {saved_card}
            <Label id="radio" >
              <input type="radio" name="optradio" onClick={this.toggleStripe.bind(this)} checked={this.state.toggleStripe} />
              <i class="far fa-credit-card"></i> Credit Card
              <span className="checkmark" checked="checked"></span>
              <span className="checkmark"></span>
            </Label>
          </div>
          {this.state.toggleStripe ?
            <div className='form-group'>
              <label id='new_label'>
                Credit or debit card
              </label>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            : <div></div>}
        </div>

    } else {
      payment_options =
        <div>
          <p onLoad={this.toggleStripe.bind(this)}>Pay by card: </p>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
    }

    let loading;
    if (this.state.isloading) {
      loading =
        <div>
          <p>
            <i class="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
            Payment is processing ...
          </p>
        </div>
    }

    let isSamePerson;
    if (this.state.isSamePerson) {
      isSamePerson =
        <div>
          <small className="text-center">This is you!</small>
        </div>
    }



    return (
      <div className="row" id="listing">
        {fans_list}

        <Modal id="tipCreator" isOpen={this.state.tipModal} toggle={() => (this.toggle(""))} className={this.props.className}>
          <ModalHeader toggle={() => (this.toggle(""))}> <h4 className="modal-title">Tip {this.state.name}</h4> </ModalHeader>
          <ModalBody>
            <Row>
              {/* fan image in circled */}
              <Col lg={3}>
                <img src={this.state.imgUrl} alt="" className="rounded-circle" height="100px" width="100px" id="receiver_image" />
              </Col>

              {/* Tip amount radio button */}
              <Col lg={9}>
                <FormGroup>
                  <Label check>HOW MUCH WOULD YOU LIKE TO TIP?</Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" style={{ color: '#00d278' }}>$</span>
                    </div>
                    <Input type="text" value={this.state.tipAmount} name="tipamount" id="tipamount" className="form-control" onChange={this.handleChangeTipAmount} required></Input>
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="form-row">
                    <div className='col-xs-3'>
                      <Label className="radio-inline" id="radio" >
                        <input type="radio" name="optradio" value='2' onChange={this.setTipAMount.bind(this, 2)}
                          checked={this.state.tipAmount == 2}
                        />$2
                        <span className="checkmark" checked="checked"></span>
                        <span className="checkmark"></span>
                      </Label>
                    </div>
                    <div className='col-xs-3'>
                      <Label className="radio-inline" id="radio" >
                        <input type="radio" name="optradio" value='5' onChange={this.setTipAMount.bind(this, 5)}
                          checked={this.state.tipAmount == 5}
                        />$5
                        <span className="checkmark" checked="checked"></span>
                        <span className="checkmark"></span>
                      </Label>
                    </div>
                    <div className='col-xs-3'>
                      <Label className="radio-inline" id="radio" >
                        <input type="radio" name="optradio" value='10' onChange={this.setTipAMount.bind(this, 10)}
                          checked={this.state.tipAmount == 10}
                        />$10
                        <span className="checkmark" checked="checked"></span>
                        <span className="checkmark"></span>
                      </Label>
                    </div>
                    <div className='col-xs-3'>
                      <Label className="radio-inline" id="radio" >
                        <input type="radio" name="optradio" value='20' onChange={this.setTipAMount.bind(this, 20)}
                          checked={this.state.tipAmount == 20}
                        />$20
                        <span className="checkmark" checked="checked"></span>
                        <span className="checkmark"></span>
                      </Label>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            {/* Text Are for the comment */}
            <div className="dropdown-divider"></div>
            <Row>
              <Col lg={12}>
                <FormGroup>
                  <textarea className="form-control" name="message" id="tipMessage" cols="30" rows="3" onChange={this.setTipMessage} placeholder="Leave a message of support(optional)..."></textarea>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                {/* Payment details section */}
                <h3>PAYMENT DETAILS</h3>
                <div className="dropdown-divider"></div>
                {payment_options}
              </Col>
            </Row>
            <Row style={{ paddingTop: '2%' }}>
              <Col lg={12}>
                <input type='text' className="form-control" id="pay-email" value={this.state.tipSendersEmail} onChange={this.setTipSendersEmail} placeholder="Enter Email" />
              </Col>
            </Row>
            <br />
            <Row>
              <Col lg={12}>
                <ElementsConsumer>
                  {({ stripe, elements }) => (
                    <FormGroup>
                      <button onClick={this.submit.bind(this, stripe, elements)} id="sendTipButton" className="btn btn-lg btn-block" disabled={this.state.isSamePerson} >
                        SEND
                        <span style={{ color: '#fff' }}> {this.state.tipAmount > 0 ? '$' + this.state.tipAmount : ''} </span>
                        TIP!
                      </button>
                    </FormGroup>
                  )}
                </ElementsConsumer>
                {isSamePerson}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                {loading}
              </Col>
            </Row>
            <p>{this.state.error}</p>
          </ModalBody>
        </Modal>
      </div >
    )
  }
}

FansList.prototypes = {
  fetch_fans_list: PropTypes.func.isRequired,
  fetch_logged_in_user: PropTypes.func.isRequired,
  fetch_csrf: PropTypes.func.isRequired,

  fans: PropTypes.array.isRequired,
  csrf: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  fans: state.fans.fans_list,
  user: state.user.user,
  csrf: state.csrf.csrf
});

export default connect(mapStateToProps, { fetch_fans_list, fetch_logged_in_user, fetch_csrf })(FansList);