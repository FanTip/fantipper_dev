'use strict'
import React from 'react';
import PropTypes from 'prop-types';
const _ = require('lodash');
import { connect } from 'react-redux';
import { fetch_fans_list } from '../actions/action_set_fanlist.js';
import { fetch_logged_in_user } from '../actions/get_logged_in.js';

import { CardElement } from '@stripe/react-stripe-js';


import {
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,

} from 'reactstrap';

class FansList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tipModal: false,
      name: '',
      imgUrl: '',
      creatorEmail: '',
      tipAmount: 0,
      toggleStripe: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleStripe = this.toggleStripe.bind(this);
    this.handleChangeTipAmount = this.handleChangeTipAmount.bind(this);

    this.setTipAMount = this.setTipAMount.bind(this);

    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.props.fetch_fans_list();
    this.props.fetch_logged_in_user();
  }

  setTipAMount(amount) {
    this.setState(prevState => ({
      tipAmount: amount
    }));
  }


  submit(event) {
    event.preventDefault();
    console.log('vhfbvfbdhvbjhbfdjh');
  }

  handleChangeTipAmount(event) {
    this.setState({ tipAmount: event.target.value });
  }

  toggle(fan) {
    this.setState(prevState => ({
      tipModal: !prevState.tipModal,
      name: fan.creatorName,
      imgUrl: fan.image,
      creatorEmail: fan.creatorEmail,
      tipAmount: 0
    }));
  }

  toggleStripe() {
    this.setState(prevState => ({
      toggleStripe: !prevState.toggleStripe
    }));
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
                    {/* TODO */}
                    {/* <div className="listing-categories one-line">
                  </div> */}
                    <br />
                    <div className='creator-head' style={{ height: '1px' }}>
                      {fan.categories.map(cat =>
                        <span className="category-token" style={{ fontSize: '8px' }}>{cat}</span>
                      )}
                    </div>
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
      if (this.props.user.isCard) {
        saved_card =
          <div>
            <Label id="radio" >
              <input type="radio" name="optradio" />
              <i class="far fa-credit-card"></i> Pay with saved card
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
              <input type="radio" name="optradio" onClick={this.toggleStripe.bind(this)} />
              <i class="far fa-credit-card"></i> Credit Card
              <span className="checkmark" checked="checked"></span>
              <span className="checkmark"></span>
            </Label>
          </div>
          {this.state.toggleStripe ? <CardElement options={CARD_ELEMENT_OPTIONS} /> : <div></div>}
        </div>

    } else {
      payment_options =
        <div>
          <p>Pay by card: </p>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
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
                  <textarea className="form-control" name="message" id="tipMessage" cols="30" rows="3" placeholder="Leave a message of support(optional)..."></textarea>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                {/* Payment details section */}
                <h3>PAYMENT DETAILS</h3>
                <div className="dropdown-divider"></div>
                <form>
                  {/* <CardElement options={CARD_ELEMENT_OPTIONS} /> */}
                </form>
                {payment_options}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <FormGroup>
                  <button id="sendTipButton" className="btn btn-lg btn-block" >
                    SEND
                    <span style={{ color: '#fff' }}> {this.state.tipAmount > 0 ? '$' + this.state.tipAmount : ''} </span>
                    TIP!
                  </button>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div >
    )
  }
}

FansList.prototypes = {
  fetch_fans_list: PropTypes.func.isRequired,
  fetch_logged_in_user: PropTypes.func.isRequired,

  fans: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  fans: state.fans.fans_list,
  user: state.user.user
});

export default connect(mapStateToProps, { fetch_fans_list, fetch_logged_in_user })(FansList);
