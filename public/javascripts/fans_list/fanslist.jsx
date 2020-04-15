'use strict'
import React from 'react';
import PropTypes from 'prop-types';
const _ = require('lodash');
import { connect } from 'react-redux';
import { fetch_fans_list } from '../actions/action_set_fanlist.js';

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
      tipAmount: 0
    };

    this.toggle = this.toggle.bind(this);

    this.setTipAMount = this.setTipAMount.bind(this);

    this.submit = this.submit.bind(this);
    this.getFan = this.getFan.bind(this);
  }

  componentDidMount() {
    this.props.fetch_fans_list();
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
  toggle(fan) {
    console.log(fan.creatorName);
    this.setState(prevState => ({
      tipModal: !prevState.tipModal,
      name: fan.creatorName,
      imgUrl: fan.image
    }));
  }

  getFan(fan) {
    console.log(fan.creatorName);
  }
  render() {

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

    return (
      <div className="row" id="listing">
        {fans_list}


        <Modal isOpen={this.state.tipModal} toggle={() => (this.toggle(""))} className={this.props.className}>
          <ModalHeader toggle={() => (this.toggle.button(this, ""))}> Tip {this.state.name}</ModalHeader>
          <ModalBody>
            <Row>
              {/* fan image in circled */}
              <Col lg={3}>
                <img src={this.state.imgUrl} alt="" className="rounded-circle"
                  height="100px"
                  width="100px"
                  id="receiver_image" />
              </Col>

              {/* Tip amount radio button */}
              <Col lg={9}>
                <FormGroup check>
                  <Label check>HOW MUCH WOULD YOU LIKE TO TIP?</Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" style={{ color: '#00d278' }}>$</span>
                      <Input type="text" name="tipamount" id="tipamount" className="form-control" required></Input>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="form-row">
                    <Col xs={3}>
                      <Label className="radio-inline" check>
                        <Input type="radio" name="radio1" value='2' />{' '}$2
                    </Label>
                    </Col>
                    <Col xs={3}>
                      <Label className="radio-inline" check>
                        <Input type="radio" name="radio1" value='2' />{' '}$2
                    </Label>
                    </Col>
                    <Col xs={3}>
                      <Label className="radio-inline" check>
                        <Input type="radio" name="radio1" value='2' />{' '}$2
                    </Label>
                    </Col>
                    <Col xs={3}>
                      <Label className="radio-inline" check>
                        <Input type="radio" name="radio1" value='2' />{' '}$2
                    </Label>
                    </Col>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <p>{this.state.name}</p>
          </ModalBody>
          {/* <ModalFooter>
            <Button color="primary" onClick={() => (this.toggle(""))}>Do Something</Button>{' '}
            <Button color="secondary" onClick={() => (this.toggle(""))}>Cancel</Button>
          </ModalFooter> */}
        </Modal>
      </div >
    )
  }
}

FansList.prototypes = {
  fetch_fans_list: PropTypes.func.isRequired,

  fans: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  fans: state.fans.fans_list
});

export default connect(mapStateToProps, { fetch_fans_list })(FansList);
