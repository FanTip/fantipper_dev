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
      tipmodal: false,
      name: ''
    };

    this.toggle = this.toggle.bind(this);

    this.submit = this.submit.bind(this);
    this.getFan = this.getFan.bind(this);
  }

  componentDidMount() {
    this.props.fetch_fans_list();
  }

  submit(event) {
    event.preventDefault();
    console.log('vhfbvfbdhvbjhbfdjh');
  }
  toggle(fan) {
    console.log("the fuck");
    this.setState(prevState => ({
      tipModal: !prevState.tipModal,
      name: fan.creatorName
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
            <Modal isOpen={this.state.tipmodal} toggle={() => (this.toggle(""))} className={this.props.className}>
              <ModalHeader toggle={() => (this.toggle(""))}>{this.state.name}</ModalHeader>
              <ModalBody>
                <Form onSubmit={this.submit}>
                  <FormGroup row>
                    <Label for="item" sm={2}>Add {this.state.name}</Label>
                    <Col sm={10}>
                      <p>hfjdvgjhfsdgbvjhfdbvjh</p>
                    </Col>
                  </FormGroup>
                  <FormGroup check row>
                    <Col sm={{ size: 10, offset: 1 }}>
                      <Button>Submit {this.state.name}</Button>
                    </Col>
                  </FormGroup>
                </Form>
              </ModalBody>
              {/* <ModalFooter>
            <Button color="primary" onClick={() => (this.toggle(""))}>Do Something</Button>{' '}
            <Button color="secondary" onClick={() => (this.toggle(""))}>Cancel</Button>
          </ModalFooter> */}
            </Modal>
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

      </div>
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
