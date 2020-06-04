'use strict'
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

} from 'reactstrap';

const _ = require('lodash');

class PayACreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csrf: '',
      creator: {},
      togglePayModal: false,
      receiptModal: false,
      toggleStripe: true,
      isSamePerson: false,
      isLoading: false,
      tipSendersEmail: '',
      tipMessage: '',
      enterCardDetailsCompleted: false,
      cardError: '',
      isCardError: true,
      receiptLink: ''
    };
    this.toggleSaved = this.toggleSaved.bind(this);
    this.toggleStripe = this.toggleStripe.bind(this);
    this.toggle = this.toggle.bind(this);
    this.setTipAMount = this.setTipAMount.bind(this);
    this.setTipMessage = this.setTipMessage.bind(this);
    this.setTipSendersEmail = this.setTipSendersEmail.bind(this);

    this.toggleReceipt = this.toggleReceipt.bind(this);

    this.stripeElementChange = this.stripeElementChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.props.fetch_logged_in_user();
    let url = document.getElementById('creatorUrl').value;
    fetch('/api/fantipper/payacreator/' + url, {
      method: 'GET',
      headers: {
        'CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        'Content-type': 'application/json'
      }
    }).then(res => res.json())
      .then((result) => {
        this.setState({
          creator: result
        });
      })
    this.setState({
      csrf: $('meta[name="csrf-token"]').attr('content')
    })
  }


  toggle() {
    this.setState(prevState => ({
      togglePayModal: !prevState.togglePayModal
    }))
    if (this.props.user) {
      if (this.state.creator.creatorEmail == this.props.user.creator.creatorEmail) {
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

  toggleReceipt(value) {
    this.setState(prevState => ({
      receiptModal: !prevState.receiptModal
    }))
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
    this.setState({ tipSendersEmail: event.target.value });
  }

  toggleStripe(value) {
    this.setState(({
      toggleStripe: value,
      isCardError: true
    }));
  }

  toggleSaved(value) {
    this.setState({
      toggleStripe: value,
      isCardError: false
    });

  }

  stripeElementChange(element) {
    this.setState({
      enterCardDetailsCompleted: element.complete
    });
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
  submit = async (stripe, elements) => {
    if (!this.state.toggleStripe) {
      this.setState({ isLoading: true });

      fetch('/tipping/sendtip', {
        method: 'POST',
        body: JSON.stringify({
          _amount: this.state.tipAmount,
          _description: this.state.tipMessage,
          _email: this.state.tipSendersEmail,
          _creatorEmail: this.state.creatorEmail,
          _receiver_id: this.state.selectedUserId,
          _saved_card: 'true',
          _csrf: this.state.csrf
        }),
        headers: {
          'CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
          'Content-type': 'application/json'
        }
      }).then(res => res.json())
        .then((result) => {
          this.setState({
            receiptLink: result.charge.charges.data[0].receipt_url
          })
          this.toggle('');
          this.toggleReceipt(true);
          this.setState({
            cardError: '',
            isCardError: true
          })
        })
    } else {
      this.setState({ isLoading: true });
      let card = elements.getElement(CardElement);

      let token = stripe.createToken(card).then((value) => {
        if (value.error) {
          this.setState({
            error: value.error
          })
        }
        else {
          fetch('/tipping/sendtip', {
            method: 'POST',
            body: JSON.stringify({
              _stripeID: value.token.id,
              _amount: this.state.tipAmount,
              _description: this.state.tipMessage,
              _email: this.state.tipSendersEmail,
              _creatorEmail: this.state.creator.creatorEmail,
              _receiver_id: this.state.selectedUserId,
              _saved_card: 'false',
              _csrf: this.state.csrf
            }),
            headers: {
              'CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
              'Content-type': 'application/json'
            }
          }).then(res => res.json())
            .then((result) => {
              this.setState({
                receiptLink: result.charge.receipt_url
              })
              this.toggle('');
              this.toggleReceipt(true);
              this.setState({
                cardError: '',
                isCardError: true
              })
            });
        }
      });

    }

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


    let payment_options;
    if (this.props.user) {
      let saved_card;
      if (!_.isEmpty(this.props.user.card)) {
        let card_data = this.props.user.card;
        saved_card =
          <div>
            <Label id="radio" >
              <input type="radio" name="optradio" onClick={this.toggleSaved.bind(this, false)} />
              <i class="far fa-credit-card"></i> Pay with saved card <small id="preview_card">**** **** **** {card_data.card_data.card.last4}</small>
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
              <input type="radio" name="optradio" onClick={this.toggleStripe.bind(this, true)} checked={this.state.toggleStripe} />
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
              <CardElement onChange={(elements) => this.stripeElementChange(elements)} options={CARD_ELEMENT_OPTIONS} />
            </div>

            : <div></div>}
        </div>

    } else {
      payment_options =
        <div>
          <p onLoad={this.toggleStripe.bind(this, true)}>Pay by card: </p>
          <CardElement onChange={(elements) => this.stripeElementChange(elements)} options={CARD_ELEMENT_OPTIONS} />
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

    let isSamePerson;
    if (this.state.isSamePerson) {
      isSamePerson =
        <div>
          <p className="text-center" >
            <small className="text-center">This is you!</small>
          </p>
        </div>
    }

    let loading;
    if (this.state.isloading) {
      loading =
        <div>
          <p>
            {/* <i class="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i> */}
            Payment is processing ...
          </p>
        </div>
    }

    return (
      <div>
        <div className="listing-content">
          <button className="btn-tip-listing" onClick={this.toggle.bind(this)}></button>
          <div className="pull-right" ></div>
        </div>
        <br />

        <Modal id="tipCreator" isOpen={this.state.togglePayModal} toggle={() => (this.toggle(""))} className={this.props.className}>
          <ModalHeader toggle={() => (this.toggle(""))}> <h4 className="modal-title">Tip {this.state.name}</h4> </ModalHeader>
          <ModalBody>
            <Row>
              {/* fan image in circled */}
              <Col lg={3}>
                <img src={this.state.creator.creatorTileImage} alt="" className="rounded-circle" height="100px" width="100px" id="receiver_image" />
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
            {card_errors}
            <Row>
              <Col lg={12}>
                <ElementsConsumer>
                  {({ stripe, elements }) => (
                    <FormGroup>
                      <button onClick={this.submit.bind(this, stripe, elements)} id="sendTipButton" className="btn btn-lg btn-block" disabled={this.state.isSamePerson || this.state.isCardError} >
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



        <Modal id="shareTip" isOpen={this.state.receiptModal} toggleReceipt={() => (this.toggleReceipt(""))} className={this.props.className}>
          <ModalHeader toggle={() => (this.toggleReceipt(""))}> <h4 className="modal-title">Tip {this.state.name}</h4> </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={12}>
                <p className="text-center" > <q><span className="text-center" id="tippeesDesc">Thank you for your support</span></q>  </p>
              </Col>
            </Row>
            <hr />
            <p className="text-center" id="desc1">Your tip was successfully sent.</p>
            <p className="text-center" > <a href={this.state.receiptLink} id="receipt_link" target="_blank"> View the receipt </a></p>
          </ModalBody>
        </Modal>



      </div >
    )
  }
}

PayACreator.prototypes = {
  fetch_logged_in_user: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.user.user
});

export default connect(mapStateToProps, { fetch_logged_in_user })(PayACreator);